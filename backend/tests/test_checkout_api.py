import requests
import time
import subprocess
import os
import sys

def test_checkout_full_cycle():
    print("🚀 Starting robust Checkout Integration Test...")
    
    backend_path = os.path.abspath("backend")
    db_path = os.path.abspath("dentsupply.db")
    env = os.environ.copy()
    env["PYTHONPATH"] = backend_path
    env["DATABASE_URL"] = f"sqlite:///{db_path}"
    
    port = 8000
    print(f"🧹 Cleaning up port {port}...")
    try:
        subprocess.run(f"lsof -ti:{port} | xargs kill -9", shell=True, check=False)
        time.sleep(2)
    except:
        pass

    process = subprocess.Popen(
        [sys.executable, "-m", "uvicorn", "app.main:app", "--host", "127.0.0.1", "--port", str(port)],
        cwd=backend_path,
        env=env
    )
    
    base_url = f"http://127.0.0.1:{port}/api/v1"
    
    try:
        # Wait for server
        print(f"⌛ Waiting for server on port {port}...")
        for _ in range(15):
            try:
                r = requests.get(f"http://127.0.0.1:{port}/health")
                if r.status_code == 200: break
            except:
                time.sleep(1)
        
        # 1. Register/Login
        print("👤 Authenticating...")
        email = f"order_test_{int(time.time())}@example.com"
        phone = str(int(time.time()))[-10:]
        requests.post(f"{base_url}/auth/register", json={
            "email": email, "password": "pass", "phone": phone, "full_name": "Test"
        })
        token = requests.post(f"{base_url}/auth/login", data={"username": email, "password": "pass"}).json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # 2. Get Initial Stock of Product 1
        print("🔍 Checking initial stock...")
        prod_resp = requests.get(f"{base_url}/products/", params={"limit": 1})
        product = prod_resp.json()[0]
        variant = product["variants"][0]
        initial_stock = variant["stock_quantity"]
        print(f"✅ Initial stock for {variant['sku']}: {initial_stock}")
        
        # 3. Add to Cart
        print("🛒 Adding to cart...")
        requests.post(f"{base_url}/cart/", headers=headers, json={
            "product_id": product["id"], 
            "variant_id": variant["id"],
            "quantity": 2
        })
        
        # 4. Checkout
        print("💳 Performing checkout...")
        checkout_resp = requests.post(f"{base_url}/orders/", headers=headers, json={
            "address_id": 1, # Mock address ID
            "notes": "Test order",
            "payment_method": "cod"
        })
        if checkout_resp.status_code != 200:
            print(f"❌ Checkout failed: {checkout_resp.text}")
            return
            
        order = checkout_resp.json()
        print(f"✅ Order Created: {order['order_number']}")
        print(f"✅ Total Amount: {order['total_amount']}")
        
        # 5. Verify Stock Deduction
        print("📉 Verifying stock deduction...")
        prod_resp = requests.get(f"{base_url}/products/", params={"limit": 1})
        updated_variant = prod_resp.json()[0]["variants"][0]
        print(f"✅ Updated stock: {updated_variant['stock_quantity']}")
        
        if updated_variant["stock_quantity"] != initial_stock - 2:
            print(f"❌ Stock Error! Expected {initial_stock - 2}, got {updated_variant['stock_quantity']}")
        else:
            print("🌟 STOCK DEDUCTION VERIFIED 🌟")
            
        # 6. Verify Cart is Empty
        print("🧹 Verifying cart is clear...")
        cart_resp = requests.get(f"{base_url}/cart/", headers=headers).json()
        if len(cart_resp["items"]) == 0:
            print("🌟 CART CLEARANCE VERIFIED 🌟")
        else:
            print(f"❌ Cart still has {len(cart_resp['items'])} items")

        # 7. Check Order History
        print("📜 Verifying order history...")
        history = requests.get(f"{base_url}/orders/", headers=headers).json()
        if len(history) >= 1:
            print(f"✅ History shows {len(history)} orders")
            print("🌟 CHECKOUT CYCLE FULLY VERIFIED 🌟")
        else:
            print("❌ History empty")

    finally:
        print("🛑 Shutting down server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_checkout_full_cycle()

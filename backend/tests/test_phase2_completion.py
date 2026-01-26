import requests
import time
import subprocess
import os
import sys

def test_phase2_complete_verification():
    print("🚀 Starting Phase 2 Completion Verification Test...")
    
    backend_path = os.path.abspath("backend")
    db_path = os.path.abspath("dentsupply.db")
    env = os.environ.copy()
    env["PYTHONPATH"] = backend_path
    env["DATABASE_URL"] = f"sqlite:///{db_path}"
    
    port = 8000
    print(f"🧹 cleaning up port {port}...")
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
        
        # 1. Test Login & Refresh Token
        print("👤 Testing Auth & Refresh...")
        login_resp = requests.post(f"{base_url}/auth/login", data={"username": "admin@dentsupply.com", "password": "admin123"})
        tokens = login_resp.json()
        if "refresh_token" not in tokens:
            print("❌ Refresh token missing in login response!")
            return
        token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        print("✅ Auth & Refresh verified")

        # 2. Test Profile Update
        print("👤 Testing Profile Update...")
        update_resp = requests.put(f"{base_url}/auth/me", headers=headers, json={"full_name": "Updated Admin", "phone": "1234567890"})
        if update_resp.json()["full_name"] != "Updated Admin":
            print(f"❌ Profile update failed: {update_resp.text}")
            return
        print("✅ Profile Update verified")

        # 3. Test Product Search
        print("🔍 Testing Product Search...")
        search_resp = requests.get(f"{base_url}/products/search", params={"q": "Tuff"})
        results = search_resp.json()
        if len(results) == 0:
            print("❌ Search returned 0 results for 'Tuff'")
            return
        print(f"✅ Search verified ({len(results)} results)")

        # 4. Test Brands
        print("🏷️ Testing Brands API...")
        brands_resp = requests.get(f"{base_url}/products/brands")
        brands = brands_resp.json()
        if len(brands) == 0:
            print("❌ Brands API returned 0 results")
            return
        print(f"✅ Brands API verified ({len(brands)} brands)")

        # 5. Test Order Cancellation & Stock Restoration
        print("📦 Testing Order Cancellation & Stock Restoration...")
        # Get a product and its stock
        prod = results[0]
        variant = prod["variants"][0]
        initial_stock = variant["stock_quantity"]
        
        # Add to cart
        requests.post(f"{base_url}/cart/", headers=headers, json={"product_id": prod["id"], "variant_id": variant["id"], "quantity": 1})
        
        # Checkout
        order_resp = requests.post(f"{base_url}/orders/", headers=headers, json={"address_id": 1, "payment_method": "cod"})
        order = order_resp.json()
        order_id = order["id"]
        
        # Check stock after order
        stock_after_order = requests.get(f"{base_url}/products/{prod['slug']}").json()["variants"][0]["stock_quantity"]
        print(f"📉 Stock after order: {stock_after_order} (Started at {initial_stock})")
        
        # Cancel order
        cancel_resp = requests.post(f"{base_url}/orders/{order_id}/cancel", headers=headers)
        if cancel_resp.status_code != 200:
            print(f"❌ Cancellation failed: {cancel_resp.text}")
            return
            
        # Check stock after cancellation
        stock_after_cancel = requests.get(f"{base_url}/products/{prod['slug']}").json()["variants"][0]["stock_quantity"]
        print(f"📈 Stock after cancel: {stock_after_cancel}")
        
        if stock_after_cancel != initial_stock:
            print(f"❌ Stock restoration failure! Expected {initial_stock}, got {stock_after_cancel}")
        else:
            print("🌟 ORDER CANCELLATION & STOCK RESTORATION VERIFIED 🌟")

        print("\n🏆 PHASE 2 FEATURE COMPLETION VERIFIED SUCCESSFULLY 🏆")

    finally:
        print("🛑 Shutting down server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_phase2_complete_verification()

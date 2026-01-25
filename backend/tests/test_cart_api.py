import requests
import time
import subprocess
import os
import sys

def test_cart_full_cycle():
    print("🚀 Starting robust Cart Integration Test...")
    
    # 1. Start Server in background
    backend_path = os.path.abspath("backend")
    db_path = os.path.abspath("dentsupply.db")
    env = os.environ.copy()
    env["PYTHONPATH"] = backend_path
    env["DATABASE_URL"] = f"sqlite:///{db_path}"
    
    # Use port 8000 as requested and kill existing processes
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
        for _ in range(10):
            try:
                requests.get(f"http://127.0.0.1:{port}/health")
                break
            except:
                time.sleep(1)
        
        # 2. Register
        print("👤 Registering user...")
        user_data = {
            "email": "cart_py_test@example.com",
            "password": "password123",
            "phone": "9988776655",
            "full_name": "Python Tester"
        }
        resp = requests.post(f"{base_url}/auth/register", json=user_data)
        if resp.status_code != 200 and "already exists" not in resp.text:
            print(f"❌ Registration failed: {resp.text}")
            return
            
        # 3. Login
        print("🔑 Logging in...")
        login_data = {"username": user_data["email"], "password": user_data["password"]}
        resp = requests.post(f"{base_url}/auth/login", data=login_data)
        token = resp.json().get("access_token")
        headers = {"Authorization": f"Bearer {token}"}
        
        # 4. Add items
        print("🛒 Adding items to cart...")
        # Add Product 1 (quantity 2)
        requests.post(f"{base_url}/cart/", headers=headers, json={"product_id": 1, "quantity": 2})
        # Add Product 2 (quantity 1)
        requests.post(f"{base_url}/cart/", headers=headers, json={"product_id": 2, "quantity": 1})
        
        # 5. Verify Cart
        print("📋 Verifying cart state...")
        resp = requests.get(f"{base_url}/cart/", headers=headers)
        cart = resp.json()
        print(f"✅ Items in cart: {len(cart['items'])}")
        print(f"✅ Total Quantity: {cart['total_quantity']}")
        print(f"✅ Subtotal: {cart['subtotal']}")
        
        if cart['total_quantity'] != 3:
            print(f"❌ Quantity mismatch! Expected 3, got {cart['total_quantity']}")
        else:
            print("🌟 CART VERIFICATION SUCCESSFUL 🌟")

    finally:
        print("🛑 Shutting down server...")
        process.terminate()
        process.wait()

if __name__ == "__main__":
    test_cart_full_cycle()

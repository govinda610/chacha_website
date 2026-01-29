import json
import os
import random
import fitz  # PyMuPDF
import pandas as pd
import re

# Paths
BASE_DIR = "/Users/govindmittal/datascience-setup/chacha_website"
PRODUCTS_JSON = os.path.join(BASE_DIR, "data/final/products_complete.json")
PDF_PATH = os.path.join(BASE_DIR, "noris_product_cat_LBL006-Rev.-2025-2_EN-2.pdf")
EXCEL_PATH = os.path.join(BASE_DIR, "clinic excel implant itinerary.xlsx")

def audit_data():
    print("--- 🔍 Deep Data Integrity Audit ---")
    
    # 1. Load Data
    with open(PRODUCTS_JSON, 'r') as f:
        products = json.load(f)
    print(f"[INFO] Loaded {len(products)} products.")

    # 2. Check for Ghost Products (Zero Variants)
    ghosts = [p for p in products if len(p.get('variants', [])) == 0]
    real_products = [p for p in products if len(p.get('variants', [])) > 0]
    
    print(f"\n[ANALYSIS] Product Categorization:")
    print(f"  - Real Products (with variants): {len(real_products)}")
    print(f"  - Ghost Products (0 variants): {len(ghosts)}")
    
    if len(ghosts) > 0:
        print(f"  [WARN] {len(ghosts)} products are likely category headers (e.g., ID {ghosts[0]['id']} '{ghosts[0]['name']}').")

    # 3. Validate Real Products
    print(f"\n[VALIDATION] auditing random sample of 5 Real Products against Source Files...")
    sample = random.sample(real_products, min(5, len(real_products)))
    
    # Load Source Content
    pdf_text = ""
    if os.path.exists(PDF_PATH):
        doc = fitz.open(PDF_PATH)
        for page in doc:
            pdf_text += page.get_text().lower()
    
    excel_content = ""
    if os.path.exists(EXCEL_PATH):
        xls = pd.ExcelFile(EXCEL_PATH)
        for sheet in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet)
            excel_content += df.to_string().lower()

    for p in sample:
        name = p['name']
        sku = p.get('sku', 'N/A')
        print(f"\n  Checking: ID {p['id']} | {name} | SKU: {sku}")
        
        # Check Price
        if p['selling_price'] <= 0:
             print(f"    ❌ [ERROR] Invalid Price: {p['selling_price']}")
        else:
             print(f"    ✅ Price: ₹{p['selling_price']}")

        # Check Images
        imgs = p.get('images', {})
        if not imgs.get('main'):
             print(f"    ❌ [ERROR] Missing Main Image")
        else:
             print(f"    ✅ Image: {imgs.get('main')}")

        # Check Source PDF
        if name.lower().split(',')[0] in pdf_text: # approximate match
             print(f"    ✅ Found in PDF Catalog")
        else:
             print(f"    ⚠️ Not found in PDF text (might be image-based or named differently)")

        # Check Source Excel
        if name.lower().split(',')[0] in excel_content:
             print(f"    ✅ Found in Excel Sheet")
        else:
             print(f"    ⚠️ Not found in Excel text")

    # 4. Global Health Check
    missing_images = [p['id'] for p in real_products if not p.get('images', {}).get('main')]
    zero_price = [p['id'] for p in real_products if p['selling_price'] <= 0]
    
    print(f"\n[SUMMARY] Global Health Metrics:")
    print(f"  - Products missing images: {len(missing_images)}")
    print(f"  - Products with 0 price: {len(zero_price)}")

if __name__ == "__main__":
    audit_data()

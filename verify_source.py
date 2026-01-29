
import fitz # PyMuPDF
import pandas as pd
import os

pdf_path = "noris_product_cat_LBL006-Rev.-2025-2_EN-2.pdf"
excel_path = "clinic excel implant itinerary.xlsx"

target_name = "Angulated Abutments Cement Retained"
target_desc_fragment = "High-quality dental implant with internal hex connection"

print(f"--- Searching in PDF: {pdf_path} ---")
if os.path.exists(pdf_path):
    doc = fitz.open(pdf_path)
    found_name = []
    found_desc = []
    
    for page_num, page in enumerate(doc):
        text = page.get_text()
        if target_name.lower() in text.lower():
            # Check if it looks like a header (naive check: is it short line?)
            lines = text.split('\n')
            for line in lines:
                if target_name.lower() in line.lower():
                    found_name.append(f"Page {page_num+1}: '{line.strip()}'")
        
        if target_desc_fragment.lower() in text.lower():
             found_desc.append(f"Page {page_num+1}: Found description match")

    if found_name:
        print(f"Found '{target_name}' in PDF:")
        for f in found_name[:5]: print(f"  - {f}")
    else:
        print(f"Name '{target_name}' NOT found in PDF text.")

else:
    print("PDF file not found.")

print(f"\n--- Searching in Excel: {excel_path} ---")
if os.path.exists(excel_path):
    try:
        # Load all sheets
        xls = pd.ExcelFile(excel_path)
        for sheet_name in xls.sheet_names:
            df = pd.read_excel(xls, sheet_name=sheet_name)
            
            # Convert whole dataframe to string and search
            # This is broad but effective for "is it there?"
            df_str = df.to_string().lower()
            
            if target_name.lower() in df_str:
                print(f"Found '{target_name}' in Excel Sheet: '{sheet_name}'")
                # Try to narrow down
                matches = df[df.apply(lambda row: row.astype(str).str.contains(target_name, case=False).any(), axis=1)]
                if not matches.empty:
                    print(f"  - Row contents: {matches.iloc[0].astype(str).values}")
            
    except Exception as e:
        print(f"Error reading Excel: {e}")
else:
    print("Excel file not found.")

import json
import os
import sys
from pathlib import Path

# Add backend to path
sys.path.append(str(Path(__file__).parent.parent))

from app.core.database import SessionLocal, engine
from app.models.user import User, Address, Order
from app.models.product import Category, Product, ProductVariant, ProductImage
from app.core.database import Base

# Ensure tables are created (though alembic should have done it)
Base.metadata.create_all(bind=engine)

DATA_DIR = Path(__file__).parent.parent.parent / "data" / "final"
CATEGORIES_PATH = DATA_DIR / "categories_updated.json"
PRODUCTS_PATH = DATA_DIR / "products_complete.json"

def seed_data():
    db = SessionLocal()
    try:
        # 1. Seed Categories
        print("🌱 Seeding Categories...")
        with open(CATEGORIES_PATH, 'r') as f:
            categories_data = json.load(f)
        
        category_map = {} # Store name -> id mapping
        
        # First pass: Parent categories
        for cat in categories_data:
            db_cat = Category(
                name=cat['name'],
                slug=cat['slug'],
                display_order=cat.get('display_order', 0)
            )
            db.add(db_cat)
            db.flush() # Get ID
            category_map[cat['name']] = db_cat.id
            
            # Second pass: Subcategories
            for sub in cat.get('subcategories', []):
                db_sub = Category(
                    name=sub['name'],
                    slug=sub['slug'],
                    parent_id=db_cat.id,
                    display_order=sub.get('display_order', 0)
                )
                db.add(db_sub)
                db.flush()
                category_map[sub['name']] = db_sub.id
        
        print(f"✅ Seeded {len(category_map)} categories")

        # 2. Seed Products
        print("🌱 Seeding Products...")
        with open(PRODUCTS_PATH, 'r') as f:
            products_data = json.load(f)
        
        product_count = 0
        variant_count = 0
        
        for p_data in products_data:
            # Map subcategory to category_id
            cat_name = p_data.get('subcategory') or p_data.get('category')
            cat_id = category_map.get(cat_name)
            
            db_product = Product(
                name=p_data['name'],
                slug=p_data['slug'],
                brand=p_data['brand'],
                category_id=cat_id,
                description=p_data.get('description'),
                specifications=p_data.get('specifications'),
                clinical_benefits=p_data.get('clinical_benefits'),
                base_price=p_data.get('base_price', 0),
                selling_price=p_data.get('selling_price', 0),
                has_variants=p_data.get('has_variants', False),
                is_active=True
            )
            db.add(db_product)
            db.flush()
            product_count += 1
            
            # Seed Variants
            if p_data.get('has_variants'):
                for v_data in p_data.get('variants', []):
                    db_variant = ProductVariant(
                        product_id=db_product.id,
                        sku=v_data['sku'],
                        name=v_data.get('original_name', p_data['name']),
                        price=v_data.get('price', db_product.selling_price),
                        stock_quantity=v_data.get('stock_quantity', 0),
                        specifications={
                            "diameter": v_data.get("diameter"),
                            "length": v_data.get("length")
                        }
                    )
                    db.add(db_variant)
                    variant_count += 1
            else:
                # Create a single variant for non-variant products (using SKU if available)
                db_variant = ProductVariant(
                    product_id=db_product.id,
                    sku=p_data.get('sku', f"SKU-{db_product.id}"),
                    name=p_data['name'],
                    price=db_product.selling_price,
                    stock_quantity=10, # Default stock
                )
                db.add(db_variant)
                variant_count += 1
            
            # Seed Images
            img_data = p_data.get('images', {})
            for img_type in ['thumbnail', 'card', 'main', 'zoom']:
                if img_data.get(img_type):
                    db_img = ProductImage(
                        product_id=db_product.id,
                        image_url=img_data[img_type],
                        image_type=img_type
                    )
                    db.add(db_img)

        db.commit()
        print(f"✅ Seeded {product_count} products and {variant_count} variants")
        
    except Exception as e:
        db.rollback()
        print(f"❌ Error seeding data: {e}")
        raise
    finally:
        db.close()

if __name__ == "__main__":
    seed_data()

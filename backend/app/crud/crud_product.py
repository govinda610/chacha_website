from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.product import Category, Product, ProductVariant, ProductImage, Brand

def get_categories(db: Session) -> List[Category]:
    return db.query(Category).all()

def get_products(
    db: Session, 
    *, 
    category_id: Optional[int] = None, 
    brand_id: Optional[int] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[Product]:
    query = db.query(Product)
    if category_id:
        query = query.filter(Product.category_id == category_id)
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    return query.offset(skip).limit(limit).all()

def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    return db.query(Product).filter(Product.slug == slug).first()

def search_products(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).filter(
        (Product.name.ilike(f"%{query}%")) | 
        (Product.description.ilike(f"%{query}%"))
    ).offset(skip).limit(limit).all()

def get_brands(db: Session) -> List[Brand]:
    return db.query(Brand).filter(Brand.is_active == True).all()

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
    search: Optional[str] = None,
    skip: int = 0, 
    limit: int = 100
) -> List[Product]:
    query = db.query(Product)
    if category_id:
        # Get all child categories of the given category
        child_category_ids = db.query(Category.id).filter(Category.parent_id == category_id).all()
        child_ids = [c.id for c in child_category_ids]
        # Include both the parent category and all child categories
        all_category_ids = [category_id] + child_ids
        query = query.filter(Product.category_id.in_(all_category_ids))
    if brand_id:
        query = query.filter(Product.brand_id == brand_id)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(search_pattern)) | 
            (Product.description.ilike(search_pattern))
        )
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

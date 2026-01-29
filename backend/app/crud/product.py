from typing import List, Optional, Dict, Any, Union
from sqlalchemy.orm import Session
from app.models.product import Category, Product, ProductVariant, ProductImage, Brand
from app.schemas.product import ProductCreate, ProductUpdate

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

def get_product(db: Session, product_id: int) -> Optional[Product]:
    return db.query(Product).filter(Product.id == product_id).first()

def get_product_by_slug(db: Session, slug: str) -> Optional[Product]:
    return db.query(Product).filter(Product.slug == slug).first()

def create(db: Session, *, obj_in: ProductCreate) -> Product:
    obj_in_data = obj_in.model_dump()
    db_obj = Product(**obj_in_data)
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def update(
    db: Session, 
    *, 
    db_obj: Product, 
    obj_in: Union[ProductUpdate, Dict[str, Any]]
) -> Product:
    obj_data = db_obj.__dict__
    if isinstance(obj_in, dict):
        update_data = obj_in
    else:
        update_data = obj_in.model_dump(exclude_unset=True)
        
    for field in obj_data:
        if field in update_data:
            setattr(db_obj, field, update_data[field])
            
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

def delete(db: Session, *, id: int) -> Product:
    obj = db.query(Product).get(id)
    db.delete(obj)
    db.commit()
    return obj

def search_products(db: Session, query: str, skip: int = 0, limit: int = 100) -> List[Product]:
    return db.query(Product).filter(
        (Product.name.ilike(f"%{query}%")) | 
        (Product.description.ilike(f"%{query}%"))
    ).offset(skip).limit(limit).all()

def get_brands(db: Session) -> List[Brand]:
    return db.query(Brand).filter(Brand.is_active == True).all()

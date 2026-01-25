from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_product
from app.schemas.product import Product

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    db: Session = Depends(deps.get_db),
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve products.
    """
    return crud_product.get_products(
        db, category_id=category_id, brand_id=brand_id, skip=skip, limit=limit
    )

@router.get("/{slug}", response_model=Product)
def read_product(
    *,
    db: Session = Depends(deps.get_db),
    slug: str,
) -> Any:
    """
    Get product by slug.
    """
    product = crud_product.get_product_by_slug(db, slug=slug)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_product
from app.schemas.product import Product, Brand

router = APIRouter()

@router.get("/", response_model=List[Product])
def read_products(
    db: Session = Depends(deps.get_db),
    category_id: Optional[int] = None,
    brand_id: Optional[int] = None,
    search: Optional[str] = Query(None, alias="q"),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve products with optional filtering by category, brand, and search query.
    """
    return crud_product.get_products(
        db, category_id=category_id, brand_id=brand_id, search=search, skip=skip, limit=limit
    )


@router.get("/search", response_model=List[Product])
def search_products(
    db: Session = Depends(deps.get_db),
    q: str = Query(...),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Search products.
    """
    return crud_product.search_products(db, query=q, skip=skip, limit=limit)

@router.get("/brands", response_model=List[Brand])
def read_brands(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve brands.
    """
    return crud_product.get_brands(db)

@router.get("/id/{product_id}", response_model=Product)
def read_product_by_id(
    *,
    db: Session = Depends(deps.get_db),
    product_id: int,
) -> Any:
    """
    Get product by ID.
    """
    product = crud_product.get_product(db, product_id=product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

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

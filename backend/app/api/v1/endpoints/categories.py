from typing import Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_product
from app.schemas.product import CategoryBase

router = APIRouter()

@router.get("/", response_model=List[CategoryBase])
def read_categories(
    db: Session = Depends(deps.get_db),
) -> Any:
    """
    Retrieve categories.
    """
    return crud_product.get_categories(db)

from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_cart
from app.schemas.cart import CartItem, CartItemCreate, CartItemUpdate, CartSummary
from app.models.user import User

router = APIRouter()

@router.get("/", response_model=CartSummary)
def read_cart(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get current user's cart.
    """
    items = crud_cart.get_cart_items(db, user_id=current_user.id)
    subtotal = sum(
        (item.variant.price if item.variant else item.product.selling_price) * item.quantity 
        for item in items
    )
    total_quantity = sum(item.quantity for item in items)
    return {
        "items": items,
        "subtotal": subtotal,
        "total_quantity": total_quantity
    }

@router.post("/", response_model=CartItem)
def add_item_to_cart(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    item_in: CartItemCreate
) -> Any:
    """
    Add item to cart.
    """
    return crud_cart.add_to_cart(db, user_id=current_user.id, item_in=item_in)

@router.put("/{item_id}", response_model=Optional[CartItem])
def update_item_in_cart(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    item_id: int,
    item_in: CartItemUpdate
) -> Any:
    """
    Update cart item quantity.
    """
    item = crud_cart.update_cart_item(db, user_id=current_user.id, item_id=item_id, item_in=item_in)
    if not item and item_in.quantity > 0:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return item

@router.delete("/{item_id}")
def remove_item_from_cart(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    item_id: int
) -> Any:
    """
    Remove item from cart.
    """
    success = crud_cart.remove_from_cart(db, user_id=current_user.id, item_id=item_id)
    if not success:
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"status": "success"}

@router.delete("/clear")
def clear_user_cart(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Clear all items from cart.
    """
    crud_cart.clear_cart(db, user_id=current_user.id)
    return {"status": "success"}

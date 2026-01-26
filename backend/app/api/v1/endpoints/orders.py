from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.api import deps
from app.crud import crud_order
from app.schemas.order import Order, OrderCreate
from app.models.user import User

router = APIRouter()

@router.post("/", response_model=Order)
def checkout(
    *,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    order_in: OrderCreate
) -> Any:
    """
    Create a new order from cart.
    """
    return crud_order.create_order(db, user_id=current_user.id, order_in=order_in)

@router.get("/", response_model=List[Order])
def read_orders(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Retrieve user's order history.
    """
    return crud_order.get_orders(db, user_id=current_user.id)

@router.get("/{order_id}", response_model=Order)
def read_order(
    order_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Get specific order details.
    """
    order = crud_order.get_order(db, user_id=current_user.id, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.post("/{order_id}/cancel", response_model=Order)
def cancel_order(
    order_id: int,
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Cancel an order.
    """
    order = crud_order.get_order(db, user_id=current_user.id, order_id=order_id)
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    return crud_order.cancel_order(db, db_order=order)

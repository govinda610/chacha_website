from typing import List, Optional
from sqlalchemy.orm import Session
from app.models.user import CartItem
from app.schemas.cart import CartItemCreate, CartItemUpdate

def get_cart_items(db: Session, user_id: int) -> List[CartItem]:
    return db.query(CartItem).filter(CartItem.user_id == user_id).all()

def add_to_cart(db: Session, user_id: int, item_in: CartItemCreate) -> CartItem:
    # Check if item already exists
    db_item = db.query(CartItem).filter(
        CartItem.user_id == user_id,
        CartItem.product_id == item_in.product_id,
        CartItem.variant_id == item_in.variant_id
    ).first()
    
    if db_item:
        db_item.quantity += item_in.quantity
    else:
        db_item = CartItem(
            user_id=user_id,
            product_id=item_in.product_id,
            variant_id=item_in.variant_id,
            quantity=item_in.quantity
        )
        db.add(db_item)
    
    db.commit()
    db.refresh(db_item)
    return db_item

def update_cart_item(db: Session, user_id: int, item_id: int, item_in: CartItemUpdate) -> Optional[CartItem]:
    db_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()
    if db_item:
        if item_in.quantity <= 0:
            db.delete(db_item)
            db.commit()
            return None
        db_item.quantity = item_in.quantity
        db.commit()
        db.refresh(db_item)
    return db_item

def remove_from_cart(db: Session, user_id: int, item_id: int) -> bool:
    db_item = db.query(CartItem).filter(CartItem.id == item_id, CartItem.user_id == user_id).first()
    if db_item:
        db.delete(db_item)
        db.commit()
        return True
    return False

def clear_cart(db: Session, user_id: int):
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()
    db.commit()

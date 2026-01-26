from typing import List, Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import CartItem, User
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import ProductVariant, Product
from app.schemas.order import OrderCreate

def create_order(db: Session, user_id: int, order_in: OrderCreate) -> Order:
    # 1. Get Cart Items
    cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    # 2. Preparation for Order
    subtotal = 0
    order_items_to_create = []
    
    for item in cart_items:
        product = item.product
        variant = item.variant
        
        # Check stock if it's a variant
        if variant:
            if variant.stock_quantity < item.quantity:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Not enough stock for {variant.name} (SKU: {variant.sku})"
                )
            price = variant.price
            sku = variant.sku
            variant_name = variant.name
        else:
            # Check stock for base product (though in our current schema, all products have at least one variant)
            price = product.selling_price
            sku = f"PROD-{product.id}"
            variant_name = product.name

        item_total = price * item.quantity
        subtotal += item_total
        
        order_items_to_create.append(
            OrderItem(
                product_id=product.id,
                variant_id=variant.id if variant else None,
                product_name=product.name,
                sku=sku,
                quantity=item.quantity,
                unit_price=price,
                total_price=item_total
            )
        )

    # 3. Pricing Logic (Mock)
    shipping_fee = 0.0 if subtotal > 5000 else 150.0 # Free delivery above 5k
    tax_amount = subtotal * 0.18 # Mock 18% GST
    total_amount = subtotal + shipping_fee + tax_amount

    # 4. Create Order
    db_order = Order(
        order_number=f"DS-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_id,
        address_id=order_in.address_id,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        payment_method=order_in.payment_method,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        notes=order_in.notes
    )
    db.add(db_order)
    db.flush() # Get ID

    # 5. Add Items and Deduct Stock
    for item_model in order_items_to_create:
        item_model.order_id = db_order.id
        db.add(item_model)
        
        # Deduct stock from variant
        if item_model.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item_model.variant_id).first()
            variant.stock_quantity -= item_model.quantity

    # 6. Clear Cart
    db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    # 7. Commit Transaction
    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()

def get_order(db: Session, user_id: int, order_id: int) -> Optional[Order]:
    return db.query(Order).filter(Order.id == order_id, Order.user_id == user_id).first()

def cancel_order(db: Session, db_order: Order) -> Order:
    if db_order.status in [OrderStatus.SHIPPED, OrderStatus.DELIVERED, OrderStatus.CANCELLED]:
        raise HTTPException(
            status_code=400, 
            detail=f"Order cannot be cancelled in state: {db_order.status}"
        )
    
    # Restore stock
    for item in db_order.items:
        if item.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item.variant_id).first()
            if variant:
                variant.stock_quantity += item.quantity
    
    db_order.status = OrderStatus.CANCELLED
    db.add(db_order)
    db.commit()
    db.refresh(db_order)
    return db_order

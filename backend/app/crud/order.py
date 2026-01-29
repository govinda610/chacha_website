from typing import List, Optional
import uuid
from datetime import datetime
from sqlalchemy.orm import Session
from fastapi import HTTPException
from app.models.user import CartItem, User
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus
from app.models.product import ProductVariant, Product
from app.schemas.order import OrderCreate

def create_order(db: Session, user_id: Optional[int], order_in: OrderCreate) -> Order:
    # 1. Get Items (either from cart or from order_in for guests)
    items_input = []
    
    if order_in.items is not None:
        items_input = order_in.items
    elif user_id:
        cart_items = db.query(CartItem).filter(CartItem.user_id == user_id).all()
        if not cart_items:
            raise HTTPException(status_code=400, detail="Cart is empty in database for this user")
        items_input = cart_items
    else:
        raise HTTPException(status_code=400, detail="No items provided for guest order and user is not logged in")

    # 2. Preparation for Order
    subtotal = 0
    order_items_to_create = []
    
    for item in items_input:
        # Check if item is a model or a schema
        p_id = item.product_id
        v_id = item.variant_id
        qty = item.quantity
        
        product = db.query(Product).filter(Product.id == p_id).first()
        if not product:
            raise HTTPException(status_code=404, detail=f"Product {p_id} not found")
            
        variant = db.query(ProductVariant).filter(ProductVariant.id == v_id).first() if v_id else None
        
        # Check stock
        if variant:
            if variant.stock_quantity < qty:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Not enough stock for {variant.name}"
                )
            price = variant.price
            sku = variant.sku
        else:
            if not product.has_variants:
                # Deduct from product? Wait, our current logic uses variants for stock
                # If no variant, we might need a different stock check. 
                # For now, let's assume all stocks are per-variant as per current model.
                price = product.selling_price
                sku = f"PROD-{product.id}"
            else:
                raise HTTPException(status_code=400, detail=f"Product {product.name} requires a variant")

        item_total = price * qty
        subtotal += item_total
        
        order_items_to_create.append(
            OrderItem(
                product_id=product.id,
                variant_id=variant.id if variant else None,
                product_name=product.name,
                sku=sku,
                quantity=qty,
                unit_price=price,
                total_price=item_total
            )
        )

    # 3. Pricing Logic
    shipping_fee = 0.0 if subtotal > 5000 else 150.0
    tax_amount = subtotal * 0.18
    total_amount = subtotal + shipping_fee + tax_amount

    # 4. Create Order
    db_order = Order(
        order_number=f"DS-{uuid.uuid4().hex[:8].upper()}",
        user_id=user_id,
        address_id=order_in.address_id,
        status=OrderStatus.PENDING,
        payment_status=PaymentStatus.PENDING,
        payment_method=order_in.payment_method,
        guest_email=order_in.guest_email,
        guest_phone=order_in.guest_phone,
        guest_name=order_in.guest_name,
        subtotal=subtotal,
        shipping_fee=shipping_fee,
        tax_amount=tax_amount,
        total_amount=total_amount,
        notes=order_in.notes
    )
    db.add(db_order)
    db.flush()

    # 5. Add Items and Deduct Stock
    for item_model in order_items_to_create:
        item_model.order_id = db_order.id
        db.add(item_model)
        
        if item_model.variant_id:
            variant = db.query(ProductVariant).filter(ProductVariant.id == item_model.variant_id).first()
            if variant:
                variant.stock_quantity -= item_model.quantity

    # 6. Clear Cart if logged in
    if user_id and not order_in.items:
        db.query(CartItem).filter(CartItem.user_id == user_id).delete()

    db.commit()
    db.refresh(db_order)
    return db_order

def get_orders(db: Session, user_id: int) -> List[Order]:
    return db.query(Order).filter(Order.user_id == user_id).order_by(Order.created_at.desc()).all()

def get_order(db: Session, order_id: int, user_id: Optional[int] = None) -> Optional[Order]:
    query = db.query(Order).filter(Order.id == order_id)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    else:
        # If no user_id, only allow if it's a guest order (security: technically weak but fits current requirement)
        query = query.filter(Order.user_id == None)
    return query.first()

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

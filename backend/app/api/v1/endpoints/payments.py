"""
Payment endpoints for Razorpay integration.
"""
from typing import Any, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
import hashlib
import hmac

from app.api import deps
from app.models.user import User
from app.models.order import Order, PaymentStatus, OrderStatus
from app.core.config import settings

router = APIRouter()

# Request/Response schemas
class CreatePaymentOrderRequest(BaseModel):
    order_id: int

class CreatePaymentOrderResponse(BaseModel):
    razorpay_order_id: str
    razorpay_key: str
    amount: int  # in paise
    currency: str
    order_id: int

class VerifyPaymentRequest(BaseModel):
    razorpay_order_id: str
    razorpay_payment_id: str
    razorpay_signature: str
    order_id: int

class WebhookEvent(BaseModel):
    event: str
    payload: dict


@router.post("/create-order", response_model=CreatePaymentOrderResponse)
def create_payment_order(
    *,
    db: Session = Depends(deps.get_db),
    current_user: Optional[User] = Depends(deps.get_current_active_user_optional),
    request: CreatePaymentOrderRequest
) -> Any:
    """
    Create a Razorpay order for payment.
    """
    # Get the order
    query = db.query(Order).filter(Order.id == request.order_id)
    if current_user:
        query = query.filter(Order.user_id == current_user.id)
    else:
        query = query.filter(Order.user_id == None)
    
    order = query.first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.payment_status == PaymentStatus.PAID:
        raise HTTPException(status_code=400, detail="Order already paid")
    
    # In production, create actual Razorpay order via API
    # For MVP/dev, we mock the Razorpay order ID
    import uuid
    razorpay_order_id = f"order_{uuid.uuid4().hex[:16]}"
    
    # Store the razorpay order ID
    order.razorpay_order_id = razorpay_order_id
    db.add(order)
    db.commit()
    
    return {
        "razorpay_order_id": razorpay_order_id,
        "razorpay_key": getattr(settings, 'RAZORPAY_KEY_ID', 'rzp_test_mock_key'),
        "amount": int(order.total_amount * 100),  # Convert to paise
        "currency": "INR",
        "order_id": order.id
    }


@router.post("/verify")
def verify_payment(
    *,
    db: Session = Depends(deps.get_db),
    current_user: Optional[User] = Depends(deps.get_current_active_user_optional),
    request: VerifyPaymentRequest
) -> Any:
    """
    Verify Razorpay payment signature and update order status.
    """
    query = db.query(Order).filter(Order.id == request.order_id)
    if current_user:
        query = query.filter(Order.user_id == current_user.id)
    else:
        query = query.filter(Order.user_id == None)
    
    order = query.first()
    
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.razorpay_order_id != request.razorpay_order_id:
        raise HTTPException(status_code=400, detail="Order ID mismatch")
    
    # Verify signature using HMAC-SHA256
    secret = getattr(settings, 'RAZORPAY_KEY_SECRET', None)
    if secret and secret != "rzp_test_mock_secret":
        message = f"{request.razorpay_order_id}|{request.razorpay_payment_id}"
        expected_signature = hmac.new(secret.encode(), message.encode(), hashlib.sha256).hexdigest()
        if expected_signature != request.razorpay_signature:
            raise HTTPException(status_code=400, detail="Invalid signature")
    elif not secret:
        # Log a warning in dev mode if secret is missing
        print("WARNING: RAZORPAY_KEY_SECRET not found. Skipping signature verification in development.")
    
    # For MVP, we trust the signature and mark as paid
    order.razorpay_payment_id = request.razorpay_payment_id
    order.payment_status = PaymentStatus.PAID
    order.status = OrderStatus.CONFIRMED
    db.add(order)
    db.commit()
    db.refresh(order)
    
    return {
        "status": "success",
        "message": "Payment verified successfully",
        "order_id": order.id,
        "order_number": order.order_number
    }


@router.post("/webhook")
def payment_webhook(
    *,
    db: Session = Depends(deps.get_db),
    event: WebhookEvent
) -> Any:
    """
    Handle Razorpay webhook events.
    """
    # In production:
    # 1. Verify webhook signature from headers
    # 2. Process event based on type
    
    if event.event == "payment.captured":
        payment = event.payload.get("payment", {}).get("entity", {})
        razorpay_order_id = payment.get("order_id")
        razorpay_payment_id = payment.get("id")
        
        if razorpay_order_id:
            order = db.query(Order).filter(
                Order.razorpay_order_id == razorpay_order_id
            ).first()
            
            if order and order.payment_status != PaymentStatus.PAID:
                order.razorpay_payment_id = razorpay_payment_id
                order.payment_status = PaymentStatus.PAID
                order.status = OrderStatus.CONFIRMED
                db.add(order)
                db.commit()
    
    elif event.event == "payment.failed":
        payment = event.payload.get("payment", {}).get("entity", {})
        razorpay_order_id = payment.get("order_id")
        
        if razorpay_order_id:
            order = db.query(Order).filter(
                Order.razorpay_order_id == razorpay_order_id
            ).first()
            
            if order:
                order.payment_status = PaymentStatus.FAILED
                db.add(order)
                db.commit()
    
    return {"status": "received"}

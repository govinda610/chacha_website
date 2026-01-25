from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel
from app.schemas.product import Product

class OrderItemBase(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int
    unit_price: float

class OrderItem(OrderItemBase):
    id: int
    order_id: int
    product_name: str
    sku: str
    total_price: float
    product: Optional[Product] = None

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    address_id: int
    notes: Optional[str] = None
    payment_method: str = "cod"

class OrderCreate(OrderBase):
    pass

class Order(OrderBase):
    id: int
    order_number: str
    user_id: int
    status: str
    payment_status: str
    subtotal: float
    shipping_fee: float
    tax_amount: float
    total_amount: float
    created_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True

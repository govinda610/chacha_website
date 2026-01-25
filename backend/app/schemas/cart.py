from typing import List, Optional
from pydantic import BaseModel
from app.schemas.product import Product, ProductVariant

class CartItemBase(BaseModel):
    product_id: int
    variant_id: Optional[int] = None
    quantity: int = 1

class CartItemCreate(CartItemBase):
    pass

class CartItemUpdate(BaseModel):
    quantity: int

class CartItem(CartItemBase):
    id: int
    user_id: int
    product: Product
    variant: Optional[ProductVariant] = None

    class Config:
        from_attributes = True

class CartSummary(BaseModel):
    items: List[CartItem]
    subtotal: float
    total_quantity: int

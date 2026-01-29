from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class ProductImageBase(BaseModel):
    image_url: str
    image_type: str
    display_order: int

    class Config:
        from_attributes = True

class Brand(BaseModel):
    id: int
    name: str
    slug: str
    logo_url: Optional[str] = None
    is_active: bool = True

    class Config:
        from_attributes = True

class ProductVariantBase(BaseModel):
    sku: str
    name: str
    price: float
    stock_quantity: int
    specifications: Optional[Dict[str, Any]] = None

    class Config:
        from_attributes = True

class ProductVariant(ProductVariantBase):
    id: int

class CategoryBase(BaseModel):
    id: int
    name: str
    slug: str
    display_order: int = 0
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    slug: str
    brand_id: Optional[int] = None
    category_id: Optional[int] = None
    description: Optional[str] = None
    base_price: float
    selling_price: float
    has_variants: bool = False
    is_active: bool = True

class Product(ProductBase):
    id: int
    images: List[ProductImageBase] = []
    variants: List[ProductVariant] = []

    class Config:
        from_attributes = True

class ProductCreate(ProductBase):
    pass

class ProductUpdate(ProductBase):
    pass

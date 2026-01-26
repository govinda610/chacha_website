"""
Admin API endpoints for managing products, orders, users, and settings.
"""
from typing import Any, List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File
from sqlalchemy.orm import Session
from sqlalchemy import func
from pydantic import BaseModel
from datetime import datetime, timedelta

from app.api import deps
from app.models.user import User
from app.models.order import Order, OrderItem, OrderStatus, PaymentStatus, DeliveryZone, SiteSettings
from app.models.product import Product, ProductVariant, Category, Brand, ProductImage

router = APIRouter()


# ============== Admin Middleware ==============
def get_admin_user(current_user: User = Depends(deps.get_current_active_user)) -> User:
    """Verify user is admin."""
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Admin access required")
    return current_user


# ============== Dashboard ==============
class DashboardStats(BaseModel):
    total_revenue: float
    order_count: int
    average_order_value: float
    low_stock_count: int
    recent_orders: List[dict]


@router.get("/dashboard", response_model=DashboardStats)
def get_dashboard_stats(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """
    Get admin dashboard statistics.
    """
    # Revenue and order stats (last 30 days)
    thirty_days_ago = datetime.now() - timedelta(days=30)
    
    paid_orders = db.query(Order).filter(
        Order.payment_status == PaymentStatus.PAID,
        Order.created_at >= thirty_days_ago
    ).all()
    
    total_revenue = sum(o.total_amount for o in paid_orders)
    order_count = len(paid_orders)
    avg_order_value = total_revenue / order_count if order_count > 0 else 0
    
    # Low stock alerts
    low_stock = db.query(ProductVariant).filter(
        ProductVariant.stock_quantity < 5
    ).count()
    
    # Recent orders
    recent = db.query(Order).order_by(Order.created_at.desc()).limit(10).all()
    recent_orders = [
        {
            "id": o.id,
            "order_number": o.order_number,
            "total": o.total_amount,
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None
        }
        for o in recent
    ]
    
    return {
        "total_revenue": total_revenue,
        "order_count": order_count,
        "average_order_value": avg_order_value,
        "low_stock_count": low_stock,
        "recent_orders": recent_orders
    }


# ============== Products ==============
class AdminProductItem(BaseModel):
    id: int
    name: str
    slug: str
    selling_price: float
    base_price: float
    is_active: bool
    category_id: Optional[int]
    
    class Config:
        from_attributes = True


@router.get("/products")
def list_admin_products(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 50,
    search: Optional[str] = None
) -> Any:
    """List all products for admin."""
    query = db.query(Product)
    if search:
        query = query.filter(Product.name.ilike(f"%{search}%"))
    
    total = query.count()
    products = query.offset(skip).limit(limit).all()
    
    # Convert to serializable format
    product_list = [AdminProductItem.model_validate(p).model_dump() for p in products]
    return {"total": total, "products": product_list}


class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    base_price: Optional[float] = None
    selling_price: Optional[float] = None
    is_active: Optional[bool] = None
    category_id: Optional[int] = None


@router.put("/products/{product_id}")
def update_product(
    product_id: int,
    update_data: ProductUpdateRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Update a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(product, field, value)
    
    db.add(product)
    db.commit()
    db.refresh(product)
    return product


@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Soft delete a product."""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    product.is_active = False
    db.add(product)
    db.commit()
    return {"status": "deleted"}


class BulkProductItem(BaseModel):
    name: str
    slug: str
    sku: str
    category_id: Optional[int] = None
    brand_id: Optional[int] = None
    description: Optional[str] = None
    base_price: float
    selling_price: float
    stock_quantity: int = 0


class BulkUploadRequest(BaseModel):
    products: List[BulkProductItem]


class BulkUploadResponse(BaseModel):
    success_count: int
    error_count: int
    errors: List[dict]


@router.post("/products/bulk-upload", response_model=BulkUploadResponse)
def bulk_upload_products(
    data: BulkUploadRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """
    Bulk upload products from JSON array.
    Validates each product and reports errors for invalid entries.
    """
    success_count = 0
    error_count = 0
    errors = []
    
    for idx, item in enumerate(data.products):
        try:
            # Check for duplicate SKU
            existing = db.query(Product).filter(Product.slug == item.slug).first()
            if existing:
                errors.append({"index": idx, "sku": item.sku, "error": "Duplicate slug"})
                error_count += 1
                continue
            
            # Create product
            product = Product(
                name=item.name,
                slug=item.slug,
                category_id=item.category_id,
                brand_id=item.brand_id,
                description=item.description,
                base_price=item.base_price,
                selling_price=item.selling_price,
                is_active=True,
                has_variants=False
            )
            db.add(product)
            db.flush()  # Get ID
            
            # Create default variant with SKU
            from app.models.product import ProductVariant
            variant = ProductVariant(
                product_id=product.id,
                sku=item.sku,
                name=item.name,
                price=item.selling_price,
                stock_quantity=item.stock_quantity
            )
            db.add(variant)
            success_count += 1
            
        except Exception as e:
            errors.append({"index": idx, "sku": item.sku, "error": str(e)})
            error_count += 1
    
    db.commit()
    
    return {
        "success_count": success_count,
        "error_count": error_count,
        "errors": errors
    }


# ============== Orders ==============
class AdminOrderItem(BaseModel):
    id: int
    order_number: str
    total_amount: float
    status: str
    payment_status: str
    user_id: int
    
    class Config:
        from_attributes = True


@router.get("/orders")
def list_admin_orders(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 50,
    status: Optional[str] = None
) -> Any:
    """List all orders for admin."""
    query = db.query(Order)
    if status:
        query = query.filter(Order.status == status)
    
    total = query.count()
    orders = query.order_by(Order.created_at.desc()).offset(skip).limit(limit).all()
    order_list = [AdminOrderItem.model_validate(o).model_dump() for o in orders]
    return {"total": total, "orders": order_list}


class OrderStatusUpdate(BaseModel):
    status: str


@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    update: OrderStatusUpdate,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Update order status."""
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    # Validate status transition
    valid_statuses = [s.value for s in OrderStatus]
    if update.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Invalid status. Must be one of: {valid_statuses}")
    
    order.status = update.status
    db.add(order)
    db.commit()
    db.refresh(order)
    return AdminOrderItem.model_validate(order).model_dump()


# ============== Users ==============
class AdminUserItem(BaseModel):
    id: int
    email: str
    full_name: Optional[str]
    phone: str
    role: str
    is_active: bool
    tier: Optional[str]
    
    class Config:
        from_attributes = True


@router.get("/users")
def list_users(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user),
    skip: int = 0,
    limit: int = 50
) -> Any:
    """List all users."""
    total = db.query(User).count()
    users = db.query(User).offset(skip).limit(limit).all()
    user_list = [AdminUserItem.model_validate(u).model_dump() for u in users]
    return {"total": total, "users": user_list}


class UserUpdateRequest(BaseModel):
    tier: Optional[str] = None
    credit_limit: Optional[float] = None
    is_active: Optional[bool] = None
    is_verified: Optional[bool] = None


@router.put("/users/{user_id}")
def update_user(
    user_id: int,
    update_data: UserUpdateRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Update user (tier, credit limit, etc)."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    for field, value in update_data.model_dump(exclude_unset=True).items():
        setattr(user, field, value)
    
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


# ============== Categories ==============
@router.get("/categories")
def list_admin_categories(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """List all categories."""
    categories = db.query(Category).all()
    return categories


class CategoryCreateRequest(BaseModel):
    name: str
    slug: str
    parent_id: Optional[int] = None
    display_order: int = 0


@router.post("/categories")
def create_category(
    data: CategoryCreateRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Create a new category."""
    category = Category(**data.model_dump())
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.put("/categories/{category_id}")
def update_category(
    category_id: int,
    data: CategoryCreateRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Update a category."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(category, field, value)
    
    db.add(category)
    db.commit()
    db.refresh(category)
    return category


@router.delete("/categories/{category_id}")
def delete_category(
    category_id: int,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Delete a category."""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Category not found")
    
    category.is_active = False
    db.add(category)
    db.commit()
    return {"status": "deleted"}


# ============== Settings ==============
@router.get("/settings")
def get_settings(
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Get all site settings."""
    settings = db.query(SiteSettings).all()
    return {s.key: s.value for s in settings}


class SettingsUpdateRequest(BaseModel):
    settings: dict


@router.put("/settings")
def update_settings(
    data: SettingsUpdateRequest,
    db: Session = Depends(deps.get_db),
    admin: User = Depends(get_admin_user)
) -> Any:
    """Update site settings."""
    for key, value in data.settings.items():
        setting = db.query(SiteSettings).filter(SiteSettings.key == key).first()
        if setting:
            setting.value = value
        else:
            setting = SiteSettings(key=key, value=value)
        db.add(setting)
    
    db.commit()
    return {"status": "updated"}

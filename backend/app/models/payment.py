from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.core.database import Base
import enum

class PaymentStatus(str, enum.Enum):
    PENDING = "pending"
    SUCCESS = "success"
    FAILED = "failed"
    REFUNDED = "refunded"

class Payment(Base):
    __tablename__ = "payments"

    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id"))
    
    razorpay_order_id = Column(String, index=True, nullable=True)
    razorpay_payment_id = Column(String, index=True, nullable=True)
    razorpay_signature = Column(String, nullable=True)
    
    amount = Column(Float, nullable=False)
    currency = Column(String, default="INR")
    status = Column(String, default=PaymentStatus.PENDING)
    
    method = Column(String, nullable=True)
    bank = Column(String, nullable=True)
    wallet = Column(String, nullable=True)
    vpa = Column(String, nullable=True)
    
    error_code = Column(String, nullable=True)
    error_description = Column(String, nullable=True)
    
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    order = relationship("Order", back_populates="payments")

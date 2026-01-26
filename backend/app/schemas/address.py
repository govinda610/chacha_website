from typing import Optional
from pydantic import BaseModel

class AddressBase(BaseModel):
    label: Optional[str] = "Home"
    full_address: str
    city: str
    state: str
    pincode: str
    is_default: Optional[bool] = False

class AddressCreate(AddressBase):
    pass

class AddressUpdate(AddressBase):
    full_address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None

class AddressInDBBase(AddressBase):
    id: int
    user_id: int

    class Config:
        from_attributes = True

class Address(AddressInDBBase):
    pass

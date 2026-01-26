from typing import Any, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import crud
from app.api import deps
from app.models.user import Address
from app.schemas.address import Address as AddressSchema, AddressCreate
from app.schemas.user import User

router = APIRouter()

@router.get("/addresses", response_model=List[AddressSchema])
def read_user_addresses(
    db: Session = Depends(deps.get_db),
    current_user: User = Depends(deps.get_current_active_user),
    skip: int = 0,
    limit: int = 100,
) -> Any:
    """
    Retrieve current user's addresses.
    """
    return db.query(Address).filter(Address.user_id == current_user.id).offset(skip).limit(limit).all()

@router.post("/addresses", response_model=AddressSchema)
def create_user_address(
    *,
    db: Session = Depends(deps.get_db),
    address_in: AddressCreate,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Create new address for current user.
    """
    # If set as default, unset others // simplified logic for now
    if address_in.is_default:
        db.query(Address).filter(Address.user_id == current_user.id).update({"is_default": False})
    
    db_obj = Address(
        **address_in.model_dump(),
        user_id=current_user.id
    )
    db.add(db_obj)
    db.commit()
    db.refresh(db_obj)
    return db_obj

@router.delete("/addresses/{id}", response_model=AddressSchema)
def delete_user_address(
    *,
    db: Session = Depends(deps.get_db),
    id: int,
    current_user: User = Depends(deps.get_current_active_user),
) -> Any:
    """
    Delete an address.
    """
    address = db.query(Address).filter(Address.id == id, Address.user_id == current_user.id).first()
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    
    db.delete(address)
    db.commit()
    return address

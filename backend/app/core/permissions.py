from typing import List
from fastapi import Depends, HTTPException, status
from app.api import deps
from app.models.user import User, UserRole

class RoleChecker:
    def __init__(self, allowed_roles: List[UserRole]):
        self.allowed_roles = allowed_roles

    def __call__(self, user: User = Depends(deps.get_current_active_user)):
        if user.role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Operation not permitted"
            )
        return user

# Convenience dependencies
allow_admin = RoleChecker([UserRole.ADMIN])
allow_warehouse = RoleChecker([UserRole.ADMIN, UserRole.WAREHOUSE_MANAGER])
allow_sales = RoleChecker([UserRole.ADMIN, UserRole.SALES_MANAGER])
allow_support = RoleChecker([UserRole.ADMIN, UserRole.SUPPORT_EXECUTIVE])
# Combined roles
allow_staff = RoleChecker([
    UserRole.ADMIN, 
    UserRole.WAREHOUSE_MANAGER, 
    UserRole.SALES_MANAGER, 
    UserRole.SUPPORT_EXECUTIVE
])

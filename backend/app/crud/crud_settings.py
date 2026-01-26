from typing import Any, Optional
from sqlalchemy.orm import Session
from app.models.order import SiteSettings

def get_setting(db: Session, key: str) -> Optional[SiteSettings]:
    return db.query(SiteSettings).filter(SiteSettings.key == key).first()

def update_setting(db: Session, key: str, value: Any, description: Optional[str] = None) -> SiteSettings:
    db_obj = get_setting(db, key)
    if db_obj:
        db_obj.value = value
        if description:
            db_obj.description = description
    else:
        db_obj = SiteSettings(key=key, value=value, description=description)
        db.add(db_obj)
    
    db.commit()
    db.refresh(db_obj)
    return db_obj

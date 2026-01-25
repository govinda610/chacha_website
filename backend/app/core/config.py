from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path

class Settings(BaseSettings):
    PROJECT_NAME: str = "DentSupply"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    DATABASE_URL: str = "sqlite:///./dentsupply.db"
    
    # SECURITY
    SECRET_KEY: str = "your-secret-key-here-for-local-dev"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env"),
        case_sensitive=True
    )

settings = Settings()

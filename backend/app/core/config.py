from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional
from pathlib import Path
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "DentSupply"
    API_V1_STR: str = "/api/v1"
    
    # DATABASE
    # - In development: Set via .env file in backend/ directory
    # - In production: Set via environment variable (e.g., PostgreSQL URL)
    # Default: sqlite:///./dentsupply.db (relative to working directory)
    # Default: sqlite:///backend/dentsupply.db (absolute path)
    DATABASE_URL: str = f"sqlite:///{Path(__file__).resolve().parent.parent.parent}/dentsupply.db"
    
    # SECURITY
    SECRET_KEY: str = "your-secret-key-here-for-local-dev"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 30 # 30 days
    
    # RAZORPAY (set via environment in production)
    RAZORPAY_KEY_ID: str = "rzp_test_placeholder"
    RAZORPAY_KEY_SECRET: str = "placeholder_secret"
    
    model_config = SettingsConfigDict(
        env_file=str(Path(__file__).parent.parent / ".env"),
        case_sensitive=True,
        extra="ignore"
    )

settings = Settings()



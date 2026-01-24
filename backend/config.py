"""
Configuration settings for Project Nebula Backend
Loads environment variables and provides app-wide settings
"""

from pydantic_settings import BaseSettings
from functools import lru_cache
import os
from dotenv import load_dotenv

# Load .env from project root
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), '.env'))


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # REQUIRED - Must be in .env (app won't start without these)
    mongodb_uri: str
    openai_api_key: str
    jwt_secret: str
    
    # OPTIONAL - Have sensible defaults
    database_name: str
    jwt_algorithm: str
    access_token_expire_minutes: int = 60 * 24 * 7  # 7 days
    environment: str
    debug: bool
    
    class Config:
        env_file = "../.env"
        extra = "ignore"


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


# Export settings instance
settings = get_settings()

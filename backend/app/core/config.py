from pydantic_settings import BaseSettings
from typing import Optional, List, Union
import os
import json

class Settings(BaseSettings):
    # Database
    DATABASE_URL: str = "sqlite:///./justsploit.db"
    
    # Security
    SECRET_KEY: str = "your-secret-key-change-this-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # API Configuration
    API_V1_STR: str = "/api"
    PROJECT_NAME: str = "JustSploit"
    
    # CORS - Support both JSON array and comma-separated string
    BACKEND_CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173",
        "https://*.vercel.app",
        "https://*.railway.app"
    ]
    
    # Metasploit Configuration
    # (hapus MSF_HOST, MSF_PORT, MSF_USER, MSF_PASSWORD)
    
    # AI Configuration
    OPENAI_API_KEY: Optional[str] = None
    REPLICATE_API_TOKEN: Optional[str] = None
    AI_MODEL: str = "gpt-3.5-turbo"
    AI_MAX_TOKENS: int = 2000
    
    # Celery Configuration
    CELERY_BROKER_URL: str = "redis://localhost:6379/0"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/0"
    
    # Nmap Configuration
    NMAP_PATH: str = "/usr/bin/nmap"
    NMAP_TIMING: int = 3  # 0-5 (slowest to fastest)
    
    # WhatWeb Configuration
    WHATWEB_PATH: str = "/usr/bin/whatweb"
    
    # File Upload
    UPLOAD_DIR: str = "./uploads"
    MAX_FILE_SIZE: int = 10 * 1024 * 1024  # 10MB
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE: str = "./logs/justsploit.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True
    
    @property
    def cors_origins(self) -> List[str]:
        """Parse CORS origins from environment variable"""
        if isinstance(self.BACKEND_CORS_ORIGINS, str):
            # If string, split by comma
            return [origin.strip() for origin in self.BACKEND_CORS_ORIGINS.split(",")]
        return self.BACKEND_CORS_ORIGINS

# Create settings instance
settings = Settings()

# Ensure upload directory exists
os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
os.makedirs(os.path.dirname(settings.LOG_FILE), exist_ok=True) 
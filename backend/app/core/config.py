import json
from typing import List, Union, Any
from pydantic import AnyHttpUrl, field_validator # Use field_validator in Pydantic v2
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "My FastAPI Project"

    # Server settings
    HOST: str = "0.0.0.0"
    PORT: int = 8000
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl] = []

    @field_validator("BACKEND_CORS_ORIGINS", mode='before')
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> Union[List[str], str]:
        if isinstance(v, str) and not v.startswith("["):
            return [i.strip() for i in v.split(",")]
        elif isinstance(v, (list, str)):
            # If it's a list or a string that looks like a list (e.g. '["http://localhost"]' )
            # Pydantic will handle its conversion to List[AnyHttpUrl]
            return v
        raise ValueError(v)

    # Database settings
    DATABASE_URL: str = "sqlite+aiosqlite:///./test.db" # Default to SQLite for easy start
    # Example for PostgreSQL: "postgresql+asyncpg://user:password@host:port/db_name"

    # Redis settings
    REDIS_HOST: str = "localhost"
    REDIS_PORT: int = 6379
    REDIS_DB: int = 0
    REDIS_PASSWORD: Union[str, None] = None

    # Security settings
    SECRET_KEY: str = "change_this_secret_key_in_production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days

    # LangChain/LLM settings
    OPENAI_API_KEY: Union[str, None] = None
    ANTHROPIC_API_KEY: Union[str, None] = None
    LANGCHAIN_TRACING_V2: bool = False
    LANGCHAIN_API_KEY: Union[str, None] = None
    LANGCHAIN_PROJECT: Union[str, None] = None

    # Celery Worker Settings (if used)
    CELERY_BROKER_URL: Union[str, None] = None
    CELERY_RESULT_BACKEND: Union[str, None] = None

    # model_config allows Pydantic v2 to load from .env files
    model_config = SettingsConfigDict(env_file=".env", extra='ignore')

# Singleton pattern to ensure settings are loaded only once
_settings_instance = None

def get_settings() -> Settings:
    global _settings_instance
    if _settings_instance is None:
        _settings_instance = Settings()
    return _settings_instance 
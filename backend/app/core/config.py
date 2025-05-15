import json
from typing import List, Union, Any, Optional
from pydantic import AnyHttpUrl, field_validator, EmailStr
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    # Project Info
    PROJECT_NAME: str = "My Fullstack Project"
    API_V1_STR: str = "/api/v1"

    # Security settings for JWT
    SECRET_KEY: str = "your_super_secret_key_please_change_this_in_env"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    # REFRESH_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days, if using refresh tokens

    # Database URL
    # Example for SQLite: "sqlite+aiosqlite:///./test.db"
    # Example for PostgreSQL: "postgresql+asyncpg://user:password@host:port/db_name"
    DATABASE_URL: str = "sqlite+aiosqlite:///./development.db"

    # CORS Origins
    # String of origins separated by comma or space, e.g. "http://localhost:3000 http://127.0.0.1:3000"
    # This will be parsed into a list of strings by the validator.
    BACKEND_CORS_ORIGINS: List[str] = ["http://localhost:3000"]

    @field_validator("BACKEND_CORS_ORIGINS", mode='before')
    def assemble_cors_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            # Split by comma or space, and filter out empty strings
            return [origin.strip() for origin in v.replace(",", " ").split() if origin.strip()]
        elif isinstance(v, list):
            return [str(origin).strip() for origin in v if str(origin).strip()]
        raise ValueError("BACKEND_CORS_ORIGINS must be a string or list of strings")

    # Optional: Redis settings (if you plan to use Redis)
    REDIS_HOST: Optional[str] = None
    REDIS_PORT: Optional[int] = None
    REDIS_DB: Optional[int] = None
    REDIS_PASSWORD: Optional[str] = None

    # Optional: LangChain/LLM settings
    OPENAI_API_KEY: Optional[str] = None
    # Add other LLM related env vars if needed

    # model_config allows Pydantic v2 to load from .env files
    # env_file_encoding can be specified if not utf-8
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding='utf-8', extra='ignore')


settings = Settings() 
from pydantic import BaseModel
from datetime import datetime
from typing import Optional
import uuid

# Example Base Schema with common fields
class BaseSchema(BaseModel):
    pass

class IdMixin(BaseModel):
    id: int # Or uuid.UUID if you prefer UUIDs

class TimestampMixin(BaseModel):
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    # Pydantic v2 config for ORM mode (formerly orm_mode = True)
    model_config = {
        "from_attributes": True
    }

# Generic message schema
class Message(BaseModel):
    message: str 
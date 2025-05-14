from sqlalchemy import Column, DateTime, Integer, func
from sqlalchemy.orm import as_declarative, declared_attr
from typing import Any

@as_declarative()
class Base:
    """Base class for all SQLAlchemy ORM models."""
    id: Any
    __name__: str

    # Generate __tablename__ automatically
    @declared_attr
    def __tablename__(cls) -> str:
        return cls.__name__.lower()

    # Common columns for all models
    # These can be uncommented and customized as needed
    # id = Column(Integer, primary_key=True, index=True)
    # created_at = Column(DateTime, server_default=func.now(), nullable=False)
    # updated_at = Column(DateTime, server_default=func.now(), onupdate=func.now(), nullable=False)

    # If you prefer UUIDs for primary keys:
    # import uuid
    # from sqlalchemy.dialects.postgresql import UUID
    # id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True) 
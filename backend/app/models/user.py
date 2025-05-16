from sqlalchemy import Column, Integer, String, Boolean, JSON
from sqlalchemy.orm import relationship

from app.models.base import Base # Corrected import path

class User(Base):
    __tablename__ = "users" # Explicitly define table name as per common practice

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False) # Added for potential superuser/admin roles

    # New fields based on frontend User type
    nickname = Column(String, nullable=True)
    avatar_url = Column(String, nullable=True) # Renamed from avatarUrl to follow snake_case
    roles = Column(JSON, nullable=True) # Storing list of strings as JSON
    permissions = Column(JSON, nullable=True) # Storing list of strings as JSON

    # Add relationships here if needed, e.g.:
    # items = relationship("Item", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}', nickname='{self.nickname}')>" 
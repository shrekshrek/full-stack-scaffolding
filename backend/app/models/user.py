from sqlalchemy import Column, Integer, String, Boolean
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

    # Add relationships here if needed, e.g.:
    # items = relationship("Item", back_populates="owner")

    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>" 
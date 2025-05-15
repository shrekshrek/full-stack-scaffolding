from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.future import select # For SQLAlchemy 2.0 style select

from app.core.security import get_password_hash
from app.models.user import User
from app.schemas.user import UserCreate

async def get_user_by_id(db: AsyncSession, user_id: int) -> User | None:
    result = await db.execute(select(User).filter(User.id == user_id))
    return result.scalar_one_or_none()

async def get_user_by_email(db: AsyncSession, email: str) -> User | None:
    result = await db.execute(select(User).filter(User.email == email))
    return result.scalar_one_or_none()

async def get_user_by_username(db: AsyncSession, username: str) -> User | None:
    result = await db.execute(select(User).filter(User.username == username))
    return result.scalar_one_or_none()

async def create_user(db: AsyncSession, user_in: UserCreate) -> User:
    hashed_password = get_password_hash(user_in.password)
    db_user = User(
        username=user_in.username,
        email=user_in.email,
        hashed_password=hashed_password,
        is_active=user_in.is_active if user_in.is_active is not None else True, # Respect schema default
        is_superuser=user_in.is_superuser if user_in.is_superuser is not None else False
    )
    db.add(db_user)
    await db.commit()
    await db.refresh(db_user)
    return db_user

# Placeholder for update_user if needed
# async def update_user(db: AsyncSession, user: User, user_in: UserUpdate) -> User:
#     pass

# Placeholder for delete_user if needed
# async def delete_user(db: AsyncSession, user_id: int) -> User | None:
#     pass 
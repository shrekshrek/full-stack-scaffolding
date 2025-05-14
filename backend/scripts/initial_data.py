#!/usr/bin/env python3
"""This script can be used to populate the database with initial or sample data.

It should be run within the PDM environment to have access to project dependencies:
`pdm run python backend/scripts/initial_data.py`
"""
import asyncio

from app.core.db import SessionLocal, engine
from app.core.config import get_settings
# Import your models and CRUD operations as needed
# from app.models.user import User # Example
# from app.schemas.user import UserCreate # Example
# from app.crud.user import user as crud_user # Example
# from app.core.security import get_password_hash # Example

settings = get_settings()

async def init_db_with_data():
    db = SessionLocal()
    try:
        # Example: Create a superuser if it doesn't exist
        # This is a simplified example. You'd typically check if the user exists first.
        # For a real superuser, ensure settings for email/password are handled securely,
        # possibly from environment variables or a secure config.
        
        # superuser_email = settings.FIRST_SUPERUSER_EMAIL # Assuming you add this to your Settings
        # superuser_password = settings.FIRST_SUPERUSER_PASSWORD # Assuming you add this

        # if superuser_email and superuser_password:
        #     existing_superuser = await crud_user.get_by_email(db, email=superuser_email)
        #     if not existing_superuser:
        #         user_in = UserCreate(
        #             email=superuser_email,
        #             password=get_password_hash(superuser_password),
        #             full_name="Admin User",
        #             is_superuser=True,
        #             is_active=True
        #         )
        #         await crud_user.create(db=db, obj_in=user_in)
        #         print(f"Superuser {superuser_email} created.")
        #     else:
        #         print(f"Superuser {superuser_email} already exists.")
        # else:
        #     print("Superuser email or password not configured. Skipping superuser creation.")

        # Add more data initialization logic here
        # For example, creating default roles, settings, or sample data for development.
        print("Initial data script placeholder. Add your data seeding logic here.")

        await db.commit() # Commit all changes made in this session
    except Exception as e:
        await db.rollback()
        print(f"An error occurred during initial data population: {e}")
        raise
    finally:
        await db.close()

async def main():
    print("Starting initial data population...")
    # Optional: You might want to create tables if they don't exist, though Alembic is preferred for schema management.
    # from app.models.base import Base
    # async with engine.begin() as conn:
    #     await conn.run_sync(Base.metadata.create_all) # Ensure tables exist
    
    await init_db_with_data()
    print("Initial data population finished.")

if __name__ == "__main__":
    asyncio.run(main()) 
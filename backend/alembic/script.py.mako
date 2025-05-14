"""This file is used to bootstrap the Alembic migration environment.
It's usually called by the `alembic` command line tool.
"""

# Import this to ensure your models are registered with SQLAlchemy's MetaData
# from app.models import user # Example: import your models here

# from app.models.base import Base # Ensure Base is imported if models are spread out

# You might not need to explicitly import models if your env.py correctly
# sets up target_metadata by importing the Base from your models package. 
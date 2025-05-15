import logging
from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine

from alembic import context

# ---> ADDED IMPORT FOR APP BASE
# from app.models.base import Base as AppBaseMetadata
# ---> ADDED IMPORT FOR APP SETTINGS
from app.core.config import settings as app_settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# target_metadata should be assigned dynamically within context configuration functions
# to ensure all models are loaded.
# Commenting out the global target_metadata assignment here:
# from app.models.base import Base as AppBaseMetadata
# target_metadata = AppBaseMetadata.metadata 

# ---> REMOVING GLOBAL target_metadata, it will be fetched dynamically
# target_metadata = AppBaseMetadata.metadata

# ---> Get an alembic logger instance
log = logging.getLogger(__name__) # Or logging.getLogger("alembic.env")

def get_app_metadata():
    """Dynamically imports and returns the app's Base.metadata."""
    from app.models.base import Base as AppBaseMetadata # Import here to ensure models are loaded
    # Implicitly, importing Base from app.models.base should trigger app.models.__init__.py,
    # which in turn imports User, registering it to Base.metadata.
    # print("DEBUG: In get_app_metadata(), tables in AppBaseMetadata.metadata:", AppBaseMetadata.metadata.tables.keys())
    log.warning(f"DEBUG (get_app_metadata): Tables in metadata: {list(AppBaseMetadata.metadata.tables.keys())}") # <--- Use logger
    log.warning(f"DEBUG (get_app_metadata): Metadata object ID: {id(AppBaseMetadata.metadata)}")
    return AppBaseMetadata.metadata

# ---> ADDING/MODIFYING get_db_url FUNCTION
def get_db_url() -> str:
    return app_settings.DATABASE_URL

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.


def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    # ---> USING get_db_url() instead of alembic.ini
    url = get_db_url() # Was config.get_main_option("sqlalchemy.url")
    # ---> Get metadata dynamically
    current_target_metadata = get_app_metadata()
    context.configure(
        url=url,
        target_metadata=current_target_metadata, # Use dynamically fetched metadata
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
        render_as_batch=True,
        template_args={}
    )

    with context.begin_transaction():
        context.run_migrations()


async def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    configuration = config.get_section(config.config_ini_section, {})
    configuration["sqlalchemy.url"] = get_db_url()

    # ---> USING AsyncEngine
    connectable = AsyncEngine(
        engine_from_config(
            configuration,
            prefix="sqlalchemy.",
            poolclass=pool.NullPool,
            future=True # Important for SQLAlchemy 2.0 style async engines
        )
    )

    # ---> USING ASYNC CONNECTION AND run_sync
    async with connectable.connect() as connection:
        await connection.run_sync(do_run_migrations)

    # ---> AWAITING DISPOSE
    await connectable.dispose()


if context.is_offline_mode():
    run_migrations_offline()
else:
    # ---> USING asyncio.run FOR ONLINE MODE
    import asyncio
    asyncio.run(run_migrations_online())

def do_run_migrations(connection):
    # ---> Get metadata dynamically
    current_target_metadata = get_app_metadata()
    log.warning(f"DEBUG (do_run_migrations): Using metadata object ID: {id(current_target_metadata)}") # <--- Use logger
    context.configure(
        connection=connection, 
        target_metadata=current_target_metadata, # Use dynamically fetched metadata
        render_as_batch=True,
        template_args={}
    )
    with context.begin_transaction():
        context.run_migrations()

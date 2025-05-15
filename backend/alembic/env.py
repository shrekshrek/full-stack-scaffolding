from logging.config import fileConfig

from sqlalchemy import engine_from_config
from sqlalchemy import pool
from sqlalchemy.ext.asyncio import AsyncEngine

from alembic import context

# ---> ADDED IMPORT FOR APP BASE
from app.models.base import Base as AppBaseMetadata
# ---> ADDED IMPORT FOR APP SETTINGS
from app.core.config import settings as app_settings

# this is the Alembic Config object, which provides
# access to the values within the .ini file in use.
config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# add your model's MetaData object here
# for 'autogenerate' support
# from myapp import mymodel
# target_metadata = mymodel.Base.metadata
# ---> SETTING TARGET_METADATA FROM APP BASE
target_metadata = AppBaseMetadata.metadata

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
    context.configure(
        url=url,
        target_metadata=target_metadata,
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
    context.configure(
        connection=connection, 
        target_metadata=target_metadata,
        render_as_batch=True,
        template_args={}
    )
    with context.begin_transaction():
        context.run_migrations()

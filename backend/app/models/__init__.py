from .base import Base  # noqa: F401, To make Base available via app.models.Base
from .user import User  # noqa: F401, To ensure User model is registered with Base.metadata

# If you have other models, import them here as well:
# from .item import Item # noqa: F401 (example)
# from .order import Order # noqa: F401 (example) 
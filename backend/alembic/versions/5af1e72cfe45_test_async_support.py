"""test_async_support

Revision ID: 5af1e72cfe45
Revises: a015f203cf2b
Create Date: 2025-05-16 00:32:48.221808

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '5af1e72cfe45'
down_revision: Union[str, None] = 'a015f203cf2b'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

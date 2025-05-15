"""test_load_db_url_from_app

Revision ID: a015f203cf2b
Revises: b3f92c503bd7
Create Date: 2025-05-16 00:32:26.311620

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a015f203cf2b'
down_revision: Union[str, None] = 'b3f92c503bd7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

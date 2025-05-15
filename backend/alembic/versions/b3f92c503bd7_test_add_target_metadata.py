"""test_add_target_metadata

Revision ID: b3f92c503bd7
Revises: 26d326f2c072
Create Date: 2025-05-16 00:31:58.087856

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b3f92c503bd7'
down_revision: Union[str, None] = '26d326f2c072'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

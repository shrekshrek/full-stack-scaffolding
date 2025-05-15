"""test_batch_and_template_args

Revision ID: cc50d6de3b0f
Revises: 5af1e72cfe45
Create Date: 2025-05-16 00:33:28.489202

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'cc50d6de3b0f'
down_revision: Union[str, None] = '5af1e72cfe45'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    """Upgrade schema."""
    pass


def downgrade() -> None:
    """Downgrade schema."""
    pass

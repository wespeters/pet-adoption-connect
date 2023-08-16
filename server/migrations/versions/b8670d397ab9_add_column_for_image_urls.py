"""add column for image URLs

Revision ID: b8670d397ab9
Revises: 3d506a01cd1e
Create Date: 2023-08-15 17:46:16.004557

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'b8670d397ab9'
down_revision = '3d506a01cd1e'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pets', schema=None) as batch_op:
        batch_op.add_column(sa.Column('image_url', sa.String(), nullable=True))

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('pets', schema=None) as batch_op:
        batch_op.drop_column('image_url')

    # ### end Alembic commands ###

"""empty message

Revision ID: 62e4da788533
Revises: 286ae0faac2f
Create Date: 2023-08-17 13:37:20.794760

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '62e4da788533'
down_revision = '286ae0faac2f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.alter_column('time',
               existing_type=sa.TIMESTAMP(),
               type_=sa.DateTime(),
               existing_nullable=False)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('messages', schema=None) as batch_op:
        batch_op.alter_column('time',
               existing_type=sa.DateTime(),
               type_=sa.TIMESTAMP(),
               existing_nullable=False)

    # ### end Alembic commands ###

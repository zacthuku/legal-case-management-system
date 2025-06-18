"""fix foreign key and password constraint

Revision ID: 32839491a69b
Revises: e46496c77d33
Create Date: 2025-06-16 10:33:39.603120

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '32839491a69b'
down_revision = 'e46496c77d33'
branch_labels = None
depends_on = None


def upgrade():
    with op.batch_alter_table('cases', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_cases_client_id_users', 'users', ['client_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key('fk_cases_lawyer_id_users', 'users', ['lawyer_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_comments_user_id_users', 'users', ['user_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key('fk_comments_case_id_cases', 'cases', ['case_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_documents_case_id_cases', 'cases', ['case_id'], ['id'], ondelete='CASCADE')
        batch_op.create_foreign_key('fk_documents_uploaded_by_users', 'users', ['uploaded_by'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.create_foreign_key('fk_user_profiles_user_id_users', 'users', ['user_id'], ['id'], ondelete='CASCADE')

    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.create_unique_constraint('uq_users_password_hash', ['password_hash'])

    pass


def downgrade():
    with op.batch_alter_table('users', schema=None) as batch_op:
        batch_op.drop_constraint('uq_users_password_hash', type_='unique')

    with op.batch_alter_table('user_profiles', schema=None) as batch_op:
        batch_op.drop_constraint('fk_user_profiles_user_id_users', type_='foreignkey')

    with op.batch_alter_table('documents', schema=None) as batch_op:
        batch_op.drop_constraint('fk_documents_case_id_cases', type_='foreignkey')
        batch_op.drop_constraint('fk_documents_uploaded_by_users', type_='foreignkey')

    with op.batch_alter_table('comments', schema=None) as batch_op:
        batch_op.drop_constraint('fk_comments_user_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_comments_case_id_cases', type_='foreignkey')

    with op.batch_alter_table('cases', schema=None) as batch_op:
        batch_op.drop_constraint('fk_cases_client_id_users', type_='foreignkey')
        batch_op.drop_constraint('fk_cases_lawyer_id_users', type_='foreignkey')

    pass

# client_views.py
from flask import Blueprint, jsonify
from models import Case, Comment, User
from flask_jwt_extended import jwt_required, get_jwt_identity
from sqlalchemy.orm import joinedload
client_bp = Blueprint('client', __name__)

@client_bp.route('/client/cases', methods=['GET'])
@jwt_required()
def get_client_cases():
    user = get_jwt_identity()
    
    if user['role'].lower() != 'client' :
        return jsonify(error="Unauthorized"), 403

    cases = Case.query.options(
        joinedload(Case.documents),
        joinedload(Case.comments).joinedload(Comment.user),
        joinedload(Case.lawyer),
        joinedload(Case.client)
    ).filter_by(client_id=user['id']).all()
    return jsonify([case.to_dict() for case in cases]), 200


@client_bp.route('/client/case/<int:id>', methods=['GET'])
@jwt_required()
def get_case_detail(id):
    user = get_jwt_identity()

    # Eager load for detail view
    case = Case.query.options(
        joinedload(Case.documents),
        joinedload(Case.comments).joinedload(Comment.user),
        joinedload(Case.lawyer),
        joinedload(Case.client)
    ).filter_by(id=id, client_id=user['id']).first()

    if not case:
        return jsonify(error="Forbidden or not found"), 403

    return jsonify(case.to_dict()), 200
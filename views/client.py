# client_views.py
from flask import Blueprint, jsonify
from models import Case
from flask_jwt_extended import jwt_required, get_jwt_identity

client_bp = Blueprint('client', __name__)

@client_bp.route('/client/cases', methods=['GET'])
@jwt_required()
def get_client_cases():
    user = get_jwt_identity()
    if user['role'] != 'Client':
        return jsonify(error="Unauthorized"), 403
    cases = Case.query.filter_by(client_id=user['id']).all()
    return jsonify([case.to_dict() for case in cases])

@client_bp.route('/client/case/<int:id>', methods=['GET'])
@jwt_required()
def get_case_detail(id):
    user = get_jwt_identity()
    case = Case.query.get_or_404(id)
    if case.client_id != user['id']:
        return jsonify(error="Forbidden"), 403
    return jsonify(case.to_dict())

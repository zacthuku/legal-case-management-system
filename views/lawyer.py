# lawyer_views.py
from flask import Blueprint, jsonify, request
from models import Case, db
from flask_jwt_extended import jwt_required, get_jwt_identity

lawyer_bp = Blueprint('lawyer', __name__)

@lawyer_bp.route('/lawyer/cases', methods=['GET'])
@jwt_required()
def get_lawyer_cases():
    user = get_jwt_identity()
    if user['role'].lower() != 'lawyer':
        return jsonify(error="Unauthorized"), 403
    cases = Case.query.filter_by(lawyer_id=user['id']).all()
    return jsonify([case.to_dict() for case in cases])

@lawyer_bp.route('/lawyer/case/<int:id>', methods=['PUT'])
@jwt_required()
def update_case(id):
    user = get_jwt_identity()
    case = Case.query.get_or_404(id)
    if case.lawyer_id != user['id']:
        return jsonify(error="Not allowed"), 403
    data = request.get_json()
    case.status = data.get("status", case.status)
    db.session.commit()
    return jsonify({"success":"case updated successfully"}, case.to_dict())
@lawyer_bp.route('/lawyer/case/<int:id>', methods=['GET'])
@jwt_required()
def get_case_detail(id):
    user = get_jwt_identity()
    case = Case.query.get_or_404(id)
    if case.lawyer_id != user['id']:
        return jsonify(error="Forbidden"), 403
    return jsonify(case.to_dict())

@lawyer_bp.route('/lawyer/case/<int:id>/comments', methods=['GET'])
@jwt_required()
def get_case_comments(id):
    user = get_jwt_identity()
    case = Case.query.get_or_404(id)
    if case.lawyer_id != user['id']:
        return jsonify(error="Forbidden"), 403
    comments = case.comments
    return jsonify([c.to_dict() for c in comments])
    return jsonify(error=str(e)), 500
# return no of assigned cases
@lawyer_bp.route('/lawyer/cases/count', methods=['GET'])
@jwt_required()
def get_assigned_cases_count():
    user = get_jwt_identity()
    if user['role'].lower() != 'lawyer':
        return jsonify(error="Unauthorized"), 403
    count = Case.query.filter_by(lawyer_id=user['id']).count()
    return jsonify(count=count)
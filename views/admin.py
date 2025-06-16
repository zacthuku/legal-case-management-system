from flask import Blueprint, request, jsonify
from models import User, Case, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from flask_mail import Mail


admin_bp = Blueprint('admin', __name__)

#  Check if user is Admin
def admin_required():
    identity = get_jwt_identity()
    if not identity or identity.get('role') != 'Admin':
        return False
    return True


@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    if not admin_required():
        return jsonify(error="Unauthorized"), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200


@admin_bp.route('/admin/cases', methods=['POST'])
@jwt_required()
def create_case():
    if not admin_required():
        return jsonify(error="Unauthorized"), 403

    data = request.get_json()
    required_fields = ['title', 'description', 'lawyer_id', 'client_id']
    for field in required_fields:
        if field not in data:
            return jsonify(error=f"Missing field: {field}"), 400

    new_case = Case(
        title=data['title'],
        description=data['description'],
        lawyer_id=data['lawyer_id'],
        client_id=data['client_id'],
        status=data.get('status', 'Open')
    )

    db.session.add(new_case)
    db.session.commit()

    # Email notification to both lawyer and client
    try:
        lawyer = User.query.get(new_case.lawyer_id)
        client = User.query.get(new_case.client_id)
        msg = Message(
            subject="New Case Assigned",
            recipients=[lawyer.email, client.email],
            body=f"A new case '{new_case.title}' has been assigned to you."
        )
        mail.send(msg)
    except Exception as e:
        print(f"Email error: {e}")
        return jsonify(message="Case created, but email failed"), 201

    return jsonify(new_case.to_dict()), 201


@admin_bp.route('/admin/cases/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case(case_id):
    if not admin_required():
        return jsonify(error="Unauthorized"), 403
    case = Case.query.get_or_404(case_id)
    return jsonify(case.to_dict()), 200


@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    identity = get_jwt_identity()
    if not identity or identity.get('role') != 'Admin':
        return jsonify(error="Unauthorized"), 403
    # if id given by admin does not exist
    if not User.query.get(user_id):
        return jsonify(error="User not found"), 404
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    
    return jsonify(message="User deleted successfully"), 200

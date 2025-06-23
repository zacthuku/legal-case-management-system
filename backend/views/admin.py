from flask import Blueprint, request, jsonify
from models import User, Case, db
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask_mail import Message
from flask_mail import Mail


admin_bp = Blueprint('admin', __name__)

#  Check if user is Admin
def admin_required():
    identity = get_jwt_identity()
    if not identity or identity.get('role') != 'admin':
        return False
    return True


@admin_bp.route('/admin/users', methods=['GET'])
@jwt_required()
def get_all_users():
    if not admin_required():
        return jsonify(error="Unauthorized"), 403
    users = User.query.all()
    return jsonify([u.to_dict() for u in users]), 200

@admin_bp.route('/clients', methods=['GET'])
@jwt_required()
def get_clients():
    clients = User.query.filter_by(role='client').all()
    return jsonify([u.to_dict() for u in clients]), 200
# admin and lawyer can view all cases
@admin_bp.route('/cases', methods=['GET'])
@jwt_required()
def get_cases():
    identity = get_jwt_identity()
    if not identity or identity.get('role', '').lower() not in ['admin', 'lawyer']:
        return jsonify(error="Unauthorized"), 403
    cases = Case.query.all()
    return jsonify([c.to_dict() for c in cases]), 200
@admin_bp.route('/lawyers', methods=['GET'])
@jwt_required()
def get_lawyers():
    lawyers = User.query.filter_by(role='lawyer').all()
    return jsonify([u.to_dict() for u in lawyers]), 200
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
    client = User.query.get(data['client_id'])
    lawyer = User.query.get(data['lawyer_id'])

    if not client:
        return jsonify(error=f"Client with ID {data['client_id']} not found."), 404
    if client.role != "client":
        return jsonify(error=f"User ID {client.id} is not a client."), 400

    if not lawyer:
        return jsonify(error=f"Lawyer with ID {data['lawyer_id']} not found."), 404
    if lawyer.role != "lawyer":
        return jsonify(error=f"User ID {lawyer.id} is not a lawyer."), 400


    new_case = Case(
        title=data['title'],
        description=data['description'],
        lawyer_id=data['lawyer_id'],
        client_id=data['client_id'],
        status=data.get('status', 'Open').capitalize()
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
        return jsonify(success="Case created"), 201

    return jsonify(new_case.to_dict()), 201

@admin_bp.route('/admin/cases', methods=['GET'])
@jwt_required()
def get_all_cases():
    if not admin_required():
        return jsonify(error="Unauthorized"), 403
    cases = Case.query.all()
    return jsonify([c.to_dict() for c in cases]), 200
#allow admin and lawyer to view a specific case
@admin_bp.route('/cases/<int:case_id>', methods=['GET'])
@jwt_required()
def get_case(case_id):
    user = get_jwt_identity()
    role = user.get("role", "").lower()
    user_id = user.get("id")

    case = Case.query.get_or_404(case_id)

    if role == 'admin':
        return jsonify(case.to_dict()), 200

    if role == 'lawyer' and case.lawyer_id == user_id:
        return jsonify(case.to_dict()), 200

    if role == 'client' and case.client_id == user_id:
        return jsonify(case.to_dict()), 200

    return jsonify(error="Unauthorized: You do not have access to this case."), 403


#update case status
@admin_bp.route('/cases/<int:case_id>/status', methods=['PATCH'])
@jwt_required()
def update_case_status(case_id):
    identity = get_jwt_identity()
    if not identity or identity.get('role', '').lower() != 'admin':
        return jsonify(error="Unauthorized"), 403
    case = Case.query.get_or_404(case_id)
    data = request.get_json()
    if 'status' not in data:
        return jsonify(error="Missing status field"), 400
    case.status = data['status'].capitalize()
    db.session.commit()
    return jsonify(case.to_dict()), 200

@admin_bp.route('/admin/users/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    identity = get_jwt_identity()
    if not identity or identity.get('role', '').lower() != 'admin':
        return jsonify(error="Unauthorized"), 403
    # if id given by admin does not exist
    if not User.query.get(user_id):
        return jsonify(error="User not found"), 404
    user = User.query.get_or_404(user_id)
    db.session.delete(user)
    db.session.commit()

    
    return jsonify(success="User deleted successfully"), 200

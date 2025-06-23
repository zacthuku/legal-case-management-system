from flask import Blueprint, request, jsonify, current_app
from models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity, get_jwt
from flask_mail import Message
from flask_mail import Mail
from datetime import datetime, timezone
from models import TokenBlocklist
from email_validator import validate_email, EmailNotValidError
import re
auth_bp = Blueprint('auth', __name__)

# Assume `mail` is initialized in app.py and accessible via current_app
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()

    required_fields = ['username', 'email', 'password', 'role']
    for field in required_fields:
        if field not in data:
            return jsonify(error=f"Missing field: {field}"), 400

    try:
        validate_email(data['email'])
    except EmailNotValidError as e:
        return jsonify({"error": str(e)}), 400
    password = data['password']
    if len(password) < 8 or not re.search(r'[A-Za-z]', password) or not re.search(r'\d', password):
        return jsonify({"error": "Password must be at least 8 characters long and contain both letters and numbers."}), 400
    role = data['role'].lower()
    if role not in ['admin', 'client', 'lawyer']:
        return jsonify({"error": "Invalid role. Must be 'admin', 'client', or 'lawyer'."}), 400
    if User.query.filter_by(email=data['email']).first():
        return jsonify(error="Email already registered"), 409
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already taken"}), 409

    hashed_password = generate_password_hash(data['password'])
    user = User(
        username=data['username'],
        email=data['email'],
        password_hash=hashed_password,
        role=role 
    )

    try:
        db.session.add(user)
        db.session.commit()

        # Send welcome email
        msg = Message(
            subject="Welcome to Our Service",
            recipients=[user.email],
            sender=current_app.config['MAIL_DEFAULT_SENDER'],
            body=f"Hello {user.username},\n\nThank you for registering with us!"
        )
        mail = current_app.extensions.get('mail')
        if mail:
            mail.send(msg)
        else:
            print("Email not sent.")

        return jsonify({"success":"User registered successfully "}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Error during registration or email sending: {e}")
        return jsonify(error="Registration failed"), 500


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()

    if 'email' not in data or 'password' not in data:
        return jsonify(error="Email and password are required"), 400

    user = User.query.filter_by(email=data['email']).first()

    if user and check_password_hash(user.password_hash, data['password']):
        identity = {"id": user.id, "role": user.role}
        access_token = create_access_token(identity=identity)

        return jsonify(
            token=access_token
        ), 200

    return jsonify(error="Invalid credentials"), 401

#  fetching logged in user
@auth_bp.route("/current_user", methods=["GET"])
@jwt_required()
def fetch_current_user():
    identity = get_jwt_identity()
    current_user_id = identity.get('id')

    user = User.query.get(current_user_id)

    if not user:
        return jsonify({"error": "User not found"}), 404

    user_data = {
        "id": user.id,
        "username": user.username,
        "email": user.email,
        "role": user.role,  
        "created_at": user.created_at
    }

    return jsonify(user_data), 200


# Logout
@auth_bp.route("/logout", methods=["DELETE"])
@jwt_required()
def modify_token():
    jti = get_jwt()["jti"]
    now = datetime.now(timezone.utc)

    new_blocked_token =TokenBlocklist(jti=jti, created_at=now)
    db.session.add(new_blocked_token)
    db.session.commit()
    return jsonify({"success": "Successfully logged out"}), 200

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.security import check_password_hash, generate_password_hash
from models import db, User, UserProfile

profile_bp = Blueprint('profile', __name__)

# Get current user's profile
@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])

    if not user:
        return jsonify(error="User not found"), 404

    if not user.profile:
        user.profile = UserProfile(user_id=user.id)
        db.session.add(user.profile)
        db.session.commit()

    return jsonify(profile=user.profile.to_dict())


# Update current user's profile
@profile_bp.route('/profile', methods=['PATCH'])
@jwt_required()
def update_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])
    data = request.get_json()

    if not user:
        return jsonify(error="User not found"), 404

    # Create profile if it doesn't exist yet
    if not user.profile:
        user.profile = UserProfile(user_id=user.id)

    profile = user.profile

    profile.full_name = data.get('full_name', profile.full_name)
    profile.phone_number = data.get('phone_number', profile.phone_number)
    profile.address = data.get('address', profile.address)
    profile.profile_picture_url = data.get('profile_picture_url', profile.profile_picture_url)

    print("Received JSON payload:", data)

    db.session.commit()
    return jsonify(success="Profile updated", profile=profile.to_dict())



@profile_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])

    if not user:
        return jsonify(error="User not found"), 404

    data = request.get_json()
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    confirm_password = data.get("confirm_password")

    if not current_password or not new_password or not confirm_password:
        return jsonify(error="All fields are required"), 400

    if not check_password_hash(user.password_hash, current_password):
        return jsonify(error="Current password is incorrect"), 401

    if new_password != confirm_password:
        return jsonify(error="New passwords do not match"), 400

    if len(new_password) < 6:
        return jsonify(error="Password must be at least 6 characters long"), 400

    user.password_hash = generate_password_hash(new_password)
    db.session.commit()

    return jsonify(message="Password changed successfully"), 200

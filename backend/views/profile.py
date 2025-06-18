from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, User, UserProfile

profile_bp = Blueprint('profile', __name__)

# Get current user's profile
@profile_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    identity = get_jwt_identity()
    user = User.query.get(identity['id'])

    if user and user.profile:
        return jsonify(user.profile.to_dict())
    return jsonify(error="Profile not found"), 404

# Update current user's profile
@profile_bp.route('/profile', methods=['PUT'])
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

    db.session.commit()
    return jsonify(success="Profile updated", profile=profile.to_dict())

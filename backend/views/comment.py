# comment_views.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Comment, db, User, Case

comment_bp = Blueprint('comments', __name__)

@comment_bp.route('/cases/<int:case_id>/comments', methods=['POST'])
@jwt_required()
def post_comment(case_id):
    user = get_jwt_identity()
    data = request.get_json()
    comment = Comment(case_id=case_id, user_id=user['id'], content=data['content'])
    db.session.add(comment)
    db.session.commit()
    return jsonify(comment.to_dict()), 201

@comment_bp.route('/cases/<int:case_id>/comments', methods=['GET'])
@jwt_required()
def get_case_comments(case_id):
    current_user = get_jwt_identity()
    user = User.query.get(current_user['id'])

    if user.role == 'admin' or user.role == 'lawyer':
        comments = Comment.query.filter_by(case_id=case_id).all()
    elif user.role == 'client':
        # Only fetch if this case belongs to them
        case = Case.query.get(case_id)
        if case.client_id != user.id:
            return jsonify({"error": "Access denied"}), 403
        comments = Comment.query.filter_by(case_id=case_id).all()
    else:
        return jsonify({"error": "Invalid role"}), 400

    return jsonify([c.to_dict() for c in comments]), 200

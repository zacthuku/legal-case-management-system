# comment_views.py
from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Comment, db

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
def get_comments(case_id):
    comments = Comment.query.filter_by(case_id=case_id).all()
    return jsonify([c.to_dict() for c in comments])

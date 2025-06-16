# document_views.py
import os
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Document, db

document_bp = Blueprint('documents', __name__)

@document_bp.route('/cases/<int:case_id>/upload', methods=['POST'])
@jwt_required()
def upload_doc(case_id):
    user = get_jwt_identity()
    file = request.files['file']
    if file:
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        doc = Document(case_id=case_id, uploader_id=user['id'], filename=filename)
        db.session.add(doc)
        db.session.commit()
        return jsonify(doc.to_dict()), 201
    return jsonify(error="No file uploaded"), 400

@document_bp.route('/documents/<filename>', methods=['GET'])
@jwt_required()
def download_doc(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename, as_attachment=True)

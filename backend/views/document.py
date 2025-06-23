# document_views.py
import os
from flask import Blueprint, request, jsonify, send_from_directory, current_app
from werkzeug.utils import secure_filename
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import Document, db, User, Case

document_bp = Blueprint('documents', __name__)

@document_bp.route('/cases/<int:case_id>/documents', methods=['POST'])
@jwt_required()
def upload_doc(case_id):
    user = get_jwt_identity()
    role = user.get("role")
    user_id = user.get("id")

    # Check if file was sent
    if 'documents' not in request.files:
        return jsonify(error="No file part in the request"), 400

    file = request.files['documents']
    if not file or file.filename == '':
        return jsonify(error="No file uploaded"), 400

    # Fetch case and validate
    case = Case.query.get(case_id)
    if not case:
        return jsonify(error="Case not found"), 404

    # Upload permission checks
    if role == "lawyer" and case.lawyer_id != user_id:
        return jsonify(error="You can only upload documents to your own cases."), 403
    elif role == "client" and case.client_id != user_id:
        return jsonify(error="You can only upload documents to your own cases."), 403

    # Save the file
    filename = secure_filename(file.filename)
    filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)

    try:
        file.save(filepath)
        file_url = f"http://127.0.0.1:5000/documents/{filename}"  # Adjust for production

        doc = Document(
            case_id=case_id,
            uploaded_by=user_id,
            filename=filename,
            file_url=file_url
        )
        db.session.add(doc)
        db.session.commit()

        return jsonify(doc.to_dict()), 201

    except Exception as e:
        current_app.logger.error(f"Document upload failed: {e}")
        return jsonify(error="Internal server error during upload."), 500


@document_bp.route('/documents/<filename>', methods=['GET'])
@jwt_required()
def download_doc(filename):
    return send_from_directory(current_app.config['UPLOAD_FOLDER'], filename, as_attachment=True)
@document_bp.route('/cases/<int:case_id>/documents', methods=['GET'])
@jwt_required()
def get_documents_by_case(case_id):
    documents = Document.query.filter_by(case_id=case_id).all()
    return jsonify([doc.to_dict() for doc in documents]), 200
@document_bp.route('/documents/<int:doc_id>', methods=['DELETE'])
@jwt_required()
def delete_document(doc_id):
    user = get_jwt_identity()
    document = Document.query.get_or_404(doc_id)

    if document.uploaded_by != user['id']:
        return jsonify(error="Unauthorized: You can only delete your own documents."), 403

    
    try:
        file_path = os.path.join(current_app.config['UPLOAD_FOLDER'], document.filename)
        if os.path.exists(file_path):
            os.remove(file_path)
    except Exception as e:
        current_app.logger.error(f"Failed to delete file from disk: {e}")
        return jsonify(error="Failed to delete file from disk."), 500

    
    db.session.delete(document)
    db.session.commit()

    return jsonify(success="Document deleted successfully."), 200

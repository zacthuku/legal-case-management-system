from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData

metadata = MetaData()
db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = "users"
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(30), nullable=False, unique=True)
    email = db.Column(db.String(50), nullable=False, unique=True)
    password_hash = db.Column(db.Text, nullable=False)
    role = db.Column(db.String(10), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships with cascade deletes
    profile = db.relationship("UserProfile", back_populates="user", uselist=False, cascade="all, delete-orphan")
    lawyer_cases = db.relationship("Case", back_populates="lawyer", foreign_keys="Case.lawyer_id", cascade="all, delete")
    client_cases = db.relationship("Case", back_populates="client", foreign_keys="Case.client_id", cascade="all, delete")
    uploaded_documents = db.relationship("Document", back_populates="uploader", cascade="all, delete")
    comments = db.relationship("Comment", back_populates="user", cascade="all, delete")
    
    def to_dict(self, include_profile=False):
        return {
            "id": self.id,
            "username": self.username,
            "email": self.email,
            "role": self.role,
            }

class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.Text)
    profile_picture_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="profile")

    def to_dict(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "full_name": self.full_name,
            "phone_number": self.phone_number,
            "address": self.address,
            "profile_picture_url": self.profile_picture_url,
            "created_at": self.created_at.isoformat()
        }


class Case(db.Model):
    __tablename__ = "cases"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default="Open")
    lawyer_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    client_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    lawyer = db.relationship("User", foreign_keys=[lawyer_id], back_populates="lawyer_cases")
    client = db.relationship("User", foreign_keys=[client_id], back_populates="client_cases")
    documents = db.relationship("Document", back_populates="case", cascade="all, delete")
    comments = db.relationship("Comment", back_populates="case", cascade="all, delete")
    
    def to_dict(self):
        return {
            "id": self.id,
            "title": self.title,
            "description": self.description,
            "status": self.status,
            "lawyer_id": self.lawyer_id,
            "client_id": self.client_id,
            "lawyer": self.lawyer.to_dict() if self.lawyer else None,
            "client": self.client.to_dict() if self.client else None,
            "documents": [doc.to_dict() for doc in self.documents],
            "comments": [comment.to_dict() for comment in self.comments]
        }

class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.Text, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    uploader = db.relationship("User", back_populates="uploaded_documents")
    case = db.relationship("Case", back_populates="documents")
    
    def to_dict(self):
        return {
            "id": self.id,
            "filename": self.filename,
            "file_url": self.file_url,
            "uploaded_by": self.uploaded_by,
            "case_id": self.case_id,
            "upload_date": self.upload_date.isoformat()
            
        }

class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id", ondelete="CASCADE"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", back_populates="comments")
    case = db.relationship("Case", back_populates="comments")

    def to_dict(self):
        return {
            "id": self.id,
            "content": self.content,
            "role": self.user.role if self.user else None,
            "user": self.user.to_dict() if self.user else None
        }

class TokenBlocklist(db.Model):
    __tablename__ = "token_blocklist"

    id = db.Column(db.Integer, primary_key=True)
    jti = db.Column(db.String(36), nullable=False, unique=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    

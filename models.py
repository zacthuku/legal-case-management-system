from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
from sqlalchemy import MetaData

metadata =  MetaData()

db = SQLAlchemy(metadata=metadata)

class User(db.Model):
    __tablename__ = "users"
    id =db.Column(db.Integer, primary_key=True)
    username=db.Column(db.String(30), nullable=False, unique=True)
    email =db.Column(db.String(50), nullable=False, unique=True)
    password_hash= db.Column(db.Text, nullable=False)
    role=db.Column(db.String(10), nullable=False)
    created_at=db.Column(db.DateTime, default=datetime.utcnow)

    # Relationships
    profile = db.relationship("UserProfile", back_populates="user", uselist=False)
    lawyer_cases = db.relationship("Case", back_populates="lawyer", foreign_keys="Case.lawyer_id")
    client_cases = db.relationship("Case", back_populates="client", foreign_keys="Case.client_id")
    uploaded_documents = db.relationship("Document", back_populates="uploader")
    comments = db.relationship("Comment", back_populates="user")


class UserProfile(db.Model):
    __tablename__ = "user_profiles"

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), unique=True, nullable=False)
    full_name = db.Column(db.String(100))
    phone_number = db.Column(db.String(20))
    address = db.Column(db.Text)
    profile_picture_url = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref=db.backref("profile", uselist=False))


class Case(db.Model):
    __tablename__ = "cases"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    status = db.Column(db.String(20), default="Open")
    lawyer_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    client_id = db.Column(db.Integer, db.ForeignKey("users.id"))
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    lawyer = db.relationship("User", foreign_keys=[lawyer_id], backref="lawyer_cases")
    client = db.relationship("User", foreign_keys=[client_id], backref="client_cases")


class Document(db.Model):
    __tablename__ = "documents"

    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.Text, nullable=False)
    uploaded_by = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    upload_date = db.Column(db.DateTime, default=datetime.utcnow)

    uploader = db.relationship("User", backref="uploaded_documents")
    case = db.relationship("Case", backref="documents")


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    content = db.Column(db.Text, nullable=False)
    case_id = db.Column(db.Integer, db.ForeignKey("cases.id"), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("users.id"), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship("User", backref="comments")
    case = db.relationship("Case", backref="comments")

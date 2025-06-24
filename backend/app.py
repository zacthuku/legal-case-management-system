from flask import Flask, request, jsonify
from models import db, User
from flask_migrate import Migrate
from flask_jwt_extended import JWTManager
from flask_mail import Mail
from datetime import timedelta
from flask_cors import CORS
import os

app = Flask(__name__)
cors = CORS(app, resources={r"/*": {"origins": "*"}})   

app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://legal_case_management_system_db_user:zzjhKuprbgvyqOecQfo3BegVxOandd2i@dpg-d1d87nili9vc73a92ih0-a.oregon-postgres.render.com/legal_case_management_system_db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
UPLOAD_FOLDER = os.path.join(os.getcwd(), 'uploads')
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['JWT_SECRET_KEY'] = 'super-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=2)


migrate = Migrate(app, db)
db.init_app(app)
jwt = JWTManager(app)
jwt.init_app(app)

app.config['MAIL_SERVER'] = 'smtp.gmail.com' 
app.config['MAIL_PORT'] = 587
app.config['MAIL_USE_TLS'] = True
app.config["MAIL_USE_SSL"] = False
app.config['MAIL_USERNAME'] = 'zacthuku7@gmail.com' 
app.config['MAIL_PASSWORD'] = 'tlqj rksl zqww emur'  
app.config['MAIL_DEFAULT_SENDER'] = 'zacthuku7@gmail.com'

mail = Mail(app)
@app.route('/test-email')
def test_email():
    try:
        msg = Message(
            subject="Test",
            recipients=["your_other_email@gmail.com"],
            body="This is a test from Flask Mail",
            sender=app.config["MAIL_DEFAULT_SENDER"]
        )
        mail.send(msg)
        return jsonify(message="Test email sent successfully!")
    except Exception as e:
        return jsonify(error=str(e)), 500


# Register Blueprint
from views import *

app.register_blueprint(auth_bp)
app.register_blueprint(client_bp)
app.register_blueprint(lawyer_bp)
app.register_blueprint(admin_bp)
app.register_blueprint(document_bp)
app.register_blueprint(comment_bp)
app.register_blueprint(profile_bp)

@jwt.token_in_blocklist_loader
def check_if_token_revoked(jwt_header, jwt_payload: dict) -> bool:
    jti = jwt_payload["jti"]
    token = db.session.query(TokenBlocklist.id).filter_by(jti=jti).scalar()

    return token is not None

if __name__ == "__main__":
    app.run(debug=True)
    

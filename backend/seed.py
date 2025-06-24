from models import db, User
from app import app
from werkzeug.security import generate_password_hash
from flask_mail import Message

def seed_admin():
    admin_email = "zacthuku@gmail.com"
    admin_username = "zacthuku"
    admin_password = "zacthuku@09"

    with app.app_context():  
        existing_admin = User.query.filter_by(email=admin_email).first()
        if existing_admin:
            print(" Admin already exists.")
            return

        admin_user = User(
            username=admin_username,
            email=admin_email,
            password_hash=generate_password_hash(admin_password),
            role="admin"
        )

        db.session.add(admin_user)
        db.session.commit()
        try:
            msg = Message(
                subject="Welcome to Our Service",
                recipients=[admin_email],
                body="Thank you for registering as an admin user."
            )
            mail = app.extensions.get('mail')
            if mail:
                mail.send(msg)
        except Exception as e:
            db.session.rollback()
            print(f"Error sending welcome email: {e}")
            return
        print(" Admin user seeded successfully.")

if __name__ == "__main__":
    seed_admin()

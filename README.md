# Legal Case Management System

**By:** Zacharia Ndinguri

**Date:** 24/06/2025


## Description

The Legal Case Management System streamlines interactions between clients, lawyers, and administrators. It offers role-based features for filing, tracking, updating, and managing legal cases. The frontend is built with React and TailwindCSS, while the backend uses Flask and PostgreSQL.

It includes:

* A landing page showcasing the app purpose
* Login and Register pages
* Role-specific dashboards (Client, Lawyer, Admin)

---

## Features / User Stories

### A User (Client/Lawyer) Can:

* Register an account (username, email, password)
* Login to their account
* Update their profile information
* View their associated legal cases
* Comment on a case
* Upload or view documents related to a case

### An Admin Can:

* Login to the admin dashboard
* View all users (clients, lawyers)
* Assign cases to lawyers
* Approve or update case statuses
* Manage all comments, documents, and cases
* Delete or update users, cases, and comments

---

## Setup/Installation Requirements

### Backend (Flask API)

1. Clone or download the repository:

   ```bash
   git clone https://github.com/zacthuku/legal-case-management-system.git
   cd legal-case-management-system/backend
   ```

2. Create and activate a virtual environment:

   ```bash
   python3 -m venv .venv
   source .venv/bin/activate
   ```

3. Install dependencies:

   ```bash
   pip install -r requirements.txt
   ```

4. Set up the database:

   ```bash
   flask db init
   flask db migrate -m "Initial migration"
   flask db upgrade
   ```

5. Seed admin user:

   ```bash
   python seed.py
   ```

6. Run the backend server:

   ```bash
   flask run --debug
   ```

---

### Frontend (React)

1. In a new terminal, navigate to the frontend:

   ```bash
   cd ../frontend
   ```

2. Install packages:

   ```bash
   npm install
   ```

3. Run the frontend app:

   ```bash
   npm run dev
   ```

---

## Deployment

* **Frontend on Vercel**: [Live Frontend App](https://legal-case-management-system.vercel.app/)
* **Backend on Render**: [Live API](https://legal-case-management-system.onrender.com)

---

## Known Bugs

The application is stable and currently has no known bugs.
If any issues arise, please feel free to report them via email.

---

## Technologies Used

* **Frontend**:

  * React
  * Tailwind CSS
  * React Icons
  * Vite
  * React Router
  * Toastify

* **Backend**:

  * Flask
  * Flask SQLAlchemy
  * Flask JWT Extended
  * Flask Mail
  * PostgreSQL

---

## Support and Contact

For questions, suggestions, or support:

Email: [zacthuku@gmail.com](mailto:zacthuku@gmail.com)

---

## License

This project is licensed under the [MIT License](LICENSE).

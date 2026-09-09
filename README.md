Career Pilot is a job application tracking application that helps job seekers organize and monitor their employment applications. It features user authentication and lets you create, view, edit, and delete job application records with details like company, role, location, status, salary, and notes.

Stack
Language(s): JavaScript (React frontend), Python (backend)
Framework / runtime: FastAPI (Python backend), React 19 + Vite (frontend), PostgreSQL database
Notable libraries: SQLAlchemy (ORM), Pydantic (validation), React Router (navigation), Passlib + PyJWT (authentication)
How it's organized
Code
app/                        FastAPI backend application
  main.py                   Application entry point, router registration, CORS setup
  database.py               PostgreSQL connection, session factory, Base model
  models.py                 SQLAlchemy ORM models (User, JobApplication)
  schemas.py                Pydantic request/response validation schemas
  routers/
    auth.py                 User registration, login, JWT token generation
    applications.py         CRUD endpoints for job applications

react-frontend/             React + Vite frontend
  src/
    App.jsx                 Router setup (Login, Register, Dashboard, ProtectedRoute)
    login.jsx               Login/register navigation, form handling
    dashboard.jsx           Main app: job application list, search, filter, CRUD operations
    App.css                 Styling

alembic/                    Database migration configuration
alembic.ini                 Alembic setup file
How it fits together: Requests flow from the React frontend through React Router to pages (Login, Register, Dashboard). The dashboard manages job applications in state, fetching and updating them via REST API calls to the FastAPI backend. Backend routes validate requests with Pydantic schemas, authenticate users via JWT tokens in the Authorization header, and interact with PostgreSQL via SQLAlchemy ORM models. User sessions are stateless and tied to JWT tokens stored in browser localStorage.

How to run it
Backend setup:

bash
cd app
pip install -r requirements.txt
uvicorn main:app --reload
Runs on http://localhost:8000. Requires a PostgreSQL database at postgresql+psycopg://postgres:159369@localhost:5432/Job_tracker.

Frontend setup:

bash
cd react-frontend
npm install
npm run dev

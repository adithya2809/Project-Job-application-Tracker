from fastapi import APIRouter,HTTPException,status,Depends
from app.schemas import UserCreate,JobApplicationCreate,JobApplicationResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobApplication
router=APIRouter()

@router.post("/applications",response_model=JobApplicationResponse)
def create_application(application:JobApplicationCreate,db:Session=Depends(get_db)):
    db_application = JobApplication(
    company=application.company,
    role=application.role,
    location=application.location,
    job_type=application.job_type,
    status=application.status,
    application_date=application.application_date,
    job_url=application.job_url,
    salary=application.salary,
    notes=application.notes,
    user_id=current_user.id
)
    db.add(db_application)
    db.commit()
    db.refresh(db_application)

    return db_application
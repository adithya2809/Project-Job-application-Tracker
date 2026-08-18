from fastapi import APIRouter,HTTPException,status,Depends
from app.schemas import UserCreate,JobApplicationCreate,JobApplicationResponse
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import JobApplication,User
from app.routers.auth import get_current_user
from jose import jwt,JWTError
router=APIRouter()

@router.post("/applications",response_model=JobApplicationResponse,status_code=status.HTTP_201_CREATED)
def create_application(application:JobApplicationCreate,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):



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

@router.get("/applications",response_model=list[JobApplicationResponse],status_code=status.HTTP_200_OK)
def get_all_applications(db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    db_application=db.query(JobApplication).filter(JobApplication.user_id==current_user.id).all()

    return db_application

@router.get("/applications/{id}",response_model=JobApplicationResponse,status_code=status.HTTP_200_OK)
def get_applications_by_id(id:int,db:Session=Depends(get_db),current_user:User=Depends(get_current_user)):
    db_application=db.query(JobApplication).filter(JobApplication.id==id,JobApplication.user_id==current_user.id).first()

    if db_application is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Data Not Found"
        )

    return db_application
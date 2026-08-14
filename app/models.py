from sqlalchemy import Column,Integer,String,Date,ForeignKey
from app.database import Base
from sqlalchemy.orm import relationship
class User(Base):
    __tablename__="users"
    applications=relationship("JobApplication",back_populates="user")

    id=Column(Integer,primary_key=True,index=True)
    user_name=Column(String(50),nullable=False,unique=True)
    email=Column(String(100),nullable=False,unique=True)
    hashed_password=Column(String,nullable=False)

class JobApplication(Base):
    __tablename__="job_applications"
    user=relationship("User",back_populates="applications")

    id=Column(Integer,primary_key=True,index=True)
    company=Column(String,nullable=False)
    role=Column(String,nullable=False)
    location=Column(String,nullable=True)
    job_type=Column(String,nullable=True)
    status=Column(String,nullable=False)
    application_date=Column(Date,nullable=False)
    job_url=Column(String,nullable=True)
    salary=Column(Integer,nullable=True)
    notes=Column(String,nullable=True)
    user_id=Column(Integer,ForeignKey(User.id),nullable=False)


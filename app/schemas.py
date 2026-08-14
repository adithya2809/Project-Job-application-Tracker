from pydantic import BaseModel,EmailStr
from typing import Optional
from datetime import date
class UserCreate(BaseModel):
    user_name:str
    email:EmailStr
    password:str

class UserResponse(BaseModel):
    user_name:str
    email:EmailStr
    id:int

class JobApplicationCreate(BaseModel):
    company:str
    role:str
    location:Optional[str]=None
    job_type:Optional[str]=None
    status:str
    application_date: date
    job_url:Optional[str]=None
    salary:Optional[int]=None
    notes:Optional[str]=None

class JobApplicationUpdate(BaseModel):
    company:Optional[str]=None
    role:Optional[str]=None
    location:Optional[str]=None
    job_type:Optional[str]=None
    status:Optional[str]=None
    job_url:Optional[str]=None
    application_date:Optional[date]=None
    salary:Optional[int]=None
    notes:Optional[str]=None

class JobApplicationResponse(BaseModel):
    id: int
    company: str
    role: str
    location: Optional[str] = None
    job_type: Optional[str] = None
    status: str
    application_date: date
    job_url: Optional[str] = None
    salary: Optional[int] = None
    notes: Optional[str] = None
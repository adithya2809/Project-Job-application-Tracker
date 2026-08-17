from passlib.context import CryptContext
from app.schemas import UserCreate,UserResponse,UserLogin,TokenResponse,JobApplicationCreate
from sqlalchemy.orm import Session
from fastapi import Depends,APIRouter,HTTPException,status
from app.database import get_db
from app.models import User

from jose import jwt,JWTError

from datetime import datetime,timezone,timedelta
pwd_context=CryptContext(schemes=["bcrypt"],
                         deprecated="auto"
                         )

SECRET_KEY="7f3c9a1e6b8d4f2a9c5e7b1d3f6a8c0e2b4d6f9a1c3e5b7d9f2a4c6e8b0d1f3"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=30

from fastapi.security import OAuth2PasswordBearer
outh2_scheme=OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token:str=Depends(outh2_scheme),db:Session=Depends(get_db)):
    try:
        payload=jwt.decode(token,SECRET_KEY,algorithms=[ALGORITHM])

        user_id=payload.get("sub")

        

        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not Validate Credentials"
            )

        try:
            user_id=int(user_id)
        except(ValueError,TypeError):
            raise HTTPException(
                            status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Could not Validate Credentials"
                        )
        
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not Validate Credentials"
        )
    db_user=db.query(User).filter(User.id==user_id).first()

    if db_user is None:
        raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Could not Validate Credentials"
                )
    return db_user

    
                     


def create_access_token(data:dict):
    to_encode=data.copy()

    expire=datetime.now(timezone.utc)+timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)

    to_encode.update({"exp":expire})

    encoded_jwt=jwt.encode(
        to_encode,
        SECRET_KEY,
        algorithm=ALGORITHM
    )

    return encoded_jwt

def hash_password(password:str)->str:
    return pwd_context.hash(password)

def verify_password(plain_password:str,hashed_password:str)->bool:
    return pwd_context.verify(plain_password,hashed_password)

router=APIRouter(prefix="/auth")

@router.post("/register",response_model=UserResponse,status_code=status.HTTP_201_CREATED)
def register_user(user:UserCreate,db:Session=Depends(get_db)):

    existing_user=db.query(User).filter(User.user_name==user.user_name).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="User alredy exists"
        )

    existing_email=db.query(User).filter(User.email==user.email).first()

    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="email alredy exists"
        )
        
    hashed_password=hash_password(user.password)
    db_user=User(
        user_name=user.user_name,
        email=user.email,
        hashed_password=hashed_password
    )

    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

@router.post("/login",response_model=TokenResponse)
def user_login(user:UserLogin,db:Session=Depends(get_db)):

    
    
    if user.user_name:
        db_user=db.query(User).filter(User.user_name==user.user_name).first()

    elif user.email:
        db_user=db.query(User).filter(User.email==user.email).first()

    
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Username or Password"
        )
    mana_user_password=verify_password(user.password,db_user.hashed_password)

    if not mana_user_password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid Username or Password"
            )

    access_token=create_access_token(
        {"sub":str(db_user.id)}
    )
    return {
        "access_token":access_token,
        "token_type":"bearer"
    }


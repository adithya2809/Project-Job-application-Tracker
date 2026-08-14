from passlib.context import CryptContext
from app.schemas import UserCreate,UserResponse,UserLogin
from sqlalchemy.orm import Session
from fastapi import Depends,APIRouter,HTTPException,status
from app.database import get_db
from app.models import User
pwd_context=CryptContext(schemes=["bcrypt"],
                         deprecated="auto"
                         )

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

@router.post("/login")
def user_login(user:UserLogin,db:Session=Depends(get_db)):
    mana_user_name=db.query(User).filter(User.user_name==user.user_name).fisrt()
    mana_user_email=db.query(User).filter(User.email==user.email).fisrt()

    if not mana_user_name and mana_user_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid Username or Email"
        )
    mana_user_password=verify_password(user.password,User.hashed_password)

    if not mana_user_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Incorrect password"
        )

    
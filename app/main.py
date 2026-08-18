from fastapi import FastAPI
from app.routers import applications,auth
from app import models
from app.database import Base,engine
from fastapi.middleware.cors import CORSMiddleware

app=FastAPI()

app.include_router(applications.router)
app.include_router(auth.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



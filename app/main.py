from fastapi import FastAPI
from app.routers import applications,auth
from app import models
from app.database import Base,engine


app=FastAPI()

app.include_router(applications.router)
app.include_router(auth.router)




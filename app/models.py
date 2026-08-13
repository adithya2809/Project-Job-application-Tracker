from sqlalchemy import Column,Integer,Boolean,String

class users():
    id=Column(Integer,primary_key=True,index=True)
    company=Column(String,nullable=False)
    role=Column(String,nullable=False)
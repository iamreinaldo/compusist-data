from pydantic import BaseModel
from typing import Optional



class UserCreateIn(BaseModel):
    name: str
    username: str
    password: str


class UserUpdateIn(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class UserLogin(BaseModel):
    username : str
    password: str
from pydantic import BaseModel

class NameOut(BaseModel):
    name: str


class AttributeOut(BaseModel):
    customer_id: int
    user_id: int

class LoginOut(BaseModel):
    username: str
from pydantic import BaseModel
from typing import Optional




class CustomerCreateIn(BaseModel):
    name : str
    cnpj : str
    address : str
    contact : str

class CustomerUpdateIn(BaseModel):
    name : Optional[str] = None
    cnpj : Optional[str] = None
    address : Optional[str] = None
    contact : Optional[str] = None
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

class CustomerAttributesIn(BaseModel):   
    customer_id : int
    user_id : int
    network_customer : bool
    network : Optional[str] = None
    server_customer: bool
    server_addr : Optional[str] = None
    server_pass : Optional[str] = None
    mgmt_pass : Optional[str] = None
    ip_list : Optional[str] = None
    clock_customer : bool
    clock_addr : Optional[str] = None
    clock_system_pass : Optional[str] = None
    tech_team : bool

class CustomerUpdateIn(BaseModel):
    user_id : int
    network_customer : Optional[bool] = None
    network : Optional[str] = None
    server_customer: Optional[bool] = None
    server_addr : Optional[str] = None
    server_pass : Optional[str] = None
    mgmt_pass : Optional[str] = None
    ip_list : Optional[str] = None
    clock_customer : Optional[bool] = None
    clock_addr : Optional[str] = None
    clock_system_pass : Optional[str] = None
    tech_team : Optional[bool] = None
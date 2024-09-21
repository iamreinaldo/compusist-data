from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Customers(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cnpj = Column(String, index=True)
    address = Column(String, index=True)
    contact = Column(String, index=True)

class CustomerAttributes(Base):     
    __tablename__ = 'customer_attributes'
    id = Column(Integer, primary_key=True, index=True)
    customer_id = Column(Integer, index=True)
    user_id = Column(Integer, index=True)
    network_customer = Column(Boolean, index=True)
    network = Column(String, nullable=True, index=True)
    server_customer = Column(Boolean, index=True)
    server_addr = Column(String, nullable=True, index=True)
    server_pass = Column(String, nullable=True, index=True)
    mgmt_pass = Column(String, nullable=True, index=True)
    ip_list = Column(String, nullable=True, index=True)
    clock_customer = Column(Boolean, index=True)
    clock_addr = Column(String, nullable=True, index=True)
    clock_system_pass = Column(String, nullable=True, index=True)
    tech_team = Column(Boolean, index=True)
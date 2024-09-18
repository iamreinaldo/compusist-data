from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import Optional

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:1309@localhost:1313/compusist'
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

class Users(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    username = Column(String, index=True)
    password = Column(String, index=True)
    
class UserCreateIn(BaseModel):
    name: str
    username: str
    password: str

class NameOut(BaseModel):
    name: str

class UserUpdateIn(BaseModel):
    name: Optional[str] = None
    username: Optional[str] = None
    password: Optional[str] = None


class Customers(Base):
    __tablename__ = 'customers'
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    cnpj = Column(String, index=True)
    address = Column(String, index=True)
    contact = Column(String, index=True)

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


Base.metadata.create_all(bind=engine)

@app.post(
        '/users/',
        response_model=NameOut,
        summary="Cria usuário",
        description="Cria um novo usuário no banco",
        )
def criar_user(user_data: UserCreateIn, db: Session = Depends(get_db)):
    novo_user = Users(name=user_data.name, username=user_data.username, password=user_data.password)
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    return user_data

@app.get(
        '/users/', 
         summary="Lista todos os usuários",
         description="Lista todos os usuários já cadastrados no banco")
def listar_users(db: Session = Depends(get_db)):
    return db.query(Users).all()

@app.patch(
            '/users/{user_id}', 
            response_model=NameOut,
            summary="Edita usuário",
            description="Edita as informações de um usuário como nome, nome de usuário e senha.")
def update_user(user_id: int, user_data: UserUpdateIn, db: Session = Depends(get_db)):
    user = db.query(Users).filter(Users.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    if user_data.name is not None:
        user.name = user_data.name

    if user_data.username is not None:
        user.username = user_data.username

    if user_data.password is not None:
        user.password = user_data.password


    db.commit()
    db.refresh(user)

    return user


@app.post(
        '/customers/',
        response_model=NameOut,
        summary="Cadastra cliente",
        description="Cadastar um novo cliente")
def create_customer(customer_data: CustomerCreateIn, db: Session = Depends(get_db)):
    new_customer = Customers(
                            name=customer_data.name,
                            cnpj=customer_data.cnpj,
                            address=customer_data.address,
                            contact=customer_data.contact
                            )
    
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return customer_data

@app.get('/customers/')
def list_customer(db: Session = Depends(get_db)):
    return db.query(Customers).all()

@app.patch(
        '/customers/{customer_id}',
        response_model=NameOut,
        summary="Edita cliente",
        description="Edita nome, endereço, contato e cnpj do cliente")
def update_customer(customer_id: int, customer_data: CustomerUpdateIn, db: Session = Depends(get_db)):
    print(f"ID recebido: {customer_id}")
    customer = db.query(Customers).filter(Customers.id == customer_id).first()
    print(f"Resultado da consulta: {customer}")
    if customer is None:
        raise HTTPException(status_code=404, detail="Cliente não encontado")

    if customer_data.name is not None:
        customer.name = customer_data.name

    if customer_data.address is not None:
        customer.address = customer_data.address

    if customer_data.cnpj is not None:
        customer.cnpj = customer_data.cnpj

    if customer_data.contact is not None:
        customer.contact = customer_data.contact

    db.commit()
    db.refresh(customer)

    return customer


@app.get('/customers/{customers_id}')
def get_customer_by_id(customers_id: int, db: Session = Depends(get_db)):
    print(f'ID recebico: {customers_id}')
    customer = db.query(Customers).filter(Customers.id == customers_id).first()

    if customer is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    print(f"Resultado da consulta {customer}")

    return customer

@app.get('/customers/search/')
def search_customer(query: Optional[str] = None, db: Session = Depends(get_db)):
    if not query:
        raise HTTPException(status_code=400, detail="O termo de busca não foi fornecido")
    
    results = db.query(Customers).filter(
        (Customers.name.ilike(f'%{query}%')) |
        (Customers.cnpj.ilike(f'%{query}%'))
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail="Nenhum cliente encontrado")
    
    return results




for route in app.routes:
    print(route.path, route.methods)
from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional
from models import customers_bd
from schemas import customer_in
from views import views

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:1309@localhost:1313/compusist'
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)


@router.post(
        '/customers/',
        response_model=views.NameOut,
        summary="Cadastra cliente",
        description="Cadastar um novo cliente")
def create_customer(customer_data: customer_in.CustomerCreateIn, db: Session = Depends(get_db)):
    new_customer = customers_bd.Customers(
                            name=customer_data.name,
                            cnpj=customer_data.cnpj,
                            address=customer_data.address,
                            contact=customer_data.contact
                            )
    
    db.add(new_customer)
    db.commit()
    db.refresh(new_customer)
    return customer_data

@router.get('/customers/')
def list_customer(db: Session = Depends(get_db)):
    return db.query(customers_bd.Customers).all()

@router.patch(
        '/customers/{customer_id}',
        response_model=views.NameOut,
        summary="Edita cliente",
        description="Edita nome, endereço, contato e cnpj do cliente")
def update_customer(customer_id: int, customer_data: customer_in.CustomerUpdateIn, db: Session = Depends(get_db)):
    print(f"ID recebido: {customer_id}")
    customer = db.query(customers_bd.Customers).filter(customers_bd.Customers.id == customer_id).first()
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


@router.get('/customers/{customers_id}')
def get_customer_by_id(customers_id: int, db: Session = Depends(get_db)):
    print(f'ID recebico: {customers_id}')
    customer = db.query(customers_bd.Customers).filter(customers_bd.Customers.id == customers_id).first()

    if customer is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    print(f"Resultado da consulta {customer}")

    return customer

@router.get('/customers/search/')
def search_customer(query: Optional[str] = None, db: Session = Depends(get_db)):
    if not query:
        raise HTTPException(status_code=400, detail="O termo de busca não foi fornecido")
    
    results = db.query(customers_bd.Customers).filter(
        (customers_bd.Customers.name.ilike(f'%{query}%')) |
        (customers_bd.Customers.cnpj.ilike(f'%{query}%'))
    ).all()

    if not results:
        raise HTTPException(status_code=404, detail="Nenhum cliente encontrado")
    
    return results
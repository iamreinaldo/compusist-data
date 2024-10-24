from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from typing import Optional
from models import customers_bd
from schemas import customer_in
from views import views
from services import services

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:1309@localhost:45432/compusist'
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = customers_bd.Base

router = APIRouter(prefix='/customers')

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

Base.metadata.create_all(bind=engine)


@router.post(
        '/',
        response_model=views.NameOut,
        summary="Cadastra cliente",
        description="Cadastar um novo cliente")
def create_customer(customer_data: customer_in.CustomerCreateIn, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
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

@router.get('/')
def list_customer(db: Session = Depends(get_db)):
    return db.query(customers_bd.Customers).all()

@router.patch(
        '/{customer_id}',
        response_model=views.NameOut,
        summary="Edita cliente",
        description="Edita nome, endereço, contato e cnpj do cliente")
def update_customer(customer_id: int, customer_data: customer_in.CustomerUpdateIn, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    customer = db.query(customers_bd.Customers).filter(customers_bd.Customers.id == customer_id).first()
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


@router.get(
        '/{customers_id}',
        summary="Lê cliente por ID",
        description="Imprime cliente escolhido pelo ID cadastrado no banco de dados")
def get_customer_by_id(customers_id: int, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    customer = db.query(customers_bd.Customers).filter(customers_bd.Customers.id == customers_id).first()

    if customer is None:
        raise HTTPException(status_code=404, detail="Cliente não encontrado")
    return customer

@router.get(
        '/search/',
        summary="Busca de clientes",
        description="Busca cliente por CNPJ ou Nome")
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


@router.post(
        '/attributes',
        response_model=views.AttributeOut,
        summary="Adciona atributo",
        description="Adciona um novo atributo para um cliente, informando qual o cliente e qual o usuário que adcionou"
             )
def create_attribute(attribute_data: customer_in.CustomerAttributesIn, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    try:
        new_attribute = customers_bd.CustomerAttributes(
                                    customer_id = attribute_data.customer_id,
                                    user_id = attribute_data.user_id,
                                    network_customer = attribute_data.network_customer,
                                    network = attribute_data.network,
                                    server_customer = attribute_data.server_customer,
                                    server_addr = attribute_data.server_addr,
                                    server_pass = attribute_data.server_pass,
                                    mgmt_pass = attribute_data.mgmt_pass,
                                    ip_list = attribute_data.ip_list,
                                    clock_customer = attribute_data.clock_customer,
                                    clock_addr = attribute_data.clock_addr,
                                    clock_system_pass = attribute_data.clock_system_pass,
                                    tech_team = attribute_data.tech_team
                                    )
        
        db.add(new_attribute)
        db.commit()
        db.refresh(new_attribute)
        return new_attribute
    except Exception as e:
        print(f"Erro: {str(e)}")
        raise HTTPException(status_code=422, detail=str(e))

@router.get('/attributes/{customer_id}')
def get_attribute_by_customer(customer_id:int, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    attributes = db.query(customers_bd.CustomerAttributes).filter(customers_bd.CustomerAttributes.customer_id == customer_id).first()

    if attributes is None:
        raise HTTPException(status_code=404, detail="Cliente sem atributo cadastrado")
    
    return attributes

@router.patch(
        '/attributes/{customer_id}',
        response_model=views.AttributeOut)
def update_attribute(customer_id: int, attribute_data: customer_in.CustomerUpdateIn, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    print(attribute_data)
    # Use customer_id instead of id for filtering
    attributes = db.query(customers_bd.CustomerAttributes).filter(customers_bd.CustomerAttributes.customer_id == customer_id).first()
    
    if attributes is None:
        raise HTTPException(status_code=404, detail="Cliente sem atributo cadastrado") 
    
    columns = ['user_id', 'network_customer', 'network', 'server_customer', 'server_addr', 'server_pass', 
               'mgmt_pass', 'ip_list', 'clock_customer', 'clock_addr', 'clock_system_pass', 'tech_team']
    
    for column in columns:
        value = getattr(attribute_data, column)
        if value not in [None, ""]:
            setattr(attributes, column, value)

    db.commit()
    print("Commit executado com sucesso")
    db.refresh(attributes)
    
    return attributes


@router.delete('/attributes/{customer_id}')
def delete_attribute(customer_id: int, db: Session = Depends(get_db), current_user: dict = Depends(services.get_current_user)):
    attributes = db.query(customers_bd.CustomerAttributes).filter(customers_bd.CustomerAttributes.customer_id == customer_id).first()
    db.delete(attributes)
    db.commit()
    return "Deletado com sucesso"
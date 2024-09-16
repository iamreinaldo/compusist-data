from fastapi import FastAPI, Depends
from sqlalchemy import create_engine, Column, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session

SQLALCHEMY_DATABASE_URL = 'postgresql://psql:1309@localhost:1313/compusist'
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
    nome = Column(String, index=True)
    user = Column(String, index=True)
    password = Column(String, index=True)

Base.metadata.create_all(bind=engine)

@app.post('/users/')
def criar_user(nome: str, user: str, password: str, db: Session = Depends(get_db)):
    novo_user = User(nome=nome, user=user, password=password)
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    return novo_user

@app.get('/users/')
def listar_users(db: Session = Depends(get_db)):
    return db.query(Users).all()
from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from models import users_db
from schemas import users_in
from views import views


SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:1309@localhost:1313/compusist'
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = users_db.Base

router = APIRouter(prefix='/users')

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
        summary="Cria usuário",
        description="Cria um novo usuário no banco",
        )
def criar_user(user_data: users_in.UserCreateIn, db: Session = Depends(get_db)):
    novo_user = users_db.Users(name=user_data.name, username=user_data.username, password=user_data.password)
    db.add(novo_user)
    db.commit()
    db.refresh(novo_user)
    return user_data

@router.get(
        '/', 
         summary="Lista todos os usuários",
         description="Lista todos os usuários já cadastrados no banco")
def listar_users(db: Session = Depends(get_db)):
    return db.query(users_db.Users).all()

@router.patch(
            '/{user_id}', 
            response_model=views.NameOut,
            summary="Edita usuário",
            description="Edita as informações de um usuário como nome, nome de usuário e senha.")
def update_user(user_id: int, user_data: users_in.UserUpdateIn, db: Session = Depends(get_db)):
    user = db.query(users_db.Users).filter(users_db.Users.id == user_id).first()
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


@router.post(
        '/login/')
async def login(user_data: users_in.UserLogin, db: Session = Depends(get_db)):
    user = db.query(users_db.Users).filter(users_db.Users.username == user_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    if user.password != user_data.password:
        raise HTTPException(status_code=400, detail="Usuário ou senha incorreta")
    
    return {"message":"Login bem sucedido", "user":user.name}

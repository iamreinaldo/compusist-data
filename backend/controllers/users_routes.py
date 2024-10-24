from fastapi import Depends, HTTPException, APIRouter
from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from models import users_db
from schemas import users_in
from views import views
from services import services


SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:1309@localhost:45432/compusist'
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
    if ' ' in user_data.username:
        raise HTTPException(status_code=400, detail="Username não pode conter espaços")
    existing_user = db.query(users_db.Users).filter(users_db.Users.username == user_data.username).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="Username já está em uso")
    hashed_password = services.get_password_hash(user_data.password)
    novo_user = users_db.Users(name=user_data.name, username=user_data.username, password=hashed_password)
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
    if ' ' in user_data.username:
        raise HTTPException(status_code=400, detail="Username não pode conter espaços")
    
    user = db.query(users_db.Users).filter(users_db.Users.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="Usuário não encontrado")
    
    
    if user_data.name is not None:
        user.name = user_data.name

    if user_data.username is not None:
        existing_user = db.query(users_db.Users).filter(users_db.Users.username == user_data.username).first()
        if existing_user and existing_user.id != user_id:
            raise HTTPException(status_code=400, detail="Username já está em uso")
        user.username = user_data.username

    if user_data.password is not None:
        hashed_password = services.get_password_hash(user_data.password)
        user.password = hashed_password


    db.commit()
    db.refresh(user)

    return user


@router.post(
        '/login/')
async def login(user_data: users_in.UserLogin, db: Session = Depends(get_db)):
    user = db.query(users_db.Users).filter(users_db.Users.username == user_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuário não existe")
    
    if not services.verify_password(user_data.password, user.password):
        raise HTTPException(status_code=400, detail="Usuário ou senha incorreta")

    
    access_token = services.create_acess_token(data={'sub': user.username})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": user.name,
        "id": user.id,
        "expires_in": services.ACCESS_TOKEN_EXPIRE_MINUTES*60
        }

from fastapi.middleware.cors import CORSMiddleware

def add_cors_middleware(app):
    # Adicionar o middleware CORS à aplicação FastAPI
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # Permitir todas as origens. Modifique isso conforme necessário.
        allow_credentials=True,
        allow_methods=["*"],  # Permitir todos os métodos (GET, POST, etc.)
        allow_headers=["*"],  # Permitir todos os headers
    )
from fastapi import FastAPI
from controllers import users_routes, customers_routes
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['http://localhost:3000'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*'],
)

app.include_router(users_routes.router)
app.include_router(customers_routes.router)


for route in app.routes:
    print(route.path, route.methods)
from fastapi import FastAPI
from controllers import users_routes, customers_routes


app = FastAPI()
app.include_router(users_routes.router)
app.include_router(customers_routes.router)
for route in app.routes:
    print(route.path, route.methods)
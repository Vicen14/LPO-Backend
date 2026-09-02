from fastapi import FastAPI

app = FastAPI(
    title="Le Petit Olivier Backend API",
    description="API for the catalog of Le Petit Olivier",
    version="1.0.0",
)

@app.get("/")
def read_root():
    return {"message": "Welcome to Le Petit Olivier API"}

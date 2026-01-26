from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings

from fastapi.staticfiles import StaticFiles
import os

app = FastAPI(
    title="DentSupply API",
    description="Backend API for DentSupply Quick Commerce PWA",
    version="0.1.0"
)

# Set up CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount static files
# Ensure the directory exists relative to where uvicorn is run (backend/)
images_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "..", "data", "images")
if os.path.isdir(images_dir):
    app.mount("/images", StaticFiles(directory=images_dir), name="images")
else:
    print(f"WARNING: Image directory not found at {images_dir}")

@app.get("/")
async def root():
    return {"message": "Welcome to DentSupply API", "status": "online"}

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/health")
async def health_check():
    return {"status": "healthy", "version": "0.1.0"}

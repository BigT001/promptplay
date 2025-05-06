from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import ai, scenes
from app.db import create_tables

app = FastAPI(title="PromptPlay API", version="1.0.0")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://172.20.10.7:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routers
app.include_router(ai.router)
app.include_router(scenes.router)

@app.on_event("startup")
async def startup():
    await create_tables()

@app.get("/health")
async def health_check():
    return {"status": "healthy"}
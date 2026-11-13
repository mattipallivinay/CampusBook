
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.ai import router as ai_router
from app.rag.state import load_saved_indexes


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Loading saved CampusBook FAISS indexes...")

    load_saved_indexes()

    print("CampusBook AI startup completed!")

    yield


app = FastAPI(
    title="CampusBook AI Service",
    description="AI-powered academic assistant for CampusBook",
    version="1.0.0",
    lifespan=lifespan
)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ai_router)


@app.get("/")
async def home():
    return {
        "success": True,
        "message": "CampusBook AI Service is running!"
    }


@app.get("/health")
async def health_check():
    return {
        "success": True,
        "status": "healthy",
        "service": "CampusBook AI"
    }

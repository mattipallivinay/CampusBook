from fastapi import FastAPI
from datetime import datetime, timezone

app = FastAPI(
    title="CampusBook AI Service",
    description="AI-powered academic learning assistant",
    version="1.0.0"
)

@app.get("/")
def home():
    return {
        "success": True,
        "message": "CampusBook AI Service is running!"
    }

@app.get("/api/health")
def health_check():
    return {
        "success": True,
        "service": "CampusBook AI",
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }
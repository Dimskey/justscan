from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn


from app.api import recon, project, ai_replicate, notes
from app.core.config import settings

app = FastAPI(
    title="JustSploit API",
    description="Penetration Testing and Security Assessment Platform",
    version="1.0.0"
)

@app.on_event("startup")
async def startup_event():
    try:
        # Import all models to ensure they're registered with SQLAlchemy
        import app.models  # This imports all models via __init__.py
        from app.db.session import engine
        from app.models.base import Base
        
        # Create all tables at once to ensure foreign keys are resolved
        Base.metadata.create_all(bind=engine)
        print("Database tables created successfully")
    except Exception as e:
        print(f"Warning: Database initialization failed: {e}")
        print("Application will continue without database...")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routes
app.include_router(recon.router, prefix="/api/recon", tags=["Reconnaissance"])
app.include_router(project.router, prefix="/api/project", tags=["Project Management"])
app.include_router(ai_replicate.router, prefix="/api/ai", tags=["AI Replicate"])
app.include_router(notes.router, prefix="/api/notes", tags=["Notes"])

@app.get("/")
async def root():
    return {"message": "JustSploit API is running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    ) 
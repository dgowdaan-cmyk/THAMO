import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.endpoints import router as api_router
from app.models.database import init_db
from app.core.logging_redactor import logger

# Initialize SQLite tables
init_db()

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Multilingual AI-Powered Investor Safety and Incident-Response Assistant for Indian Retail Investors.",
    version=settings.VERSION,
    docs_url="/docs",
    redoc_url="/redoc"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API Router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def startup_event():
    logger.info(f"THAMO Backend Service v{settings.VERSION} initialized successfully.")

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

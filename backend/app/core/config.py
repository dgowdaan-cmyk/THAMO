import os
from pathlib import Path
from pydantic_settings import BaseSettings

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    PROJECT_NAME: str = "THAMO"
    PROJECT_TAGLINE: str = "Pause. Understand. Protect your next step."
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api"
    
    # CORS
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:4173",
        "http://localhost:3000",
        "*"
    ]
    
    # File upload limits
    MAX_UPLOAD_SIZE_BYTES: int = 5 * 1024 * 1024  # 5 MB
    ALLOWED_IMAGE_TYPES: list[str] = ["image/png", "image/jpeg", "image/jpg", "image/webp"]
    
    # Database (explicit local persistence)
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{BASE_DIR}/thamo_incidents.db")
    
    # Languages supported
    SUPPORTED_LANGUAGES: list[str] = ["en", "hi", "kn"]
    
    # Tesseract path search order on Windows
    TESSERACT_CANDIDATE_PATHS: list[str] = [
        "tesseract",
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expanduser(r"~\AppData\Local\Tesseract-OCR\tesseract.exe")
    ]
    
    # Data paths
    DATA_DIR: Path = BASE_DIR / "data"
    RESOURCES_PATH: Path = BASE_DIR / "app" / "resources" / "official_resources.json"
    EVALUATION_DATASET_PATH: Path = BASE_DIR / "data" / "evaluation_dataset.json"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings()

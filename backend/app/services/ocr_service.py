import io
import os
import shutil
from typing import Tuple
from PIL import Image, ImageOps, ImageFilter
from app.core.config import settings

def find_tesseract_binary() -> str | None:
    """Locates tesseract executable on system if available."""
    # Check PATH first
    which_cmd = shutil.which("tesseract")
    if which_cmd:
        return which_cmd

    # Check candidate paths on Windows
    for candidate in settings.TESSERACT_CANDIDATE_PATHS:
        if os.path.isfile(candidate) and os.access(candidate, os.X_OK):
            return candidate

    return None

def preprocess_image(image: Image.Image) -> Image.Image:
    """
    Applies gentle grayscale, autocontrast, and thresholding for cleaner character edges.
    """
    # Convert to grayscale
    gray = image.convert("L")
    # Enhance contrast
    contrasted = ImageOps.autocontrast(gray)
    # Slight sharpen filter
    sharpened = contrasted.filter(ImageFilter.SHARPEN)
    return sharpened

def extract_text_from_image_bytes(image_bytes: bytes) -> Tuple[str, str, str, str]:
    """
    Extracts text from image bytes using OCR.
    Returns: (extracted_text, engine_used, confidence_level, quality_notes)
    """
    try:
        image = Image.open(io.BytesIO(image_bytes))
    except Exception as e:
        return "", "none", "unavailable", f"Invalid image format: {str(e)}"

    width, height = image.size
    if width < 50 or height < 50:
        return "", "none", "low", "Image dimensions are too small for reliable character recognition."

    processed = preprocess_image(image)

    tesseract_path = find_tesseract_binary()
    if not tesseract_path:
        return (
            "",
            "tesseract_unavailable",
            "unavailable",
            "Tesseract OCR binary is not detected in your system PATH. Please review or manually enter the suspicious message text."
        )

    try:
        import pytesseract
        pytesseract.pytesseract.tesseract_cmd = tesseract_path
        
        # Extract text using multi-lingual or standard eng
        text = pytesseract.image_to_string(processed, lang="eng")
        cleaned_text = text.strip()

        if len(cleaned_text) < 10:
            return cleaned_text, "tesseract_local", "low", "Low extraction density: characters could not be discerned clearly."
        elif len(cleaned_text) < 30:
            return cleaned_text, "tesseract_local", "fair", "Moderate extraction: some characters or words may be truncated."
        else:
            return cleaned_text, "tesseract_local", "good", "Text successfully extracted from screenshot."

    except Exception as e:
        return (
            "",
            "tesseract_error",
            "low",
            f"OCR extraction encountered a runtime exception: {str(e)}"
        )

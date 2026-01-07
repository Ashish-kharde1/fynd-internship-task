import os
from google import genai
from dotenv import load_dotenv
import logging

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# Initialize the new Client
if GEMINI_API_KEY:
    client = genai.Client(api_key=GEMINI_API_KEY)
    # Using the latest 2.0-flash model for speed and efficiency in 2026
    MODEL_NAME = 'gemini-2.5-flash' 
else:
    client = None
    logger.warning("GEMINI_API_KEY not set. AI features will return mock responses.")

def generate_ai_content(prompt: str) -> str:
    if not client:
        return "AI service unavailable (Key missing)."
    try:
        # New SDK syntax: client.models.generate_content
        response = client.models.generate_content(
            model=MODEL_NAME,
            contents=prompt
        )
        return response.text.strip()
    except Exception as e:
        logger.error(f"Gemini API Error: {e}")
        return "AI service currently unavailable."

def generate_user_response(review_text: str, rating: int) -> str:
    """
    Prompt A: User-facing response (empathetic, polite, short)
    """
    prompt = (
        f"A customer left a review with rating {rating}/5 and text: '{review_text}'. "
        "Write a short, polite, and empathetic response to this customer. "
        "Do not include any internal notes or headers."
    )
    return generate_ai_content(prompt)

def generate_admin_summary(review_text: str) -> str:
    """
    Prompt B: Admin summary (1–2 concise sentences)
    """
    prompt = (
        f"Summarize the following customer review in 1-2 concise sentences for an admin dashboard: '{review_text}'. "
    )
    return generate_ai_content(prompt)

def generate_recommended_actions(review_text: str, rating: int) -> str:
    """
    Prompt C: Admin recommended actions (2–3 bullet points)
    """
    prompt = (
        f"Based on the review: '{review_text}' (Rating: {rating}/5), "
        "suggest 2-3 concrete recommended actions for the business. "
        "Format as bullet points."
    )
    return generate_ai_content(prompt)
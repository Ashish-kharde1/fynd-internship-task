from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class ReviewSubmit(BaseModel):
    rating: int = Field(..., ge=1, le=5, description="Rating must be between 1 and 5")
    review: str = Field(..., min_length=1, max_length=1000, description="Review text cannot be empty or too long")

class ReviewResponse(BaseModel):
    status: str
    ai_response: str

class ReviewRead(BaseModel):
    id: int
    rating: int
    review: str
    ai_user_response: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_recommended_action: Optional[str] = None
    created_at: datetime

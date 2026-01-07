from typing import Optional
from sqlmodel import Field, SQLModel
from datetime import datetime

class Review(SQLModel, table=True):
    id: Optional[int] = Field(default=None, primary_key=True)
    rating: int = Field(ge=1, le=5)
    review: str
    ai_user_response: Optional[str] = None
    ai_summary: Optional[str] = None
    ai_recommended_action: Optional[str] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)

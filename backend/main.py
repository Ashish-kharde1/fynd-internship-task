from fastapi import FastAPI, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from database import create_db_and_tables, get_session
from models import Review
from schemas import ReviewSubmit, ReviewResponse, ReviewRead
from services import generate_user_response, generate_admin_summary, generate_recommended_actions

@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield

app = FastAPI(lifespan=lifespan)

# CORS Configuration
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "https://fynd-user-dashboard-kappa.vercel.app",
    "https://fynd-admin-dashboard-five.vercel.app",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/submit-review", response_model=ReviewResponse)
def submit_review(review_data: ReviewSubmit, session: Session = Depends(get_session)):
    # 1. Generate AI Content (Server-side)
    ai_user_resp = generate_user_response(review_data.review, review_data.rating)
    ai_summary = generate_admin_summary(review_data.review)
    ai_rec_actions = generate_recommended_actions(review_data.review, review_data.rating)

    # 2. Store in DB
    new_review = Review(
        rating=review_data.rating,
        review=review_data.review,
        ai_user_response=ai_user_resp,
        ai_summary=ai_summary,
        ai_recommended_action=ai_rec_actions
    )
    session.add(new_review)
    session.commit()
    session.refresh(new_review)

    return ReviewResponse(
        status="success",
        ai_response=ai_user_resp
    )

@app.get("/admin/reviews", response_model=List[ReviewRead])
def get_admin_reviews(session: Session = Depends(get_session)):
    statement = select(Review).order_by(Review.created_at.desc())
    reviews = session.exec(statement).all()
    return reviews

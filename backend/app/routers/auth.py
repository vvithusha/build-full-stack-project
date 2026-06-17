import random
import string

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User, UserRole
from app.models.student import Student
from app.schemas.auth import StudentRegisterRequest, LoginRequest, TokenResponse, MessageResponse
from app.services.security import (
    hash_password, verify_password, create_access_token,
    get_current_user
)
from app.config import settings

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


def _generate_roll_number(db: Session) -> str:
    """Auto-generate a unique roll number like TC-2024-0001."""
    from datetime import datetime
    year = datetime.utcnow().year
    count = db.query(Student).count() + 1
    return f"TC-{year}-{count:04d}"


# ─── Student Registration ─────────────────────────────────────

@router.post("/register", response_model=MessageResponse, status_code=status.HTTP_201_CREATED)
def register_student(payload: StudentRegisterRequest, db: Session = Depends(get_db)):
    """Student self-registration endpoint."""

    # Check duplicate email
    if db.query(User).filter(User.email == payload.email).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered")

    # Check duplicate username
    if db.query(User).filter(User.username == payload.username).first():
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Username already taken")

    # Create user
    user = User(
        email=payload.email,
        username=payload.username,
        password_hash=hash_password(payload.password),
        role=UserRole.student,
        is_active=True,
    )
    db.add(user)
    db.flush()  # get user.id without committing

    # Create student profile
    student = Student(
        user_id=user.id,
        full_name=payload.full_name,
        phone=payload.phone,
        roll_number=_generate_roll_number(db),
        parent_name=payload.parent_name,
        parent_phone=payload.parent_phone,
    )
    db.add(student)
    db.commit()

    return MessageResponse(message="Registration successful! You can now log in.", success=True)


# ─── Unified Login ────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    """Unified login for students, teachers, and admin."""

    # Try to find user by username or email
    user = (
        db.query(User)
        .filter(
            (User.username == payload.username) | (User.email == payload.username)
        )
        .first()
    )

    # Admin check: compare against env credentials if role is admin
    # (Admin user is seeded on startup — see main.py)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is deactivated")

    token_data = {"sub": str(user.id), "role": user.role.value, "username": user.username}
    access_token = create_access_token(data=token_data)

    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        role=user.role.value,
        user_id=str(user.id),
        username=user.username,
    )


# ─── Get Current User ─────────────────────────────────────────

@router.get("/me", response_model=dict)
def get_me(current_user: User = Depends(get_current_user)):
    """Returns the currently authenticated user's info."""
    return {
        "id": str(current_user.id),
        "email": current_user.email,
        "username": current_user.username,
        "role": current_user.role.value,
        "is_active": current_user.is_active,
    }

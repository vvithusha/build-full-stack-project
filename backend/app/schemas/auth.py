import re
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, EmailStr, field_validator, model_validator


# ──────────────────────────────────────────────
# Auth Schemas
# ──────────────────────────────────────────────

class StudentRegisterRequest(BaseModel):
    full_name: str
    email: EmailStr
    username: str
    password: str
    phone: Optional[str] = None
    parent_name: Optional[str] = None
    parent_phone: Optional[str] = None

    @field_validator("full_name")
    @classmethod
    def name_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 2 or len(v) > 150:
            raise ValueError("Full name must be between 2 and 150 characters")
        if not re.match(r"^[A-Za-z\s\-']+$", v):
            raise ValueError("Full name can only contain letters, spaces, hyphens and apostrophes")
        return v

    @field_validator("username")
    @classmethod
    def username_must_be_valid(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 3 or len(v) > 50:
            raise ValueError("Username must be between 3 and 50 characters")
        if not re.match(r"^[A-Za-z0-9_]+$", v):
            raise ValueError("Username can only contain letters, numbers, and underscores")
        return v

    @field_validator("password")
    @classmethod
    def password_must_be_strong(cls, v: str) -> str:
        if len(v) < 8:
            raise ValueError("Password must be at least 8 characters")
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v

    @field_validator("phone", "parent_phone", mode="before")
    @classmethod
    def phone_must_be_valid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if v and not re.match(r"^\+?[\d\s\-]{7,20}$", v):
            raise ValueError("Invalid phone number format")
        return v


class LoginRequest(BaseModel):
    username: str   # can be username OR email
    password: str

    @field_validator("username")
    @classmethod
    def sanitize_username(cls, v: str) -> str:
        return v.strip()[:255]

    @field_validator("password")
    @classmethod
    def sanitize_password(cls, v: str) -> str:
        if len(v) > 128:
            raise ValueError("Password too long")
        return v


# ──────────────────────────────────────────────
# Response Schemas
# ──────────────────────────────────────────────

class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    username: str


class UserResponse(BaseModel):
    id: UUID
    email: str
    username: str
    role: str
    is_active: bool

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str
    success: bool = True

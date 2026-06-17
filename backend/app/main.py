from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from sqlalchemy.exc import IntegrityError

from app.config import settings
from app.database import engine, SessionLocal
from app.models.user import User, UserRole
from app.models.student import Student
from app.models.teacher import Teacher, TeacherSubject
from app.models.class_subject import Class, Subject
from app.models.marks import Mark
from app.models.fees import Fee
from app.models.homework import Homework, HomeworkSubmission
from app.models.alert import Alert
from app.services.security import hash_password
from app.routers import auth

# ─── Rate Limiter ─────────────────────────────────────────────
limiter = Limiter(key_func=get_remote_address)

# ─── App Init ─────────────────────────────────────────────────
app = FastAPI(
    title=settings.app_name,
    description="Tuition Center Management System API",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    openapi_url="/api/openapi.json",
)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

# ─── CORS Middleware ──────────────────────────────────────────
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        settings.frontend_url,
        "http://localhost:5173",
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["*"],
)


# ─── Global Exception Handlers ────────────────────────────────
@app.exception_handler(IntegrityError)
async def integrity_error_handler(request: Request, exc: IntegrityError):
    return JSONResponse(
        status_code=400,
        content={"detail": "A record with this information already exists."},
    )


@app.exception_handler(Exception)
async def generic_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred."},
    )


# ─── DB Startup: Create Tables & Seed Admin ───────────────────
def create_tables():
    """Create all tables if they don't exist."""
    from app.database import Base
    Base.metadata.create_all(bind=engine)


def seed_admin():
    """Seed the admin user from .env on first run."""
    db = SessionLocal()
    try:
        existing = db.query(User).filter(User.role == UserRole.admin).first()
        if not existing:
            admin_user = User(
                email=settings.admin_email,
                username=settings.admin_username,
                password_hash=hash_password(settings.admin_password),
                role=UserRole.admin,
                is_active=True,
            )
            db.add(admin_user)
            db.commit()
            print(f"✅ Admin user seeded: {settings.admin_username}")
        else:
            print(f"ℹ️  Admin already exists: {existing.username}")
    except Exception as e:
        db.rollback()
        print(f"⚠️  Admin seed error: {e}")
    finally:
        db.close()


def seed_classes():
    """Seed Grade 6–11 classes if not present."""
    db = SessionLocal()
    try:
        for grade in range(6, 12):
            name = f"Grade {grade}"
            exists = db.query(Class).filter(Class.name == name).first()
            if not exists:
                db.add(Class(name=name, grade_level=grade))
        db.commit()
        print("✅ Classes Grade 6–11 seeded")
    except Exception as e:
        db.rollback()
        print(f"⚠️  Class seed error: {e}")
    finally:
        db.close()


@app.on_event("startup")
async def startup_event():
    print("🚀 Starting Tuition Center API...")
    create_tables()
    seed_admin()
    seed_classes()
    print("✅ Startup complete")


# ─── Include Routers ──────────────────────────────────────────
app.include_router(auth.router)


# ─── Health Check ─────────────────────────────────────────────
@app.get("/api/health", tags=["Health"])
def health_check():
    return {"status": "ok", "service": settings.app_name, "version": "1.0.0"}


@app.get("/", tags=["Root"])
def root():
    return {"message": f"Welcome to {settings.app_name} API. Visit /api/docs for documentation."}

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from app.config import settings

# Use connection pooling compatible with Supabase (transaction mode pooler)
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=5,
    max_overflow=10,
    echo=False,  # Set True for SQL query logging during debug
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    """Dependency: yields a DB session and ensures it closes after request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

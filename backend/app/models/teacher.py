import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Teacher(Base):
    __tablename__ = "teachers"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    qualification = Column(String(200), nullable=True)
    experience_years = Column(Integer, default=0)
    bio = Column(Text, nullable=True)
    rating = Column(Float, default=0.0)
    profile_image_url = Column(String(500), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="teacher_profile")
    teacher_subjects = relationship("TeacherSubject", back_populates="teacher", cascade="all, delete-orphan")
    homework = relationship("Homework", back_populates="teacher", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Teacher {self.full_name}>"


class TeacherSubject(Base):
    """Many-to-many join: a teacher can teach multiple subjects."""
    __tablename__ = "teacher_subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    assigned_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    teacher = relationship("Teacher", back_populates="teacher_subjects")
    subject = relationship("Subject", back_populates="teacher_subjects")

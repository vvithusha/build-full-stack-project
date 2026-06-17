import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Date
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Class(Base):
    __tablename__ = "classes"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(50), unique=True, nullable=False)   # e.g. "Grade 6"
    grade_level = Column(Integer, nullable=False)             # 6, 7, 8, 9, 10, 11
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    subjects = relationship("Subject", back_populates="class_ref", cascade="all, delete-orphan")
    students = relationship("Student", back_populates="class_ref")

    def __repr__(self):
        return f"<Class {self.name}>"


class Subject(Base):
    __tablename__ = "subjects"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    name = Column(String(100), nullable=False)       # e.g. "Mathematics"
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    class_ref = relationship("Class", back_populates="subjects")
    marks = relationship("Mark", back_populates="subject", cascade="all, delete-orphan")
    homework = relationship("Homework", back_populates="subject", cascade="all, delete-orphan")
    teacher_subjects = relationship("TeacherSubject", back_populates="subject", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Subject {self.name}>"

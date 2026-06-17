import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Boolean, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class HomeworkStatus(str, enum.Enum):
    pending = "pending"
    submitted = "submitted"
    graded = "graded"


class Homework(Base):
    __tablename__ = "homework"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    teacher_id = Column(UUID(as_uuid=True), ForeignKey("teachers.id", ondelete="CASCADE"), nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    due_date = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    teacher = relationship("Teacher", back_populates="homework")
    subject = relationship("Subject", back_populates="homework")
    submissions = relationship("HomeworkSubmission", back_populates="homework", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Homework '{self.title}'>"


class HomeworkSubmission(Base):
    __tablename__ = "homework_submissions"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    homework_id = Column(UUID(as_uuid=True), ForeignKey("homework.id", ondelete="CASCADE"), nullable=False)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    status = Column(SAEnum(HomeworkStatus), default=HomeworkStatus.pending)
    submission_notes = Column(Text, nullable=True)
    submitted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    homework = relationship("Homework", back_populates="submissions")
    student = relationship("Student", back_populates="homework_submissions")

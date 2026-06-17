import uuid
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    full_name = Column(String(150), nullable=False)
    phone = Column(String(20), nullable=True)
    roll_number = Column(String(20), unique=True, nullable=False)
    class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="SET NULL"), nullable=True)
    parent_name = Column(String(150), nullable=True)
    parent_phone = Column(String(20), nullable=True)
    address = Column(Text, nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    user = relationship("User", back_populates="student_profile")
    class_ref = relationship("Class", back_populates="students")
    marks = relationship("Mark", back_populates="student", cascade="all, delete-orphan")
    fees = relationship("Fee", back_populates="student", cascade="all, delete-orphan")
    homework_submissions = relationship("HomeworkSubmission", back_populates="student", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Student {self.full_name} roll={self.roll_number}>"

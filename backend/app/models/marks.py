import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, Enum as SAEnum, Float
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class ExamType(str, enum.Enum):
    monthly_test = "monthly_test"
    mid_term = "mid_term"
    final = "final"
    assignment = "assignment"


class Mark(Base):
    __tablename__ = "marks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    subject_id = Column(UUID(as_uuid=True), ForeignKey("subjects.id", ondelete="CASCADE"), nullable=False)
    exam_type = Column(SAEnum(ExamType), nullable=False)
    score = Column(Float, nullable=False)
    max_score = Column(Float, nullable=False, default=100.0)
    remarks = Column(Text, nullable=True)
    entered_by = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="marks")
    subject = relationship("Subject", back_populates="marks")

    @property
    def percentage(self):
        if self.max_score and self.max_score > 0:
            return round((self.score / self.max_score) * 100, 2)
        return 0.0

    def __repr__(self):
        return f"<Mark student={self.student_id} subject={self.subject_id} score={self.score}/{self.max_score}>"

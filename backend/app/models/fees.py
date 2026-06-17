import uuid
import enum
from datetime import datetime

from sqlalchemy import Column, String, Integer, ForeignKey, DateTime, Text, Numeric, Enum as SAEnum
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class FeeStatus(str, enum.Enum):
    paid = "paid"
    pending = "pending"
    overdue = "overdue"


class Fee(Base):
    __tablename__ = "fees"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    student_id = Column(UUID(as_uuid=True), ForeignKey("students.id", ondelete="CASCADE"), nullable=False)
    month = Column(Integer, nullable=False)          # 1-12
    year = Column(Integer, nullable=False)           # e.g. 2024
    amount = Column(Numeric(10, 2), nullable=False)
    status = Column(SAEnum(FeeStatus), nullable=False, default=FeeStatus.pending)
    paid_at = Column(DateTime, nullable=True)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    student = relationship("Student", back_populates="fees")

    def __repr__(self):
        return f"<Fee student={self.student_id} {self.month}/{self.year} {self.status}>"

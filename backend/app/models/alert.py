import uuid
from datetime import datetime

from sqlalchemy import Column, String, ForeignKey, DateTime, Text, Boolean
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.database import Base


class Alert(Base):
    __tablename__ = "alerts"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4, index=True)
    admin_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="SET NULL"), nullable=True)
    # target_class_id = NULL means broadcast to ALL students
    target_class_id = Column(UUID(as_uuid=True), ForeignKey("classes.id", ondelete="SET NULL"), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    is_active = Column(Boolean, default=True, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=True)

    def __repr__(self):
        return f"<Alert '{self.title}' active={self.is_active}>"

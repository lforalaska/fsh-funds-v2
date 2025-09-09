"""Communication model for tracking donor interactions."""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, Relationship
from models.base import BaseModel


class Communication(BaseModel, table=True):
    """Communication/Interaction database model."""
    __tablename__ = "communications"
    
    # Donor Relationship
    donor_id: int = Field(foreign_key="donors.id", index=True)
    donor: "Donor" = Relationship(back_populates="communications")
    
    # Communication Details
    communication_type: str = Field(index=True)  # email, phone, meeting, letter, event
    direction: str = Field(default="outgoing")  # outgoing, incoming
    subject: Optional[str] = Field(default=None)
    content: Optional[str] = Field(default=None)
    
    # Contact Information
    contact_person: Optional[str] = Field(default=None)  # Staff member who made contact
    contact_date: datetime = Field(default_factory=datetime.utcnow, index=True)
    
    # Campaign/Event Association
    campaign_id: Optional[int] = Field(default=None)
    event_id: Optional[int] = Field(default=None)
    
    # Email Specific Fields
    email_opened: Optional[bool] = Field(default=None)
    email_clicked: Optional[bool] = Field(default=None)
    email_bounced: Optional[bool] = Field(default=None)
    
    # Follow-up Information
    follow_up_required: bool = Field(default=False)
    follow_up_date: Optional[datetime] = Field(default=None)
    follow_up_completed: bool = Field(default=False)
    
    # Status and Priority
    priority: str = Field(default="normal")  # low, normal, high, urgent
    status: str = Field(default="completed")  # completed, pending, cancelled
    
    # Notes
    notes: Optional[str] = Field(default=None)
    
    def __repr__(self) -> str:
        return f"<Communication(id={self.id}, donor_id={self.donor_id}, type={self.communication_type}, date={self.contact_date})>"
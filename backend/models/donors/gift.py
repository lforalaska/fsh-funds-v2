"""Gift model for tracking donations."""
from datetime import datetime
from typing import Optional
from sqlmodel import Field, Relationship
from models.base import BaseModel


class Gift(BaseModel, table=True):
    """Gift/Donation database model."""
    __tablename__ = "gifts"
    
    # Donor Relationship
    donor_id: int = Field(foreign_key="donors.id", index=True)
    donor: "Donor" = Relationship(back_populates="gifts")
    
    # Gift Information
    amount: float = Field(index=True)
    gift_date: datetime = Field(index=True)
    gift_type: str = Field(default="cash")  # cash, check, credit_card, stock, inkind
    payment_method: Optional[str] = Field(default=None)  # visa, mastercard, check, etc.
    
    # Campaign and Designation
    campaign_id: Optional[int] = Field(default=None)  # Link to campaign if exists
    designation: Optional[str] = Field(default="general")  # general, specific program
    fund_name: Optional[str] = Field(default=None)
    
    # Transaction Details
    transaction_id: Optional[str] = Field(default=None)  # External transaction reference
    check_number: Optional[str] = Field(default=None)
    receipt_number: Optional[str] = Field(default=None)
    
    # Gift Processing
    acknowledged: bool = Field(default=False)
    acknowledged_date: Optional[datetime] = Field(default=None)
    acknowledged_by: Optional[str] = Field(default=None)
    
    # Gift Status
    gift_status: str = Field(default="completed")  # completed, pending, cancelled, refunded
    is_anonymous: bool = Field(default=False)
    is_tribute: bool = Field(default=False)
    tribute_info: Optional[str] = Field(default=None)  # JSON string
    
    # Tax Information
    tax_deductible_amount: Optional[float] = Field(default=None)
    receipt_sent: bool = Field(default=False)
    receipt_sent_date: Optional[datetime] = Field(default=None)
    
    # Notes
    notes: Optional[str] = Field(default=None)
    
    def __repr__(self) -> str:
        return f"<Gift(id={self.id}, donor_id={self.donor_id}, amount=${self.amount}, date={self.gift_date})>"
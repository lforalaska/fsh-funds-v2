"""Donor model."""
from datetime import datetime
from typing import Optional, List
from sqlmodel import Field, Relationship
from models.base import BaseModel


class Donor(BaseModel, table=True):
    """Donor database model."""
    __tablename__ = "donors"
    
    # Personal Information
    first_name: str = Field(index=True)
    last_name: str = Field(index=True)
    full_name: Optional[str] = Field(default=None, index=True)
    preferred_name: Optional[str] = Field(default=None)
    title: Optional[str] = Field(default=None)
    suffix: Optional[str] = Field(default=None)
    
    # Contact Information
    email: Optional[str] = Field(default=None, index=True)
    phone: Optional[str] = Field(default=None, index=True)
    mobile_phone: Optional[str] = Field(default=None)
    work_phone: Optional[str] = Field(default=None)
    
    # Address Information
    address_line_1: Optional[str] = Field(default=None)
    address_line_2: Optional[str] = Field(default=None)
    city: Optional[str] = Field(default=None)
    state: Optional[str] = Field(default=None)
    postal_code: Optional[str] = Field(default=None)
    country: Optional[str] = Field(default="US")
    
    # Professional Information
    company: Optional[str] = Field(default=None)
    job_title: Optional[str] = Field(default=None)
    
    # Donor Preferences
    preferred_contact_method: Optional[str] = Field(default="email")  # email, phone, mail
    communication_preferences: Optional[str] = Field(default=None)  # JSON string
    do_not_email: bool = Field(default=False)
    do_not_call: bool = Field(default=False)
    do_not_mail: bool = Field(default=False)
    
    # Giving Information
    total_gifts: float = Field(default=0.0)
    total_gift_count: int = Field(default=0)
    first_gift_date: Optional[datetime] = Field(default=None)
    last_gift_date: Optional[datetime] = Field(default=None)
    largest_gift: float = Field(default=0.0)
    average_gift: float = Field(default=0.0)
    
    # Status and Segmentation
    donor_status: str = Field(default="active")  # active, lapsed, prospect
    donor_type: str = Field(default="individual")  # individual, organization, foundation
    wealth_rating: Optional[str] = Field(default=None)  # A, B, C, D
    capacity_rating: Optional[int] = Field(default=None)  # 1-10 scale
    
    # Notes and Additional Info
    notes: Optional[str] = Field(default=None)
    source: Optional[str] = Field(default=None)  # How they were acquired
    
    # Duplicate Detection Fields
    name_key: Optional[str] = Field(default=None, index=True)  # Normalized name for matching
    email_key: Optional[str] = Field(default=None, index=True)  # Normalized email for matching
    phone_key: Optional[str] = Field(default=None, index=True)  # Normalized phone for matching
    
    # Relationships
    gifts: List["Gift"] = Relationship(back_populates="donor")
    communications: List["Communication"] = Relationship(back_populates="donor")
    donor_tags: List["DonorTag"] = Relationship(back_populates="donor")
    
    def __repr__(self) -> str:
        return f"<Donor(id={self.id}, name='{self.full_name}', email='{self.email}')>"
"""Tag models for donor segmentation and categorization."""
from typing import Optional, List
from sqlmodel import Field, Relationship
from models.base import BaseModel


class Tag(BaseModel, table=True):
    """Tag database model for categorizing donors."""
    __tablename__ = "tags"
    
    name: str = Field(unique=True, index=True)
    description: Optional[str] = Field(default=None)
    category: Optional[str] = Field(default="general")  # general, giving_level, interest, event
    color: Optional[str] = Field(default="#3B82F6")  # Hex color for UI display
    is_active: bool = Field(default=True)
    
    # Usage tracking
    donor_count: int = Field(default=0)  # Number of donors with this tag
    
    # Relationships
    donor_tags: List["DonorTag"] = Relationship(back_populates="tag")
    
    def __repr__(self) -> str:
        return f"<Tag(id={self.id}, name='{self.name}', category='{self.category}')>"


class DonorTag(BaseModel, table=True):
    """Association table for many-to-many relationship between donors and tags."""
    __tablename__ = "donor_tags"
    
    # Foreign Keys
    donor_id: int = Field(foreign_key="donors.id", primary_key=True)
    tag_id: int = Field(foreign_key="tags.id", primary_key=True)
    
    # Additional Fields
    assigned_by: Optional[str] = Field(default=None)  # User who assigned the tag
    notes: Optional[str] = Field(default=None)
    
    # Relationships
    donor: "Donor" = Relationship(back_populates="donor_tags")
    tag: Tag = Relationship(back_populates="donor_tags")
    
    def __repr__(self) -> str:
        return f"<DonorTag(donor_id={self.donor_id}, tag_id={self.tag_id})>"
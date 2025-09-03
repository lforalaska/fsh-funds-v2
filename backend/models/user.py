"""User model."""
from typing import Optional
from sqlmodel import Field
from models.base import BaseModel


class User(BaseModel, table=True):
    """User database model."""
    __tablename__ = "users"
    
    username: str = Field(unique=True, index=True)
    email: str = Field(unique=True, index=True)
    hashed_password: str
    is_active: bool = Field(default=True)
    is_superuser: bool = Field(default=False)
"""Users router."""
from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from pydantic import BaseModel, EmailStr
from api.dependencies.auth import get_current_user, get_optional_current_user
from api.utils.logger import get_logger


router = APIRouter()
logger = get_logger(__name__)


class User(BaseModel):
    """User model."""
    id: int
    username: str
    email: EmailStr
    is_active: bool = True


class UserCreate(BaseModel):
    """User creation model."""
    username: str
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    """User update model."""
    username: str = None
    email: EmailStr = None
    is_active: bool = None


# Mock data - in a real app, this would be from a database
MOCK_USERS = [
    User(id=1, username="admin", email="admin@example.com"),
    User(id=2, username="user1", email="user1@example.com"),
]


@router.get("/", response_model=List[User])
async def get_users(current_user: dict = Depends(get_optional_current_user)):
    """Get all users."""
    logger.info("Fetching all users")
    return MOCK_USERS


@router.get("/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    """Get current user information."""
    logger.info(f"Fetching current user info for user: {current_user['username']}")
    return User(
        id=current_user["id"],
        username=current_user["username"],
        email=current_user["email"]
    )


@router.get("/{user_id}", response_model=User)
async def get_user(user_id: int, current_user: dict = Depends(get_current_user)):
    """Get user by ID."""
    logger.info(f"Fetching user with ID: {user_id}")
    
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return user


@router.post("/", response_model=User)
async def create_user(
    user_data: UserCreate,
    current_user: dict = Depends(get_current_user)
):
    """Create a new user."""
    logger.info(f"Creating new user: {user_data.username}")
    
    # Check if user already exists
    if any(u.email == user_data.email for u in MOCK_USERS):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Create new user
    new_user = User(
        id=len(MOCK_USERS) + 1,
        username=user_data.username,
        email=user_data.email
    )
    MOCK_USERS.append(new_user)
    
    return new_user


@router.put("/{user_id}", response_model=User)
async def update_user(
    user_id: int,
    user_data: UserUpdate,
    current_user: dict = Depends(get_current_user)
):
    """Update user by ID."""
    logger.info(f"Updating user with ID: {user_id}")
    
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update user fields
    update_data = user_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(user, field, value)
    
    return user


@router.delete("/{user_id}")
async def delete_user(
    user_id: int,
    current_user: dict = Depends(get_current_user)
):
    """Delete user by ID."""
    logger.info(f"Deleting user with ID: {user_id}")
    
    user = next((u for u in MOCK_USERS if u.id == user_id), None)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    MOCK_USERS.remove(user)
    return {"message": "User deleted successfully"}
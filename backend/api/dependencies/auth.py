"""Authentication dependencies."""
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from models.user import User


security = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(security)
) -> User:
    """Get current authenticated user."""
    # For now, return a mock user for development
    # In production, this would validate JWT tokens and fetch user from database
    
    # Create a mock user for development
    mock_user = User(
        id=1,
        username="admin",
        email="admin@fshfunds.com", 
        hashed_password="mock_hash",
        is_active=True,
        is_superuser=True
    )
    return mock_user


async def get_optional_current_user(
    credentials: Optional[HTTPAuthorizationCredentials] = Depends(HTTPBearer(auto_error=False))
) -> Optional[dict]:
    """Get current user if authenticated, None otherwise."""
    if not credentials:
        return None
    
    try:
        return await get_current_user(credentials)
    except HTTPException:
        return None
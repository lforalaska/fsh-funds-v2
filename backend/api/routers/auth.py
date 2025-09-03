"""Authentication router."""
from fastapi import APIRouter, HTTPException, status
from pydantic import BaseModel, EmailStr
from api.utils.logger import get_logger


router = APIRouter()
logger = get_logger(__name__)


class LoginRequest(BaseModel):
    """Login request model."""
    email: EmailStr
    password: str


class LoginResponse(BaseModel):
    """Login response model."""
    access_token: str
    token_type: str = "bearer"
    user: dict


class RegisterRequest(BaseModel):
    """Registration request model."""
    email: EmailStr
    password: str
    username: str


@router.post("/login", response_model=LoginResponse)
async def login(request: LoginRequest):
    """Authenticate user and return access token."""
    logger.info(f"Login attempt for email: {request.email}")
    
    # This is a placeholder implementation
    # In a real app, you would validate credentials against the database
    if request.email == "admin@example.com" and request.password == "password":
        return LoginResponse(
            access_token="mock_jwt_token",
            user={
                "id": 1,
                "email": request.email,
                "username": "admin"
            }
        )
    
    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Incorrect email or password"
    )


@router.post("/register")
async def register(request: RegisterRequest):
    """Register a new user."""
    logger.info(f"Registration attempt for email: {request.email}")
    
    # This is a placeholder implementation
    # In a real app, you would save the user to the database
    return {
        "message": "User registered successfully",
        "user": {
            "email": request.email,
            "username": request.username
        }
    }


@router.post("/logout")
async def logout():
    """Logout user."""
    logger.info("User logout")
    return {"message": "Successfully logged out"}
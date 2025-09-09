"""Donor management API endpoints."""
from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends, Query
from sqlmodel import Session
from pydantic import BaseModel

from api.dependencies.auth import get_current_user
from models.user import User
from models.donors.donor import Donor
from api.services.donors.donor_service import DonorService


# Database dependency (simplified for now)
def get_session():
    """Get database session - to be implemented with proper dependency injection."""
    # This would be implemented with proper database session management
    pass


# Pydantic models for requests/responses
class DonorCreate(BaseModel):
    """Donor creation request model."""
    first_name: str
    last_name: str
    email: Optional[str] = None
    phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    work_phone: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = "US"
    company: Optional[str] = None
    job_title: Optional[str] = None
    preferred_contact_method: Optional[str] = "email"
    do_not_email: bool = False
    do_not_call: bool = False
    do_not_mail: bool = False
    donor_type: str = "individual"
    notes: Optional[str] = None
    source: Optional[str] = None


class DonorUpdate(BaseModel):
    """Donor update request model."""
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    preferred_name: Optional[str] = None
    title: Optional[str] = None
    suffix: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    mobile_phone: Optional[str] = None
    work_phone: Optional[str] = None
    address_line_1: Optional[str] = None
    address_line_2: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    postal_code: Optional[str] = None
    country: Optional[str] = None
    company: Optional[str] = None
    job_title: Optional[str] = None
    preferred_contact_method: Optional[str] = None
    do_not_email: Optional[bool] = None
    do_not_call: Optional[bool] = None
    do_not_mail: Optional[bool] = None
    donor_status: Optional[str] = None
    donor_type: Optional[str] = None
    wealth_rating: Optional[str] = None
    capacity_rating: Optional[int] = None
    notes: Optional[str] = None
    source: Optional[str] = None


class DonorResponse(BaseModel):
    """Donor response model."""
    id: int
    first_name: str
    last_name: str
    full_name: Optional[str]
    email: Optional[str]
    phone: Optional[str]
    city: Optional[str]
    state: Optional[str]
    company: Optional[str]
    donor_status: str
    donor_type: str
    total_gifts: float
    total_gift_count: int
    created_at: str


class MergeDonorsRequest(BaseModel):
    """Request model for merging donors."""
    primary_donor_id: int
    duplicate_donor_id: int


class AddTagRequest(BaseModel):
    """Request model for adding tags to donors."""
    tag_name: str


# Router
router = APIRouter(prefix="/donors", tags=["donors"])


@router.post("/", response_model=DonorResponse)
async def create_donor(
    donor_data: DonorCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Create a new donor."""
    service = DonorService(session)
    donor = service.create_donor(donor_data.dict())
    
    return DonorResponse(
        id=donor.id,
        first_name=donor.first_name,
        last_name=donor.last_name,
        full_name=donor.full_name,
        email=donor.email,
        phone=donor.phone,
        city=donor.city,
        state=donor.state,
        company=donor.company,
        donor_status=donor.donor_status,
        donor_type=donor.donor_type,
        total_gifts=donor.total_gifts,
        total_gift_count=donor.total_gift_count,
        created_at=donor.created_at.isoformat()
    )


@router.get("/", response_model=List[DonorResponse])
async def list_donors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=500),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """List donors with pagination."""
    service = DonorService(session)
    donors = service.list_donors(skip=skip, limit=limit)
    
    return [
        DonorResponse(
            id=donor.id,
            first_name=donor.first_name,
            last_name=donor.last_name,
            full_name=donor.full_name,
            email=donor.email,
            phone=donor.phone,
            city=donor.city,
            state=donor.state,
            company=donor.company,
            donor_status=donor.donor_status,
            donor_type=donor.donor_type,
            total_gifts=donor.total_gifts,
            total_gift_count=donor.total_gift_count,
            created_at=donor.created_at.isoformat()
        ) for donor in donors
    ]


@router.get("/search", response_model=List[DonorResponse])
async def search_donors(
    q: str = Query(..., min_length=2),
    limit: int = Query(50, ge=1, le=100),
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Search donors by name, email, or phone."""
    service = DonorService(session)
    donors = service.search_donors(q, limit)
    
    return [
        DonorResponse(
            id=donor.id,
            first_name=donor.first_name,
            last_name=donor.last_name,
            full_name=donor.full_name,
            email=donor.email,
            phone=donor.phone,
            city=donor.city,
            state=donor.state,
            company=donor.company,
            donor_status=donor.donor_status,
            donor_type=donor.donor_type,
            total_gifts=donor.total_gifts,
            total_gift_count=donor.total_gift_count,
            created_at=donor.created_at.isoformat()
        ) for donor in donors
    ]


@router.get("/{donor_id}", response_model=DonorResponse)
async def get_donor(
    donor_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Get donor by ID."""
    service = DonorService(session)
    donor = service.get_donor(donor_id)
    
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    return DonorResponse(
        id=donor.id,
        first_name=donor.first_name,
        last_name=donor.last_name,
        full_name=donor.full_name,
        email=donor.email,
        phone=donor.phone,
        city=donor.city,
        state=donor.state,
        company=donor.company,
        donor_status=donor.donor_status,
        donor_type=donor.donor_type,
        total_gifts=donor.total_gifts,
        total_gift_count=donor.total_gift_count,
        created_at=donor.created_at.isoformat()
    )


@router.put("/{donor_id}", response_model=DonorResponse)
async def update_donor(
    donor_id: int,
    donor_data: DonorUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Update donor information."""
    service = DonorService(session)
    donor = service.update_donor(donor_id, donor_data.dict(exclude_unset=True))
    
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    return DonorResponse(
        id=donor.id,
        first_name=donor.first_name,
        last_name=donor.last_name,
        full_name=donor.full_name,
        email=donor.email,
        phone=donor.phone,
        city=donor.city,
        state=donor.state,
        company=donor.company,
        donor_status=donor.donor_status,
        donor_type=donor.donor_type,
        total_gifts=donor.total_gifts,
        total_gift_count=donor.total_gift_count,
        created_at=donor.created_at.isoformat()
    )


@router.get("/{donor_id}/duplicates", response_model=List[DonorResponse])
async def find_potential_duplicates(
    donor_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Find potential duplicate donors."""
    service = DonorService(session)
    donor = service.get_donor(donor_id)
    
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    duplicates = service.find_potential_duplicates(donor)
    
    return [
        DonorResponse(
            id=dup.id,
            first_name=dup.first_name,
            last_name=dup.last_name,
            full_name=dup.full_name,
            email=dup.email,
            phone=dup.phone,
            city=dup.city,
            state=dup.state,
            company=dup.company,
            donor_status=dup.donor_status,
            donor_type=dup.donor_type,
            total_gifts=dup.total_gifts,
            total_gift_count=dup.total_gift_count,
            created_at=dup.created_at.isoformat()
        ) for dup in duplicates
    ]


@router.post("/merge", response_model=DonorResponse)
async def merge_donors(
    request: MergeDonorsRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Merge two donor records."""
    service = DonorService(session)
    merged_donor = service.merge_donors(
        request.primary_donor_id, 
        request.duplicate_donor_id
    )
    
    if not merged_donor:
        raise HTTPException(status_code=404, detail="One or both donors not found")
    
    return DonorResponse(
        id=merged_donor.id,
        first_name=merged_donor.first_name,
        last_name=merged_donor.last_name,
        full_name=merged_donor.full_name,
        email=merged_donor.email,
        phone=merged_donor.phone,
        city=merged_donor.city,
        state=merged_donor.state,
        company=merged_donor.company,
        donor_status=merged_donor.donor_status,
        donor_type=merged_donor.donor_type,
        total_gifts=merged_donor.total_gifts,
        total_gift_count=merged_donor.total_gift_count,
        created_at=merged_donor.created_at.isoformat()
    )


@router.post("/{donor_id}/tags")
async def add_tag_to_donor(
    donor_id: int,
    request: AddTagRequest,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Add a tag to a donor."""
    service = DonorService(session)
    success = service.add_tag_to_donor(donor_id, request.tag_name)
    
    if not success:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    return {"message": f"Tag '{request.tag_name}' added to donor"}


@router.delete("/{donor_id}")
async def delete_donor(
    donor_id: int,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user)
):
    """Delete a donor."""
    service = DonorService(session)
    donor = service.get_donor(donor_id)
    
    if not donor:
        raise HTTPException(status_code=404, detail="Donor not found")
    
    service.repository.delete(donor_id)
    return {"message": "Donor deleted successfully"}
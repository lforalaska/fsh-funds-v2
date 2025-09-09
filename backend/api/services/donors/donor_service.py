"""Donor service for business logic."""
import re
from typing import List, Optional, Dict, Any
from sqlmodel import Session
from models.donors.donor import Donor
from models.donors.tag import Tag, DonorTag
from repositories.donors.donor_repository import DonorRepository


class DonorService:
    """Service for donor business logic."""
    
    def __init__(self, session: Session):
        self.session = session
        self.repository = DonorRepository(session)
    
    def create_donor(self, donor_data: Dict[str, Any]) -> Donor:
        """Create a new donor with normalized fields."""
        donor = Donor(**donor_data)
        
        # Set full name if not provided
        if not donor.full_name and donor.first_name and donor.last_name:
            donor.full_name = f"{donor.first_name} {donor.last_name}".strip()
        
        # Set normalized keys for duplicate detection
        donor.name_key = self._normalize_name(donor.full_name or "")
        donor.email_key = self._normalize_email(donor.email or "")
        donor.phone_key = self._normalize_phone(donor.phone or "")
        
        return self.repository.create(donor)
    
    def update_donor(self, donor_id: int, donor_data: Dict[str, Any]) -> Optional[Donor]:
        """Update donor with normalized fields."""
        donor = self.repository.get_by_id(donor_id)
        if not donor:
            return None
        
        # Update fields
        for key, value in donor_data.items():
            if hasattr(donor, key):
                setattr(donor, key, value)
        
        # Update full name if first/last name changed
        if "first_name" in donor_data or "last_name" in donor_data:
            if donor.first_name and donor.last_name:
                donor.full_name = f"{donor.first_name} {donor.last_name}".strip()
        
        # Update normalized keys
        donor.name_key = self._normalize_name(donor.full_name or "")
        donor.email_key = self._normalize_email(donor.email or "")
        donor.phone_key = self._normalize_phone(donor.phone or "")
        
        return self.repository.update(donor)
    
    def get_donor(self, donor_id: int) -> Optional[Donor]:
        """Get donor by ID."""
        return self.repository.get_by_id(donor_id)
    
    def list_donors(self, skip: int = 0, limit: int = 100) -> List[Donor]:
        """List donors with pagination."""
        return self.repository.get_all(skip=skip, limit=limit)
    
    def search_donors(self, query: str, limit: int = 50) -> List[Donor]:
        """Search donors by name, email, or phone."""
        return self.repository.search_donors(query, limit)
    
    def find_potential_duplicates(self, donor: Donor) -> List[Donor]:
        """Find potential duplicate donors."""
        return self.repository.find_potential_duplicates(donor)
    
    def merge_donors(self, primary_donor_id: int, duplicate_donor_id: int) -> Optional[Donor]:
        """Merge two donor records."""
        primary = self.repository.get_by_id(primary_donor_id)
        duplicate = self.repository.get_by_id(duplicate_donor_id)
        
        if not primary or not duplicate:
            return None
        
        # Merge logic: keep primary donor's data, but fill in missing fields from duplicate
        merge_fields = [
            'email', 'phone', 'mobile_phone', 'work_phone',
            'address_line_1', 'address_line_2', 'city', 'state', 'postal_code',
            'company', 'job_title', 'notes'
        ]
        
        for field in merge_fields:
            primary_value = getattr(primary, field)
            duplicate_value = getattr(duplicate, field)
            if not primary_value and duplicate_value:
                setattr(primary, field, duplicate_value)
        
        # Update gift totals (would need to move actual gifts in a real implementation)
        primary.total_gifts += duplicate.total_gifts
        primary.total_gift_count += duplicate.total_gift_count
        
        # Update dates
        if duplicate.first_gift_date and (not primary.first_gift_date or duplicate.first_gift_date < primary.first_gift_date):
            primary.first_gift_date = duplicate.first_gift_date
        
        if duplicate.last_gift_date and (not primary.last_gift_date or duplicate.last_gift_date > primary.last_gift_date):
            primary.last_gift_date = duplicate.last_gift_date
        
        # Update largest gift
        if duplicate.largest_gift > primary.largest_gift:
            primary.largest_gift = duplicate.largest_gift
        
        # Recalculate average
        if primary.total_gift_count > 0:
            primary.average_gift = primary.total_gifts / primary.total_gift_count
        
        # Save primary and delete duplicate
        updated_primary = self.repository.update(primary)
        self.repository.delete(duplicate_donor_id)
        
        return updated_primary
    
    def add_tag_to_donor(self, donor_id: int, tag_name: str) -> bool:
        """Add a tag to a donor."""
        donor = self.repository.get_by_id(donor_id)
        if not donor:
            return False
        
        # Find or create tag
        tag_statement = f"SELECT * FROM tags WHERE name = '{tag_name}'"
        existing_tags = self.session.exec(tag_statement).all()
        
        if existing_tags:
            tag = existing_tags[0]
        else:
            tag = Tag(name=tag_name)
            self.session.add(tag)
            self.session.commit()
            self.session.refresh(tag)
        
        # Check if association already exists
        existing_association = self.session.exec(
            f"SELECT * FROM donor_tags WHERE donor_id = {donor_id} AND tag_id = {tag.id}"
        ).first()
        
        if not existing_association:
            donor_tag = DonorTag(donor_id=donor_id, tag_id=tag.id)
            self.session.add(donor_tag)
            self.session.commit()
        
        return True
    
    def _normalize_name(self, name: str) -> str:
        """Normalize name for duplicate detection."""
        if not name:
            return ""
        # Remove extra spaces, convert to lowercase, remove punctuation
        normalized = re.sub(r'[^\w\s]', '', name.lower())
        normalized = ' '.join(normalized.split())
        return normalized
    
    def _normalize_email(self, email: str) -> str:
        """Normalize email for duplicate detection."""
        if not email:
            return ""
        return email.lower().strip()
    
    def _normalize_phone(self, phone: str) -> str:
        """Normalize phone for duplicate detection."""
        if not phone:
            return ""
        # Remove all non-numeric characters
        return re.sub(r'[^\d]', '', phone)
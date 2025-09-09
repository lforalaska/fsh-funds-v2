"""Donor repository for database operations."""
from typing import List, Optional
from sqlmodel import Session, select, and_, or_
from models.donors.donor import Donor
from models.donors.tag import Tag, DonorTag
from repositories.base import BaseRepository


class DonorRepository(BaseRepository[Donor]):
    """Repository for donor database operations."""
    
    def __init__(self, session: Session):
        super().__init__(session, Donor)
    
    def find_by_email(self, email: str) -> Optional[Donor]:
        """Find donor by email address."""
        statement = select(Donor).where(Donor.email == email)
        return self.session.exec(statement).first()
    
    def find_by_phone(self, phone: str) -> Optional[Donor]:
        """Find donor by phone number."""
        statement = select(Donor).where(Donor.phone == phone)
        return self.session.exec(statement).first()
    
    def find_by_name_parts(self, first_name: str, last_name: str) -> List[Donor]:
        """Find donors by first and last name."""
        statement = select(Donor).where(
            and_(
                Donor.first_name.ilike(f"%{first_name}%"),
                Donor.last_name.ilike(f"%{last_name}%")
            )
        )
        return list(self.session.exec(statement).all())
    
    def search_donors(self, query: str, limit: int = 50) -> List[Donor]:
        """Search donors by name, email, or phone."""
        search_term = f"%{query}%"
        statement = select(Donor).where(
            or_(
                Donor.full_name.ilike(search_term),
                Donor.first_name.ilike(search_term),
                Donor.last_name.ilike(search_term),
                Donor.email.ilike(search_term),
                Donor.phone.ilike(search_term),
                Donor.company.ilike(search_term)
            )
        ).limit(limit)
        return list(self.session.exec(statement).all())
    
    def find_potential_duplicates(self, donor: Donor) -> List[Donor]:
        """Find potential duplicate donors based on normalized keys."""
        conditions = []
        
        # Match by normalized name
        if donor.name_key:
            conditions.append(Donor.name_key == donor.name_key)
        
        # Match by normalized email
        if donor.email_key:
            conditions.append(Donor.email_key == donor.email_key)
        
        # Match by normalized phone
        if donor.phone_key:
            conditions.append(Donor.phone_key == donor.phone_key)
        
        if not conditions:
            return []
        
        statement = select(Donor).where(
            and_(
                Donor.id != donor.id,  # Exclude the donor being checked
                or_(*conditions)
            )
        )
        return list(self.session.exec(statement).all())
    
    def get_donors_by_tag(self, tag_name: str) -> List[Donor]:
        """Get all donors with a specific tag."""
        statement = (
            select(Donor)
            .join(DonorTag)
            .join(Tag)
            .where(Tag.name == tag_name)
        )
        return list(self.session.exec(statement).all())
    
    def get_active_donors(self, limit: int = 100) -> List[Donor]:
        """Get active donors with recent giving activity."""
        statement = select(Donor).where(
            Donor.donor_status == "active"
        ).limit(limit)
        return list(self.session.exec(statement).all())
    
    def get_lapsed_donors(self, limit: int = 100) -> List[Donor]:
        """Get lapsed donors who haven't given recently."""
        statement = select(Donor).where(
            Donor.donor_status == "lapsed"
        ).limit(limit)
        return list(self.session.exec(statement).all())
"""Base repository class."""
from typing import Generic, TypeVar, Type, List, Optional
from sqlmodel import Session, select
from models.base import BaseModel


ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseRepository(Generic[ModelType]):
    """Base repository with common CRUD operations."""
    
    def __init__(self, model: Type[ModelType], session: Session):
        self.model = model
        self.session = session
    
    def get(self, id: int) -> Optional[ModelType]:
        """Get single record by ID."""
        return self.session.get(self.model, id)
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all records with pagination."""
        statement = select(self.model).offset(skip).limit(limit)
        return self.session.exec(statement).all()
    
    def create(self, obj_in: dict) -> ModelType:
        """Create new record."""
        db_obj = self.model(**obj_in)
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
    
    def update(self, db_obj: ModelType, obj_in: dict) -> ModelType:
        """Update existing record."""
        for field, value in obj_in.items():
            if hasattr(db_obj, field):
                setattr(db_obj, field, value)
        
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
    
    def delete(self, id: int) -> None:
        """Delete record by ID."""
        obj = self.session.get(self.model, id)
        if obj:
            self.session.delete(obj)
            self.session.commit()
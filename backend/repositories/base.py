"""Base repository class."""
from typing import Generic, TypeVar, Type, List, Optional
from sqlmodel import Session, select
from models.base import BaseModel


ModelType = TypeVar("ModelType", bound=BaseModel)


class BaseRepository(Generic[ModelType]):
    """Base repository with common CRUD operations."""
    
    def __init__(self, session: Session, model: Type[ModelType]):
        self.session = session
        self.model = model
    
    def get_by_id(self, id: int) -> Optional[ModelType]:
        """Get single record by ID."""
        return self.session.get(self.model, id)
    
    def get_all(self, skip: int = 0, limit: int = 100) -> List[ModelType]:
        """Get all records with pagination."""
        statement = select(self.model).offset(skip).limit(limit)
        return list(self.session.exec(statement).all())
    
    def create(self, obj_in) -> ModelType:
        """Create new record."""
        if isinstance(obj_in, dict):
            db_obj = self.model(**obj_in)
        else:
            db_obj = obj_in
        self.session.add(db_obj)
        self.session.commit()
        self.session.refresh(db_obj)
        return db_obj
    
    def update(self, db_obj: ModelType) -> ModelType:
        """Update existing record."""
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
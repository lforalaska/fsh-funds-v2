"""Database dependencies."""
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlmodel import Session

# For now, use SQLite for development
DATABASE_URL = "sqlite:///./fsh_funds.db"

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_session() -> Session:
    """Get database session."""
    with Session(engine) as session:
        yield session
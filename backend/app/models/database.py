import uuid
from datetime import datetime
from typing import List, Optional
from sqlalchemy import create_engine, Column, String, Integer, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker, Session
from app.core.config import settings

Base = declarative_base()

class IncidentRecord(Base):
    __tablename__ = "incidents"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    situation = Column(String, nullable=False)
    risk_level = Column(String, nullable=False)
    assessment_status = Column(String, nullable=False)
    language = Column(String, nullable=False, default="en")
    redacted_summary = Column(String, nullable=False)
    evidence_count = Column(Integer, default=0)
    action_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

engine = create_engine(
    settings.DATABASE_URL,
    connect_args={"check_same_thread": False} if "sqlite" in settings.DATABASE_URL else {}
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_incident(
    db: Session,
    situation: str,
    risk_level: str,
    assessment_status: str,
    language: str,
    redacted_summary: str,
    evidence_count: int,
    action_count: int
) -> IncidentRecord:
    record = IncidentRecord(
        id=str(uuid.uuid4()),
        situation=situation,
        risk_level=risk_level,
        assessment_status=assessment_status,
        language=language,
        redacted_summary=redacted_summary,
        evidence_count=evidence_count,
        action_count=action_count,
        created_at=datetime.utcnow()
    )
    db.add(record)
    db.commit()
    db.refresh(record)
    return record

def list_incidents(db: Session, limit: int = 50) -> List[IncidentRecord]:
    return db.query(IncidentRecord).order_by(IncidentRecord.created_at.desc()).limit(limit).all()

def get_incident_by_id(db: Session, incident_id: str) -> Optional[IncidentRecord]:
    return db.query(IncidentRecord).filter(IncidentRecord.id == incident_id).first()

def delete_incident_by_id(db: Session, incident_id: str) -> bool:
    record = db.query(IncidentRecord).filter(IncidentRecord.id == incident_id).first()
    if record:
        db.delete(record)
        db.commit()
        return True
    return False

def clear_all_incident_records(db: Session) -> int:
    deleted_count = db.query(IncidentRecord).delete()
    db.commit()
    return deleted_count

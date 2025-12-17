from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    logs = relationship("AuditLog", back_populates="project")

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    project_id = Column(Integer, ForeignKey("projects.id"))
    
    task_prompt = Column(Text)
    ai_response_code = Column(Text)
    execution_output = Column(Text)
    status = Column(String)  # 'success' or 'error'
    attempts_count = Column(Integer)
    
    timestamp = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="logs")
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, JSON
from app.models.base import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class ScanResult(Base):
    __tablename__ = "scan_results"
    
    id = Column(Integer, primary_key=True, index=True)
    scan_type = Column(String(50), nullable=False)  # 'nmap', 'whatweb', 'custom'
    target_id = Column(Integer, ForeignKey("targets.id"), nullable=True)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    status = Column(String(20), default="pending")  # pending, running, completed, failed
    raw_output = Column(Text, nullable=True)
    parsed_data = Column(JSON, nullable=True)  # Structured scan data
    scan_options = Column(JSON, nullable=True)  # Options used for the scan
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    error_message = Column(Text, nullable=True)
    
    # Relationships
    target = relationship("Target", back_populates="scan_results")
    project = relationship("Project", back_populates="scan_results")
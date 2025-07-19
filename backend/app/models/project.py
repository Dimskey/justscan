from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from .base import Base
from sqlalchemy.orm import relationship
from datetime import datetime

class Project(Base):
    __tablename__ = "projects"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    scope = Column(Text, nullable=True)  # JSON string of scope
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)  # Opsional, tidak dipakai untuk publik/guest
    is_active = Column(Boolean, default=True)
    
    # Relationships
    targets = relationship("Target", back_populates="project", cascade="all, delete-orphan")
    scan_results = relationship("ScanResult", back_populates="project", cascade="all, delete-orphan")
    notes = relationship("Note", back_populates="project", cascade="all, delete-orphan")
    user = relationship("User", back_populates="projects")

class Target(Base):
    __tablename__ = "targets"
    
    id = Column(Integer, primary_key=True, index=True)
    url = Column(String(500), nullable=True)
    ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    hostname = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    project_id = Column(Integer, ForeignKey("projects.id"), nullable=False)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    project = relationship("Project", back_populates="targets")
    scan_results = relationship("ScanResult", back_populates="target", cascade="all, delete-orphan") 
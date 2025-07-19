from pydantic import BaseModel, validator
from typing import Optional, Dict, Any, List
from datetime import datetime
from enum import Enum

class ScanType(str, Enum):
    BASIC = "basic"
    STEALTH = "stealth"
    AGGRESSIVE = "aggressive"
    PORT_SCAN = "port_scan"
    CUSTOM = "custom"

class NmapScanRequest(BaseModel):
    target: str
    scan_type: ScanType = ScanType.BASIC
    ports: Optional[str] = None
    options: Optional[Dict[str, Any]] = None
    project_id: Optional[int] = None
    
    @validator('target')
    def validate_target(cls, v):
        if not v or not v.strip():
            raise ValueError('Target cannot be empty')
        return v.strip()
    
    @validator('ports')
    def validate_ports(cls, v):
        if v:
            # Basic validation for port ranges
            if not any(c.isdigit() for c in v):
                raise ValueError('Ports must contain numbers')
        return v

class WhatWebScanRequest(BaseModel):
    target: str
    options: Optional[Dict[str, Any]] = None
    project_id: Optional[int] = None
    
    @validator('target')
    def validate_target(cls, v):
        if not v or not v.strip():
            raise ValueError('Target cannot be empty')
        return v.strip()

class ScanResult(BaseModel):
    id: int
    scan_type: str
    target_id: Optional[int] = None
    project_id: int
    status: str
    raw_output: Optional[str] = None
    parsed_data: Optional[Dict[str, Any]] = None
    scan_options: Optional[Dict[str, Any]] = None
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    created_at: datetime
    error_message: Optional[str] = None
    
    class Config:
        from_attributes = True

class ScanStatus(BaseModel):
    task_id: str
    status: str
    progress: Optional[int] = None
    message: Optional[str] = None
    result: Optional[Dict[str, Any]] = None
    error: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None 
from pydantic import BaseModel, HttpUrl
from typing import Optional, List
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None
    scope: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class ProjectUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    scope: Optional[str] = None

class ProjectResponse(ProjectBase):
    id: int
    created_at: datetime
    updated_at: datetime
    user_id: Optional[int] = None
    is_active: bool
    
    class Config:
        from_attributes = True

class TargetBase(BaseModel):
    url: Optional[str] = None
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    description: Optional[str] = None

class TargetCreate(TargetBase):
    pass

class TargetUpdate(BaseModel):
    url: Optional[str] = None
    ip_address: Optional[str] = None
    hostname: Optional[str] = None
    description: Optional[str] = None

class TargetResponse(TargetBase):
    id: int
    created_at: datetime
    updated_at: datetime
    project_id: int
    is_active: bool
    
    class Config:
        from_attributes = True

class ProjectWithTargets(ProjectResponse):
    targets: List[TargetResponse] = [] 
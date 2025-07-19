from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime

class ChatMessage(BaseModel):
    id: Optional[int] = None
    message: str
    response: Optional[str] = None
    timestamp: datetime
    project_id: Optional[int] = None
    user_id: Optional[int] = None
    
    class Config:
        from_attributes = True

class ChatRequest(BaseModel):
    message: str
    context: Optional[str] = None
    project_id: Optional[int] = None

class ChatResponse(BaseModel):
    message: str
    timestamp: Optional[str] = None
    suggestions: List[str] = []

class AIAnalysisRequest(BaseModel):
    scan_data: Dict[str, Any]
    project_id: int
    analysis_type: Optional[str] = "comprehensive"

class AIAnalysisResponse(BaseModel):
    analysis: str
    timestamp: str
    scan_data: Dict[str, Any]
    risk_level: Optional[str] = None
    recommendations: List[str] = []

class ExploitSuggestionRequest(BaseModel):
    target_info: Dict[str, Any]
    project_id: int

class ExploitSuggestionResponse(BaseModel):
    suggestions: List[str]
    confidence: Optional[float] = None
    reasoning: Optional[str] = None

class ReportGenerationRequest(BaseModel):
    project_id: int
    report_type: str = "comprehensive"
    include_recommendations: bool = True

class ReportGenerationResponse(BaseModel):
    report: str
    report_type: str
    project_id: int
    timestamp: str
    sections: List[str] = [] 
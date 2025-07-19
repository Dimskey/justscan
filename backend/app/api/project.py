from fastapi import APIRouter, HTTPException, Depends
from typing import List, Optional
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse, TargetCreate, TargetResponse
from app.models.project import Project, Target
# from app.core.security import get_current_user  # Tidak dipakai lagi

router = APIRouter()

@router.post("/", response_model=ProjectResponse)
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db)
):
    """
    Create a new project (public/guest)
    """
    try:
        db_project = Project(
            name=project.name,
            description=project.description,
            scope=project.scope
            # user_id=None  # Tidak perlu user_id
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/", response_model=List[ProjectResponse])
async def get_projects(
    db: Session = Depends(get_db),
    skip: int = 0,
    limit: int = 100
):
    """
    Get all projects (public/guest)
    """
    projects = db.query(Project).offset(skip).limit(limit).all()
    return projects

@router.get("/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Get specific project by ID (public/guest)
    """
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project

@router.put("/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db)
):
    """
    Update project (public/guest)
    """
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    for field, value in project_update.dict(exclude_unset=True).items():
        setattr(db_project, field, value)
    db.commit()
    db.refresh(db_project)
    return db_project

@router.delete("/{project_id}")
async def delete_project(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Delete project (public/guest)
    """
    db_project = db.query(Project).filter(Project.id == project_id).first()
    if not db_project:
        raise HTTPException(status_code=404, detail="Project not found")
    db.delete(db_project)
    db.commit()
    return {"message": "Project deleted successfully"}

# Target management endpoints
@router.post("/{project_id}/targets", response_model=TargetResponse)
async def add_target(
    project_id: int,
    target: TargetCreate,
    db: Session = Depends(get_db)
):
    """
    Add target to project (public/guest)
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    db_target = Target(
        url=target.url,
        ip_address=target.ip_address,
        description=target.description,
        project_id=project_id
    )
    db.add(db_target)
    db.commit()
    db.refresh(db_target)
    return db_target

@router.get("/{project_id}/targets", response_model=List[TargetResponse])
async def get_project_targets(
    project_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all targets for a project (public/guest)
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    targets = db.query(Target).filter(Target.project_id == project_id).all()
    return targets

@router.delete("/{project_id}/targets/{target_id}")
async def remove_target(
    project_id: int,
    target_id: int,
    db: Session = Depends(get_db)
):
    """
    Remove target from project (public/guest)
    """
    # Verify project exists
    project = db.query(Project).filter(Project.id == project_id).first()
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    target = db.query(Target).filter(
        Target.id == target_id,
        Target.project_id == project_id
    ).first()
    if not target:
        raise HTTPException(status_code=404, detail="Target not found")
    db.delete(target)
    db.commit()
    return {"message": "Target removed successfully"} 
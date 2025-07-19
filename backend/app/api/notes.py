from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db.session import get_db
from app.models.note import Note
from app.schemas.note import Note as NoteSchema, NoteCreate, NoteUpdate

router = APIRouter()

@router.get("/", response_model=List[NoteSchema])
def get_notes(
    project_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db)
):
    """Get all notes, optionally filtered by project_id"""
    query = db.query(Note)
    
    if project_id:
        query = query.filter(Note.project_id == project_id)
    
    notes = query.offset(skip).limit(limit).all()
    return notes

@router.get("/{note_id}", response_model=NoteSchema)
def get_note(note_id: int, db: Session = Depends(get_db)):
    """Get a specific note by ID"""
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    return note

@router.post("/", response_model=NoteSchema)
def create_note(note_data: NoteCreate, db: Session = Depends(get_db)):
    """Create a new note"""
    note = Note(**note_data.dict())
    db.add(note)
    db.commit()
    db.refresh(note)
    return note

@router.put("/{note_id}", response_model=NoteSchema)
def update_note(note_id: int, note_data: NoteUpdate, db: Session = Depends(get_db)):
    """Update an existing note"""
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    update_data = note_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(note, field, value)
    
    db.commit()
    db.refresh(note)
    return note

@router.delete("/{note_id}")
def delete_note(note_id: int, db: Session = Depends(get_db)):
    """Delete a note"""
    note = db.query(Note).filter(Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
    
    db.delete(note)
    db.commit()
    return {"message": "Note deleted successfully"}
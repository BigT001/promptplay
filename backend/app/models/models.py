from pydantic import BaseModel
from typing import Optional, Literal, List, Union
from datetime import datetime

class AIRequest(BaseModel):
    prompt: str
    provider: Optional[str] = None  # "ollama", "gemini", or "auto"
    model: Optional[str] = None
    max_tokens: Optional[int] = 2000
    temperature: Optional[float] = 0.7

class CharacterBase(BaseModel):
    name: str
    role: Optional[str] = None
    description: Optional[str] = None
    background: Optional[str] = None
    personality: Optional[str] = None
    goals: Optional[str] = None

class CharacterCreate(CharacterBase):
    project_id: int

class Character(CharacterBase):
    id: int
    project_id: int

    class Config:
        from_attributes = True

class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    category: Optional[str] = None

class ProjectCreate(ProjectBase):
    user_id: int

class Project(ProjectBase):
    id: int
    user_id: int
    content: Optional[str] = None
    progress: Optional[int] = 0

    class Config:
        from_attributes = True

class Scene(BaseModel):
    id: Optional[int] = None
    project_id: int
    title: str
    sequence_number: int
    content: Optional[str] = None
    notes: Optional[str] = None
    status: str = "draft"
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True

class SceneCreate(BaseModel):
    project_id: int
    title: str
    sequence_number: int
    content: Optional[str] = None
    notes: Optional[str] = None

class AIGenerationHistory(BaseModel):
    id: Optional[int] = None
    user_id: int
    project_id: Optional[int] = None
    prompt: str
    result: str
    model: str
    tokens_used: Optional[int] = None
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True
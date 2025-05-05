from pydantic import BaseModel
from typing import Optional

class AIRequest(BaseModel):
    prompt: str
    model: str = "llama2"
    max_tokens: Optional[int] = 2000
    temperature: Optional[float] = 0.7

class CharacterBase(BaseModel):
    name: str
    role: Optional[str] = None
    description: Optional[str] = None
    personality: Optional[str] = None
    goals: Optional[str] = None
    background: Optional[str] = None

class Character(CharacterBase):
    id: int
    project_id: int

class CharacterCreate(CharacterBase):
    project_id: int
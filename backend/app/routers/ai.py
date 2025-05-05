from fastapi import APIRouter, HTTPException
from typing import Dict
import httpx
from app.models.models import AIRequest, CharacterBase

router = APIRouter(prefix="/ai", tags=["ai"])

OLLAMA_API_URL = "http://localhost:11434/api/generate"

@router.post("/generate-background")
async def generate_character_background(character: CharacterBase) -> Dict[str, str]:
    prompt = f"""Create a detailed and compelling background story for a character with the following details:
Name: {character.name}
{f'Role: {character.role}\\n' if character.role else ''}
{f'Description: {character.description}\\n' if character.description else ''}
{f'Personality: {character.personality}\\n' if character.personality else ''}
{f'Goals: {character.goals}\\n' if character.goals else ''}

Focus on creating a rich backstory that explains:
1. Key life events that shaped the character
2. Important relationships and influences
3. Motivations behind their current goals
4. Past experiences that inform their personality
5. Significant achievements or failures"""

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OLLAMA_API_URL,
                json={
                    "model": "llama2",
                    "prompt": prompt,
                    "stream": False
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to generate background")
            
            result = response.json()
            return {"background": result["response"]}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-script")
async def analyze_script(request: AIRequest) -> Dict[str, str]:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OLLAMA_API_URL,
                json={
                    "model": request.model,
                    "prompt": request.prompt,
                    "stream": False
                },
                timeout=30.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Failed to analyze script")
            
            result = response.json()
            return {"analysis": result["response"]}
            
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
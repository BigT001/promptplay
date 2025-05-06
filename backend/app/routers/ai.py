from fastapi import APIRouter, HTTPException, Request, Depends, Header
from typing import Optional
from jose import jwt, JWTError
import os
import httpx
import google.generativeai as genai
from app.models.models import AIRequest, CharacterBase, AIGenerationHistory
from app.middleware.cache import ai_cache
from app.middleware.rate_limit import rate_limiter
from app.db import get_db
import hashlib
import asyncpg

router = APIRouter(prefix="/ai", tags=["ai"])

# Configure AI providers
OLLAMA_API_URL = os.getenv("OLLAMA_API_URL", "http://localhost:11434/api/generate")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
USE_OLLAMA = os.getenv("USE_OLLAMA", "true").lower() == "true"

# Initialize Gemini
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel('gemini-pro')

async def try_ollama(prompt: str, model: str = "llama2") -> str:
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                OLLAMA_API_URL,
                json={"model": model, "prompt": prompt},
                timeout=30.0
            )
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="Ollama API failed")
            return response.json()["response"]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Ollama error: {str(e)}")

async def try_gemini(prompt: str) -> str:
    try:
        if not GEMINI_API_KEY:
            raise HTTPException(status_code=500, detail="Gemini API key not configured")
        response = gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Gemini error: {str(e)}")

def generate_cache_key(prompt: str, provider: str = None) -> str:
    # Create a unique cache key based on the prompt and provider
    return hashlib.md5(f"{prompt}:{provider or 'auto'}".encode()).hexdigest()

async def log_generation(
    user_id: int,
    project_id: int | None,
    prompt: str,
    result: str,
    model: str,
    tokens: int | None,
    db: asyncpg.Connection
):
    query = """
        INSERT INTO ai_generation_history 
        (user_id, project_id, prompt, result, model, tokens_used)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING id
    """
    await db.fetchval(
        query,
        user_id,
        project_id,
        prompt,
        result,
        model,
        tokens
    )

async def get_ai_response(
    prompt: str,
    provider: str = None,
    request: Request = None,
    user_id: int = None,
    project_id: int = None,
    db: asyncpg.Connection = None
) -> str:
    # Apply rate limiting
    client_id = request.client.host if request else "default"
    rate_limiter.check_rate_limit(client_id)
    
    # Check cache first
    cache_key = generate_cache_key(prompt, provider)
    cached_response = ai_cache.get(cache_key)
    if cached_response:
        if db and user_id:
            await log_generation(
                user_id=user_id,
                project_id=project_id,
                prompt=prompt,
                result=cached_response,
                model="cache",
                tokens=None,
                db=db
            )
        return cached_response
        
    try:
        if provider == "ollama" or (USE_OLLAMA and not provider):
            response = await try_ollama(prompt)
            ai_cache.set(cache_key, response)
            if db and user_id:
                await log_generation(
                    user_id=user_id,
                    project_id=project_id,
                    prompt=prompt,
                    result=response,
                    model="llama2",
                    tokens=None,
                    db=db
                )
            return response
        else:
            response = await try_gemini(prompt)
            ai_cache.set(cache_key, response)
            if db and user_id:
                await log_generation(
                    user_id=user_id,
                    project_id=project_id,
                    prompt=prompt,
                    result=response,
                    model="gemini-pro",
                    tokens=None,
                    db=db
                )
            return response
    except Exception as e:
        if provider == "ollama":
            raise
        response = await try_gemini(prompt)
        ai_cache.set(cache_key, response)
        if db and user_id:
            await log_generation(
                user_id=user_id,
                project_id=project_id,
                prompt=prompt,
                result=response,
                model="gemini-pro",
                tokens=None,
                db=db
            )
        return response

async def get_current_user(authorization: Optional[str] = Header(None)) -> int:
    if not authorization or not authorization.startswith('Bearer '):
        raise HTTPException(
            status_code=401,
            detail="Missing or invalid authentication token"
        )
    
    token = authorization.split(' ')[1]
    try:
        payload = jwt.decode(
            token, 
            os.getenv('JWT_SECRET', 'your-secret-key'), 
            algorithms=['HS256']
        )
        user_id = payload.get('user_id')
        if not user_id:
            raise HTTPException(status_code=401, detail="Invalid user token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid authentication token")

@router.post("/generate-script")
async def generate_script(
    request: AIRequest,
    req: Request,
    db: asyncpg.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user)
) -> dict:
    prompt = f"""Create a script with the following requirements:
Title: {request.prompt}
Format: Standard screenplay format
Include:
- Scene descriptions
- Character dialogue
- Action sequences
- Emotional beats"""

    try:
        response = await get_ai_response(
            prompt,
            request.provider,
            req,
            user_id,
            None,  # project_id is optional
            db
        )
        return {"content": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze-script")
async def analyze_script(
    request: AIRequest,
    req: Request,
    db: asyncpg.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user)
) -> dict:
    try:
        response = await get_ai_response(request.prompt, request.provider, req, user_id, None, db)
        return {"analysis": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/generate-character")
async def generate_character_background(
    character: CharacterBase,
    request: Request,
    db: asyncpg.Connection = Depends(get_db),
    user_id: int = Depends(get_current_user)
) -> dict:
    prompt = f"""Create a detailed character profile for:
Name: {character.name}
Role: {character.role or 'Unknown'}
Description: {character.description or 'Not provided'}
Include:
- Backstory
- Personality traits
- Motivations
- Goals
- Conflicts"""

    try:
        response = await get_ai_response(prompt, None, request, user_id, None, db)
        return {"background": response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
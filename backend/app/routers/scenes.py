from fastapi import APIRouter, HTTPException, Depends
from typing import List
import asyncpg
from app.models.models import Scene, SceneCreate
from app.db import get_db

router = APIRouter(prefix="/scenes", tags=["scenes"])

@router.post("", response_model=Scene)
async def create_scene(scene: SceneCreate, db: asyncpg.Connection = Depends(get_db)):
    query = """
        INSERT INTO scenes (project_id, title, sequence_number, content, notes)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, project_id, title, sequence_number, content, notes, status, created_at, updated_at
    """
    try:
        record = await db.fetchrow(
            query,
            scene.project_id,
            scene.title,
            scene.sequence_number,
            scene.content,
            scene.notes
        )
        return Scene(**dict(record))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/{project_id}", response_model=List[Scene])
async def get_project_scenes(project_id: int, db: asyncpg.Connection = Depends(get_db)):
    query = """
        SELECT id, project_id, title, sequence_number, content, notes, status, created_at, updated_at
        FROM scenes
        WHERE project_id = $1
        ORDER BY sequence_number
    """
    try:
        records = await db.fetch(query, project_id)
        return [Scene(**dict(record)) for record in records]
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.put("/{scene_id}", response_model=Scene)
async def update_scene(
    scene_id: int,
    scene_update: SceneCreate,
    db: asyncpg.Connection = Depends(get_db)
):
    query = """
        UPDATE scenes
        SET title = $1, sequence_number = $2, content = $3, notes = $4
        WHERE id = $5
        RETURNING id, project_id, title, sequence_number, content, notes, status, created_at, updated_at
    """
    try:
        record = await db.fetchrow(
            query,
            scene_update.title,
            scene_update.sequence_number,
            scene_update.content,
            scene_update.notes,
            scene_id
        )
        if record is None:
            raise HTTPException(status_code=404, detail="Scene not found")
        return Scene(**dict(record))
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/{scene_id}")
async def delete_scene(scene_id: int, db: asyncpg.Connection = Depends(get_db)):
    query = "DELETE FROM scenes WHERE id = $1 RETURNING id"
    try:
        record = await db.fetchrow(query, scene_id)
        if record is None:
            raise HTTPException(status_code=404, detail="Scene not found")
        return {"message": "Scene deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
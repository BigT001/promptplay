import pytest
from fastapi.testclient import TestClient
from typing import Dict, Any

@pytest.mark.asyncio
async def test_create_scene(client: TestClient, db: Any):
    # Create test project first
    project_data = {
        "title": "Test Project",
        "user_id": 1
    }
    await db.execute(
        "INSERT INTO projects (title, user_id) VALUES ($1, $2) RETURNING id",
        project_data["title"],
        project_data["user_id"]
    )
    
    # Test scene creation
    scene_data = {
        "project_id": 1,
        "title": "Test Scene",
        "sequence_number": 1,
        "content": "Scene content",
        "notes": "Scene notes"
    }
    
    response = client.post("/scenes", json=scene_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["title"] == scene_data["title"]
    assert data["content"] == scene_data["content"]
    assert data["sequence_number"] == scene_data["sequence_number"]

@pytest.mark.asyncio
async def test_get_project_scenes(client: TestClient, db: Any):
    # Create test scenes
    project_id = 1
    scenes = [
        ("Scene 1", 1),
        ("Scene 2", 2),
        ("Scene 3", 3)
    ]
    
    for title, seq in scenes:
        await db.execute(
            """
            INSERT INTO scenes (project_id, title, sequence_number)
            VALUES ($1, $2, $3)
            """,
            project_id, title, seq
        )
    
    response = client.get(f"/scenes/{project_id}")
    assert response.status_code == 200
    data = response.json()
    
    assert len(data) == 3
    assert [scene["title"] for scene in data] == ["Scene 1", "Scene 2", "Scene 3"]
    assert [scene["sequence_number"] for scene in data] == [1, 2, 3]

@pytest.mark.asyncio
async def test_update_scene(client: TestClient, db: Any):
    # Create test scene
    scene_id = await db.fetchval(
        """
        INSERT INTO scenes (project_id, title, sequence_number)
        VALUES ($1, $2, $3)
        RETURNING id
        """,
        1, "Original Title", 1
    )
    
    update_data = {
        "project_id": 1,
        "title": "Updated Title",
        "sequence_number": 1,
        "content": "Updated content",
        "notes": "Updated notes"
    }
    
    response = client.put(f"/scenes/{scene_id}", json=update_data)
    assert response.status_code == 200
    data = response.json()
    
    assert data["title"] == update_data["title"]
    assert data["content"] == update_data["content"]
    assert data["notes"] == update_data["notes"]

@pytest.mark.asyncio
async def test_delete_scene(client: TestClient, db: Any):
    # Create test scene
    scene_id = await db.fetchval(
        """
        INSERT INTO scenes (project_id, title, sequence_number)
        VALUES ($1, $2, $3)
        RETURNING id
        """,
        1, "Scene to Delete", 1
    )
    
    response = client.delete(f"/scenes/{scene_id}")
    assert response.status_code == 200
    
    # Verify scene was deleted
    scene = await db.fetchrow("SELECT * FROM scenes WHERE id = $1", scene_id)
    assert scene is None
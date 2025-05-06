import pytest
import asyncio
import asyncpg
from fastapi.testclient import TestClient
from typing import AsyncGenerator, Generator
from app.main import app
from app.db import get_db

# Test database configuration
TEST_DATABASE_URL = "postgresql://postgres:Mastercode@localhost:5432/promptplay_test"

@pytest.fixture(scope="session")
def event_loop() -> Generator:
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db_pool():
    pool = await asyncpg.create_pool(TEST_DATABASE_URL)
    yield pool
    await pool.close()

@pytest.fixture
async def db(db_pool) -> AsyncGenerator:
    async with db_pool.acquire() as conn:
        transaction = conn.transaction()
        await transaction.start()
        try:
            yield conn
        finally:
            await transaction.rollback()

@pytest.fixture
async def client(db) -> Generator:
    async def _get_test_db():
        yield db
    
    app.dependency_overrides[get_db] = _get_test_db
    with TestClient(app) as test_client:
        yield test_client
    app.dependency_overrides.clear()
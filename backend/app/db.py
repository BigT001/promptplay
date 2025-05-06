import os
import asyncpg
from typing import AsyncGenerator

async def get_db() -> AsyncGenerator[asyncpg.Connection, None]:
    conn = await asyncpg.connect(
        user=os.getenv("PGUSER", "postgres"),
        password=os.getenv("PGPASSWORD", "Mastercode@"),
        database=os.getenv("PGDATABASE", "promptplay"),
        host=os.getenv("PGHOST", "localhost"),
        port=int(os.getenv("PGPORT", "5432"))
    )
    try:
        yield conn
    finally:
        await conn.close()

async def create_tables():
    """Create database tables if they don't exist"""
    conn = await asyncpg.connect(
        user=os.getenv("PGUSER", "postgres"),
        password=os.getenv("PGPASSWORD", "Mastercode@"),
        database=os.getenv("PGDATABASE", "promptplay"),
        host=os.getenv("PGHOST", "localhost"),
        port=int(os.getenv("PGPORT", "5432"))
    )
    try:
        # Read schema.sql
        schema_path = os.path.join(os.path.dirname(__file__), "..", "..", "frontend", "database", "schema.sql")
        with open(schema_path, "r", encoding="utf-8") as f:
            schema = f.read()
            
        # Execute the entire schema as a single transaction
        async with conn.transaction():
            try:
                await conn.execute(schema)
            except asyncpg.DuplicateObjectError:
                # If objects already exist, ignore the error
                pass
    finally:
        await conn.close()
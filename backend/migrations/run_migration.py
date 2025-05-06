import asyncpg
import asyncio
import os
from dotenv import load_dotenv

async def run_migration():
    # Load environment variables from .env file
    load_dotenv()
    
    # Connect to database using environment variables or defaults
    conn = await asyncpg.connect(
        user=os.getenv('PGUSER', 'postgres'),
        password=os.getenv('PGPASSWORD', 'Mastercode@'),
        database=os.getenv('PGDATABASE', 'promptplay'),
        host=os.getenv('PGHOST', 'localhost'),
        port=int(os.getenv('PGPORT', 5432))
    )
    
    try:
        # First create the updated_at trigger function if it doesn't exist
        await conn.execute("""
            CREATE OR REPLACE FUNCTION update_updated_at_column()
            RETURNS TRIGGER AS $$
            BEGIN
                NEW.updated_at = CURRENT_TIMESTAMP;
                RETURN NEW;
            END;
            $$ language 'plpgsql';
        """)
        
        # Read and execute migration SQL
        with open('migrations/add_missing_tables.sql', 'r') as file:
            sql = file.read()
            
        # Run migration in a transaction
        async with conn.transaction():
            await conn.execute(sql)
            print("✅ Migration completed successfully!")
            
        # Verify the tables were created
        tables = await conn.fetch("""
            SELECT table_name, 
                   (SELECT count(*) FROM information_schema.columns WHERE table_name = t.table_name) as column_count
            FROM information_schema.tables t
            WHERE table_schema = 'public'
            AND table_name IN ('characters', 'scenes', 'ai_generation_history')
        """)
        
        print("\nCreated tables:")
        for table in tables:
            print(f"- {table['table_name']} ({table['column_count']} columns)")
            
    except Exception as e:
        print(f"❌ Error during migration: {str(e)}")
    finally:
        await conn.close()

if __name__ == "__main__":
    asyncio.run(run_migration())
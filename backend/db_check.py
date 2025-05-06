import asyncpg
import asyncio

async def check_database():
    # Connect to the database
    conn = await asyncpg.connect(
        user='postgres',
        password='Mastercode@',
        database='promptplay',
        host='localhost',
        port=5432
    )
    
    # Get all tables
    tables = await conn.fetch("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
    """)
    
    print("\nExisting tables:")
    for table in tables:
        print(f"\n=== {table['table_name']} ===")
        # Get columns for each table
        columns = await conn.fetch("""
            SELECT column_name, data_type, character_maximum_length
            FROM information_schema.columns 
            WHERE table_name = $1
        """, table['table_name'])
        
        for col in columns:
            print(f"- {col['column_name']}: {col['data_type']}")
    
    await conn.close()

if __name__ == "__main__":
    asyncio.run(check_database())
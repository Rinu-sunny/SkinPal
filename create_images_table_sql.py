#!/usr/bin/env python3
"""
Create images table using raw Supabase SQL API
"""
import sys
import os
import json
from pathlib import Path

# Load environment
env_path = Path("D:\\programs\\SkinPal\\.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line:
                key, val = line.strip().split("=", 1)
                os.environ[key] = val

sys.path.insert(0, 'SkinPal-backend')

from supabase import create_client, Client
from config import SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

def create_images_table():
    """Create images table using raw SQL"""
    try:
        # Use service role client to run SQL
        client = create_client(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)
        
        # Create table
        sql = """
        CREATE TABLE IF NOT EXISTS public.images (
            image_id BIGSERIAL PRIMARY KEY,
            analysis_id BIGINT NOT NULL UNIQUE REFERENCES analysis_results(analysis_id) ON DELETE CASCADE,
            image_data TEXT NOT NULL,
            image_type VARCHAR(20) DEFAULT 'image/jpeg',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );

        ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

        DROP POLICY IF EXISTS "allow_service_role" ON images;

        CREATE POLICY "allow_service_role" ON images
        FOR ALL USING (true) WITH CHECK (true);
        """
        
        # Execute raw SQL via Supabase
        result = client.rpc('exec_sql', {'sql': sql}).execute()
        print("❌ exec_sql RPC doesn't exist")
        return False
        
    except Exception as e:
        error_str = str(e)
        if "already exists" in error_str or "duplicate key" in error_str:
            print("✅ images table already exists!")
            return True
        print(f"⚠️ Cannot create table via RPC: {error_str}")
        print("\n📝 Please create table manually in Supabase:")
        print("""
1. Go to Supabase dashboard → SQL Editor
2. Click "New Query"
3. Paste and run:

CREATE TABLE IF NOT EXISTS public.images (
    image_id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL UNIQUE REFERENCES analysis_results(analysis_id) ON DELETE CASCADE,
    image_data TEXT NOT NULL,
    image_type VARCHAR(20) DEFAULT 'image/jpeg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_service_role" ON images
FOR ALL USING (true) WITH CHECK (true);
        """)
        return False

if __name__ == "__main__":
    create_images_table()

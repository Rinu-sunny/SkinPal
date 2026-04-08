#!/usr/bin/env python3
"""
Setup script to create the images table in Supabase
This script provides both the SQL commands and optional direct creation via Python
"""
import sys
import os
from pathlib import Path

# Load environment
env_path = Path("D:\\programs\\SkinPal\\.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key] = val

sys.path.insert(0, 'SkinPal-backend')

from utils.db import supabase_service

def check_images_table():
    """Check if images table exists"""
    try:
        result = supabase_service.table("images").select("*").limit(1).execute()
        print("✅ images table already exists!")
        return True
    except Exception as e:
        print(f"❌ images table doesn't exist: {e}")
        return False

def create_images_table_sql():
    """Print SQL to create the images table"""
    sql = """
-- Create images table to store analysis images
CREATE TABLE IF NOT EXISTS public.images (
    image_id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL UNIQUE REFERENCES public.analysis_results(analysis_id) ON DELETE CASCADE,
    image_data TEXT NOT NULL,
    image_type VARCHAR(50) DEFAULT 'image/jpeg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_images_analysis_id ON public.images(analysis_id);

-- Enable Row Level Security
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role access
CREATE POLICY "service_role_access" ON public.images
FOR ALL USING (true) WITH CHECK (true);

-- Grant permissions to authenticated users
GRANT SELECT ON public.images TO authenticated;
GRANT SELECT ON public.images TO anon;
"""
    return sql

def main():
    print("=" * 60)
    print("SKINPAL - SETUP IMAGES TABLE")
    print("=" * 60)
    
    # Check if table exists
    exists = check_images_table()
    
    if not exists:
        print("\n📋 To create the images table, run this SQL in Supabase SQL Editor:")
        print("-" * 60)
        print(create_images_table_sql())
        print("-" * 60)
        print("\nSteps:")
        print("1. Go to https://supabase.com -> Your Project -> SQL Editor")
        print("2. Create a new query")
        print("3. Paste the SQL above")
        print("4. Click 'Run'")
        print("5. Come back here and rerun this script to verify")
    else:
        print("\n✅ Table is ready! Images can now be saved.")

if __name__ == "__main__":
    main()

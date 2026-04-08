#!/usr/bin/env python3
"""
Create images table in Supabase to store image data
"""
import sys
import os
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

from utils.db import supabase_service

def create_images_table():
    """Create images table if it doesn't exist"""
    try:
        # Try to select from images table to see if it exists
        result = supabase_service.table("images").select("*").limit(1).execute()
        print("✅ images table already exists!")
        return True
    except:
        print("📝 images table doesn't exist - creating...")
        print("""
To create the images table manually in Supabase:

1. Go to SQL Editor in Supabase dashboard
2. Run this SQL:

CREATE TABLE IF NOT EXISTS public.images (
    image_id BIGSERIAL PRIMARY KEY,
    analysis_id BIGINT NOT NULL REFERENCES analysis_results(analysis_id) ON DELETE CASCADE,
    image_data BYTEA NOT NULL,
    image_type VARCHAR(20) DEFAULT 'image/jpeg',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(analysis_id)
);

ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "allow_service_role" ON images
FOR ALL USING (true) WITH CHECK (true);

3. Also add skincare_tips field to analysis_results table:

ALTER TABLE public.analysis_results 
ADD COLUMN skincare_tips JSONB DEFAULT NULL;
        """)
        return False

if __name__ == "__main__":
    create_images_table()

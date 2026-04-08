#!/usr/bin/env python3
"""
Setup script to add analysis_id to uploaded_images table in Supabase
"""

def get_migration_sql():
    """Return SQL to add analysis_id column to uploaded_images"""
    return """
-- Add analysis_id column to uploaded_images table to link images to analyses
ALTER TABLE public.uploaded_images 
ADD COLUMN IF NOT EXISTS analysis_id BIGINT REFERENCES public.analysis_results(analysis_id) ON DELETE SET NULL;

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_uploaded_images_analysis_id ON public.uploaded_images(analysis_id);

-- Verify the column was added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'uploaded_images' ORDER BY ordinal_position;
"""

def main():
    print("=" * 60)
    print("SKINPAL - UPDATE UPLOADED_IMAGES TABLE")
    print("=" * 60)
    print("\n📋 To add analysis_id to uploaded_images table, run this SQL in Supabase SQL Editor:")
    print("-" * 60)
    print(get_migration_sql())
    print("-" * 60)
    print("\nSteps:")
    print("1. Go to https://supabase.com -> Your Project -> SQL Editor")
    print("2. Create a new query")
    print("3. Paste the SQL above")
    print("4. Click 'Run'")
    print("5. Verify the column was added (check the SELECT statement results)")

if __name__ == "__main__":
    main()

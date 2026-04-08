#!/usr/bin/env python3
"""
SQL migration to add missing columns to analysis_results table
"""

def get_migration_sql():
    """Return SQL to add missing columns"""
    return """
-- Add image_id column to analysis_results (if not already present)
ALTER TABLE public.analysis_results 
ADD COLUMN IF NOT EXISTS image_id BIGINT REFERENCES public.uploaded_images(image_id) ON DELETE SET NULL;

-- Add skincare_tips column to analysis_results (if not already present)
ALTER TABLE public.analysis_results 
ADD COLUMN IF NOT EXISTS skincare_tips JSONB DEFAULT NULL;

-- Verify columns were added
SELECT column_name, data_type FROM information_schema.columns 
WHERE table_name = 'analysis_results' AND column_name IN ('image_id', 'skincare_tips')
ORDER BY ordinal_position;
"""

def main():
    print("=" * 70)
    print("SKINPAL - ADD MISSING COLUMNS TO ANALYSIS_RESULTS TABLE")
    print("=" * 70)
    print("\n📋 Run this SQL in Supabase SQL Editor to add missing columns:")
    print("-" * 70)
    print(get_migration_sql())
    print("-" * 70)
    print("\nSteps:")
    print("1. Go to https://supabase.com -> Your Project -> SQL Editor")
    print("2. Create a new query")
    print("3. Paste the SQL above")
    print("4. Click 'Run'")
    print("\n✓ After this, new skin analyses will:")
    print("  - Save images to uploaded_images table")
    print("  - Store skincare tips in analysis_results")
    print("  - Link everything together")

if __name__ == "__main__":
    main()

#!/usr/bin/env python3
"""
Fix uploaded_images table to have proper auto-incrementing image_id
"""

def get_migration_sql():
    """Return SQL to fix the uploaded_images table"""
    return """
-- Check current table structure
SELECT column_name, data_type, is_nullable, column_default 
FROM information_schema.columns 
WHERE table_name = 'uploaded_images'
ORDER BY ordinal_position;

-- If image_id is not BIGSERIAL, we'll need to recreate it
-- First, let's backup the data
CREATE TEMP TABLE uploaded_images_backup AS SELECT * FROM public.uploaded_images;

-- Drop the old table
DROP TABLE IF EXISTS public.uploaded_images CASCADE;

-- Recreate with proper schema
CREATE TABLE public.uploaded_images (
    image_id BIGSERIAL PRIMARY KEY,
    image_url TEXT NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    user_id UUID,
    analysis_id BIGINT REFERENCES public.analysis_results(analysis_id) ON DELETE SET NULL
);

-- Enable RLS
ALTER TABLE public.uploaded_images ENABLE ROW LEVEL SECURITY;

-- Create policy
CREATE POLICY "service_role_access" ON public.uploaded_images
FOR ALL USING (true) WITH CHECK (true);

-- Restore data if any (without image_id as it will auto-generate)
INSERT INTO public.uploaded_images (image_url, user_id, analysis_id) 
SELECT image_url, user_id, analysis_id FROM uploaded_images_backup
WHERE image_url IS NOT NULL;

-- Create index
CREATE INDEX idx_uploaded_images_user_id ON public.uploaded_images(user_id);
CREATE INDEX idx_uploaded_images_analysis_id ON public.uploaded_images(analysis_id);

-- Verify the table
SELECT * FROM public.uploaded_images LIMIT 5;
"""

def main():
    print("=" * 70)
    print("SKINPAL - FIX UPLOADED_IMAGES TABLE STRUCTURE")
    print("=" * 70)
    print("\n⚠️  IMPORTANT: This will recreate the uploaded_images table!")
    print("\n📋 Run this SQL in Supabase SQL Editor:")
    print("-" * 70)
    print(get_migration_sql())
    print("-" * 70)
    print("\nAfter running this:")
    print("1. The image_id column will properly auto-increment")
    print("2. New images can be inserted without specifying image_id")
    print("3. Images will be properly linked to analyses")

if __name__ == "__main__":
    main()

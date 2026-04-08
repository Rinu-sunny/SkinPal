-- Fix uploaded_images to have proper auto-incrementing image_id
-- Drop the old sequence if it exists
DROP SEQUENCE IF EXISTS public.uploaded_images_image_id_seq CASCADE;

-- Create a new sequence for image_id
CREATE SEQUENCE public.uploaded_images_image_id_seq
    START 1
    INCREMENT 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

-- Alter the image_id column to use the sequence
ALTER TABLE public.uploaded_images 
ALTER COLUMN image_id SET DEFAULT nextval('public.uploaded_images_image_id_seq'::regclass);

-- Verify the fix
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'uploaded_images'
ORDER BY ordinal_position;

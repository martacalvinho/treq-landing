
-- Add TAG and LOCATION columns to the materials table
ALTER TABLE public.materials 
ADD COLUMN tag TEXT,
ADD COLUMN location TEXT;

-- Add some comments to document the purpose of these columns
COMMENT ON COLUMN public.materials.tag IS 'Tags for categorizing materials (e.g., sustainable, premium, fire-rated)';
COMMENT ON COLUMN public.materials.location IS 'Common application locations for the material (e.g., kitchen, bathroom, exterior)';

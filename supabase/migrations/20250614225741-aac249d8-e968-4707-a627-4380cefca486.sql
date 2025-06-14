
-- Add REFERENCE/SKU and DIMENSIONS columns to the materials table
ALTER TABLE public.materials 
ADD COLUMN reference_sku TEXT,
ADD COLUMN dimensions TEXT;

-- Add comments to document the purpose of these columns
COMMENT ON COLUMN public.materials.reference_sku IS 'Product reference number, SKU, or catalog number from manufacturer';
COMMENT ON COLUMN public.materials.dimensions IS 'Physical dimensions of the material (e.g., 12"x24", 2m x 1m x 10mm)';


-- Add subcategory column to materials table
ALTER TABLE public.materials 
ADD COLUMN subcategory TEXT;

-- Update existing materials to have a default subcategory based on their category
UPDATE public.materials 
SET subcategory = CASE 
  WHEN LOWER(category) LIKE '%flooring%' THEN 'Hardwood'
  WHEN LOWER(category) LIKE '%paint%' THEN 'Interior Paint'
  WHEN LOWER(category) LIKE '%surface%' THEN 'Countertops'
  WHEN LOWER(category) LIKE '%hardware%' THEN 'Cabinet Hardware'
  WHEN LOWER(category) LIKE '%lighting%' THEN 'Fixtures'
  WHEN LOWER(category) LIKE '%plumbing%' THEN 'Fixtures (sinks, faucets, toilets)'
  WHEN LOWER(category) LIKE '%glass%' OR LOWER(category) LIKE '%glazing%' THEN 'Windows'
  WHEN LOWER(category) LIKE '%millwork%' OR LOWER(category) LIKE '%carpentry%' THEN 'Built-ins'
  WHEN LOWER(category) LIKE '%stone%' THEN 'Natural Stone'
  WHEN LOWER(category) LIKE '%metal%' THEN 'Structural'
  WHEN LOWER(category) LIKE '%tile%' THEN 'Wall Tile'
  WHEN LOWER(category) LIKE '%fabric%' OR LOWER(category) LIKE '%textile%' THEN 'Upholstery'
  WHEN LOWER(category) LIKE '%ceiling%' THEN 'Tiles'
  WHEN LOWER(category) LIKE '%wall%' THEN 'Plaster'
  WHEN LOWER(category) LIKE '%exterior%' THEN 'Siding / Cladding'
  ELSE 'Other'
END
WHERE subcategory IS NULL;

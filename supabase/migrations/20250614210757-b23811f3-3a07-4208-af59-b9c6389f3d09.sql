
-- Create a table for material categories and subcategories
CREATE TABLE public.material_subcategories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  category TEXT NOT NULL,
  subcategory TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(category, subcategory)
);

-- Insert all the categories and subcategories
INSERT INTO public.material_subcategories (category, subcategory) VALUES
-- Flooring
('Flooring', 'Hardwood'),
('Flooring', 'Laminate'),
('Flooring', 'Tile'),
('Flooring', 'Carpet'),
('Flooring', 'Vinyl'),
('Flooring', 'Stone'),

-- Paint
('Paint', 'Interior Paint'),
('Paint', 'Exterior Paint'),
('Paint', 'Specialty Coatings'),

-- Surfaces
('Surfaces', 'Countertops'),
('Surfaces', 'Wall Panels'),
('Surfaces', 'Backsplashes'),
('Surfaces', 'Cladding'),

-- Hardware
('Hardware', 'Cabinet Hardware'),
('Hardware', 'Door Hardware'),
('Hardware', 'Window Hardware'),
('Hardware', 'Locks'),
('Hardware', 'Handles'),

-- Lighting
('Lighting', 'Fixtures'),
('Lighting', 'Bulbs / Lamps'),
('Lighting', 'Controls / Switches'),

-- Plumbing
('Plumbing', 'Fixtures (sinks, faucets, toilets)'),
('Plumbing', 'Pipes / Fittings'),
('Plumbing', 'Accessories'),

-- Glass & Glazing
('Glass & Glazing', 'Windows'),
('Glass & Glazing', 'Shower Glass'),
('Glass & Glazing', 'Specialty Glass'),

-- Millwork / Carpentry
('Millwork / Carpentry', 'Built-ins'),
('Millwork / Carpentry', 'Trim / Moulding'),
('Millwork / Carpentry', 'Custom Joinery'),

-- Stone
('Stone', 'Natural Stone'),
('Stone', 'Engineered Stone'),
('Stone', 'Pavers'),

-- Metalwork
('Metalwork', 'Structural'),
('Metalwork', 'Decorative'),
('Metalwork', 'Railings'),

-- Tile
('Tile', 'Wall Tile'),
('Tile', 'Floor Tile'),
('Tile', 'Mosaic Tile'),

-- Fabric / Textiles
('Fabric / Textiles', 'Upholstery'),
('Fabric / Textiles', 'Curtains'),
('Fabric / Textiles', 'Wallcoverings'),

-- Ceiling
('Ceiling', 'Tiles'),
('Ceiling', 'Panels'),
('Ceiling', 'Treatments'),

-- Wall Finishes
('Wall Finishes', 'Plaster'),
('Wall Finishes', 'Wallpaper'),
('Wall Finishes', 'Specialty Finishes'),

-- Exterior Materials
('Exterior Materials', 'Siding / Cladding'),
('Exterior Materials', 'Roofing'),
('Exterior Materials', 'Decking'),
('Exterior Materials', 'Fencing');

-- Enable RLS on the material_subcategories table
ALTER TABLE public.material_subcategories ENABLE ROW LEVEL SECURITY;

-- Create a policy that allows everyone to read material subcategories (since they're reference data)
CREATE POLICY "Allow read access to material subcategories" ON public.material_subcategories FOR SELECT USING (true);

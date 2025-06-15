
-- Add pricing and quantity columns to materials table
ALTER TABLE public.materials 
ADD COLUMN price_per_sqft numeric(10,2),
ADD COLUMN price_per_unit numeric(10,2),
ADD COLUMN unit_type text CHECK (unit_type IN ('sqft', 'unit', 'both')),
ADD COLUMN last_price_update timestamp with time zone;

-- Create a table to track price history
CREATE TABLE public.material_price_history (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id uuid NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  studio_id uuid NOT NULL,
  price_per_sqft numeric(10,2),
  price_per_unit numeric(10,2),
  unit_type text CHECK (unit_type IN ('sqft', 'unit', 'both')),
  changed_by uuid,
  change_reason text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Add quantity and pricing columns to proj_materials table
ALTER TABLE public.proj_materials 
ADD COLUMN square_feet numeric(10,2),
ADD COLUMN total_cost numeric(10,2),
ADD COLUMN cost_per_sqft numeric(10,2),
ADD COLUMN cost_per_unit numeric(10,2);

-- Create indexes for better performance
CREATE INDEX idx_material_price_history_material_id ON public.material_price_history(material_id);
CREATE INDEX idx_material_price_history_studio_id ON public.material_price_history(studio_id);
CREATE INDEX idx_material_price_history_created_at ON public.material_price_history(created_at);

-- Enable RLS on price history table
ALTER TABLE public.material_price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for price history
CREATE POLICY "Users can view price history for their studio materials" 
  ON public.material_price_history 
  FOR SELECT 
  USING (studio_id = get_user_studio_id());

CREATE POLICY "Users can insert price history for their studio materials" 
  ON public.material_price_history 
  FOR INSERT 
  WITH CHECK (studio_id = get_user_studio_id());

-- Create a function to automatically track price changes
CREATE OR REPLACE FUNCTION public.track_material_price_changes()
RETURNS TRIGGER AS $$
BEGIN
  -- Only track if pricing fields have changed
  IF (OLD.price_per_sqft IS DISTINCT FROM NEW.price_per_sqft) OR 
     (OLD.price_per_unit IS DISTINCT FROM NEW.price_per_unit) OR 
     (OLD.unit_type IS DISTINCT FROM NEW.unit_type) THEN
    
    INSERT INTO public.material_price_history (
      material_id,
      studio_id,
      price_per_sqft,
      price_per_unit,
      unit_type,
      changed_by,
      change_reason
    ) VALUES (
      NEW.id,
      NEW.studio_id,
      NEW.price_per_sqft,
      NEW.price_per_unit,
      NEW.unit_type,
      auth.uid(),
      'Material updated'
    );
    
    NEW.last_price_update = now();
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to automatically track price changes
CREATE TRIGGER trigger_track_material_price_changes
  BEFORE UPDATE ON public.materials
  FOR EACH ROW
  EXECUTE FUNCTION public.track_material_price_changes();


-- Add pricing fields to proj_materials table for project-specific pricing (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proj_materials' AND column_name = 'cost_per_sqft') THEN
        ALTER TABLE public.proj_materials ADD COLUMN cost_per_sqft NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proj_materials' AND column_name = 'cost_per_unit') THEN
        ALTER TABLE public.proj_materials ADD COLUMN cost_per_unit NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proj_materials' AND column_name = 'square_feet') THEN
        ALTER TABLE public.proj_materials ADD COLUMN square_feet NUMERIC;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'proj_materials' AND column_name = 'total_cost') THEN
        ALTER TABLE public.proj_materials ADD COLUMN total_cost NUMERIC;
    END IF;
END $$;

-- Create material price history table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.material_price_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  material_id UUID NOT NULL REFERENCES public.materials(id) ON DELETE CASCADE,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  price_per_sqft NUMERIC,
  price_per_unit NUMERIC,
  unit_type TEXT,
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on material_price_history table
ALTER TABLE public.material_price_history ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for material_price_history (drop if exists first)
DROP POLICY IF EXISTS "Users can view price history for their studio materials" ON public.material_price_history;
DROP POLICY IF EXISTS "Users can insert price history for their studio materials" ON public.material_price_history;

CREATE POLICY "Users can view price history for their studio materials" 
  ON public.material_price_history 
  FOR SELECT 
  USING (studio_id = (SELECT studio_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can insert price history for their studio materials" 
  ON public.material_price_history 
  FOR INSERT 
  WITH CHECK (studio_id = (SELECT studio_id FROM public.users WHERE id = auth.uid()));

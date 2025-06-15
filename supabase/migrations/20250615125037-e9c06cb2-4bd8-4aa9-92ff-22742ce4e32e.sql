
-- Create table to track material overages for per-material billing
CREATE TABLE public.material_overages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  studio_id UUID REFERENCES public.studios NOT NULL,
  user_id UUID REFERENCES auth.users NOT NULL,
  month_year TEXT NOT NULL, -- Format: 'YYYY-MM'
  overage_count INTEGER NOT NULL DEFAULT 0,
  total_charge DECIMAL(10,2) NOT NULL DEFAULT 0.00,
  per_material_rate DECIMAL(10,2) NOT NULL DEFAULT 5.00, -- $5 per extra material
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(studio_id, month_year)
);

-- Add Row Level Security (RLS)
ALTER TABLE public.material_overages ENABLE ROW LEVEL SECURITY;

-- Create policies for material_overages table
CREATE POLICY "Users can view their own studio overages" 
  ON public.material_overages 
  FOR SELECT 
  USING (studio_id IN (SELECT studio_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can create overages for their studio" 
  ON public.material_overages 
  FOR INSERT 
  WITH CHECK (studio_id IN (SELECT studio_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own studio overages" 
  ON public.material_overages 
  FOR UPDATE 
  USING (studio_id IN (SELECT studio_id FROM public.users WHERE id = auth.uid()));

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_material_overages
  BEFORE UPDATE ON public.material_overages
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add billing preference to studios table
ALTER TABLE public.studios 
ADD COLUMN billing_preference TEXT DEFAULT 'blocked' CHECK (billing_preference IN ('blocked', 'per_material', 'upgrade_pending'));

-- Add monthly material count tracking to studios
ALTER TABLE public.studios 
ADD COLUMN current_month_materials INTEGER DEFAULT 0,
ADD COLUMN current_month TEXT DEFAULT TO_CHAR(CURRENT_DATE, 'YYYY-MM');

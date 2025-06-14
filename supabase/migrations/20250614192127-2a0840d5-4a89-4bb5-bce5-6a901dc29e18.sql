
-- Create manufacturer_notes table
CREATE TABLE public.manufacturer_notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  manufacturer_id UUID NOT NULL REFERENCES public.manufacturers(id) ON DELETE CASCADE,
  studio_id UUID NOT NULL REFERENCES public.studios(id) ON DELETE CASCADE,
  contact_date DATE NOT NULL,
  material_discussed_id UUID REFERENCES public.materials(id) ON DELETE SET NULL,
  delivery_time TEXT,
  notes TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security
ALTER TABLE public.manufacturer_notes ENABLE ROW LEVEL SECURITY;

-- Create policy for studio users to manage their own manufacturer notes
CREATE POLICY "Studio users can manage their manufacturer notes"
  ON public.manufacturer_notes
  USING (studio_id = (SELECT studio_id FROM public.users WHERE id = auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.manufacturer_notes
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

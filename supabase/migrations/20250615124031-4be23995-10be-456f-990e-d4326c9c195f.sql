
-- Create feedback table for contact us feature
CREATE TABLE public.feedback (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users NOT NULL,
  studio_id UUID REFERENCES public.studios NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  contact_email TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add Row Level Security (RLS) to feedback table
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Create policies for feedback table
CREATE POLICY "Users can view their own feedback" 
  ON public.feedback 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create feedback" 
  ON public.feedback 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER handle_updated_at_feedback
  BEFORE UPDATE ON public.feedback
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Add new alert types for upgrade and cancellation requests
-- We'll use the existing alerts table but add new message patterns

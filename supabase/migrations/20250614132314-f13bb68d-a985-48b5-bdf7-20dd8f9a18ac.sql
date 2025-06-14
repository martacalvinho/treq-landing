
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  new_studio_id UUID;
  studio_name TEXT;
BEGIN
  -- Extract studio_name from raw_user_meta_data
  studio_name := NEW.raw_user_meta_data->>'studio_name';

  -- If studio_name is provided, create a new studio and associate the user with it
  IF studio_name IS NOT NULL AND studio_name <> '' THEN
    -- Create a new studio
    INSERT INTO public.studios (name)
    VALUES (studio_name)
    RETURNING id INTO new_studio_id;

    -- Create the user profile and link it to the new studio
    INSERT INTO public.users (id, email, first_name, last_name, role, studio_id)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      'studio_user', -- All new signups are studio_users
      new_studio_id
    );
  ELSE
    -- If no studio_name is provided, create the user without a studio_id
    INSERT INTO public.users (id, email, first_name, last_name, role, studio_id)
    VALUES (
      NEW.id,
      NEW.email,
      NEW.raw_user_meta_data->>'first_name',
      NEW.raw_user_meta_data->>'last_name',
      'studio_user',
      NULL
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

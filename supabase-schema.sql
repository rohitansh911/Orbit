-- 1. Create Users Table
CREATE TABLE users (
  uid UUID PRIMARY KEY REFERENCES auth.users(id),
  displayName TEXT,
  email TEXT,
  photoURL TEXT,
  hasCompletedOnboarding BOOLEAN DEFAULT false,
  onboardingData JSONB DEFAULT '{}',
  stats JSONB DEFAULT '{"xp": 0, "level": 1, "momentumScore": 0, "streak": 0}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Setup RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON users FOR SELECT
  USING (auth.uid() = uid);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid() = uid);

CREATE POLICY "Users can insert own profile"
  ON users FOR INSERT
  WITH CHECK (auth.uid() = uid);

-- 3. Automatic User Creation Trigger (Optional but recommended)
-- This automatically inserts a row into public.users when a new Supabase Auth user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (uid, email, displayName, photoURL)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', 
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

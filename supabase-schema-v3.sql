-- Orbit Database Schema V3: Opportunity Engine

-- 1. Global Opportunities Table
CREATE TABLE opportunities (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  company TEXT NOT NULL,
  role TEXT NOT NULL,
  location TEXT,
  remote_type TEXT CHECK (remote_type IN ('remote', 'hybrid', 'onsite')),
  salary_range TEXT,
  skills_required TEXT[] DEFAULT '{}',
  experience_level TEXT,
  description TEXT,
  tags TEXT[] DEFAULT '{}',
  url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. User Job Applications Pipeline
CREATE TABLE job_applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid UUID REFERENCES users(uid) ON DELETE CASCADE,
  opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
  status TEXT DEFAULT 'saved' CHECK (status IN ('saved', 'applied', 'interviewing', 'offer', 'rejected', 'archived')),
  ai_match_score INTEGER,
  ai_explanation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(uid, opportunity_id) -- A user can only have one application pipeline per opportunity
);

-- 3. Seed Data (Hyper-realistic Market Snapshot)
INSERT INTO opportunities (company, role, location, remote_type, salary_range, skills_required, experience_level, tags)
VALUES
('Vercel', 'Frontend Engineer (Next.js Core)', 'San Francisco, CA', 'remote', '$130k - $170k', ARRAY['React', 'Next.js', 'TypeScript', 'Tailwind'], 'mid', ARRAY['High Growth', 'Open Source']),
('OpenAI', 'Product Engineer', 'San Francisco, CA', 'hybrid', '$180k - $250k', ARRAY['React', 'Python', 'System Design'], 'senior', ARRAY['AI', 'Top Tier']),
('Linear', 'Frontend Engineer', 'Remote', 'remote', '$140k - $180k', ARRAY['React', 'TypeScript', 'GraphQL', 'MobX'], 'mid', ARRAY['Design Focused', 'Fast Paced']),
('Stripe', 'Fullstack Engineer', 'New York, NY', 'hybrid', '$150k - $200k', ARRAY['React', 'Ruby', 'TypeScript', 'SQL'], 'mid', ARRAY['Fintech', 'Established']),
('Supabase', 'Frontend Developer Advocate', 'Remote', 'remote', '$120k - $150k', ARRAY['React', 'PostgreSQL', 'Content Creation'], 'mid', ARRAY['Open Source', 'DevTools']),
('Anthropic', 'UI Engineer', 'San Francisco, CA', 'onsite', '$160k - $220k', ARRAY['React', 'TypeScript', 'Data Visualization'], 'mid', ARRAY['AI', 'Research']),
('Figma', 'Software Engineer, Editor', 'San Francisco, CA', 'hybrid', '$140k - $190k', ARRAY['C++', 'WebAssembly', 'React', 'WebGL'], 'mid', ARRAY['Design', 'Deep Tech']),
('Ramp', 'Frontend Engineer', 'New York, NY', 'hybrid', '$150k - $190k', ARRAY['React', 'TypeScript', 'Tailwind', 'REST APIs'], 'mid', ARRAY['Fintech', 'High Velocity']);

-- 4. Setup RLS
ALTER TABLE opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Opportunities are viewable by everyone"
  ON opportunities FOR SELECT
  USING (true);

CREATE POLICY "Users can manage own pipeline"
  ON job_applications FOR ALL
  USING (auth.uid() = uid);

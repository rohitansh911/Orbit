-- Orbit Database Schema V2: Progression & Memory

-- 1. User Missions Table (Tracks history of all generated missions)
CREATE TABLE user_missions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid UUID REFERENCES users(uid) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'completed', 'skipped')),
  xp_reward INTEGER DEFAULT 50,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  skipped_at TIMESTAMP WITH TIME ZONE
);

-- 2. AI Memory Events Table (Tracks behavioral insights)
CREATE TABLE ai_memory_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  uid UUID REFERENCES users(uid) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN ('mission_completed', 'mission_skipped', 'streak_milestone', 'skill_weakness_detected')),
  context TEXT NOT NULL, -- e.g., "Skipped 3 backend tasks in a row"
  impact_score INTEGER DEFAULT 0, -- Positive or negative weight for AI prompt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Setup RLS (Row Level Security)
ALTER TABLE user_missions ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_memory_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own missions"
  ON user_missions FOR ALL
  USING (auth.uid() = uid);

CREATE POLICY "Users can manage own memory"
  ON ai_memory_events FOR ALL
  USING (auth.uid() = uid);

-- Orbit Schema V4: Job Applications Enhancement
-- Run this in your Supabase SQL Editor

-- Add missing columns to job_applications table
ALTER TABLE job_applications 
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS company TEXT,
  ADD COLUMN IF NOT EXISTS role TEXT;

-- Add performance indexes
CREATE INDEX IF NOT EXISTS idx_job_applications_uid ON job_applications(uid);
CREATE INDEX IF NOT EXISTS idx_job_applications_status ON job_applications(status);
CREATE INDEX IF NOT EXISTS idx_job_applications_uid_status ON job_applications(uid, status);
CREATE INDEX IF NOT EXISTS idx_job_applications_created ON job_applications(created_at DESC);

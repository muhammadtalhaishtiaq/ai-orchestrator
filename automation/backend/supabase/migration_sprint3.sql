-- ============================================================
-- Sprint 3 Migration — Multi-Project SaaS
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    color TEXT DEFAULT '#6366F1',
    icon TEXT DEFAULT 'zap',
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
CREATE INDEX IF NOT EXISTS idx_projects_user ON projects(user_id);

-- Add project_id to pipelines
ALTER TABLE pipelines ADD COLUMN IF NOT EXISTS project_id UUID REFERENCES projects(id) ON DELETE SET NULL;
CREATE INDEX IF NOT EXISTS idx_pipelines_project ON pipelines(project_id);

-- Add plan/tier to user_profiles (for future billing, all unlimited for now)
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS plan TEXT DEFAULT 'unlimited';
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ============================================================
-- Sprint 4 Addition — User Settings (API keys, notifications)
-- ============================================================

CREATE TABLE IF NOT EXISTS user_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
    api_keys JSONB DEFAULT '{}',
    notification_prefs JSONB DEFAULT '{"pipeline_success": true, "pipeline_failure": true, "weekly_digest": false}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);
CREATE INDEX IF NOT EXISTS idx_user_settings_user ON user_settings(user_id);

-- pipeline_runs needs user_id index for analytics queries
CREATE INDEX IF NOT EXISTS idx_pipeline_runs_user_started ON pipeline_runs(user_id, started_at DESC);

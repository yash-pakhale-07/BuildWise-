CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  preferred_language TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT now()
);

ALTER TABLE users
ADD COLUMN IF NOT EXISTS password_hash TEXT;

CREATE TABLE IF NOT EXISTS ideas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  raw_text TEXT NOT NULL,
  novelty_score INT,
  feasibility_notes TEXT,
  status TEXT DEFAULT 'validating', -- validating | researching | planned | scaffolded
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS research_clusters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  cluster_type TEXT NOT NULL, -- existing_solutions | academic | oss | gaps
  summary TEXT,
  sources JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS project_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  idea_id UUID REFERENCES ideas(id),
  architecture JSONB,
  tech_stack JSONB,
  milestones JSONB,
  datasets JSONB,
  repos JSONB,
  generated_doc TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS milestones (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES project_plans(id),
  title TEXT NOT NULL,
  due_date DATE,
  status TEXT DEFAULT 'pending', -- pending | in_progress | done
  reminder_sent BOOLEAN DEFAULT false,
  github_issue_url TEXT
);

CREATE TABLE IF NOT EXISTS github_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  plan_id UUID REFERENCES project_plans(id),
  repo_url TEXT,
  starter_pr_url TEXT,
  installed_at TIMESTAMPTZ DEFAULT now(),
  last_synced_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS agent_interactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  channel TEXT, -- telegram | whatsapp | web
  message TEXT,
  direction TEXT, -- inbound | outbound
  created_at TIMESTAMPTZ DEFAULT now()
);

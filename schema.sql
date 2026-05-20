CREATE TABLE magic_tokens (
  token TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  used INTEGER DEFAULT 0
);

CREATE TABLE sessions (
  session_id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  last_seen INTEGER NOT NULL
);

CREATE TABLE characters (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_key TEXT,
  updated_at INTEGER NOT NULL,
  updated_by TEXT
, chatgpt_prompt TEXT, notes TEXT, candidate_keys TEXT, status TEXT DEFAULT 'pending');

CREATE TABLE shots (
  id INTEGER PRIMARY KEY,
  title TEXT NOT NULL,
  time_code TEXT,
  shot_type TEXT,
  aspect TEXT,
  description TEXT,
  chatgpt_prompt TEXT,
  flow_motion_prompt TEXT,
  notes TEXT,
  character_refs TEXT,
  status TEXT DEFAULT 'pending',
  winner_image_key TEXT,
  start_frame_key TEXT,
  end_frame_key TEXT,
  candidate_keys TEXT,
  updated_at INTEGER,
  updated_by TEXT
, video_candidate_keys TEXT, winner_video_key TEXT, vo_quote TEXT, vo_who TEXT);

CREATE TABLE comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  shot_id INTEGER NOT NULL,
  email TEXT NOT NULL,
  body TEXT NOT NULL,
  created_at INTEGER NOT NULL
);

CREATE INDEX idx_comments_shot ON comments(shot_id);

CREATE INDEX idx_tokens_email ON magic_tokens(email);

CREATE TABLE style_refs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        image_key TEXT NOT NULL,
        label TEXT,
        sort_order INTEGER DEFAULT 0,
        uploaded_at INTEGER NOT NULL,
        uploaded_by TEXT
    );

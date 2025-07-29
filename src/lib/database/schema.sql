-- Activities table for storing user activities
CREATE TABLE IF NOT EXISTS activities (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL,
  points INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Index for faster queries by timestamp
CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp);

-- Index for faster queries by category
CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category);

-- Index for faster queries by date (for daily aggregations)
CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date(timestamp));
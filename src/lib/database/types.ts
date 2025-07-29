// Database types for Turso integration

export interface DatabaseActivity {
  id: string;
  category: string;
  name: string;
  points: number;
  timestamp: string;
  created_at: string;
  updated_at: string;
}

export interface CreateActivityInput {
  id: string;
  category: string;
  name: string;
  points: number;
  timestamp: string;
}

export interface ActivityStats {
  totalPoints: number;
  streakCount: number;
  level: number;
  activitiesCount: number;
}

export interface DailyMoodData {
  date: string;
  totalPoints: number;
  activitiesCount: number;
}
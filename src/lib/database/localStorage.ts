// LocalStorage fallback for local development
import type { DatabaseActivity, CreateActivityInput, ActivityStats, DailyMoodData } from './types';

const STORAGE_KEY = 'mood-tracker-activities';

export class LocalStorageService {
  // Get all activities from localStorage
  private getStoredActivities(): DatabaseActivity[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load activities from localStorage:', error);
      return [];
    }
  }

  // Save activities to localStorage
  private saveActivities(activities: DatabaseActivity[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(activities));
    } catch (error) {
      console.error('Failed to save activities to localStorage:', error);
    }
  }

  // Create a new activity
  async createActivity(activity: CreateActivityInput): Promise<DatabaseActivity> {
    const activities = this.getStoredActivities();
    const now = new Date().toISOString();
    
    const newActivity: DatabaseActivity = {
      ...activity,
      created_at: now,
      updated_at: now
    };

    activities.push(newActivity);
    this.saveActivities(activities);
    
    return newActivity;
  }

  // Get activities with optional filters
  async getActivities(
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<DatabaseActivity[]> {
    let activities = this.getStoredActivities();

    // Filter by date range
    if (startDate || endDate) {
      activities = activities.filter(activity => {
        const activityDate = activity.timestamp.split('T')[0];
        if (startDate && activityDate < startDate) return false;
        if (endDate && activityDate > endDate) return false;
        return true;
      });
    }

    // Sort by timestamp descending
    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    // Apply limit
    if (limit) {
      activities = activities.slice(0, limit);
    }

    return activities;
  }

  // Get activities for the last N days
  async getActivitiesForLastDays(days = 28): Promise<DatabaseActivity[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const startDateString = startDate.toISOString().split('T')[0];
    
    return this.getActivities(startDateString);
  }

  // Get daily mood data for heatmap
  async getDailyMoodData(days = 28): Promise<DailyMoodData[]> {
    const activities = await this.getActivitiesForLastDays(days);
    
    // Group activities by date
    const dailyData = new Map<string, { totalPoints: number; count: number }>();
    
    activities.forEach(activity => {
      const date = activity.timestamp.split('T')[0];
      const existing = dailyData.get(date) || { totalPoints: 0, count: 0 };
      dailyData.set(date, {
        totalPoints: existing.totalPoints + activity.points,
        count: existing.count + 1
      });
    });

    // Convert to array format
    return Array.from(dailyData.entries()).map(([date, data]) => ({
      date,
      totalPoints: data.totalPoints,
      activitiesCount: data.count
    })).sort((a, b) => b.date.localeCompare(a.date));
  }

  // Get user statistics
  async getActivityStats(): Promise<ActivityStats> {
    const activities = this.getStoredActivities();
    
    // Calculate total points
    const totalPoints = activities.reduce((sum, activity) => sum + activity.points, 0);
    
    // Calculate level (every 10 positive points)
    const level = Math.max(1, Math.floor(Math.max(0, totalPoints) / 10) + 1);
    
    // Calculate streak (consecutive days with activities)
    const uniqueDates = [...new Set(activities.map(a => a.timestamp.split('T')[0]))];
    uniqueDates.sort((a, b) => b.localeCompare(a));
    
    let streakCount = 0;
    
    for (let i = 0; i < uniqueDates.length; i++) {
      const expectedDate = new Date();
      expectedDate.setDate(expectedDate.getDate() - i);
      const expectedDateString = expectedDate.toISOString().split('T')[0];
      
      if (uniqueDates[i] === expectedDateString) {
        streakCount++;
      } else {
        break;
      }
    }

    return {
      totalPoints,
      streakCount,
      level,
      activitiesCount: activities.length
    };
  }

  // Delete an activity
  async deleteActivity(id: string): Promise<void> {
    const activities = this.getStoredActivities();
    const filtered = activities.filter(activity => activity.id !== id);
    this.saveActivities(filtered);
  }

  // Update an activity
  async updateActivity(
    id: string,
    updates: Partial<Omit<CreateActivityInput, 'id'>>
  ): Promise<DatabaseActivity> {
    const activities = this.getStoredActivities();
    const index = activities.findIndex(activity => activity.id === id);
    
    if (index === -1) {
      throw new Error(`Activity with id ${id} not found`);
    }

    const updated = {
      ...activities[index],
      ...updates,
      updated_at: new Date().toISOString()
    };

    activities[index] = updated;
    this.saveActivities(activities);
    
    return updated;
  }

  // Initialize "database" (no-op for localStorage)
  async initialize(): Promise<void> {
    // localStorage doesn't need initialization
    console.log('Using localStorage for local development');
  }
}

export const localStorageService = new LocalStorageService();
import { getDbClient, isUsingLocalStorageDB } from "./client";
import { localStorageService } from "./localStorage";
import type { createClient } from "@libsql/client";
import type {
  DatabaseActivity,
  CreateActivityInput,
  ActivityStats,
  DailyMoodData,
} from "./types";

// Activity CRUD operations
export class ActivityService {
  private getDb() {
    return getDbClient();
  }

  // Create a new activity
  async createActivity(
    activity: CreateActivityInput
  ): Promise<DatabaseActivity> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.createActivity(activity);
      }

      const now = new Date().toISOString();

      await (db as ReturnType<typeof createClient>).execute({
        sql: `
          INSERT INTO activities (id, category, name, points, timestamp, created_at, updated_at)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
        args: [
          activity.id,
          activity.category,
          activity.name,
          activity.points,
          activity.timestamp,
          now,
          now,
        ],
      });

      // Return the created activity
      const result = await (db as ReturnType<typeof createClient>).execute({
        sql: "SELECT * FROM activities WHERE id = ?",
        args: [activity.id],
      });

      return result.rows[0] as DatabaseActivity;
    } catch (error) {
      console.error("Failed to create activity:", error);
      throw error;
    }
  }

  // Get all activities, optionally filtered by date range
  async getActivities(
    startDate?: string,
    endDate?: string,
    limit?: number
  ): Promise<DatabaseActivity[]> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.getActivities(
          startDate,
          endDate,
          limit
        );
      }

      let sql = "SELECT * FROM activities";
      const args: (string | number)[] = [];

      if (startDate && endDate) {
        sql += " WHERE date(timestamp) BETWEEN date(?) AND date(?)";
        args.push(startDate, endDate);
      } else if (startDate) {
        sql += " WHERE date(timestamp) >= date(?)";
        args.push(startDate);
      } else if (endDate) {
        sql += " WHERE date(timestamp) <= date(?)";
        args.push(endDate);
      }

      sql += " ORDER BY timestamp DESC";

      if (limit) {
        sql += " LIMIT ?";
        args.push(limit);
      }

      const result = await (db as ReturnType<typeof createClient>).execute({
        sql,
        args,
      });
      return result.rows as DatabaseActivity[];
    } catch (error) {
      console.error("Failed to get activities:", error);
      throw error;
    }
  }

  // Get activities for the last N days (for heatmap)
  async getActivitiesForLastDays(days = 28): Promise<DatabaseActivity[]> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.getActivitiesForLastDays(days);
      }

      const result = await (db as ReturnType<typeof createClient>).execute({
        sql: `
          SELECT * FROM activities 
          WHERE date(timestamp) >= date('now', '-' || ? || ' days')
          ORDER BY timestamp DESC
        `,
        args: [days],
      });

      return result.rows as DatabaseActivity[];
    } catch (error) {
      console.error("Failed to get activities for last days:", error);
      throw error;
    }
  }

  // Get daily mood data for heatmap
  async getDailyMoodData(days = 28): Promise<DailyMoodData[]> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.getDailyMoodData(days);
      }

      const result = await (db as ReturnType<typeof createClient>).execute({
        sql: `
          SELECT 
            date(timestamp) as date,
            SUM(points) as totalPoints,
            COUNT(*) as activitiesCount
          FROM activities 
          WHERE date(timestamp) >= date('now', '-' || ? || ' days')
          GROUP BY date(timestamp)
          ORDER BY date(timestamp) DESC
        `,
        args: [days],
      });

      return result.rows.map((row) => ({
        date: row.date as string,
        totalPoints: Number(row.totalPoints),
        activitiesCount: Number(row.activitiesCount),
      }));
    } catch (error) {
      console.error("Failed to get daily mood data:", error);
      throw error;
    }
  }

  // Get user statistics
  async getActivityStats(): Promise<ActivityStats> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.getActivityStats();
      }

      // Get total points
      const totalResult = await (db as ReturnType<typeof createClient>).execute(
        {
          sql: "SELECT COALESCE(SUM(points), 0) as totalPoints FROM activities",
        }
      );
      const totalPoints = Number(totalResult.rows[0]?.totalPoints || 0);

      // Get activities count
      const countResult = await (db as ReturnType<typeof createClient>).execute(
        {
          sql: "SELECT COUNT(*) as count FROM activities",
        }
      );
      const activitiesCount = Number(countResult.rows[0]?.count || 0);

      // Calculate level (every 10 positive points)
      const level = Math.max(1, Math.floor(Math.max(0, totalPoints) / 10) + 1);

      // Calculate streak (consecutive days with activities)
      const streakResult = await (
        db as ReturnType<typeof createClient>
      ).execute({
        sql: `
          WITH daily_activities AS (
            SELECT date(timestamp) as activity_date
            FROM activities
            GROUP BY date(timestamp)
            ORDER BY date(timestamp) DESC
          ),
          streak_calc AS (
            SELECT 
              activity_date,
              ROW_NUMBER() OVER (ORDER BY activity_date DESC) as row_num,
              julianday(activity_date) as julian_date
            FROM daily_activities
          )
          SELECT COUNT(*) as streak
          FROM streak_calc
          WHERE julianday('now') - julian_date = row_num - 1
        `,
      });

      const streakCount = Number(streakResult.rows[0]?.streak || 0);

      return {
        totalPoints,
        streakCount,
        level,
        activitiesCount,
      };
    } catch (error) {
      console.error("Failed to get activity stats:", error);
      throw error;
    }
  }

  // Delete an activity
  async deleteActivity(id: string): Promise<void> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.deleteActivity(id);
      }

      await (db as ReturnType<typeof createClient>).execute({
        sql: "DELETE FROM activities WHERE id = ?",
        args: [id],
      });
    } catch (error) {
      console.error("Failed to delete activity:", error);
      throw error;
    }
  }

  // Update an activity
  async updateActivity(
    id: string,
    updates: Partial<Omit<CreateActivityInput, "id">>
  ): Promise<DatabaseActivity> {
    try {
      const db = this.getDb();

      if (isUsingLocalStorageDB()) {
        return await localStorageService.updateActivity(id, updates);
      }

      const fields = [];
      const args = [];

      if (updates.category) {
        fields.push("category = ?");
        args.push(updates.category);
      }
      if (updates.name) {
        fields.push("name = ?");
        args.push(updates.name);
      }
      if (updates.points !== undefined) {
        fields.push("points = ?");
        args.push(updates.points);
      }
      if (updates.timestamp) {
        fields.push("timestamp = ?");
        args.push(updates.timestamp);
      }

      fields.push("updated_at = ?");
      args.push(new Date().toISOString());
      args.push(id);

      await (db as ReturnType<typeof createClient>).execute({
        sql: `UPDATE activities SET ${fields.join(", ")} WHERE id = ?`,
        args,
      });

      // Return updated activity
      const result = await (db as ReturnType<typeof createClient>).execute({
        sql: "SELECT * FROM activities WHERE id = ?",
        args: [id],
      });

      return result.rows[0] as DatabaseActivity;
    } catch (error) {
      console.error("Failed to update activity:", error);
      throw error;
    }
  }
}

// Export singleton instance
export const activityService = new ActivityService();

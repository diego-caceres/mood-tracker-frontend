import { createClient } from "@libsql/client";
import { localStorageService, LocalStorageService } from './localStorage';

// Database client configuration
let client: ReturnType<typeof createClient> | LocalStorageService | null = null;
let isUsingLocalStorage = false;

export function getDbClient() {
  if (!client) {
    // Check for required environment variables
    const url = import.meta.env.VITE_TURSO_DATABASE_URL;
    const authToken = import.meta.env.VITE_TURSO_AUTH_TOKEN;

    if (!url) {
      throw new Error(
        "VITE_TURSO_DATABASE_URL environment variable is required"
      );
    }

    // Handle local development - use localStorage for file: URLs
    if (url.startsWith("file:")) {
      console.warn(
        "file: URLs are not supported in browser. Using localStorage for local development."
      );
      client = localStorageService;
      isUsingLocalStorage = true;
    } else {
      // Create client configuration for remote databases
      const config: Parameters<typeof createClient>[0] = {
        url,
      };

      // Add auth token if provided (required for remote Turso databases)
      if (authToken) {
        config.authToken = authToken;
      }

      client = createClient(config);
      isUsingLocalStorage = false;
    }
  }

  return client;
}

// Initialize database with schema
export async function initializeDatabase() {
  const db = getDbClient();

  try {
    if (isUsingLocalStorage) {
      // localStorage doesn't need schema creation
      await (db as LocalStorageService).initialize();
    } else {
      // Create activities table for Turso/LibSQL
      await (db as ReturnType<typeof createClient>).execute(`
        CREATE TABLE IF NOT EXISTS activities (
          id TEXT PRIMARY KEY,
          category TEXT NOT NULL,
          name TEXT NOT NULL,
          points INTEGER NOT NULL,
          timestamp TEXT NOT NULL,
          created_at TEXT NOT NULL DEFAULT (datetime('now')),
          updated_at TEXT NOT NULL DEFAULT (datetime('now'))
        )
      `);

      // Create indexes for better performance
      await (db as ReturnType<typeof createClient>).execute(`
        CREATE INDEX IF NOT EXISTS idx_activities_timestamp ON activities(timestamp)
      `);

      await (db as ReturnType<typeof createClient>).execute(`
        CREATE INDEX IF NOT EXISTS idx_activities_category ON activities(category)
      `);

      await (db as ReturnType<typeof createClient>).execute(`
        CREATE INDEX IF NOT EXISTS idx_activities_date ON activities(date(timestamp))
      `);
    }

    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
}

// Close database connection (useful for cleanup)
export function closeDbConnection() {
  if (client && !isUsingLocalStorage) {
    (client as ReturnType<typeof createClient>).close();
  }
  client = null;
  isUsingLocalStorage = false;
}

// Export helper to check if using localStorage
export function isUsingLocalStorageDB(): boolean {
  return isUsingLocalStorage;
}

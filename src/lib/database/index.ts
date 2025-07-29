// Database exports
export { getDbClient, initializeDatabase, closeDbConnection, isUsingLocalStorageDB } from './client';
export { ActivityService, activityService } from './services';
export { localStorageService } from './localStorage';
export type {
  DatabaseActivity,
  CreateActivityInput,
  ActivityStats,
  DailyMoodData
} from './types';
# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

### Core Commands
- `npm run dev` - Start development server on localhost:5173
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality checks

### Database Setup
For local development, the app automatically falls back to in-memory database if no Turso credentials are provided. For persistent data:
- Set `VITE_TURSO_DATABASE_URL` and `VITE_TURSO_AUTH_TOKEN` in `.env`
- Use `file:local.db` for local SQLite file (though browser limitations apply)

## Architecture Overview

### Database Layer
The app uses a dual-database strategy:
- **Primary**: Turso (global SQLite) for production with real-time sync
- **Fallback**: localStorage-based service for offline/local development
- **Service Layer**: `ActivityService` class abstracts database operations
- **Auto-detection**: `isUsingLocalStorageDB()` determines which backend to use

### Component Architecture
- **Route-based**: React Router v7 with `/` (Dashboard) and `/day/:date` (DayView)
- **State Management**: React Context + useState for theme, no external state library
- **Database Integration**: Components directly use `activityService` singleton

### Key Data Flow
1. Activities logged through predefined categories (8 types: Food, Exercise, Learning, etc.)
2. Each activity has points (-5 to +5) that contribute to daily mood scores
3. Gamification: Level = floor(max(totalPoints, 0) / 10) + 1, streaks from consecutive days
4. Heatmap visualization shows last 28 days of mood data

### Styling System
- **Tailwind CSS** with custom dark mode support
- **Theme Persistence**: localStorage with `theme` key
- **Dark Mode**: Controlled via `darkMode` state in App.tsx, applies `dark` class to html

### Database Schema
```sql
CREATE TABLE activities (
  id TEXT PRIMARY KEY,
  category TEXT NOT NULL,
  name TEXT NOT NULL, 
  points INTEGER NOT NULL,
  timestamp TEXT NOT NULL,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);
```

## File Structure Importance

### Database Files
- `src/lib/database/services.ts` - Main ActivityService class with CRUD operations
- `src/lib/database/client.ts` - Database connection and detection logic
- `src/lib/database/localStorage.ts` - Fallback localStorage implementation
- `src/lib/database/types.ts` - TypeScript interfaces for database entities

### Components
- `components/ActivityLogger.tsx` - Category selection and activity logging
- `components/MoodHeatmap.tsx` - Calendar visualization of mood data
- `components/GameElements.tsx` - Streak counter, level display, achievements
- `components/Dashboard.tsx` - Main view combining all elements
- `components/DayView.tsx` - Detailed view for specific date

### Routing
- `routes.tsx` - React Router v7 configuration
- `App.tsx` - Root component with theme management and layout

## Development Notes

### Environment Variables
- `VITE_TURSO_DATABASE_URL` - Turso database URL
- `VITE_TURSO_AUTH_TOKEN` - Turso auth token
- App works without these (localStorage fallback)

### TypeScript
- Strict mode enabled
- Path alias: `@/` → `./src/`
- Database types in `types.ts` for consistency

### Activity System
Activities are predefined with fixed point values. Categories:
- Food: Healthy meals (+3), Home cooking (+2), Fast food (-2), Overeating (-3)
- Exercise: Workout (+5), Walk/Run (+3), Stretch (+2), Skipped exercise (-2)
- Learning: Read book (+4), Online course (+3), New skill (+5), Procrastinated (-2)
- Self Care: Meditation (+3), Good sleep (+4), Social time (+2), Skipped self-care (-3)
- Work: Productive day (+4), Completed task (+2), Helped colleague (+3), Missed deadline (-3)
- Habits: No sugar (+2), Drink water (+1), Early rising (+2), Bad habit (-2)
- Hobbies: Creative time (+3), Nature time (+4), Music practice (+2), Missed hobby (-1)
- Mood: Great day (+5), Stress managed (+3), Anxiety (-3), Bad mood (-4)
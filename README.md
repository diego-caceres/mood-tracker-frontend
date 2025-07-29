# Mood Tracker - Dado

A gamified mood and activity tracking application built with React, TypeScript, and Tailwind CSS. Track your daily activities, visualize your mood patterns, and level up through positive habits.

## Features

### 📊 Mood Visualization
- **Heatmap Calendar**: Visual representation of your mood over the last 28 days
- **Color-coded System**: Green for positive days, red for challenging days
- **Activity-based Scoring**: Mood calculated from your daily activities

### 🎯 Activity Logging
Track activities across 8 categories:
- **Food**: Healthy meals (+3), Home cooking (+2), Fast food (-2), Overeating (-3)
- **Exercise**: Workout (+5), Walk/Run (+3), Stretch (+2), Skipped exercise (-2)
- **Learning**: Read book (+4), Online course (+3), New skill (+5), Procrastinated (-2)
- **Self Care**: Meditation (+3), Good sleep (+4), Social time (+2), Skipped self-care (-3)
- **Work**: Productive day (+4), Completed task (+2), Helped colleague (+3), Missed deadline (-3)
- **Habits**: No sugar (+2), Drink water (+1), Early rising (+2), Bad habit (-2)
- **Hobbies**: Creative time (+3), Nature time (+4), Music practice (+2), Missed hobby (-1)
- **Mood**: Great day (+5), Stress managed (+3), Anxiety (-3), Bad mood (-4)

### 🎮 Gamification Elements
- **Level System**: Level up every 10 positive points
- **Streak Counter**: Track consecutive days of activity logging
- **Achievements**: Unlock badges for consistency and milestones
- **Progress Tracking**: Visual progress bars and point system

### 🗄️ Data Persistence
- **Turso Database**: All activities stored in a fast, global SQLite database
- **Real-time Sync**: Activities saved instantly and synced across devices
- **Offline Support**: Local fallback when database is unavailable

### 🌙 Dark Mode Support
Toggle between light and dark themes for comfortable viewing.

## Tech Stack

- **Frontend**: React 18 with TypeScript
- **Database**: Turso (SQLite)
- **Styling**: Tailwind CSS with custom dark mode support
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Development**: ESLint for code quality

## Getting Started

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn
- Turso account and database (for data persistence)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mood-tracker-dado
```

2. Install dependencies:
```bash
npm install
```

3. Set up your Turso database:
   - Create a [Turso account](https://turso.tech)
   - Create a new database: `turso db create mood-tracker`
   - Get your database URL: `turso db show mood-tracker`
   - Create an auth token: `turso db tokens create mood-tracker`

4. Configure environment variables:
```bash
cp .env.example .env
```
Then edit `.env` and add your Turso credentials:
```env
VITE_TURSO_DATABASE_URL=libsql://your-database-name-your-username.turso.io
VITE_TURSO_AUTH_TOKEN=your-auth-token-here
```

5. Start the development server:
```bash
npm run dev
```

6. Open your browser and navigate to `http://localhost:5173`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Usage

1. **Select a Category**: Click on one of the 8 activity categories (Food, Exercise, Learning, etc.)
2. **Log an Activity**: Choose from predefined activities with point values
3. **View Your Progress**: Check your streak, level, and achievements
4. **Track Your Mood**: View the heatmap to see patterns over time
5. **Review Recent Activities**: See your last 5 logged activities

## Project Structure

```
src/
├── components/
│   ├── ActivityLogger.tsx    # Category selection and activity logging
│   ├── Dashboard.tsx         # Main dashboard component
│   ├── GameElements.tsx      # Streak, level, and achievements
│   ├── Header.tsx           # App header with dark mode toggle
│   └── MoodHeatmap.tsx      # Calendar heatmap visualization
├── lib/
│   ├── database/
│   │   ├── client.ts        # Turso database client setup
│   │   ├── services.ts      # Database operations and queries
│   │   ├── types.ts         # Database type definitions
│   │   ├── schema.sql       # Database schema
│   │   └── index.ts         # Database exports
│   └── utils.ts             # Utility functions
├── App.tsx                  # Main app component
├── index.tsx               # App entry point
└── index.css               # Global styles
```

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes and commit: `git commit -m 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Database

This app uses [Turso](https://turso.tech) for data persistence, which provides:
- **Global Edge Database**: SQLite replicated to multiple regions
- **Fast Queries**: Sub-10ms response times
- **Scalable**: Handles millions of reads per second
- **Serverless**: Pay only for what you use

### Database Schema

The app uses a simple `activities` table:

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

### Local Development

For local development without Turso, you can use an in-memory database:
```env
VITE_TURSO_DATABASE_URL=file:local.db
VITE_TURSO_AUTH_TOKEN=
```

**Note:** The `file:` URL scheme is not supported in browsers, so the app automatically converts `file:` URLs to use an in-memory database (`:memory:`). This means:
- ✅ The app will work immediately for development
- ⚠️ Data will be lost when you refresh the page or restart the dev server
- 💡 For persistent local data, use a real Turso database instead

## Future Enhancements

- Export mood data to JSON/CSV
- Custom activity creation
- Weekly/monthly analytics dashboard
- Social sharing features
- Mobile app version
- Activity categories customization
- Data backup and restore

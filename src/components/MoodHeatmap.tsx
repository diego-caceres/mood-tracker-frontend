import React from 'react';
import { Activity } from './Dashboard';
interface MoodHeatmapProps {
  activities: Activity[];
}
const MoodHeatmap: React.FC<MoodHeatmapProps> = ({
  activities
}) => {
  // Generate days for the last 4 weeks (28 days)
  const generateCalendarDays = () => {
    const days = [];
    const today = new Date();
    for (let i = 27; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      days.push({
        date,
        dateString: date.toISOString().split('T')[0],
        dayOfMonth: date.getDate(),
        dayName: date.toLocaleDateString('en-US', {
          weekday: 'short'
        }).substring(0, 1)
      });
    }
    return days;
  };
  const days = generateCalendarDays();
  // Calculate mood score for each day
  const getDayMood = (dateString: string) => {
    const dayActivities = activities.filter(a => a.timestamp.split('T')[0] === dateString);
    if (dayActivities.length === 0) return 0;
    const total = dayActivities.reduce((sum, activity) => sum + activity.points, 0);
    return total;
  };
  // Get color class based on mood score
  const getMoodColorClass = (score: number) => {
    if (score === 0) return 'bg-gray-100 dark:bg-gray-800';
    if (score > 10) return 'bg-green-500 dark:bg-green-600';
    if (score > 5) return 'bg-green-400 dark:bg-green-500';
    if (score > 0) return 'bg-green-300 dark:bg-green-400';
    if (score > -5) return 'bg-red-300 dark:bg-red-400';
    if (score > -10) return 'bg-red-400 dark:bg-red-500';
    return 'bg-red-500 dark:bg-red-600';
  };
  return <div className="rounded-lg border p-4 bg-card">
      <div className="grid grid-cols-7 gap-2">
        {/* Day labels (S M T W T F S) */}
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => <div key={i} className="h-8 flex items-center justify-center text-xs text-muted-foreground">
            {day}
          </div>)}
        {/* Calendar grid - first fill empty cells to align with weekdays */}
        {Array(days[0].date.getDay()).fill(null).map((_, i) => <div key={`empty-${i}`} className="h-8 md:h-10"></div>)}
        {/* Actual day squares */}
        {days.map(day => {
        const mood = getDayMood(day.dateString);
        return <div key={day.dateString} className={`h-8 md:h-10 rounded-md flex items-center justify-center relative ${getMoodColorClass(mood)}`} title={`${day.date.toLocaleDateString()}: Mood score ${mood}`}>
              <span className="text-xs absolute bottom-1 right-1 opacity-50">
                {day.dayOfMonth}
              </span>
            </div>;
      })}
      </div>
      <div className="mt-4 flex items-center justify-center gap-2 text-xs">
        <span className="text-muted-foreground">Less</span>
        <div className="w-4 h-4 rounded bg-gray-100 dark:bg-gray-800"></div>
        <div className="w-4 h-4 rounded bg-green-300 dark:bg-green-400"></div>
        <div className="w-4 h-4 rounded bg-green-400 dark:bg-green-500"></div>
        <div className="w-4 h-4 rounded bg-green-500 dark:bg-green-600"></div>
        <span className="text-muted-foreground">More</span>
      </div>
    </div>;
};
export default MoodHeatmap;
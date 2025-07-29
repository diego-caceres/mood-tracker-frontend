import React, { useState } from 'react';
import MoodHeatmap from './MoodHeatmap';
import ActivityLogger from './ActivityLogger';
import GameElements from './GameElements';
export interface Activity {
  id: string;
  category: string;
  name: string;
  points: number;
  timestamp: string;
}
const Dashboard: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [streakCount, setStreakCount] = useState(0);
  const [level, setLevel] = useState(1);
  const [totalPoints, setTotalPoints] = useState(0);
  const addActivity = (activity: Activity) => {
    setActivities(prev => [activity, ...prev]);
    setTotalPoints(prev => prev + activity.points);
    // Simple streak calculation - if we have an activity today
    const today = new Date().toISOString().split('T')[0];
    const hasActivityToday = [...activities, activity].some(a => a.timestamp.split('T')[0] === today);
    if (hasActivityToday) {
      setStreakCount(prev => prev + 1);
      // Level up every 10 positive points
      if (totalPoints + activity.points > 0 && (totalPoints + activity.points) % 10 === 0) {
        setLevel(prev => prev + 1);
      }
    }
  };
  return <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Your Mood Map</h2>
        <p className="text-sm text-muted-foreground">
          Track how you feel each day
        </p>
        <MoodHeatmap activities={activities} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Log Activity</h2>
        <p className="text-sm text-muted-foreground">
          What have you done today?
        </p>
        <ActivityLogger onAddActivity={addActivity} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Your Progress</h2>
        <p className="text-sm text-muted-foreground">Keep up the good work!</p>
        <GameElements streakCount={streakCount} level={level} totalPoints={totalPoints} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Recent Activities</h2>
        <div className="border rounded-lg overflow-hidden">
          {activities.length > 0 ? <ul className="divide-y">
              {activities.slice(0, 5).map(activity => <li key={activity.id} className="p-3 flex justify-between">
                  <div>
                    <span className="font-medium">{activity.name}</span>
                    <span className="ml-2 text-sm text-muted-foreground">
                      {activity.category}
                    </span>
                  </div>
                  <span className={activity.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}>
                    {activity.points > 0 ? '+' : ''}
                    {activity.points}
                  </span>
                </li>)}
            </ul> : <div className="p-8 text-center text-muted-foreground">
              No activities logged yet. Start tracking your day!
            </div>}
        </div>
      </section>
    </div>;
};
export default Dashboard;
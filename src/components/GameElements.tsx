import React from 'react';
import { Trophy, Zap, Award } from 'lucide-react';
interface GameElementsProps {
  streakCount: number;
  level: number;
  totalPoints: number;
}
const GameElements: React.FC<GameElementsProps> = ({
  streakCount,
  level,
  totalPoints
}) => {
  // Calculate progress to next level (every 10 points)
  const nextLevelPoints = level * 10;
  const progressPercent = Math.min(100, Math.max(0, totalPoints % 10 * 10));
  // Define achievements
  const achievements = [{
    id: 'streak3',
    name: 'Consistent',
    description: 'Log activities 3 days in a row',
    icon: <Zap size={16} className="text-yellow-500" />,
    unlocked: streakCount >= 3
  }, {
    id: 'points10',
    name: 'Starter',
    description: 'Earn 10 positive points',
    icon: <Award size={16} className="text-blue-500" />,
    unlocked: totalPoints >= 10
  }, {
    id: 'level3',
    name: 'Dedicated',
    description: 'Reach level 3',
    icon: <Trophy size={16} className="text-purple-500" />,
    unlocked: level >= 3
  }];
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Stats cards */}
      <div className="flex flex-col gap-4">
        {/* Streak card */}
        <div className="p-4 border rounded-lg bg-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-medium">Current Streak</h3>
            <div className="text-2xl font-bold">
              {streakCount} {streakCount === 1 ? 'day' : 'days'}
            </div>
          </div>
        </div>
        {/* Level card */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Level {level}</h3>
            <span className="text-sm text-muted-foreground">
              {totalPoints} total points
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-1">
            <div className="bg-primary h-2 rounded-full" style={{
            width: `${progressPercent}%`
          }}></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {nextLevelPoints - totalPoints} points to level {level + 1}
          </div>
        </div>
      </div>
      {/* Achievements */}
      <div className="border rounded-lg bg-card p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Trophy size={18} />
          Achievements
        </h3>
        <ul className="space-y-2">
          {achievements.map(achievement => <li key={achievement.id} className={`p-2 rounded-lg border flex items-center gap-2 ${achievement.unlocked ? 'bg-muted/50' : 'opacity-50'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${achievement.unlocked ? 'bg-primary/10' : 'bg-muted'}`}>
                {achievement.icon}
              </div>
              <div>
                <div className="font-medium text-sm">{achievement.name}</div>
                <div className="text-xs text-muted-foreground">
                  {achievement.description}
                </div>
              </div>
              {achievement.unlocked && <div className="ml-auto">
                  <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                </div>}
            </li>)}
        </ul>
      </div>
    </div>;
};
export default GameElements;
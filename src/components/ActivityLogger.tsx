import React, { useState } from 'react';
import { Activity } from './Dashboard';
import { Utensils, Dumbbell, Book, Coffee, Briefcase, Heart, Music, Frown } from 'lucide-react';
interface ActivityLoggerProps {
  onAddActivity: (activity: Activity) => void;
}
interface CategoryButton {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  activities: {
    name: string;
    points: number;
  }[];
}
const ActivityLogger: React.FC<ActivityLoggerProps> = ({
  onAddActivity
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories: CategoryButton[] = [{
    id: 'food',
    name: 'Food',
    icon: <Utensils size={20} />,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    activities: [{
      name: 'Healthy meal',
      points: 3
    }, {
      name: 'Home cooking',
      points: 2
    }, {
      name: 'Fast food',
      points: -2
    }, {
      name: 'Overeating',
      points: -3
    }]
  }, {
    id: 'exercise',
    name: 'Exercise',
    icon: <Dumbbell size={20} />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    activities: [{
      name: 'Workout',
      points: 5
    }, {
      name: 'Walk/Run',
      points: 3
    }, {
      name: 'Stretch',
      points: 2
    }, {
      name: 'Skipped exercise',
      points: -2
    }]
  }, {
    id: 'learning',
    name: 'Learning',
    icon: <Book size={20} />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    activities: [{
      name: 'Read book',
      points: 4
    }, {
      name: 'Online course',
      points: 3
    }, {
      name: 'New skill',
      points: 5
    }, {
      name: 'Procrastinated',
      points: -2
    }]
  }, {
    id: 'selfcare',
    name: 'Self Care',
    icon: <Heart size={20} />,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    activities: [{
      name: 'Meditation',
      points: 3
    }, {
      name: 'Good sleep',
      points: 4
    }, {
      name: 'Social time',
      points: 2
    }, {
      name: 'Skipped self-care',
      points: -3
    }]
  }, {
    id: 'work',
    name: 'Work',
    icon: <Briefcase size={20} />,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    activities: [{
      name: 'Productive day',
      points: 4
    }, {
      name: 'Completed task',
      points: 2
    }, {
      name: 'Helped colleague',
      points: 3
    }, {
      name: 'Missed deadline',
      points: -3
    }]
  }, {
    id: 'habits',
    name: 'Habits',
    icon: <Coffee size={20} />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    activities: [{
      name: 'No sugar',
      points: 2
    }, {
      name: 'Drink water',
      points: 1
    }, {
      name: 'Early rising',
      points: 2
    }, {
      name: 'Bad habit',
      points: -2
    }]
  }, {
    id: 'hobbies',
    name: 'Hobbies',
    icon: <Music size={20} />,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    activities: [{
      name: 'Creative time',
      points: 3
    }, {
      name: 'Nature time',
      points: 4
    }, {
      name: 'Music practice',
      points: 2
    }, {
      name: 'Missed hobby',
      points: -1
    }]
  }, {
    id: 'mood',
    name: 'Mood',
    icon: <Frown size={20} />,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    activities: [{
      name: 'Great day',
      points: 5
    }, {
      name: 'Stress managed',
      points: 3
    }, {
      name: 'Anxiety',
      points: -3
    }, {
      name: 'Bad mood',
      points: -4
    }]
  }];
  const handleAddActivity = (categoryId: string, activity: {
    name: string;
    points: number;
  }) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;
    const newActivity: Activity = {
      id: Date.now().toString(),
      category: category.name,
      name: activity.name,
      points: activity.points,
      timestamp: new Date().toISOString()
    };
    onAddActivity(newActivity);
    setSelectedCategory(null);
  };
  const getSelectedCategory = () => {
    return categories.find(c => c.id === selectedCategory);
  };
  return <div className="space-y-4">
      {/* Category buttons */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
        {categories.map(category => <button key={category.id} className={`p-3 rounded-lg flex flex-col items-center justify-center gap-1 transition-all ${selectedCategory === category.id ? `ring-2 ring-primary ${category.color}` : `${category.color} opacity-70 hover:opacity-100`}`} onClick={() => setSelectedCategory(category.id)}>
            {category.icon}
            <span className="text-xs font-medium">{category.name}</span>
          </button>)}
      </div>
      {/* Activity options */}
      {selectedCategory && <div className="border rounded-lg p-4 bg-card animate-accordion-down">
          <h3 className="font-medium mb-3 flex items-center gap-2">
            {getSelectedCategory()?.icon}
            {getSelectedCategory()?.name} Activities
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {getSelectedCategory()?.activities.map((activity, index) => <button key={index} className={`p-3 rounded-lg border flex justify-between items-center hover:bg-muted transition-colors`} onClick={() => handleAddActivity(selectedCategory, activity)}>
                <span>{activity.name}</span>
                <span className={`font-medium ${activity.points > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {activity.points > 0 ? '+' : ''}
                  {activity.points}
                </span>
              </button>)}
          </div>
          <button className="w-full mt-3 text-sm text-muted-foreground hover:text-foreground" onClick={() => setSelectedCategory(null)}>
            Cancel
          </button>
        </div>}
    </div>;
};
export default ActivityLogger;
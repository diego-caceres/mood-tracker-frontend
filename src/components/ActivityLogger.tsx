import React, { useState } from 'react';
import { Activity } from './Dashboard';
import { activityService, type CreateActivityInput } from '../lib/database';
import { Utensils, Dumbbell, Book, Coffee, Briefcase, Heart, Music, Frown } from 'lucide-react';

interface ActivityLoggerProps {
  onAddActivity?: (activity: Activity) => void;
  onActivityAdded?: () => void;
  targetDate?: string;
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
  onAddActivity,
  onActivityAdded,
  targetDate
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const categories: CategoryButton[] = [{
    id: 'food',
    name: 'Comida',
    icon: <Utensils size={20} />,
    color: 'bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400',
    activities: [{
      name: 'Comida saludable',
      points: 3
    }, {
      name: 'Cocinar en casa',
      points: 2
    }, {
      name: 'Comida rápida',
      points: -2
    }, {
      name: 'Comer en exceso',
      points: -3
    }]
  }, {
    id: 'exercise',
    name: 'Ejercicio',
    icon: <Dumbbell size={20} />,
    color: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    activities: [{
      name: 'Entrenar',
      points: 5
    }, {
      name: 'Caminar/Correr',
      points: 3
    }, {
      name: 'Estirar',
      points: 2
    }, {
      name: 'Saltar ejercicio',
      points: -2
    }]
  }, {
    id: 'learning',
    name: 'Aprendizaje',
    icon: <Book size={20} />,
    color: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    activities: [{
      name: 'Leer libro',
      points: 4
    }, {
      name: 'Curso online',
      points: 3
    }, {
      name: 'Nueva habilidad',
      points: 5
    }, {
      name: 'Procrastinar',
      points: -2
    }]
  }, {
    id: 'selfcare',
    name: 'Autocuidado',
    icon: <Heart size={20} />,
    color: 'bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400',
    activities: [{
      name: 'Meditación',
      points: 3
    }, {
      name: 'Buen sueño',
      points: 4
    }, {
      name: 'Tiempo social',
      points: 2
    }, {
      name: 'Saltar autocuidado',
      points: -3
    }]
  }, {
    id: 'work',
    name: 'Trabajo',
    icon: <Briefcase size={20} />,
    color: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400',
    activities: [{
      name: 'Día productivo',
      points: 4
    }, {
      name: 'Tarea completada',
      points: 2
    }, {
      name: 'Ayudar colega',
      points: 3
    }, {
      name: 'Perder fecha límite',
      points: -3
    }]
  }, {
    id: 'habits',
    name: 'Hábitos',
    icon: <Coffee size={20} />,
    color: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    activities: [{
      name: 'Sin azúcar',
      points: 2
    }, {
      name: 'Beber agua',
      points: 1
    }, {
      name: 'Levantarse temprano',
      points: 2
    }, {
      name: 'Mal hábito',
      points: -2
    }]
  }, {
    id: 'hobbies',
    name: 'Pasatiempos',
    icon: <Music size={20} />,
    color: 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
    activities: [{
      name: 'Tiempo creativo',
      points: 3
    }, {
      name: 'Tiempo en naturaleza',
      points: 4
    }, {
      name: 'Práctica musical',
      points: 2
    }, {
      name: 'Perder pasatiempo',
      points: -1
    }]
  }, {
    id: 'mood',
    name: 'Estado de Ánimo',
    icon: <Frown size={20} />,
    color: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    activities: [{
      name: 'Gran día',
      points: 5
    }, {
      name: 'Estrés controlado',
      points: 3
    }, {
      name: 'Ansiedad',
      points: -3
    }, {
      name: 'Mal humor',
      points: -4
    }]
  }];
  const handleAddActivity = async (categoryId: string, activity: {
    name: string;
    points: number;
  }) => {
    const category = categories.find(c => c.id === categoryId);
    if (!category) return;

    const activityId = Date.now().toString();
    
    // Use targetDate if provided, otherwise use current time
    let timestamp: string;
    if (targetDate) {
      // Create date in local timezone to avoid timezone shift issues
      const targetDateTime = new Date(targetDate + 'T00:00:00');
      const now = new Date();
      targetDateTime.setHours(now.getHours());
      targetDateTime.setMinutes(now.getMinutes());
      targetDateTime.setSeconds(now.getSeconds());
      timestamp = targetDateTime.toISOString();
    } else {
      timestamp = new Date().toISOString();
    }

    const newActivity: Activity = {
      id: activityId,
      category: category.name,
      name: activity.name,
      points: activity.points,
      timestamp
    };

    try {
      // Save to database
      const createInput: CreateActivityInput = {
        id: activityId,
        category: category.name,
        name: activity.name,
        points: activity.points,
        timestamp
      };
      
      await activityService.createActivity(createInput);
      
      // Call appropriate callback
      if (onAddActivity) {
        onAddActivity(newActivity);
      }
      if (onActivityAdded) {
        onActivityAdded();
      }
    } catch (error) {
      console.error('Failed to add activity:', error);
      // Still call callback for UI update even if DB save failed
      if (onAddActivity) {
        onAddActivity(newActivity);
      }
    }
    
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
            Actividades de {getSelectedCategory()?.name}
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
            Cancelar
          </button>
        </div>}
    </div>;
};
export default ActivityLogger;
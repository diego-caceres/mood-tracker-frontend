import React, { useState, useEffect } from 'react';
import MoodHeatmap from './MoodHeatmap';
import ActivityLogger from './ActivityLogger';
import GameElements from './GameElements';
import { activityService, initializeDatabase, type CreateActivityInput } from '../lib/database';
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Initialize database and load data on component mount
  useEffect(() => {
    const initializeApp = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Initialize database
        await initializeDatabase();
        
        // Load recent activities
        await loadActivities();
        
        // Load user stats
        await loadStats();
      } catch (err) {
        console.error('Failed to initialize app:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize database');
      } finally {
        setLoading(false);
      }
    };

    initializeApp();
  }, []);

  // Load activities from database
  const loadActivities = async () => {
    try {
      const dbActivities = await activityService.getActivities(undefined, undefined, 20);
      setActivities(dbActivities.map(activity => ({
        id: activity.id,
        category: activity.category,
        name: activity.name,
        points: activity.points,
        timestamp: activity.timestamp
      })));
    } catch (err) {
      console.error('Failed to load activities:', err);
    }
  };

  // Load user statistics
  const loadStats = async () => {
    try {
      const stats = await activityService.getActivityStats();
      setTotalPoints(stats.totalPoints);
      setStreakCount(stats.streakCount);
      setLevel(stats.level);
    } catch (err) {
      console.error('Failed to load stats:', err);
    }
  };

  // Add activity to database and update state
  const addActivity = async (activity: Activity) => {
    try {
      const createInput: CreateActivityInput = {
        id: activity.id,
        category: activity.category,
        name: activity.name,
        points: activity.points,
        timestamp: activity.timestamp
      };
      
      // Save to database
      await activityService.createActivity(createInput);
      
      // Update local state
      setActivities(prev => [activity, ...prev]);
      
      // Reload stats to get accurate calculations
      await loadStats();
    } catch (err) {
      console.error('Failed to add activity:', err);
      setError('Failed to save activity. Please try again.');
    }
  };
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-2">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-sm text-muted-foreground">Cargando tu rastreador de estado de ánimo...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4 max-w-md">
          <div className="text-red-500 dark:text-red-400">
            <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium">Error de Conexión a la Base de Datos</h3>
          <p className="text-sm text-muted-foreground">{error}</p>
          <p className="text-xs text-muted-foreground">
            Por favor verifica la configuración de tu base de datos Turso e intenta refrescar la página.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return <div className="space-y-6">
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Tu Mapa de Estado de Ánimo</h2>
        <p className="text-sm text-muted-foreground">
          Rastrea cómo te sientes cada día
        </p>
        <MoodHeatmap activities={activities} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Registrar Actividad</h2>
        <p className="text-sm text-muted-foreground">
          ¿Qué has hecho hoy?
        </p>
        <ActivityLogger onAddActivity={addActivity} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Tu Progreso</h2>
        <p className="text-sm text-muted-foreground">¡Sigue con el buen trabajo!</p>
        <GameElements streakCount={streakCount} level={level} totalPoints={totalPoints} />
      </section>
      <section className="space-y-2">
        <h2 className="text-lg font-medium">Actividades Recientes</h2>
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
              Aún no hay actividades registradas. ¡Comienza a rastrear tu día!
            </div>}
        </div>
      </section>
    </div>;
};
export default Dashboard;
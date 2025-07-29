import React from 'react';
import { Trophy, Zap, Award, Star, Target, Clock, Heart, Brain, Coffee, BookOpen, Users, Sparkles, Crown, Shield, Flame, Mountain, Rocket, Gem, Calendar, Sun, Moon, Gift, Music, Camera, Palette, Gamepad2, MapPin, TreePine, Waves } from 'lucide-react';
interface GameElementsProps {
  streakCount: number;
  level: number;
  totalPoints: number;
}

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  unlocked: boolean;
  progress?: number;
  maxProgress?: number;
  category: 'streak' | 'points' | 'level' | 'special';
  achievedAt?: string;
}
const GameElements: React.FC<GameElementsProps> = ({
  streakCount,
  level,
  totalPoints
}) => {
  // Calculate progress to next level (every 10 points)
  const nextLevelPoints = level * 10;
  const progressPercent = Math.min(100, Math.max(0, totalPoints % 10 * 10));
  
  // Define comprehensive achievements list
  const allAchievements: Achievement[] = [
    // Streak achievements
    { id: 'streak3', name: 'Constante', description: 'Registra actividades 3 días seguidos', icon: <Zap size={16} className="text-yellow-500" />, unlocked: streakCount >= 3, progress: streakCount, maxProgress: 3, category: 'streak' },
    { id: 'streak7', name: 'Perseverante', description: 'Mantén una racha de 7 días', icon: <Flame size={16} className="text-orange-500" />, unlocked: streakCount >= 7, progress: streakCount, maxProgress: 7, category: 'streak' },
    { id: 'streak14', name: 'Disciplinado', description: 'Racha de 2 semanas completas', icon: <Calendar size={16} className="text-red-500" />, unlocked: streakCount >= 14, progress: streakCount, maxProgress: 14, category: 'streak' },
    { id: 'streak30', name: 'Maestro de Hábitos', description: 'Un mes completo de constancia', icon: <Crown size={16} className="text-gold-500" />, unlocked: streakCount >= 30, progress: streakCount, maxProgress: 30, category: 'streak' },
    { id: 'streak50', name: 'Leyenda', description: '50 días de racha perfecta', icon: <Shield size={16} className="text-platinum-500" />, unlocked: streakCount >= 50, progress: streakCount, maxProgress: 50, category: 'streak' },
    { id: 'streak100', name: 'Centurión', description: '100 días de dedicación absoluta', icon: <Mountain size={16} className="text-diamond-500" />, unlocked: streakCount >= 100, progress: streakCount, maxProgress: 100, category: 'streak' },
    
    // Points achievements
    { id: 'points10', name: 'Principiante', description: 'Gana 10 puntos positivos', icon: <Award size={16} className="text-blue-500" />, unlocked: totalPoints >= 10, progress: totalPoints, maxProgress: 10, category: 'points' },
    { id: 'points25', name: 'Progresando', description: 'Acumula 25 puntos', icon: <Star size={16} className="text-green-500" />, unlocked: totalPoints >= 25, progress: totalPoints, maxProgress: 25, category: 'points' },
    { id: 'points50', name: 'Comprometido', description: '50 puntos de experiencia', icon: <Target size={16} className="text-purple-500" />, unlocked: totalPoints >= 50, progress: totalPoints, maxProgress: 50, category: 'points' },
    { id: 'points100', name: 'Centenar', description: '100 puntos alcanzados', icon: <Gem size={16} className="text-cyan-500" />, unlocked: totalPoints >= 100, progress: totalPoints, maxProgress: 100, category: 'points' },
    { id: 'points200', name: 'Doscientos', description: '200 puntos de progreso', icon: <Rocket size={16} className="text-indigo-500" />, unlocked: totalPoints >= 200, progress: totalPoints, maxProgress: 200, category: 'points' },
    { id: 'points500', name: 'Quinientos', description: '500 puntos maestros', icon: <Sparkles size={16} className="text-pink-500" />, unlocked: totalPoints >= 500, progress: totalPoints, maxProgress: 500, category: 'points' },
    { id: 'points1000', name: 'Milenario', description: '1000 puntos legendarios', icon: <Crown size={16} className="text-gold-600" />, unlocked: totalPoints >= 1000, progress: totalPoints, maxProgress: 1000, category: 'points' },
    
    // Level achievements (only show next level)
    { id: 'level2', name: 'Novato', description: 'Alcanza el nivel 2', icon: <Trophy size={16} className="text-bronze-500" />, unlocked: level >= 2, category: 'level' },
    { id: 'level3', name: 'Dedicado', description: 'Alcanza el nivel 3', icon: <Trophy size={16} className="text-silver-500" />, unlocked: level >= 3, category: 'level' },
    { id: 'level5', name: 'Experto', description: 'Alcanza el nivel 5', icon: <Trophy size={16} className="text-gold-400" />, unlocked: level >= 5, category: 'level' },
    { id: 'level10', name: 'Veterano', description: 'Alcanza el nivel 10', icon: <Trophy size={16} className="text-purple-400" />, unlocked: level >= 10, category: 'level' },
    { id: 'level15', name: 'Maestro', description: 'Alcanza el nivel 15', icon: <Trophy size={16} className="text-red-400" />, unlocked: level >= 15, category: 'level' },
    { id: 'level20', name: 'Campeón', description: 'Alcanza el nivel 20', icon: <Trophy size={16} className="text-diamond-400" />, unlocked: level >= 20, category: 'level' },
    { id: 'level25', name: 'Leyenda', description: 'Alcanza el nivel 25', icon: <Crown size={16} className="text-rainbow" />, unlocked: level >= 25, category: 'level' },
    
    // Special achievements
    { id: 'morning_person', name: 'Madrugador', description: 'Registra 5 actividades antes de las 8 AM', icon: <Sun size={16} className="text-yellow-400" />, unlocked: false, category: 'special' },
    { id: 'night_owl', name: 'Búho Nocturno', description: 'Registra 5 actividades después de las 10 PM', icon: <Moon size={16} className="text-indigo-400" />, unlocked: false, category: 'special' },
    { id: 'balanced', name: 'Equilibrado', description: 'Registra actividades en todas las categorías', icon: <Heart size={16} className="text-pink-400" />, unlocked: false, category: 'special' },
    { id: 'thinker', name: 'Pensador', description: 'Completa 10 actividades de aprendizaje', icon: <Brain size={16} className="text-purple-400" />, unlocked: false, category: 'special' },
    { id: 'social', name: 'Social', description: 'Registra 10 actividades sociales', icon: <Users size={16} className="text-blue-400" />, unlocked: false, category: 'special' },
    { id: 'creative', name: 'Creativo', description: 'Completa 10 actividades creativas', icon: <Palette size={16} className="text-rainbow" />, unlocked: false, category: 'special' },
    { id: 'fitness', name: 'Atlético', description: 'Registra 15 actividades de ejercicio', icon: <Mountain size={16} className="text-green-500" />, unlocked: false, category: 'special' },
    { id: 'explorer', name: 'Explorador', description: 'Visita 10 lugares diferentes', icon: <MapPin size={16} className="text-red-500" />, unlocked: false, category: 'special' },
    { id: 'nature_lover', name: 'Amante de la Naturaleza', description: '20 actividades al aire libre', icon: <TreePine size={16} className="text-green-600" />, unlocked: false, category: 'special' },
    { id: 'musician', name: 'Músico', description: 'Escucha o toca música 25 veces', icon: <Music size={16} className="text-purple-500" />, unlocked: false, category: 'special' },
    { id: 'photographer', name: 'Fotógrafo', description: 'Toma fotos en 15 ocasiones', icon: <Camera size={16} className="text-blue-500" />, unlocked: false, category: 'special' },
    { id: 'gamer', name: 'Jugador', description: 'Juega videojuegos 20 veces', icon: <Gamepad2 size={16} className="text-indigo-500" />, unlocked: false, category: 'special' },
    { id: 'bookworm', name: 'Ratón de Biblioteca', description: 'Lee durante 30 sesiones', icon: <BookOpen size={16} className="text-brown-500" />, unlocked: false, category: 'special' },
    { id: 'caffeine_addict', name: 'Adicto a la Cafeína', description: 'Registra café/té 50 veces', icon: <Coffee size={16} className="text-brown-600" />, unlocked: false, category: 'special' },
    { id: 'water_warrior', name: 'Guerrero del Agua', description: 'Mantente hidratado 40 días', icon: <Waves size={16} className="text-blue-300" />, unlocked: false, category: 'special' },
    { id: 'gift_giver', name: 'Generoso', description: 'Da regalos o ayuda 10 veces', icon: <Gift size={16} className="text-red-400" />, unlocked: false, category: 'special' }
  ];

  // Get unlocked achievements sorted by unlock date
  const unlockedAchievements = allAchievements.filter(a => a.unlocked);
  const lastThreeAchieved = unlockedAchievements.slice(-3);

  // For level achievements, only show the next one to unlock
  const levelAchievements = allAchievements.filter(a => a.category === 'level');
  const nextLevelAchievement = levelAchievements.find(a => !a.unlocked);

  // Find the closest achievement to unlock (with progress tracking)
  const progressAchievements = allAchievements.filter(a => !a.unlocked && a.maxProgress && a.progress !== undefined);
  const closestAchievement = progressAchievements.reduce((closest, current) => {
    if (!closest) return current;
    const currentProgress = (current.progress! / current.maxProgress!) * 100;
    const closestProgress = (closest.progress! / closest.maxProgress!) * 100;
    return currentProgress > closestProgress ? current : closest;
  }, null as Achievement | null);

  // Combine achievements to show: last 3 achieved + next level + closest progress
  const achievementsToShow = [
    ...lastThreeAchieved,
    ...(nextLevelAchievement && !lastThreeAchieved.includes(nextLevelAchievement) ? [nextLevelAchievement] : []),
    ...(closestAchievement && !lastThreeAchieved.includes(closestAchievement) ? [closestAchievement] : [])
  ].slice(0, 6);
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Stats cards */}
      <div className="flex flex-col gap-4">
        {/* Streak card */}
        <div className="p-4 border rounded-lg bg-card flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400">
            <Zap size={24} />
          </div>
          <div>
            <h3 className="font-medium">Racha Actual</h3>
            <div className="text-2xl font-bold">
              {streakCount} {streakCount === 1 ? 'día' : 'días'}
            </div>
          </div>
        </div>
        {/* Level card */}
        <div className="p-4 border rounded-lg bg-card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">Nivel {level}</h3>
            <span className="text-sm text-muted-foreground">
              {totalPoints} puntos totales
            </span>
          </div>
          <div className="w-full bg-muted rounded-full h-2 mb-1">
            <div className="bg-primary h-2 rounded-full" style={{
            width: `${progressPercent}%`
          }}></div>
          </div>
          <div className="text-xs text-muted-foreground">
            {nextLevelPoints - totalPoints} puntos para nivel {level + 1}
          </div>
        </div>
      </div>
      {/* Achievements */}
      <div className="border rounded-lg bg-card p-4">
        <h3 className="font-medium mb-3 flex items-center gap-2">
          <Trophy size={18} />
          Logros Recientes y Próximos
        </h3>
        <ul className="space-y-3">
          {achievementsToShow.map(achievement => <li key={achievement.id} className={`p-3 rounded-lg border ${achievement.unlocked ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-muted/30'}`}>
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${achievement.unlocked ? 'bg-green-100 dark:bg-green-800' : 'bg-muted'}`}>
                  {achievement.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <div className="font-medium text-sm">{achievement.name}</div>
                    {achievement.unlocked && <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                        <svg width="10" height="10" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M10 3L4.5 8.5L2 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>}
                  </div>
                  <div className="text-xs text-muted-foreground mb-2">
                    {achievement.description}
                  </div>
                  {!achievement.unlocked && achievement.progress !== undefined && achievement.maxProgress && (
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>{achievement.progress} / {achievement.maxProgress}</span>
                        <span>{Math.round((achievement.progress / achievement.maxProgress) * 100)}%</span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-1.5">
                        <div 
                          className="bg-primary h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${Math.min(100, (achievement.progress / achievement.maxProgress) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </li>)}
          {achievementsToShow.length === 0 && (
            <li className="p-4 text-center text-muted-foreground text-sm">
              ¡Comienza a registrar actividades para desbloquear logros!
            </li>
          )}
        </ul>
      </div>
    </div>;
};
export default GameElements;
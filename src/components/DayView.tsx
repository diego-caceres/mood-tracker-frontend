import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { activityService, type DatabaseActivity } from "../lib/database";
import ActivityLogger from "./ActivityLogger";

const DayView: React.FC = () => {
  const { date } = useParams<{ date: string }>();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<DatabaseActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActivityLogger, setShowActivityLogger] = useState(false);

  // Handle date parsing to avoid timezone issues
  const currentDate = date ? new Date(date + "T00:00:00") : new Date();
  const dateString = date || new Date().toISOString().split("T")[0];

  const loadDayActivities = useCallback(async () => {
    try {
      setLoading(true);
      const dayActivities = await activityService.getActivities(
        dateString,
        dateString
      );
      setActivities(dayActivities);
    } catch (error) {
      console.error("Failed to load day activities:", error);
    } finally {
      setLoading(false);
    }
  }, [dateString]);

  useEffect(() => {
    loadDayActivities();
  }, [loadDayActivities]);

  const navigateToDay = (offset: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    const newDateString = newDate.toISOString().split("T")[0];
    navigate(`/day/${newDateString}`);
  };

  const handleActivityAdded = () => {
    loadDayActivities();
    setShowActivityLogger(false);
  };

  const totalPoints = activities.reduce(
    (sum, activity) => sum + activity.points,
    0
  );

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("es-ES", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const isToday = dateString === new Date().toISOString().split("T")[0];

  // Get mood color class based on points (same as heatmap)
  const getMoodColorClass = (score: number) => {
    if (score === 0) return "bg-gray-100 dark:bg-gray-800";
    if (score > 10) return "bg-green-500 dark:bg-green-600";
    if (score > 5) return "bg-green-400 dark:bg-green-500";
    if (score > 0) return "bg-green-300 dark:bg-green-400";
    if (score > -5) return "bg-red-300 dark:bg-red-400";
    if (score > -10) return "bg-red-400 dark:bg-red-500";
    return "bg-red-500 dark:bg-red-600";
  };

  const getMoodLabel = (score: number) => {
    if (score === 0) return "Neutral";
    if (score > 10) return "Excelente";
    if (score > 5) return "Bueno";
    if (score > 0) return "Positivo";
    if (score > -5) return "Negativo";
    if (score > -10) return "Malo";
    return "Muy Malo";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Navigation Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigateToDay(-1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          <ChevronLeft className="w-4 h-4" />
          Anterior
        </button>

        <div className="text-center">
          <h1 className="text-2xl font-bold">{formatDate(currentDate)}</h1>
          {isToday && (
            <span className="text-sm text-muted-foreground">Hoy</span>
          )}
          <div className="flex items-center justify-center gap-3 mt-2">
            <div
              className={`w-8 h-8 rounded-full ${getMoodColorClass(
                totalPoints
              )} border-2 border-white dark:border-gray-900 shadow-sm`}
              title={`Estado de ánimo: ${getMoodLabel(totalPoints)}`}
            />
            <span className="text-sm text-muted-foreground">
              {getMoodLabel(totalPoints)}
            </span>
          </div>
        </div>

        <button
          onClick={() => navigateToDay(1)}
          className="flex items-center gap-2 px-3 py-2 rounded-lg border hover:bg-gray-50 dark:hover:bg-gray-800"
          disabled={dateString >= new Date().toISOString().split("T")[0]}
        >
          Siguiente
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Daily Summary */}
      <div className="rounded-lg border p-4 bg-card">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold">Resumen Diario</h2>
            <p className="text-muted-foreground">
              {activities.length}{" "}
              {activities.length === 1
                ? "actividad registrada"
                : "actividades registradas"}
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold">
              {totalPoints > 0 ? "+" : ""}
              {totalPoints}
            </div>
            <div className="text-sm text-muted-foreground">puntos</div>
          </div>
        </div>
      </div>

      {/* Add Activity Button */}
      <div className="flex justify-center">
        <button
          onClick={() => setShowActivityLogger(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
        >
          <Plus className="w-4 h-4" />
          Registrar Actividad para Este Día
        </button>
      </div>

      {/* Activities List */}
      <div className="space-y-3">
        <h3 className="text-lg font-semibold">Actividades</h3>
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay actividades registradas para este día
          </div>
        ) : (
          <div className="space-y-2">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="rounded-lg border p-3 bg-card flex justify-between items-center"
              >
                <div>
                  <div className="font-medium">{activity.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {activity.category} •{" "}
                    {new Date(activity.timestamp).toLocaleTimeString("es-ES", {
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div
                  className={`font-semibold ${
                    activity.points > 0 ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {activity.points > 0 ? "+" : ""}
                  {activity.points}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Activity Logger Modal */}
      {showActivityLogger && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-card rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-semibold">
                Registrar Actividad para {formatDate(currentDate)}
              </h3>
              <button
                onClick={() => setShowActivityLogger(false)}
                className="text-muted-foreground hover:text-foreground text-2xl w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                ×
              </button>
            </div>
            <div className="p-6">
              <ActivityLogger
                onActivityAdded={handleActivityAdded}
                targetDate={dateString}
              />
            </div>
          </div>
        </div>
      )}

      {/* Back to Dashboard */}
      <div className="flex justify-center pt-4">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800"
        >
          Volver al Panel
        </button>
      </div>
    </div>
  );
};

export default DayView;

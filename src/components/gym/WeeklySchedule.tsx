import React from 'react';
import { Calendar, Check, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface WeeklyScheduleProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  schedule: Record<string, string>;
  workouts: Record<string, any>;
  onAssignWorkout: (date: Date) => void;
  onDeleteWorkout: (dateKey: string) => void;
  onStartWorkout: (workoutName: string) => void;
  workoutHistory: any[];
}

const WeeklySchedule: React.FC<WeeklyScheduleProps> = ({
  selectedDate,
  onDateSelect,
  schedule,
  workouts,
  onAssignWorkout,
  onDeleteWorkout,
  onStartWorkout,
  workoutHistory
}) => {
  // Calculate current week dates
  const getWeekDates = (date: Date) => {
    const start = new Date(date);
    const day = start.getDay();
    // Calculate days to subtract to get to Monday (0=Sunday, 1=Monday, etc.)
    const daysToMonday = (day + 6) % 7; // Sunday becomes 6, Monday becomes 0
    const monday = new Date(start);
    monday.setDate(start.getDate() - daysToMonday);
    
    const dates = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const weekDates = getWeekDates(selectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Week navigation
  const goToPreviousWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 7);
    onDateSelect(newDate);
  };

  const goToThisWeek = () => {
    onDateSelect(new Date());
  };

  const goToNextWeek = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 7);
    onDateSelect(newDate);
  };

  // Helper functions
  const formatDateKey = (date: Date) => date.toISOString().split('T')[0];
  
  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString();
  };

  const isWorkoutCompleted = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return workoutHistory.some(workout => 
      workout.date.split('T')[0] === dateStr
    );
  };

  const getDayName = (date: Date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (date: Date) => {
    return date.getDate();
  };

  return (
    <div className="space-y-6">
      {/* Week Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPreviousWeek}
          className="text-sm font-medium"
        >
          Last Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToThisWeek}
          className="text-sm font-medium"
        >
          This Week
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={goToNextWeek}
          className="text-sm font-medium"
        >
          Next Week
        </Button>
      </div>

      {/* Week Range Display */}
      <div className="text-center">
        <h3 className="text-lg font-semibold text-foreground">
          {weekDates[0].toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {' '}
          {weekDates[6].toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
        </h3>
      </div>

      {/* Daily Cards */}
      <div className="space-y-3">
        {weekDates.map((date, index) => {
          const dateKey = formatDateKey(date);
          const scheduledWorkout = schedule[dateKey];
          const isCompleted = isWorkoutCompleted(date);
          const isTodayDate = isToday(date);
          
          return (
            <Card 
              key={index} 
              className={cn(
                "glass border-border/30 transition-all",
                isTodayDate && "border-primary/50 bg-primary/5"
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  {/* Day Circle and Info */}
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center font-semibold text-sm",
                      isTodayDate 
                        ? "bg-primary text-primary-foreground" 
                        : scheduledWorkout 
                        ? "bg-success/20 text-success border-2 border-success/30"
                        : "bg-muted/30 text-muted-foreground"
                    )}>
                      <div className="text-center">
                        <div className="text-xs font-normal leading-tight">
                          {getDayName(date)}
                        </div>
                        <div className="text-sm font-bold leading-tight">
                          {getDayNumber(date)}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground">
                          {isTodayDate ? 'Today' : getDayName(date)}
                        </h4>
                        {isCompleted && (
                          <div className="w-6 h-6 rounded-full bg-success/20 flex items-center justify-center">
                            <Check className="w-4 h-4 text-success" />
                          </div>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {scheduledWorkout ? (scheduledWorkout === 'Rest Day' ? 'Rest Day' : scheduledWorkout) : 'No workout'}
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    {scheduledWorkout ? (
                      <>
                        {scheduledWorkout !== 'Rest Day' && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => onStartWorkout(scheduledWorkout)}
                            className="text-primary border-primary/30 hover:bg-primary/10"
                          >
                            Start
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onDeleteWorkout(dateKey)}
                          className="h-8 w-8 text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onAssignWorkout(date)}
                        className="text-muted-foreground hover:text-primary"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default WeeklySchedule;
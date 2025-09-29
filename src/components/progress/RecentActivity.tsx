import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity } from "@/types/progress";

interface RecentActivityProps {
  activities: Activity[];
}

export const RecentActivity = ({ activities }: RecentActivityProps) => {
  const getActivityTypeColor = (type: Activity['type']) => {
    switch (type) {
      case 'workout':
        return 'bg-blue-500/10 text-blue-700 border-blue-200';
      case 'weight':
        return 'bg-green-500/10 text-green-700 border-green-200';
      case 'photo':
        return 'bg-purple-500/10 text-purple-700 border-purple-200';
      case 'achievement':
        return 'bg-yellow-500/10 text-yellow-700 border-yellow-200';
      case 'pr':
        return 'bg-red-500/10 text-red-700 border-red-200';
      default:
        return 'bg-gray-500/10 text-gray-700 border-gray-200';
    }
  };

  return (
    <section className="mb-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            📋 Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {activities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-4xl mb-2">📈</div>
              <p>No recent activity</p>
              <p className="text-sm">Start logging workouts and progress!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/10 hover:bg-accent/10 transition-colors"
                >
                  <div className="text-xl">{activity.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {activity.description}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()} • {new Date(activity.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${getActivityTypeColor(activity.type)}`}
                  >
                    {activity.type.toUpperCase()}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
};
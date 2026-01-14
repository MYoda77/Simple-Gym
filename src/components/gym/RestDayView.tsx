import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Activity,
  Dumbbell,
  CheckCircle2,
  X,
  Timer,
} from "lucide-react";

interface RestDayViewProps {
  restDayType: string;
  notes?: string;
  onComplete: () => void;
  onCancel: () => void;
}

export const RestDayView = ({
  restDayType,
  notes,
  onComplete,
  onCancel,
}: RestDayViewProps) => {
  // Parse activities from notes
  const activities: string[] = [];
  if (notes) {
    const activitiesMatch = notes.match(/Activities: (.+?)(?:\n|$)/);
    if (activitiesMatch) {
      activities.push(...activitiesMatch[1].split(", "));
    }
  }

  const getRestDayIcon = () => {
    switch (restDayType) {
      case "complete":
        return <Heart className="w-6 h-6 text-primary" />;
      case "active":
        return <Activity className="w-6 h-6 text-success" />;
      case "stretching":
        return <Dumbbell className="w-6 h-6 text-warning" />;
      default:
        return <Timer className="w-6 h-6 text-accent" />;
    }
  };

  const getRestDayTitle = () => {
    switch (restDayType) {
      case "complete":
        return "Complete Rest";
      case "active":
        return "Active Recovery";
      case "stretching":
        return "Stretching & Mobility";
      case "custom":
        return "Custom Activities";
      default:
        return "Rest Day";
    }
  };

  const getRestDayDescription = () => {
    switch (restDayType) {
      case "complete":
        return "Full recovery day - no structured activities";
      case "active":
        return "Light activities: walking, swimming, easy cycling";
      case "stretching":
        return "Focus on flexibility, yoga, foam rolling";
      case "custom":
        return "Define your own recovery routine";
      default:
        return "Recovery and rest";
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <Card className="glass border-border/50">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getRestDayIcon()}
                <div>
                  <CardTitle className="text-foreground">
                    {getRestDayTitle()}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-1">
                    {getRestDayDescription()}
                  </p>
                </div>
              </div>
              <Badge variant="outline" className="bg-primary/10 text-primary">
                Rest Day
              </Badge>
            </div>
          </CardHeader>
        </Card>

        {/* Activities Section */}
        {activities.length > 0 && (
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-success" />
                Planned Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground mb-4">
                These are the activities you selected for today's rest day.
                Activity tracking will be implemented in a future update.
              </p>
              <div className="space-y-2">
                {activities.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-accent/5 border border-accent/20"
                  >
                    <div className="w-2 h-2 rounded-full bg-success"></div>
                    <span className="text-foreground">{activity}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {notes && !notes.startsWith("Activities:") && (
          <Card className="glass border-border/50">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {notes.split("\n").slice(1).join("\n") || notes}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Placeholder Info */}
        <Card className="glass border-border/50 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Timer className="w-5 h-5 text-primary mt-0.5" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">
                  Coming Soon
                </h3>
                <p className="text-sm text-muted-foreground">
                  Activity tracking, completion checkboxes, and rest day
                  analytics will be available in a future update. For now, use
                  this view as a reminder of your planned recovery activities.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-4">
          <Button
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-border/50"
          >
            <X className="w-4 h-4 mr-2" />
            Back
          </Button>
          <Button
            onClick={onComplete}
            className="flex-1 bg-success hover:bg-success/90"
          >
            <CheckCircle2 className="w-4 h-4 mr-2" />
            Mark as Complete
          </Button>
        </div>
      </div>
    </div>
  );
};

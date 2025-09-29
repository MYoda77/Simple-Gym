import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Achievement } from "@/types/progress";

interface AchievementsProps {
  achievements: Achievement[];
}

export const Achievements = ({ achievements }: AchievementsProps) => {
  return (
    <section className="mb-6">
      <Card className="bg-card/50 backdrop-blur-sm border-border/20">
        <CardHeader>
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            🏆 Achievements & Milestones
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {achievements.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">
              <div className="text-4xl mb-2">🎯</div>
              <p>Start working out to unlock achievements!</p>
            </div>
          ) : (
            achievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-3 rounded-lg bg-accent/10 border border-accent/20 hover:bg-accent/20 transition-colors cursor-pointer"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1">
                  <h4 className="font-medium text-foreground">{achievement.title}</h4>
                  {achievement.description && (
                    <p className="text-sm text-muted-foreground">{achievement.description}</p>
                  )}
                </div>
                <Badge variant="secondary" className="text-xs">
                  {new Date(achievement.date).toLocaleDateString()}
                </Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </section>
  );
};
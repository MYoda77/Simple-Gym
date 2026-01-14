import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Target, Lock } from "lucide-react";
import {
  Achievement,
  UserStats,
  ACHIEVEMENTS,
} from "@/utils/achievementSystem";

interface DashboardAchievementShowcaseProps {
  achievements: Achievement[];
  stats: UserStats;
}

export const DashboardAchievementShowcase: React.FC<
  DashboardAchievementShowcaseProps
> = ({ achievements, stats }) => {
  // Deduplicate achievements by ID (keep most recent)
  const uniqueAchievements = Array.from(
    achievements
      .reduce((map, achievement) => {
        const existing = map.get(achievement.id);
        if (
          !existing ||
          (achievement.unlockedAt &&
            new Date(achievement.unlockedAt).getTime() >
              new Date(existing.unlockedAt || 0).getTime())
        ) {
          map.set(achievement.id, achievement);
        }
        return map;
      }, new Map<string, Achievement>())
      .values()
  );

  // Get recent achievements (last 3)
  const recentAchievements = [...uniqueAchievements]
    .sort((a, b) => {
      const dateA = new Date(a.unlockedAt || 0).getTime();
      const dateB = new Date(b.unlockedAt || 0).getTime();
      return dateB - dateA;
    })
    .slice(0, 3);

  // Find next achievements to unlock
  const unlockedIds = new Set(uniqueAchievements.map((a) => a.id));
  const nextAchievements = ACHIEVEMENTS.filter(
    (def) => !unlockedIds.has(def.id)
  ).slice(0, 3);

  // Calculate completion percentage
  const completionPercentage = Math.round(
    (uniqueAchievements.length / ACHIEVEMENTS.length) * 100
  );

  return (
    <div className="space-y-4">
      {/* Achievement Progress Overview */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-yellow-500" />
              Achievement Progress
            </span>
            <Badge variant="secondary" className="text-sm">
              {uniqueAchievements.length} / {ACHIEVEMENTS.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Progress value={completionPercentage} className="h-2" />
            <p className="text-sm text-muted-foreground text-center">
              {completionPercentage}% Complete
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      {recentAchievements.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              🏆 Recent Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {recentAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className="flex items-center gap-3 p-2 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="text-2xl">{achievement.icon}</div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {achievement.title}
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    {achievement.unlockedAt
                      ? new Date(achievement.unlockedAt).toLocaleDateString()
                      : achievement.date
                      ? new Date(achievement.date).toLocaleDateString()
                      : "Recently"}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Next Achievements */}
      {nextAchievements.length > 0 && (
        <Card className="glass border-border/50">
          <CardHeader>
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <Target className="w-4 h-4 text-primary" />
              Next Achievements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {nextAchievements.map((def) => {
              // Try to calculate progress if possible
              let progressValue = 0;
              let progressText = "";

              // Simple progress indicators based on achievement type
              if (def.id.includes("workout-milestone")) {
                const target = parseInt(def.id.split("-").pop() || "0");
                progressValue = Math.min(
                  (stats.totalWorkouts / target) * 100,
                  100
                );
                progressText = `${stats.totalWorkouts} / ${target} workouts`;
              } else if (def.id.includes("pr-milestone")) {
                const target = parseInt(def.id.split("-").pop() || "0");
                progressValue = Math.min((stats.totalPRs / target) * 100, 100);
                progressText = `${stats.totalPRs} / ${target} PRs`;
              } else if (def.id.includes("streak")) {
                const target = parseInt(def.id.split("-").pop() || "0");
                progressValue = Math.min(
                  (stats.currentStreak / target) * 100,
                  100
                );
                progressText = `${stats.currentStreak} / ${target} day streak`;
              }

              return (
                <div
                  key={def.id}
                  className="p-3 rounded-lg bg-muted/20 border border-muted/30"
                >
                  <div className="flex items-start gap-3 mb-2">
                    <div className="text-xl opacity-50">{def.icon}</div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                        {def.title}
                        <Lock className="w-3 h-3 text-muted-foreground" />
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {def.description}
                      </p>
                    </div>
                  </div>
                  {progressText && (
                    <div className="space-y-1">
                      <Progress value={progressValue} className="h-1.5" />
                      <p className="text-xs text-muted-foreground">
                        {progressText}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

interface AchievementsPageProps {
  achievements: Achievement[];
  stats: UserStats;
}

export const AchievementsPage: React.FC<AchievementsPageProps> = ({
  achievements,
  stats,
}) => {
  // Deduplicate achievements by ID (keep most recent)
  const uniqueAchievements = Array.from(
    achievements
      .reduce((map, achievement) => {
        const existing = map.get(achievement.id);
        if (
          !existing ||
          (achievement.unlockedAt &&
            new Date(achievement.unlockedAt).getTime() >
              new Date(existing.unlockedAt || 0).getTime())
        ) {
          map.set(achievement.id, achievement);
        }
        return map;
      }, new Map<string, Achievement>())
      .values()
  );

  const unlockedIds = new Set(uniqueAchievements.map((a) => a.id));

  // Group achievements by category
  const categories = [
    {
      id: "beginner",
      name: "🎯 Beginner",
      color: "bg-blue-500/10 border-blue-500/20",
    },
    {
      id: "workout",
      name: "💪 Workout Milestones",
      color: "bg-green-500/10 border-green-500/20",
    },
    {
      id: "pr",
      name: "🏆 Personal Records",
      color: "bg-yellow-500/10 border-yellow-500/20",
    },
    {
      id: "streak",
      name: "🔥 Consistency",
      color: "bg-red-500/10 border-red-500/20",
    },
    {
      id: "weekly",
      name: "📅 Weekly Goals",
      color: "bg-purple-500/10 border-purple-500/20",
    },
    {
      id: "special",
      name: "⭐ Special",
      color: "bg-pink-500/10 border-pink-500/20",
    },
  ];

  const completionPercentage = Math.round(
    (uniqueAchievements.length / ACHIEVEMENTS.length) * 100
  );

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <Card className="glass border-border/50">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-6 h-6 text-yellow-500" />
                My Achievements
              </h2>
              <p className="text-sm text-muted-foreground mt-1">
                {uniqueAchievements.length} of {ACHIEVEMENTS.length} unlocked
              </p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-primary">
                {completionPercentage}%
              </div>
              <p className="text-xs text-muted-foreground">Complete</p>
            </div>
          </div>
          <Progress value={completionPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Achievement Categories */}
      {categories.map((category) => {
        // Filter secret achievements - only show if unlocked
        const categoryAchievements = ACHIEVEMENTS.filter(
          (def) =>
            def.category === category.id &&
            (!def.secret || unlockedIds.has(def.id))
        );

        const unlockedInCategory = categoryAchievements.filter((def) =>
          unlockedIds.has(def.id)
        ).length;

        return (
          <Card key={category.id} className={`glass border ${category.color}`}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{category.name}</span>
                <Badge variant="secondary">
                  {unlockedInCategory} / {categoryAchievements.length}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {categoryAchievements.map((def) => {
                const isUnlocked = unlockedIds.has(def.id);
                const achievement = uniqueAchievements.find(
                  (a) => a.id === def.id
                );

                return (
                  <div
                    key={def.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border ${
                      isUnlocked
                        ? "bg-accent/10 border-accent/20"
                        : "bg-muted/10 border-muted/20 opacity-60"
                    }`}
                  >
                    <div className={`text-2xl ${!isUnlocked && "opacity-40"}`}>
                      {def.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-foreground flex items-center gap-2">
                        {def.title}
                        {!isUnlocked && (
                          <Lock className="w-3 h-3 text-muted-foreground" />
                        )}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {def.description}
                      </p>
                    </div>
                    {isUnlocked && achievement && (
                      <Badge
                        variant="outline"
                        className="text-xs whitespace-nowrap"
                      >
                        {achievement.unlockedAt
                          ? new Date(
                              achievement.unlockedAt
                            ).toLocaleDateString()
                          : achievement.date
                          ? new Date(achievement.date).toLocaleDateString()
                          : "Unlocked"}
                      </Badge>
                    )}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

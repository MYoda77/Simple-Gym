import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Crown, Sparkles, Award } from "lucide-react";
import {
  AchievementRarity,
  AchievementTier,
  RarityAchievement,
  RARITY_COLORS,
  TIER_CONFIG,
  ACHIEVEMENT_RARITY_DEFINITIONS,
  calculateTierProgress,
  calculateTotalPoints,
  getRarityDistribution,
  calculateRarityCompletion,
  sortByRarity,
  LeaderboardEntry,
} from "@/utils/achievementRarity";
import { Achievement as SystemAchievement } from "@/utils/achievementSystem";

/**
 * Rarity badge component
 */
interface RarityBadgeProps {
  rarity: AchievementRarity;
  size?: "sm" | "md" | "lg";
}

export const RarityBadge: React.FC<RarityBadgeProps> = ({
  rarity,
  size = "md",
}) => {
  const colors = RARITY_COLORS[rarity];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-base px-4 py-1.5",
  };

  return (
    <Badge
      className={`bg-gradient-to-r ${colors.bg} ${colors.text} ${colors.border} border ${sizeClasses[size]} capitalize`}
    >
      {colors.icon} {rarity}
    </Badge>
  );
};

/**
 * Tier badge component
 */
interface TierBadgeProps {
  tier: AchievementTier;
  size?: "sm" | "md" | "lg";
}

export const TierBadge: React.FC<TierBadgeProps> = ({ tier, size = "md" }) => {
  const config = TIER_CONFIG[tier];
  const sizeClasses = {
    sm: "text-xs px-2 py-0.5",
    md: "text-sm px-3 py-1",
    lg: "text-lg px-4 py-2",
  };

  const specialClass = "special" in config ? config.special : "";

  return (
    <Badge
      className={`bg-gradient-to-r ${config.color} text-white border-2 ${config.borderColor} ${sizeClasses[size]} font-bold ${specialClass}`}
    >
      {config.icon} {config.name}
    </Badge>
  );
};

/**
 * Enhanced achievement card with rarity
 */
interface RarityAchievementCardProps {
  achievement: RarityAchievement;
  onClick?: () => void;
}

export const RarityAchievementCard: React.FC<RarityAchievementCardProps> = ({
  achievement,
  onClick,
}) => {
  const colors = RARITY_COLORS[achievement.rarity];

  return (
    <div
      className={`relative p-[2px] rounded-lg bg-gradient-to-r ${colors.bg} cursor-pointer transform transition-all hover:scale-105 hover:shadow-lg ${colors.glow}`}
      onClick={onClick}
    >
      {/* Animated glow effect for legendary */}
      {achievement.rarity === "legendary" && (
        <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 rounded-lg opacity-75 blur animate-pulse" />
      )}

      <div className="relative bg-background rounded-lg p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="text-4xl">{achievement.icon}</div>
          <RarityBadge rarity={achievement.rarity} size="sm" />
        </div>

        <h4 className="font-bold text-foreground mb-1">{achievement.title}</h4>
        <p className="text-sm text-muted-foreground mb-3">
          {achievement.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-warning" />
            <span className="text-sm font-semibold text-foreground">
              +{achievement.points} pts
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {achievement.unlockedAt
              ? new Date(achievement.unlockedAt).toLocaleDateString()
              : "Recently"}
          </span>
        </div>

        {achievement.unlockRate && achievement.unlockRate < 50 && (
          <div className="mt-2 pt-2 border-t border-border">
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              Only {achievement.unlockRate}% of users have this!
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

/**
 * Tier progress card
 */
interface TierProgressCardProps {
  achievements: SystemAchievement[];
}

export const TierProgressCard: React.FC<TierProgressCardProps> = ({
  achievements,
}) => {
  const totalPoints = calculateTotalPoints(achievements);
  const tierProgress = calculateTierProgress(totalPoints);

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Crown className="w-5 h-5 text-primary" />
            Achievement Tier
          </span>
          <TierBadge tier={tierProgress.currentTier} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Points display */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">{totalPoints}</p>
            <p className="text-sm text-muted-foreground">Total Points</p>
          </div>
          <Trophy className="w-12 h-12 text-primary/20" />
        </div>

        {/* Progress to next tier */}
        {tierProgress.nextTier && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                Progress to {TIER_CONFIG[tierProgress.nextTier].icon}{" "}
                {TIER_CONFIG[tierProgress.nextTier].name}
              </span>
              <span className="font-semibold text-foreground">
                {tierProgress.progress}%
              </span>
            </div>
            <Progress value={tierProgress.progress} className="h-3" />
            <p className="text-xs text-muted-foreground text-right">
              {tierProgress.pointsForNextTier - totalPoints} points to go
            </p>
          </div>
        )}

        {/* Max tier achieved */}
        {!tierProgress.nextTier && (
          <div className="text-center py-4 bg-primary/10 rounded-lg border border-primary/20">
            <Crown className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="font-bold text-foreground">Maximum Tier Achieved!</p>
            <p className="text-sm text-muted-foreground">
              You're at the top! 🎉
            </p>
          </div>
        )}

        {/* All tiers display */}
        <div className="grid grid-cols-4 gap-2 pt-4 border-t border-border">
          {(["bronze", "silver", "gold", "platinum"] as AchievementTier[]).map(
            (tier) => {
              const tierThreshold =
                tier === "bronze"
                  ? 0
                  : tier === "silver"
                  ? 100
                  : tier === "gold"
                  ? 500
                  : 1500;
              const isUnlocked =
                totalPoints >= tierThreshold ||
                tier === tierProgress.currentTier;
              const isCurrent = tier === tierProgress.currentTier;

              return (
                <div
                  key={tier}
                  className={`text-center p-2 rounded-lg border-2 transition-all ${
                    isUnlocked
                      ? `${TIER_CONFIG[tier].borderColor} bg-gradient-to-b ${TIER_CONFIG[tier].color}/10`
                      : "border-muted bg-muted/10 opacity-40"
                  } ${isCurrent ? "ring-2 ring-primary" : ""}`}
                >
                  <div className="text-2xl mb-1">{TIER_CONFIG[tier].icon}</div>
                  <p className="text-xs font-medium">
                    {TIER_CONFIG[tier].name}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Rarity statistics card
 */
interface RarityStatsCardProps {
  achievements: SystemAchievement[];
}

export const RarityStatsCard: React.FC<RarityStatsCardProps> = ({
  achievements,
}) => {
  const completion = calculateRarityCompletion(achievements);

  const rarities: AchievementRarity[] = ["legendary", "epic", "rare", "common"];

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-primary" />
          Rarity Collection
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {rarities.map((rarity) => {
          const colors = RARITY_COLORS[rarity];
          const stats = completion[rarity];

          return (
            <div key={rarity} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{colors.icon}</span>
                  <span className="font-medium text-foreground capitalize">
                    {rarity}
                  </span>
                </div>
                <span className="text-sm font-semibold text-foreground">
                  {stats.unlocked}/{stats.total}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Progress
                  value={stats.percentage}
                  className={`flex-1 h-2 bg-gradient-to-r ${colors.bg}`}
                />
                <span className="text-xs font-medium text-muted-foreground w-12 text-right">
                  {stats.percentage}%
                </span>
              </div>
            </div>
          );
        })}

        {/* Total summary */}
        <div className="pt-4 border-t border-border">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Total Unlocked</span>
            <span className="font-bold text-foreground">
              {achievements.length} / {ACHIEVEMENT_RARITY_DEFINITIONS.length}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Achievements grid with rarity sorting
 */
interface RarityAchievementsGridProps {
  achievements: SystemAchievement[];
  onAchievementClick?: (achievement: RarityAchievement) => void;
}

export const RarityAchievementsGrid: React.FC<RarityAchievementsGridProps> = ({
  achievements,
  onAchievementClick,
}) => {
  const sortedAchievements = sortByRarity(achievements);

  if (sortedAchievements.length === 0) {
    return (
      <Card className="glass border-border/50">
        <CardContent className="p-12 text-center">
          <Trophy className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            No Achievements Yet
          </h3>
          <p className="text-muted-foreground">
            Complete workouts to unlock achievements and earn points!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Group by rarity
  const rarities: AchievementRarity[] = ["legendary", "epic", "rare", "common"];

  return (
    <div className="space-y-8">
      {rarities.map((rarity) => {
        const rarityAchievements = sortedAchievements.filter(
          (a) => a.rarity === rarity
        );

        if (rarityAchievements.length === 0) return null;

        return (
          <div key={rarity}>
            <div className="flex items-center gap-3 mb-4">
              <RarityBadge rarity={rarity} size="lg" />
              <div className="flex-1 h-px bg-gradient-to-r from-border to-transparent" />
              <span className="text-sm text-muted-foreground">
                {rarityAchievements.length} unlocked
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {rarityAchievements.map((achievement) => (
                <RarityAchievementCard
                  key={achievement.id}
                  achievement={achievement}
                  onClick={() => onAchievementClick?.(achievement)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
};

/**
 * Leaderboard component
 */
interface LeaderboardProps {
  entries: LeaderboardEntry[];
  currentUserId?: string;
}

export const Leaderboard: React.FC<LeaderboardProps> = ({
  entries,
  currentUserId,
}) => {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            const getRankIcon = (rank: number) => {
              if (rank === 1) return "🥇";
              if (rank === 2) return "🥈";
              if (rank === 3) return "🥉";
              return `#${rank}`;
            };

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isCurrentUser
                    ? "bg-primary/10 border-primary/40 ring-2 ring-primary/20"
                    : "bg-muted/10 border-border hover:bg-muted/20"
                }`}
              >
                {/* Rank */}
                <div className="w-12 text-center">
                  <span className="text-lg font-bold">
                    {getRankIcon(entry.rank)}
                  </span>
                </div>

                {/* User info */}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-foreground">
                      {entry.username}
                      {isCurrentUser && (
                        <span className="text-primary ml-1">(You)</span>
                      )}
                    </span>
                    <TierBadge tier={entry.tier} size="sm" />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {entry.achievementCount} achievements •{" "}
                    {entry.legendaryCount} legendary
                  </p>
                </div>

                {/* Points */}
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">
                    {entry.totalPoints.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">points</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Compact points display widget
 */
interface PointsWidgetProps {
  achievements: SystemAchievement[];
}

export const PointsWidget: React.FC<PointsWidgetProps> = ({ achievements }) => {
  const totalPoints = calculateTotalPoints(achievements);
  const tierProgress = calculateTierProgress(totalPoints);

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-primary/10 to-accent/10 rounded-lg border border-primary/20">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <Star className="w-4 h-4 text-warning" />
          <span className="text-2xl font-bold text-foreground">
            {totalPoints}
          </span>
          <span className="text-sm text-muted-foreground">points</span>
        </div>
        <TierBadge tier={tierProgress.currentTier} size="sm" />
      </div>
      {tierProgress.nextTier && (
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Next tier</p>
          <p className="text-sm font-semibold text-foreground">
            {tierProgress.pointsForNextTier - totalPoints} pts
          </p>
        </div>
      )}
    </div>
  );
};

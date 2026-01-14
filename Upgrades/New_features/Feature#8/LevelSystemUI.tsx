import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Zap, TrendingUp, Award, Star, Crown, Trophy, Gift } from 'lucide-react';
import {
  UserLevel,
  getLevelTitle,
  getLevelRewards,
  getNextReward,
  LevelLeaderboard,
  LEVEL_TITLES,
} from '@/utils/levelSystem';

/**
 * Level display badge
 */
interface LevelBadgeProps {
  level: number;
  size?: 'sm' | 'md' | 'lg';
}

export const LevelBadge: React.FC<LevelBadgeProps> = ({ level, size = 'md' }) => {
  const title = getLevelTitle(level);
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1.5',
    lg: 'text-base px-4 py-2',
  };

  return (
    <Badge
      className={`bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold ${sizeClasses[size]}`}
    >
      Lv.{level} {title}
    </Badge>
  );
};

/**
 * XP progress card
 */
interface XPProgressCardProps {
  userLevel: UserLevel;
}

export const XPProgressCard: React.FC<XPProgressCardProps> = ({ userLevel }) => {
  const nextReward = getNextReward(userLevel.level);

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-warning" />
            Level Progress
          </span>
          <LevelBadge level={userLevel.level} />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* XP Numbers */}
        <div className="flex items-end justify-between">
          <div>
            <p className="text-3xl font-bold text-foreground">
              {userLevel.currentXP.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              / {userLevel.xpForNextLevel.toLocaleString()} XP
            </p>
          </div>
          <TrendingUp className="w-8 h-8 text-success" />
        </div>

        {/* Progress bar */}
        <div className="space-y-2">
          <Progress value={userLevel.progress} className="h-4" />
          <p className="text-xs text-muted-foreground text-right">
            {Math.round(userLevel.progress)}% to Level {userLevel.level + 1}
          </p>
        </div>

        {/* Next reward preview */}
        {nextReward && (
          <div className="p-3 bg-primary/10 rounded-lg border border-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <Gift className="w-4 h-4 text-primary" />
              <p className="text-sm font-semibold text-foreground">
                Unlock at Level {nextReward.level}
              </p>
            </div>
            <ul className="text-xs text-muted-foreground space-y-1">
              {nextReward.unlocks.map((unlock, idx) => (
                <li key={idx}>• {unlock}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Total XP */}
        <div className="pt-3 border-t border-border flex justify-between text-sm">
          <span className="text-muted-foreground">Total XP Earned</span>
          <span className="font-bold text-foreground">
            {userLevel.totalXP.toLocaleString()}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * XP gain notification
 */
interface XPGainProps {
  amount: number;
  source: string;
}

export const XPGainNotification: React.FC<XPGainProps> = ({ amount, source }) => {
  return (
    <div className="flex items-center gap-2 p-3 bg-warning/10 rounded-lg border border-warning/30 animate-in slide-in-from-top">
      <Zap className="w-5 h-5 text-warning" />
      <div>
        <p className="text-sm font-bold text-foreground">+{amount} XP</p>
        <p className="text-xs text-muted-foreground">{source}</p>
      </div>
    </div>
  );
};

/**
 * Level up celebration
 */
interface LevelUpModalProps {
  newLevel: number;
  rewards?: { unlocks: string[]; points: number };
  onClose: () => void;
}

export const LevelUpModal: React.FC<LevelUpModalProps> = ({
  newLevel,
  rewards,
  onClose,
}) => {
  const title = getLevelTitle(newLevel);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
      <Card className="max-w-md w-full mx-4 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border-2 border-purple-400">
        <CardContent className="p-8 text-center space-y-6">
          {/* Level up badge */}
          <div className="space-y-4">
            <Crown className="w-16 h-16 text-warning mx-auto animate-bounce" />
            <h2 className="text-4xl font-bold text-foreground">Level Up!</h2>
            <LevelBadge level={newLevel} size="lg" />
          </div>

          {/* Rewards */}
          {rewards && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-foreground">Rewards Unlocked!</h3>
              <ul className="space-y-2">
                {rewards.unlocks.map((unlock, idx) => (
                  <li
                    key={idx}
                    className="flex items-center gap-2 text-sm text-muted-foreground"
                  >
                    <Star className="w-4 h-4 text-warning" />
                    {unlock}
                  </li>
                ))}
              </ul>
              <div className="flex items-center justify-center gap-2 text-warning">
                <Trophy className="w-5 h-5" />
                <span className="font-bold">+{rewards.points} Bonus Points!</span>
              </div>
            </div>
          )}

          <Button onClick={onClose} className="w-full" size="lg">
            Awesome!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

/**
 * Compact level widget for dashboard
 */
interface LevelWidgetProps {
  userLevel: UserLevel;
}

export const LevelWidget: React.FC<LevelWidgetProps> = ({ userLevel }) => {
  return (
    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-400/20">
      <div className="flex-1">
        <LevelBadge level={userLevel.level} size="sm" />
        <div className="mt-2">
          <Progress value={userLevel.progress} className="h-2 mb-1" />
          <p className="text-xs text-muted-foreground">
            {userLevel.currentXP.toLocaleString()} / {userLevel.xpForNextLevel.toLocaleString()} XP
          </p>
        </div>
      </div>
      <Zap className="w-8 h-8 text-warning" />
    </div>
  );
};

/**
 * Level leaderboard
 */
interface LevelLeaderboardProps {
  entries: LevelLeaderboard[];
  currentUserId?: string;
}

export const LevelLeaderboard: React.FC<LevelLeaderboardProps> = ({
  entries,
  currentUserId,
}) => {
  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Level Leaderboard
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {entries.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            const getRankIcon = (rank: number) => {
              if (rank === 1) return '🥇';
              if (rank === 2) return '🥈';
              if (rank === 3) return '🥉';
              return `#${rank}`;
            };

            return (
              <div
                key={entry.userId}
                className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                  isCurrentUser
                    ? 'bg-primary/10 border-primary/40 ring-2 ring-primary/20'
                    : 'bg-muted/10 border-border hover:bg-muted/20'
                }`}
              >
                <div className="w-10 text-center font-bold text-lg">
                  {getRankIcon(entry.rank)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-foreground">
                    {entry.username}
                    {isCurrentUser && <span className="text-primary ml-1">(You)</span>}
                  </p>
                  <p className="text-xs text-muted-foreground">{entry.title}</p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">Lv.{entry.level}</p>
                  <p className="text-xs text-muted-foreground">
                    {(entry.totalXP / 1000).toFixed(1)}k XP
                  </p>
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
 * XP breakdown card
 */
interface XPBreakdownProps {
  breakdown: { source: string; amount: number }[];
  total: number;
}

export const XPBreakdown: React.FC<XPBreakdownProps> = ({ breakdown, total }) => {
  return (
    <div className="p-4 bg-muted/20 rounded-lg border border-border space-y-3">
      <h4 className="font-semibold text-foreground flex items-center gap-2">
        <Award className="w-4 h-4 text-warning" />
        XP Earned
      </h4>
      <div className="space-y-2">
        {breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <span className="text-muted-foreground">{item.source}</span>
            <span className="font-semibold text-warning">+{item.amount}</span>
          </div>
        ))}
      </div>
      <div className="pt-2 border-t border-border flex justify-between font-bold">
        <span className="text-foreground">Total XP</span>
        <span className="text-warning">+{total}</span>
      </div>
    </div>
  );
};

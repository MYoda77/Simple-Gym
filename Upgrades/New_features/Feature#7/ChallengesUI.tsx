import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Clock, Target, Trophy, Zap, CheckCircle } from 'lucide-react';
import { Challenge, getTimeRemaining } from '@/utils/challenges';

/**
 * Challenge card component
 */
interface ChallengeCardProps {
  challenge: Challenge;
  onComplete?: () => void;
}

export const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onComplete }) => {
  const isCompleted = challenge.status === 'completed';
  const isExpired = challenge.status === 'expired';
  const timeRemaining = getTimeRemaining(challenge.endDate);

  return (
    <div
      className={`p-4 rounded-lg border-2 transition-all ${
        isCompleted
          ? 'bg-success/10 border-success/40'
          : isExpired
          ? 'bg-muted/20 border-border opacity-60'
          : 'bg-primary/5 border-primary/30 hover:border-primary/50'
      }`}
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="text-3xl">{challenge.icon}</span>
          <div>
            <h4 className="font-semibold text-foreground flex items-center gap-2">
              {challenge.title}
              {isCompleted && <CheckCircle className="w-4 h-4 text-success" />}
            </h4>
            <p className="text-sm text-muted-foreground">{challenge.description}</p>
          </div>
        </div>
        <Badge variant={challenge.type === 'daily' ? 'default' : 'secondary'} className="text-xs">
          {challenge.type}
        </Badge>
      </div>

      {/* Progress */}
      <div className="space-y-2 mb-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">
            {challenge.current} / {challenge.target}
          </span>
          <span className="font-semibold text-foreground">{Math.round(challenge.progress)}%</span>
        </div>
        <Progress value={challenge.progress} className="h-2" />
      </div>

      {/* Rewards & Time */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1 text-warning">
            <Trophy className="w-3 h-3" />
            +{challenge.points} pts
          </span>
          {challenge.xp && (
            <span className="flex items-center gap-1 text-accent">
              <Zap className="w-3 h-3" />
              +{challenge.xp} XP
            </span>
          )}
        </div>
        {!isCompleted && !isExpired && (
          <span className="flex items-center gap-1 text-muted-foreground">
            <Clock className="w-3 h-3" />
            {timeRemaining}
          </span>
        )}
      </div>
    </div>
  );
};

/**
 * Challenges dashboard
 */
interface ChallengesDashboardProps {
  challenges: Challenge[];
  onRefresh?: () => void;
}

export const ChallengesDashboard: React.FC<ChallengesDashboardProps> = ({
  challenges,
  onRefresh,
}) => {
  const dailyChallenges = challenges.filter((c) => c.type === 'daily');
  const weeklyChallenges = challenges.filter((c) => c.type === 'weekly');
  
  const completedDaily = dailyChallenges.filter((c) => c.status === 'completed').length;
  const completedWeekly = weeklyChallenges.filter((c) => c.status === 'completed').length;

  return (
    <div className="space-y-6">
      {/* Header stats */}
      <div className="grid grid-cols-2 gap-4">
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Daily Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {completedDaily}/{dailyChallenges.length}
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-border/50">
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">Weekly Completed</p>
            <p className="text-2xl font-bold text-foreground">
              {completedWeekly}/{weeklyChallenges.length}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Daily Challenges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Daily Challenges
        </h3>
        <div className="space-y-3">
          {dailyChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>

      {/* Weekly Challenges */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
          <Trophy className="w-5 h-5 text-warning" />
          Weekly Challenges
        </h3>
        <div className="space-y-3">
          {weeklyChallenges.map((challenge) => (
            <ChallengeCard key={challenge.id} challenge={challenge} />
          ))}
        </div>
      </div>
    </div>
  );
};

/**
 * Compact widget for dashboard
 */
interface ChallengesWidgetProps {
  challenges: Challenge[];
  onViewAll?: () => void;
}

export const ChallengesWidget: React.FC<ChallengesWidgetProps> = ({
  challenges,
  onViewAll,
}) => {
  const activeChallenges = challenges.filter((c) => c.status === 'active').slice(0, 2);

  if (activeChallenges.length === 0) return null;

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          <span className="flex items-center gap-2">
            <Target className="w-4 h-4 text-primary" />
            Today's Challenges
          </span>
          {onViewAll && (
            <button onClick={onViewAll} className="text-xs text-primary hover:underline">
              View All
            </button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {activeChallenges.map((challenge) => (
          <div key={challenge.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">{challenge.icon} {challenge.title}</span>
              <span className="text-xs text-muted-foreground">
                {challenge.current}/{challenge.target}
              </span>
            </div>
            <Progress value={challenge.progress} className="h-1.5" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

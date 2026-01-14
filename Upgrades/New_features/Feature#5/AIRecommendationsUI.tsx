import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Brain,
  TrendingUp,
  Heart,
  Dumbbell,
  Target,
  Zap,
  Activity,
  AlertCircle,
  CheckCircle,
  X,
  ChevronRight,
  Sparkles,
  BarChart3,
} from 'lucide-react';
import {
  WorkoutRecommendation,
  RecommendationType,
  RecommendationPriority,
} from '@/utils/aiRecommendations';

/**
 * Get icon for recommendation type
 */
const getRecommendationIcon = (type: RecommendationType) => {
  switch (type) {
    case 'next-workout':
      return Dumbbell;
    case 'muscle-balance':
      return Target;
    case 'recovery':
      return Heart;
    case 'progression':
      return TrendingUp;
    case 'variety':
      return Sparkles;
    case 'volume':
      return BarChart3;
    case 'frequency':
      return Activity;
    case 'deload':
      return Zap;
    default:
      return Brain;
  }
};

/**
 * Get color for priority
 */
const getPriorityColor = (priority: RecommendationPriority) => {
  switch (priority) {
    case 'urgent':
      return 'bg-destructive/20 text-destructive border-destructive/40';
    case 'high':
      return 'bg-warning/20 text-warning border-warning/40';
    case 'medium':
      return 'bg-primary/20 text-primary border-primary/40';
    case 'low':
      return 'bg-accent/20 text-accent border-accent/40';
    default:
      return 'bg-muted';
  }
};

/**
 * Get priority label
 */
const getPriorityLabel = (priority: RecommendationPriority) => {
  switch (priority) {
    case 'urgent':
      return '🔴 Urgent';
    case 'high':
      return '🟠 High';
    case 'medium':
      return '🟡 Medium';
    case 'low':
      return '🟢 Low';
  }
};

/**
 * Individual recommendation card
 */
interface RecommendationCardProps {
  recommendation: WorkoutRecommendation;
  onDismiss?: (id: string) => void;
  onAccept?: (recommendation: WorkoutRecommendation) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  recommendation,
  onDismiss,
  onAccept,
}) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = getRecommendationIcon(recommendation.type);

  return (
    <Card className={`border-2 ${getPriorityColor(recommendation.priority)}`}>
      <CardContent className="p-4">
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3 flex-1">
              <div className="p-2 rounded-lg bg-background/50">
                <Icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-semibold text-foreground">
                    {recommendation.title}
                  </h4>
                  <Badge variant="outline" className="text-xs">
                    {getPriorityLabel(recommendation.priority)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  {recommendation.description}
                </p>
              </div>
            </div>

            {/* Dismiss button */}
            {recommendation.dismissable && onDismiss && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDismiss(recommendation.id)}
                className="ml-2"
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          {/* Confidence bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Confidence</span>
              <span>{recommendation.confidence}%</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${recommendation.confidence}%` }}
              />
            </div>
          </div>

          {/* Reasoning (expandable) */}
          {recommendation.reasoning.length > 0 && (
            <div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setExpanded(!expanded)}
                className="text-xs p-0 h-auto"
              >
                <ChevronRight
                  className={`w-3 h-3 mr-1 transition-transform ${
                    expanded ? 'rotate-90' : ''
                  }`}
                />
                Why this recommendation?
              </Button>

              {expanded && (
                <ul className="mt-2 space-y-1 text-xs text-muted-foreground">
                  {recommendation.reasoning.map((reason, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <CheckCircle className="w-3 h-3 text-primary mt-0.5 flex-shrink-0" />
                      <span>{reason}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Action details */}
          {recommendation.action.details && (
            <div className="p-3 bg-background/50 rounded-lg space-y-2">
              <p className="text-xs font-medium text-foreground">Action:</p>
              {typeof recommendation.action.details === 'string' ? (
                <p className="text-sm text-muted-foreground">
                  {recommendation.action.details}
                </p>
              ) : (
                <div className="text-sm text-muted-foreground space-y-1">
                  {Object.entries(recommendation.action.details).map(([key, value]) => (
                    <div key={key}>
                      <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                      {Array.isArray(value) ? (
                        <ul className="ml-4 mt-1">
                          {value.map((item, idx) => (
                            <li key={idx}>• {item}</li>
                          ))}
                        </ul>
                      ) : (
                        <span>{String(value)}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Accept button */}
          {onAccept && (
            <Button
              onClick={() => onAccept(recommendation)}
              className="w-full"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Apply Recommendation
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

/**
 * Recommendations dashboard
 */
interface RecommendationsDashboardProps {
  recommendations: WorkoutRecommendation[];
  onDismiss?: (id: string) => void;
  onAccept?: (recommendation: WorkoutRecommendation) => void;
}

export const RecommendationsDashboard: React.FC<
  RecommendationsDashboardProps
> = ({ recommendations, onDismiss, onAccept }) => {
  const [filter, setFilter] = useState<'all' | RecommendationType>('all');

  const filteredRecommendations =
    filter === 'all'
      ? recommendations
      : recommendations.filter((r) => r.type === filter);

  const urgentCount = recommendations.filter((r) => r.priority === 'urgent').length;
  const highCount = recommendations.filter((r) => r.priority === 'high').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="glass border-border/50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="w-6 h-6 text-primary" />
            AI Workout Recommendations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {recommendations.length} personalized recommendations based on your training
              </p>
              {(urgentCount > 0 || highCount > 0) && (
                <div className="flex gap-2 mt-2">
                  {urgentCount > 0 && (
                    <Badge variant="destructive">
                      {urgentCount} Urgent
                    </Badge>
                  )}
                  {highCount > 0 && (
                    <Badge className="bg-warning/20 text-warning">
                      {highCount} High Priority
                    </Badge>
                  )}
                </div>
              )}
            </div>
            <Brain className="w-12 h-12 text-primary/20" />
          </div>
        </CardContent>
      </Card>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={filter === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilter('all')}
        >
          All ({recommendations.length})
        </Button>
        {(['next-workout', 'muscle-balance', 'recovery', 'progression'] as const).map(
          (type) => {
            const count = recommendations.filter((r) => r.type === type).length;
            if (count === 0) return null;
            return (
              <Button
                key={type}
                variant={filter === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilter(type)}
              >
                {type.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ')} ({count})
              </Button>
            );
          }
        )}
      </div>

      {/* Recommendations list */}
      {filteredRecommendations.length > 0 ? (
        <div className="space-y-4">
          {filteredRecommendations.map((recommendation) => (
            <RecommendationCard
              key={recommendation.id}
              recommendation={recommendation}
              onDismiss={onDismiss}
              onAccept={onAccept}
            />
          ))}
        </div>
      ) : (
        <Card className="glass border-border/50">
          <CardContent className="p-12 text-center">
            <Brain className="w-16 h-16 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Recommendations
            </h3>
            <p className="text-muted-foreground">
              {filter === 'all'
                ? 'Complete more workouts to receive personalized recommendations'
                : `No ${filter} recommendations at this time`}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

/**
 * Compact recommendation widget (for dashboard)
 */
interface RecommendationWidgetProps {
  recommendations: WorkoutRecommendation[];
  onViewAll?: () => void;
}

export const RecommendationWidget: React.FC<RecommendationWidgetProps> = ({
  recommendations,
  onViewAll,
}) => {
  const topRecommendations = recommendations.slice(0, 3);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className="glass border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Brain className="w-5 h-5 text-primary" />
            AI Recommendations
          </span>
          {onViewAll && (
            <Button variant="ghost" size="sm" onClick={onViewAll}>
              View All
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {topRecommendations.map((rec) => {
          const Icon = getRecommendationIcon(rec.type);
          return (
            <div
              key={rec.id}
              className={`p-3 rounded-lg border ${getPriorityColor(rec.priority)}`}
            >
              <div className="flex items-start gap-2">
                <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm text-foreground">
                    {rec.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {rec.description}
                  </p>
                </div>
              </div>
            </div>
          );
        })}

        {recommendations.length > 3 && (
          <p className="text-xs text-center text-muted-foreground">
            +{recommendations.length - 3} more recommendations
          </p>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * Alert banner for urgent recommendations
 */
interface UrgentRecommendationBannerProps {
  recommendation: WorkoutRecommendation;
  onDismiss?: () => void;
}

export const UrgentRecommendationBanner: React.FC<
  UrgentRecommendationBannerProps
> = ({ recommendation, onDismiss }) => {
  return (
    <Alert className="border-destructive bg-destructive/10">
      <AlertCircle className="w-4 h-4 text-destructive" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-semibold text-foreground">
            {recommendation.title}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {recommendation.description}
          </p>
        </div>
        {onDismiss && (
          <Button variant="ghost" size="sm" onClick={onDismiss}>
            <X className="w-4 h-4" />
          </Button>
        )}
      </AlertDescription>
    </Alert>
  );
};

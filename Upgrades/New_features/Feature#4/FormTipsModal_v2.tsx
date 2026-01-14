import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  PlayCircle,
  AlertTriangle,
  CheckCircle,
  Lightbulb,
  TrendingUp,
  TrendingDown,
  Target,
  ExternalLink,
  Wind,
  Shield,
  Zap,
  Film,
  Image as ImageIcon,
} from 'lucide-react';
import { ExerciseFormTips, getYouTubeEmbedUrl } from '@/utils/exerciseFormTips';

interface FormTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formTips: ExerciseFormTips | null;
}

export const FormTipsModal: React.FC<FormTipsModalProps> = ({
  open,
  onOpenChange,
  formTips,
}) => {
  const [activeTab, setActiveTab] = useState('overview');
  const [showVideo, setShowVideo] = useState(false); // Toggle between GIF and video

  if (!formTips) return null;

  const embedUrl = formTips.videoUrl ? getYouTubeEmbedUrl(formTips.videoUrl) : null;
  const hasGif = !!formTips.gifUrl;
  const hasVideo = !!embedUrl;
  const hasBoth = hasGif && hasVideo;

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-success/20 text-success';
      case 'intermediate':
        return 'bg-warning/20 text-warning';
      case 'advanced':
        return 'bg-destructive/20 text-destructive';
      default:
        return 'bg-muted';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'injury-risk':
        return 'border-destructive bg-destructive/10';
      case 'major':
        return 'border-warning bg-warning/10';
      case 'minor':
        return 'border-accent bg-accent/10';
      default:
        return 'border-border';
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'injury-risk':
        return <AlertTriangle className="w-4 h-4 text-destructive" />;
      case 'major':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-accent" />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Target className="w-6 h-6 text-primary" />
            {formTips.exerciseName}
            <Badge className={getDifficultyColor(formTips.difficulty)}>
              {formTips.difficulty}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="form">Form Cues</TabsTrigger>
            <TabsTrigger value="mistakes">Mistakes</TabsTrigger>
            <TabsTrigger value="variations">Variations</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* Visual Content - GIF or Video */}
            {(hasGif || hasVideo) && (
              <div className="space-y-3">
                {/* Toggle buttons if both available */}
                {hasBoth && (
                  <div className="flex gap-2">
                    <Button
                      variant={showVideo ? 'outline' : 'default'}
                      size="sm"
                      onClick={() => setShowVideo(false)}
                      className="flex items-center gap-2"
                    >
                      <ImageIcon className="w-4 h-4" />
                      GIF
                    </Button>
                    <Button
                      variant={showVideo ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setShowVideo(true)}
                      className="flex items-center gap-2"
                    >
                      <Film className="w-4 h-4" />
                      Video Tutorial
                    </Button>
                  </div>
                )}

                {/* Show GIF or Video based on toggle */}
                {!showVideo && hasGif ? (
                  <div className="bg-black rounded-lg overflow-hidden flex items-center justify-center p-4">
                    <img
                      src={formTips.gifUrl}
                      alt={formTips.exerciseName}
                      className="max-w-full h-auto rounded"
                      style={{ maxHeight: '400px' }}
                    />
                  </div>
                ) : showVideo && hasVideo && embedUrl ? (
                  <div className="aspect-video w-full bg-black rounded-lg overflow-hidden">
                    <iframe
                      src={embedUrl}
                      title={formTips.exerciseName}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                ) : null}

                {/* Info about visual type */}
                <div className="text-xs text-muted-foreground text-center">
                  {!showVideo && hasGif && (
                    <span>Animated demonstration • Loops automatically</span>
                  )}
                  {showVideo && hasVideo && (
                    <span>Full video tutorial with detailed explanation</span>
                  )}
                </div>
              </div>
            )}

            {/* Muscle Groups */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  Primary Muscles
                </h4>
                <ul className="space-y-1">
                  {formTips.primaryMuscles.map((muscle, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-primary" />
                      {muscle}
                    </li>
                  ))}
                </ul>
              </div>

              {formTips.secondaryMuscles && formTips.secondaryMuscles.length > 0 && (
                <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Target className="w-4 h-4 text-accent" />
                    Secondary Muscles
                  </h4>
                  <ul className="space-y-1">
                    {formTips.secondaryMuscles.map((muscle, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground flex items-center gap-2">
                        <CheckCircle className="w-3 h-3 text-accent" />
                        {muscle}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Programming Info */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Rep Range</p>
                <p className="text-lg font-bold text-foreground">{formTips.recommendedRepRange}</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Sets</p>
                <p className="text-lg font-bold text-foreground">{formTips.recommendedSets}</p>
              </div>
              <div className="p-3 bg-muted/20 rounded-lg text-center">
                <p className="text-xs text-muted-foreground mb-1">Rest</p>
                <p className="text-lg font-bold text-foreground">{formTips.restPeriod}</p>
              </div>
            </div>

            {/* Pro Tips */}
            {formTips.proTips && formTips.proTips.length > 0 && (
              <div className="p-4 bg-warning/10 rounded-lg border border-warning/20">
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Lightbulb className="w-4 h-4 text-warning" />
                  Pro Tips
                </h4>
                <ul className="space-y-2">
                  {formTips.proTips.map((tip, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                      <Zap className="w-3 h-3 text-warning mt-1 flex-shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </TabsContent>

          {/* Form Cues Tab */}
          <TabsContent value="form" className="space-y-4">
            {/* GIF at top of form cues for reference */}
            {hasGif && (
              <div className="bg-muted/20 rounded-lg p-3 flex items-center justify-center">
                <img
                  src={formTips.gifUrl}
                  alt={formTips.exerciseName}
                  className="max-h-48 rounded"
                />
              </div>
            )}

            {/* Setup Cues */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-primary" />
                Setup
              </h3>
              <div className="space-y-2">
                {formTips.setupCues.map((cue, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-foreground">{cue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Execution Cues */}
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                <PlayCircle className="w-5 h-5 text-success" />
                Execution
              </h3>
              <div className="space-y-2">
                {formTips.executionCues.map((cue, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 bg-muted/20 rounded-lg">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-success/20 flex items-center justify-center text-xs font-bold text-success">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-foreground">{cue}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Breathing Cues */}
            {formTips.breathingCues && formTips.breathingCues.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Wind className="w-5 h-5 text-accent" />
                  Breathing
                </h3>
                <div className="space-y-2">
                  {formTips.breathingCues.map((cue, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-3 bg-accent/10 rounded-lg">
                      <Wind className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-foreground">{cue}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Safety Tips */}
            {formTips.safetyTips && formTips.safetyTips.length > 0 && (
              <Alert className="bg-destructive/10 border-destructive/20">
                <Shield className="w-4 h-4 text-destructive" />
                <AlertDescription>
                  <p className="font-semibold text-foreground mb-2">Safety Tips:</p>
                  <ul className="space-y-1">
                    {formTips.safetyTips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {tip}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Common Mistakes Tab */}
          <TabsContent value="mistakes" className="space-y-3">
            {formTips.commonMistakes.map((mistake, idx) => (
              <div
                key={idx}
                className={`p-4 rounded-lg border-2 ${getSeverityColor(mistake.severity)}`}
              >
                <div className="flex items-start gap-3">
                  {getSeverityIcon(mistake.severity)}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-foreground">{mistake.mistake}</h4>
                      <Badge variant="outline" className="text-xs">
                        {mistake.severity.replace('-', ' ')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      <span className="font-medium text-foreground">Fix: </span>
                      {mistake.correction}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </TabsContent>

          {/* Variations Tab */}
          <TabsContent value="variations" className="space-y-4">
            {/* Easier Variations */}
            {formTips.easier && formTips.easier.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingDown className="w-5 h-5 text-success" />
                  Easier Variations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formTips.easier.map((variation, idx) => (
                    <div key={idx} className="p-3 bg-success/10 rounded-lg border border-success/20">
                      <p className="text-sm text-foreground">{variation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Harder Variations */}
            {formTips.harder && formTips.harder.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-destructive" />
                  Harder Variations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formTips.harder.map((variation, idx) => (
                    <div key={idx} className="p-3 bg-destructive/10 rounded-lg border border-destructive/20">
                      <p className="text-sm text-foreground">{variation}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Alternatives */}
            {formTips.alternatives && formTips.alternatives.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-accent" />
                  Alternative Exercises
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {formTips.alternatives.map((alt, idx) => (
                    <div key={idx} className="p-3 bg-accent/10 rounded-lg border border-accent/20">
                      <p className="text-sm text-foreground">{alt}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Prerequisites */}
            {formTips.prerequisites && formTips.prerequisites.length > 0 && (
              <Alert>
                <AlertDescription>
                  <p className="font-semibold text-foreground mb-2">Prerequisites:</p>
                  <ul className="space-y-1">
                    {formTips.prerequisites.map((prereq, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground">
                        • {prereq}
                      </li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            {formTips.externalLinks && formTips.externalLinks.length > 0 && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-3">External Resources</h3>
                <div className="space-y-3">
                  {formTips.externalLinks.map((link, idx) => (
                    <a
                      key={idx}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-4 bg-muted/20 rounded-lg border border-border hover:bg-muted/30 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ExternalLink className="w-4 h-4 text-primary" />
                          <div>
                            <p className="font-medium text-foreground">{link.title}</p>
                            <p className="text-xs text-muted-foreground capitalize">{link.type}</p>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          Open
                        </Button>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {formTips.videoUrl && (
              <div className="p-4 bg-primary/10 rounded-lg border border-primary/20">
                <p className="text-sm text-muted-foreground mb-2">Primary Video:</p>
                <a
                  href={formTips.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-2"
                >
                  <PlayCircle className="w-4 h-4" />
                  Watch on YouTube
                </a>
              </div>
            )}

            {formTips.gifUrl && formTips.gymVisualId && (
              <div className="p-4 bg-accent/10 rounded-lg border border-accent/20">
                <p className="text-sm text-muted-foreground mb-2">Animation Source:</p>
                <a
                  href={`https://gymvisual.com/${formTips.gymVisualId}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent hover:underline flex items-center gap-2"
                >
                  <ImageIcon className="w-4 h-4" />
                  View on GymVisual
                </a>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

/**
 * Compact Form Tips button with GIF indicator
 */
interface FormTipsButtonProps {
  exerciseId: string;
  exerciseName: string;
  formTips: ExerciseFormTips | null;
}

export const FormTipsButton: React.FC<FormTipsButtonProps> = ({
  exerciseId,
  exerciseName,
  formTips,
}) => {
  const [modalOpen, setModalOpen] = useState(false);

  if (!formTips) return null;

  const hasGif = !!formTips.gifUrl;
  const hasVideo = !!formTips.videoUrl;

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setModalOpen(true)}
        className="flex items-center gap-2"
      >
        {hasGif ? <ImageIcon className="w-4 h-4" /> : <PlayCircle className="w-4 h-4" />}
        Form Guide
        {hasGif && hasVideo && (
          <Badge variant="secondary" className="ml-1 text-xs px-1">
            GIF + Video
          </Badge>
        )}
      </Button>

      <FormTipsModal open={modalOpen} onOpenChange={setModalOpen} formTips={formTips} />
    </>
  );
};

/**
 * Inline GIF preview for exercise cards
 */
interface ExerciseGifPreviewProps {
  gifUrl: string;
  exerciseName: string;
  className?: string;
}

export const ExerciseGifPreview: React.FC<ExerciseGifPreviewProps> = ({
  gifUrl,
  exerciseName,
  className = '',
}) => {
  return (
    <div className={`relative overflow-hidden rounded-lg bg-black ${className}`}>
      <img
        src={gifUrl}
        alt={exerciseName}
        className="w-full h-full object-contain"
        loading="lazy"
      />
    </div>
  );
};

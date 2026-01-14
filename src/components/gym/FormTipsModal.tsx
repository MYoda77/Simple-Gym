import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Play, AlertCircle, Info, TrendingUp } from "lucide-react";
import { ExerciseFormTips } from "@/data/exerciseFormTips";

interface FormTipsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formTips: ExerciseFormTips | null;
}

export function FormTipsModal({
  open,
  onOpenChange,
  formTips,
}: FormTipsModalProps) {
  const [showVideo, setShowVideo] = useState(false);

  if (!formTips) return null;

  const getDifficultyVariant = (difficulty?: string) => {
    switch (difficulty) {
      case "beginner":
        return "default";
      case "intermediate":
        return "secondary";
      case "advanced":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "injury-risk":
        return "border-red-500 bg-red-50 dark:bg-red-950 text-red-950 dark:text-red-50";
      case "major":
        return "border-yellow-500 bg-yellow-50 dark:bg-yellow-950 text-yellow-950 dark:text-yellow-50";
      case "minor":
        return "border-blue-500 bg-blue-50 dark:bg-blue-950 text-blue-950 dark:text-blue-50";
      default:
        return "";
    }
  };

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "injury-risk":
        return (
          <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
        );
      case "major":
        return (
          <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
        );
      case "minor":
        return <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between gap-2">
            <span>{formTips.exerciseName}</span>
            {formTips.difficulty && (
              <Badge variant={getDifficultyVariant(formTips.difficulty)}>
                {formTips.difficulty}
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-muted">
            <TabsTrigger
              value="overview"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Overview
            </TabsTrigger>
            <TabsTrigger
              value="form"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Form Cues
            </TabsTrigger>
            <TabsTrigger
              value="mistakes"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Mistakes
            </TabsTrigger>
            <TabsTrigger
              value="variations"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Variations
            </TabsTrigger>
            <TabsTrigger
              value="resources"
              className="data-[state=active]:bg-background data-[state=active]:text-foreground"
            >
              Resources
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            {/* GIF/Video Display */}
            <div className="bg-black rounded-lg overflow-hidden">
              {showVideo && formTips.videoUrl ? (
                <div className="aspect-video">
                  <iframe
                    width="100%"
                    height="100%"
                    src={formTips.videoUrl}
                    title={formTips.exerciseName}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              ) : (
                <div className="flex items-center justify-center p-4">
                  <img
                    src={formTips.gifUrl}
                    alt={formTips.exerciseName}
                    className="max-h-[400px] object-contain"
                  />
                </div>
              )}
            </div>

            {/* Toggle Video Button */}
            {formTips.videoUrl && (
              <Button
                onClick={() => setShowVideo(!showVideo)}
                variant="outline"
                className="w-full"
              >
                <Play className="h-4 w-4 mr-2" />
                {showVideo ? "Show GIF" : "Watch Video Tutorial"}
              </Button>
            )}

            {/* Muscle Groups */}
            <div className="space-y-2">
              <h3 className="font-semibold text-sm">Target Muscles</h3>
              <div className="flex flex-wrap gap-2">
                {formTips.primaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="default">
                    {muscle}
                  </Badge>
                ))}
                {formTips.secondaryMuscles.map((muscle) => (
                  <Badge key={muscle} variant="secondary">
                    {muscle}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Programming Recommendations */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold text-sm mb-3">Programming</h3>
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Reps</p>
                    <p className="font-medium">
                      {formTips.recommendedRepRange}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Sets</p>
                    <p className="font-medium">{formTips.recommendedSets}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Rest</p>
                    <p className="font-medium">{formTips.restPeriod}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Pro Tips */}
            {formTips.proTips && formTips.proTips.length > 0 && (
              <Card className="bg-primary/5">
                <CardContent className="pt-6">
                  <h3 className="font-semibold text-sm mb-3 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-primary" />
                    Pro Tips
                  </h3>
                  <ul className="space-y-2">
                    {formTips.proTips.map((tip, index) => (
                      <li key={index} className="text-sm flex gap-2">
                        <span className="text-primary mt-1">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Form Cues Tab */}
          <TabsContent value="form" className="space-y-4">
            {/* Setup Cues */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Setup</h3>
                <ul className="space-y-2">
                  {formTips.setupCues.map((cue, index) => (
                    <li key={index} className="text-sm flex gap-2">
                      <span className="text-primary font-bold">
                        {index + 1}.
                      </span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Execution Cues */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">Execution</h3>
                <ul className="space-y-2">
                  {formTips.executionCues.map((cue, index) => (
                    <li key={index} className="text-sm flex gap-2">
                      <span className="text-primary font-bold">
                        {index + 1}.
                      </span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Breathing Cues */}
            {formTips.breathingCues && formTips.breathingCues.length > 0 && (
              <Card className="bg-accent/50">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Breathing Pattern</h3>
                  <ul className="space-y-2">
                    {formTips.breathingCues.map((cue, index) => (
                      <li key={index} className="text-sm flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{cue}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Safety Tips */}
            {formTips.safetyTips && formTips.safetyTips.length > 0 && (
              <Card className="border-primary">
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-primary" />
                    Safety Tips
                  </h3>
                  <ul className="space-y-2">
                    {formTips.safetyTips.map((tip, index) => (
                      <li key={index} className="text-sm flex gap-2">
                        <span className="text-primary">•</span>
                        <span>{tip}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Mistakes Tab */}
          <TabsContent value="mistakes" className="space-y-3">
            {formTips.commonMistakes.map((mistake, index) => (
              <Card
                key={index}
                className={`border-2 ${getSeverityColor(mistake.severity)}`}
              >
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    {getSeverityIcon(mistake.severity)}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-current">
                          {mistake.mistake}
                        </h4>
                        <Badge
                          variant="outline"
                          className="capitalize border-current text-current"
                        >
                          {mistake.severity.replace("-", " ")}
                        </Badge>
                      </div>
                      <p className="text-sm opacity-90">{mistake.correction}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {/* Variations Tab */}
          <TabsContent value="variations" className="space-y-4">
            {/* Easier Variations */}
            {formTips.easier && formTips.easier.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 rotate-180 text-green-600" />
                    Easier Variations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formTips.easier.map((variation) => (
                      <Badge key={variation} variant="secondary">
                        {variation}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Harder Variations */}
            {formTips.harder && formTips.harder.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-red-600" />
                    Harder Variations
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {formTips.harder.map((variation) => (
                      <Badge key={variation} variant="secondary">
                        {variation}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Alternative Exercises */}
            {formTips.alternatives && formTips.alternatives.length > 0 && (
              <Card>
                <CardContent className="pt-6">
                  <h3 className="font-semibold mb-3">Alternative Exercises</h3>
                  <div className="flex flex-wrap gap-2">
                    {formTips.alternatives.map((alt) => (
                      <Badge key={alt} variant="outline">
                        {alt}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">About This Exercise</h3>
                <div className="space-y-4 text-sm">
                  <div>
                    <p className="font-medium mb-1">Primary Muscles</p>
                    <p className="text-muted-foreground">
                      {formTips.primaryMuscles.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Secondary Muscles</p>
                    <p className="text-muted-foreground">
                      {formTips.secondaryMuscles.join(", ")}
                    </p>
                  </div>
                  <div>
                    <p className="font-medium mb-1">Difficulty Level</p>
                    <p className="text-muted-foreground capitalize">
                      {formTips.difficulty || "Not specified"}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* External Resources */}
            <Card>
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-3">External Resources</h3>
                <div className="space-y-2">
                  {formTips.gymVisualId && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={`https://gymvisual.com/`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View on GymVisual
                      </a>
                    </Button>
                  )}
                  {formTips.videoUrl && (
                    <Button
                      variant="outline"
                      className="w-full justify-start"
                      asChild
                    >
                      <a
                        href={formTips.videoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Play className="h-4 w-4 mr-2" />
                        Watch Video Tutorial
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

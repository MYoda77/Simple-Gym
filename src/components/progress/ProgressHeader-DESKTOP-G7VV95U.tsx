import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ProgressHeaderProps {
  onBack?: () => void;
  onReset?: () => void;
}

export const ProgressHeader = ({ onBack, onReset }: ProgressHeaderProps) => {
  return (
    <header className="sticky top-0 z-10 bg-background/80 backdrop-blur-sm border-b border-border/20">
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-foreground">My Progress</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onReset}
            className="h-9 w-9"
            title="Go to Profile to Reset All Data"
          >
            <RotateCcw className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

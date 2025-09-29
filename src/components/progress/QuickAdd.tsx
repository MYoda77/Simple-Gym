import { Button } from "@/components/ui/button";
import { Scale, Camera } from "lucide-react";

interface QuickAddProps {
  onLogWeight?: () => void;
  onAddPhoto?: () => void;
}

export const QuickAdd = ({ onLogWeight, onAddPhoto }: QuickAddProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-sm border-t border-border/20 p-4 z-50">
      <div className="flex gap-3 max-w-md mx-auto">
        <Button
          onClick={onLogWeight}
          className="flex-1 flex items-center gap-2 bg-primary hover:bg-primary/90"
        >
          <Scale className="h-4 w-4" />
          Log Weight
        </Button>
        <Button
          onClick={onAddPhoto}
          variant="outline"
          className="flex-1 flex items-center gap-2"
        >
          <Camera className="h-4 w-4" />
          Add Photo
        </Button>
      </div>
    </div>
  );
};
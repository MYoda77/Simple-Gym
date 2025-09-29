import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Scale, Save } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface LogWeightDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (data: { weight: number; bodyFat?: number; notes?: string; date: string }) => void;
}

export const LogWeightDialog = ({ open, onOpenChange, onSave }: LogWeightDialogProps) => {
  const [weight, setWeight] = useState("");
  const [bodyFat, setBodyFat] = useState("");
  const [notes, setNotes] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!weight || isNaN(Number(weight))) {
      toast({
        title: "Invalid weight",
        description: "Please enter a valid weight",
        variant: "destructive",
      });
      return;
    }

    const data = {
      weight: Number(weight),
      bodyFat: bodyFat ? Number(bodyFat) : undefined,
      notes: notes || undefined,
      date: new Date().toISOString(),
    };

    onSave?.(data);
    
    toast({
      title: "Weight logged successfully!",
      description: `Logged ${weight}kg`,
    });

    // Reset form
    setWeight("");
    setBodyFat("");
    setNotes("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5" />
            Log Weight
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              step="0.1"
              placeholder="70.5"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bodyFat">Body Fat % (optional)</Label>
            <Input
              id="bodyFat"
              type="number"
              step="0.1"
              placeholder="15.2"
              value={bodyFat}
              onChange={(e) => setBodyFat(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              placeholder="How are you feeling today?"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none"
              rows={3}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
            Cancel
          </Button>
          <Button onClick={handleSave} className="flex-1 flex items-center gap-2">
            <Save className="h-4 w-4" />
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
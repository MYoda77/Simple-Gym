import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Share2, Download, Copy } from "lucide-react";
import { Achievement } from "@/types/progress";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AchievementShareButtonProps {
  achievement: Achievement;
  onShare?: (method: string) => void;
}

export const AchievementShareButton: React.FC<AchievementShareButtonProps> = ({
  achievement,
  onShare,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateShareText = () => {
    return `🏆 Achievement Unlocked!\n\n${achievement.icon} ${achievement.title}\n${achievement.description}\n\n#Fitness #Achievement #SimpleGym`;
  };

  const handleCopyText = async () => {
    const text = generateShareText();
    try {
      await navigator.clipboard.writeText(text);
      onShare?.("text");
    } catch (err) {
      console.error("Failed to copy text:", err);
    }
  };

  const handleDownloadImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    canvas.width = 800;
    canvas.height = 400;

    // Background gradient
    const gradient = ctx.createLinearGradient(
      0,
      0,
      canvas.width,
      canvas.height
    );
    gradient.addColorStop(0, "#1a1a2e");
    gradient.addColorStop(1, "#16213e");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = "#FFD700";
    ctx.lineWidth = 4;
    ctx.strokeRect(10, 10, canvas.width - 20, canvas.height - 20);

    // Achievement icon
    ctx.font = "bold 100px Arial";
    ctx.textAlign = "center";
    ctx.fillText(achievement.icon, canvas.width / 2, 140);

    // Title
    ctx.font = "bold 32px Arial";
    ctx.fillStyle = "#FFD700";
    ctx.fillText("Achievement Unlocked!", canvas.width / 2, 200);

    // Achievement title
    ctx.font = "bold 40px Arial";
    ctx.fillStyle = "#FFFFFF";
    ctx.fillText(achievement.title, canvas.width / 2, 260);

    // Description
    ctx.font = "20px Arial";
    ctx.fillStyle = "#CCCCCC";
    ctx.fillText(
      achievement.description || "Achievement unlocked!",
      canvas.width / 2,
      300
    );

    // Date
    const date = achievement.unlockedAt
      ? new Date(achievement.unlockedAt).toLocaleDateString()
      : achievement.date
      ? new Date(achievement.date).toLocaleDateString()
      : new Date().toLocaleDateString();
    ctx.font = "16px Arial";
    ctx.fillStyle = "#999999";
    ctx.fillText(date, canvas.width / 2, 350);

    // Convert canvas to blob and download
    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `achievement-${achievement.id}.png`;
      link.click();
      URL.revokeObjectURL(url);
      onShare?.("image");
    });
  };

  const handleShare = async () => {
    const text = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Achievement Unlocked!",
          text: text,
        });
        onShare?.("native");
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          console.error("Error sharing:", err);
        }
      }
    } else {
      handleCopyText();
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <Share2 className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleCopyText}>
          <Copy className="w-4 h-4 mr-2" />
          Copy Text
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleDownloadImage}>
          <Download className="w-4 h-4 mr-2" />
          Download Image
        </DropdownMenuItem>
        {typeof navigator !== "undefined" && "share" in navigator && (
          <DropdownMenuItem onClick={handleShare}>
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

interface ExportAchievementsButtonProps {
  achievements: Achievement[];
}

export const ExportAchievementsButton: React.FC<
  ExportAchievementsButtonProps
> = ({ achievements }) => {
  const handleExport = () => {
    const exportData = {
      achievements: achievements.map((a) => ({
        id: a.id,
        title: a.title,
        description: a.description,
        icon: a.icon,
        unlockedAt: a.unlockedAt || a.date,
        category: a.category,
      })),
      exportDate: new Date().toISOString(),
      totalAchievements: achievements.length,
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `achievements-${
      new Date().toISOString().split("T")[0]
    }.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      <Download className="w-4 h-4 mr-2" />
      Export All
    </Button>
  );
};

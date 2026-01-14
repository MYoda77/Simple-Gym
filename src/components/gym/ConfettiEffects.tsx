import { useEffect } from "react";
import confetti from "canvas-confetti";
import type { CelebrationType } from "@/utils/confettiUtils";

interface ConfettiCelebrationProps {
  trigger: boolean;
  onComplete?: () => void;
  type?: CelebrationType;
}

export const ConfettiCelebration: React.FC<ConfettiCelebrationProps> = ({
  trigger,
  onComplete,
  type = "achievement",
}) => {
  useEffect(() => {
    if (!trigger) return;

    const colors = {
      achievement: ["#FFD700", "#FFA500", "#FF6347"],
      pr: ["#00CED1", "#1E90FF", "#4169E1"],
      streak: ["#FF4500", "#FF6347", "#FF8C00"],
      workout: ["#32CD32", "#00FF00", "#ADFF2F"],
    };

    const fireConfetti = () => {
      const count = 200;
      const defaults = {
        origin: { y: 0.7 },
        colors: colors[type],
      };

      function fire(particleRatio: number, opts: confetti.Options) {
        confetti({
          ...defaults,
          ...opts,
          particleCount: Math.floor(count * particleRatio),
        });
      }

      fire(0.25, {
        spread: 26,
        startVelocity: 55,
      });

      fire(0.2, {
        spread: 60,
      });

      fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2,
      });

      fire(0.1, {
        spread: 120,
        startVelocity: 45,
      });
    };

    // Achievement gets multiple bursts
    if (type === "achievement") {
      fireConfetti();
      setTimeout(fireConfetti, 250);
      setTimeout(fireConfetti, 500);
    } else {
      fireConfetti();
    }

    // Call onComplete after animation
    const timer = setTimeout(() => {
      onComplete?.();
    }, 3000);

    return () => clearTimeout(timer);
  }, [trigger, type, onComplete]);

  return null;
};

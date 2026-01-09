import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ConfettiParticle {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  velocityX: number;
  velocityY: number;
  rotationSpeed: number;
}

interface AchievementUnlockNotificationProps {
  achievement: {
    icon: string;
    title: string;
    description: string;
  };
  show: boolean;
  onClose: () => void;
}

export const AchievementUnlockNotification: React.FC<
  AchievementUnlockNotificationProps
> = ({ achievement, show, onClose }) => {
  const [confetti, setConfetti] = useState<ConfettiParticle[]>([]);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);

      // Generate confetti particles
      const particles: ConfettiParticle[] = [];
      const colors = [
        "#FFD700",
        "#FFA500",
        "#FF6347",
        "#4169E1",
        "#32CD32",
        "#FF69B4",
      ];

      for (let i = 0; i < 50; i++) {
        particles.push({
          id: i,
          x: 50, // Start from center
          y: 50,
          rotation: Math.random() * 360,
          color: colors[Math.floor(Math.random() * colors.length)],
          size: Math.random() * 10 + 5,
          velocityX: (Math.random() - 0.5) * 100,
          velocityY: (Math.random() - 0.5) * 100,
          rotationSpeed: (Math.random() - 0.5) * 360,
        });
      }

      setConfetti(particles);

      // Auto-close after 5 seconds
      const timer = setTimeout(() => {
        onClose();
      }, 5000);

      return () => clearTimeout(timer);
    } else {
      setConfetti([]);
      setIsVisible(false);
    }
  }, [show, onClose]);

  if (!isVisible) return null;

  return (
    <>
      {/* Confetti Layer */}
      <div className="fixed inset-0 pointer-events-none z-[100]">
        {confetti.map((particle) => {
          const randomDelay = Math.random() * 0.2;
          const randomDuration = 2.5 + Math.random();

          return (
            <div
              key={particle.id}
              className="absolute opacity-100"
              style={{
                left: `${particle.x}%`,
                top: `${particle.y}%`,
                width: `${particle.size}px`,
                height: `${particle.size}px`,
                backgroundColor: particle.color,
                borderRadius: particle.size % 2 === 0 ? "50%" : "2px",
                transform: `rotate(${particle.rotation}deg) translateX(${particle.velocityX}px)`,
                animation: `confetti-fall ${randomDuration}s ease-out ${randomDelay}s forwards`,
              }}
            />
          );
        })}
      </div>

      {/* Achievement Notification Overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[101] p-4 animate-in fade-in duration-300">
        <div className="relative w-full max-w-md animate-in zoom-in-95 duration-500">
          <Card className="relative overflow-hidden bg-gradient-to-br from-yellow-500/20 via-primary/20 to-purple-500/20 border-2 border-yellow-500/50 backdrop-blur-xl">
            {/* Close Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="absolute top-2 right-2 z-10 hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>

            {/* Content */}
            <div className="p-8 text-center space-y-4">
              {/* Icon with bounce animation */}
              <div className="text-8xl animate-bounce-slow">
                {achievement.icon}
              </div>

              {/* Title */}
              <div className="space-y-2">
                <h2 className="text-3xl font-bold text-yellow-400 animate-in slide-in-from-bottom duration-500 delay-200">
                  Achievement Unlocked!
                </h2>

                <h3 className="text-2xl font-semibold text-foreground animate-in slide-in-from-bottom duration-500 delay-300">
                  {achievement.title}
                </h3>

                <p className="text-muted-foreground animate-in slide-in-from-bottom duration-500 delay-400">
                  {achievement.description}
                </p>
              </div>

              {/* Shine effect */}
              <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shine" />
            </div>
          </Card>
        </div>
      </div>

      {/* Add custom CSS animations */}
      <style>{`
        @keyframes confetti-fall {
          to {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes shine {
          0% {
            transform: translateX(-100%) skewX(-20deg);
          }
          50% {
            transform: translateX(200%) skewX(-20deg);
          }
          100% {
            transform: translateX(200%) skewX(-20deg);
          }
        }
        
        .animate-confetti-fall {
          animation: confetti-fall 3s ease-out forwards;
        }
        
        .animate-shine {
          animation: shine 3s ease-in-out infinite;
        }
        
        .animate-bounce-slow {
          animation: bounce 2s ease-in-out infinite;
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.1);
          }
        }
      `}</style>
    </>
  );
};

export default AchievementUnlockNotification;

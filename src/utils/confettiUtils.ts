import confetti from "canvas-confetti";

/**
 * Celebration types with their color schemes
 */
export type CelebrationType = "achievement" | "pr" | "streak" | "workout";

const celebrationColors: Record<CelebrationType, string[]> = {
  achievement: ["#FFD700", "#FFA500", "#FF8C00"], // Gold/Orange
  pr: ["#4169E1", "#1E90FF", "#00BFFF"], // Blue
  streak: ["#FF4500", "#FF6347", "#FF7F50"], // Red/Orange
  workout: ["#32CD32", "#00FF00", "#7FFF00"], // Green
};

/**
 * Trigger a confetti celebration
 */
export const triggerConfetti = (
  type: CelebrationType = "achievement",
  customOptions?: confetti.Options
) => {
  const colors = celebrationColors[type];

  const defaults: confetti.Options = {
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors,
  };

  confetti({
    ...defaults,
    ...customOptions,
  });
};

/**
 * Trigger a legendary confetti celebration (multi-burst)
 */
export const triggerLegendaryConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  function randomInRange(min: number, max: number) {
    return Math.random() * (max - min) + min;
  }

  const interval: NodeJS.Timeout = setInterval(function () {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);

    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FF8C00"],
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ["#FFD700", "#FFA500", "#FF8C00"],
    });
  }, 250);
};

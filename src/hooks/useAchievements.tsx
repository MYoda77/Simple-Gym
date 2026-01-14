import { useState, useCallback, useEffect } from "react";
import {
  Achievement,
  UserStats,
  checkAchievements,
  ACHIEVEMENTS,
} from "@/utils/achievementSystem";
import { getAchievementRarity, RARITY_COLORS } from "@/utils/achievementRarity";

const STORAGE_KEY = "progress-achievements";

export function useAchievements() {
  // Load achievements from localStorage
  const [achievements, setAchievements] = useState<Achievement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure all achievements have the full data from ACHIEVEMENTS
        return parsed.map((saved: Achievement) => {
          const template = ACHIEVEMENTS.find((a) => a.id === saved.id);
          return template
            ? { ...template, unlockedAt: saved.unlockedAt }
            : saved;
        });
      }
      return [];
    } catch (error) {
      console.error("Error loading achievements:", error);
      return [];
    }
  });

  // Save achievements to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(achievements));
    } catch (error) {
      console.error("Error saving achievements:", error);
    }
  }, [achievements]);

  /**
   * Check and unlock new achievements based on current stats
   * @param stats Current user statistics
   * @returns Array of newly unlocked achievements
   */
  const checkAndUnlockAchievements = useCallback(
    (stats: UserStats): Achievement[] => {
      const newAchievements = checkAchievements(stats, achievements);

      if (newAchievements.length > 0) {
        setAchievements((prev) => [...prev, ...newAchievements]);

        // Add to recent activities
        try {
          const currentActivities = JSON.parse(
            localStorage.getItem("progress-activities") || "[]"
          );

          newAchievements.forEach((achievement) => {
            currentActivities.unshift({
              id: `achievement-${achievement.id}-${Date.now()}`,
              type: "achievement" as const,
              date: achievement.unlockedAt || new Date().toISOString(),
              description: achievement.title,
              icon: "trophy",
            });
          });

          localStorage.setItem(
            "progress-activities",
            JSON.stringify(currentActivities.slice(0, 20))
          );
        } catch (error) {
          console.error("Error updating activities:", error);
        }
      }

      return newAchievements;
    },
    [achievements]
  );

  /**
   * Reset all achievements (useful for data reset)
   */
  const resetAchievements = useCallback(() => {
    setAchievements([]);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  /**
   * Get achievements by category
   */
  const getAchievementsByCategory = useCallback(
    (category: Achievement["category"]) => {
      return achievements.filter((a) => a.category === category);
    },
    [achievements]
  );

  /**
   * Check if a specific achievement is unlocked
   */
  const isUnlocked = useCallback(
    (achievementId: string) => {
      return achievements.some((a) => a.id === achievementId);
    },
    [achievements]
  );

  /**
   * Get total achievement count
   */
  const getTotalAchievements = useCallback(() => {
    return ACHIEVEMENTS.length;
  }, []);

  /**
   * Get unlocked achievement count
   */
  const getUnlockedCount = useCallback(() => {
    return achievements.length;
  }, [achievements]);

  /**
   * Get completion percentage
   */
  const getCompletionPercentage = useCallback(() => {
    return Math.round((achievements.length / ACHIEVEMENTS.length) * 100);
  }, [achievements]);

  return {
    achievements,
    checkAndUnlockAchievements,
    resetAchievements,
    getAchievementsByCategory,
    isUnlocked,
    getTotalAchievements,
    getUnlockedCount,
    getCompletionPercentage,
  };
}

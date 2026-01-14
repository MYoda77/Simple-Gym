import { describe, it, expect } from "@jest/globals";
import type { Achievement } from "@/types/progress";
import {
  getAchievementRarity,
  calculateTotalPoints,
  calculateTierProgress,
  getRarityDistribution,
  getRarestAchievement,
  sortByRarity,
  getAchievementsByRarity,
  calculateRarityCompletion,
  getNextLegendary,
  getPointsUntilNextTier,
  RARITY_POINTS,
  TIER_THRESHOLDS,
  type AchievementRarity,
  type AchievementTier,
} from "./achievementRarity";

describe("Achievement Rarity System", () => {
  // Mock achievements
  const mockAchievements: Achievement[] = [
    {
      id: "first-workout",
      title: "First Workout",
      description: "Complete your first workout",
      icon: "🎯",
      date: "2024-01-01",
    },
    {
      id: "workouts-10",
      title: "10 Workouts",
      description: "Complete 10 workouts",
      icon: "💪",
      date: "2024-01-15",
    },
    {
      id: "workouts-50",
      title: "50 Workouts",
      description: "Complete 50 workouts",
      icon: "🔥",
      date: "2024-02-01",
    },
    {
      id: "workouts-100",
      title: "100 Workouts",
      description: "Complete 100 workouts",
      icon: "⭐",
      date: "2024-03-01",
    },
  ];

  describe("getAchievementRarity", () => {
    it("should return correct rarity and points for common achievement", () => {
      const result = getAchievementRarity("first-workout");
      expect(result.rarity).toBe("common");
      expect(result.points).toBe(RARITY_POINTS.common);
      expect(result.unlockRate).toBe(100);
    });

    it("should return correct rarity and points for rare achievement", () => {
      const result = getAchievementRarity("workouts-10");
      expect(result.rarity).toBe("rare");
      expect(result.points).toBe(RARITY_POINTS.rare);
      expect(result.unlockRate).toBe(70);
    });

    it("should return correct rarity and points for epic achievement", () => {
      const result = getAchievementRarity("workouts-50");
      expect(result.rarity).toBe("epic");
      expect(result.points).toBe(RARITY_POINTS.epic);
      expect(result.unlockRate).toBe(25);
    });

    it("should return correct rarity and points for legendary achievement", () => {
      const result = getAchievementRarity("workouts-100");
      expect(result.rarity).toBe("legendary");
      expect(result.points).toBe(RARITY_POINTS.legendary);
      expect(result.unlockRate).toBe(10);
    });

    it("should return default common rarity for unknown achievement", () => {
      const result = getAchievementRarity("unknown-achievement");
      expect(result.rarity).toBe("common");
      expect(result.points).toBe(RARITY_POINTS.common);
      expect(result.unlockRate).toBe(100);
    });
  });

  describe("calculateTotalPoints", () => {
    it("should calculate correct total points for multiple achievements", () => {
      const total = calculateTotalPoints(mockAchievements);
      // first-workout (5) + workouts-10 (15) + workouts-50 (30) + workouts-100 (100) = 150
      expect(total).toBe(150);
    });

    it("should return 0 for empty achievement array", () => {
      const total = calculateTotalPoints([]);
      expect(total).toBe(0);
    });

    it("should handle single achievement", () => {
      const total = calculateTotalPoints([mockAchievements[0]]);
      expect(total).toBe(5); // common = 5 points
    });
  });

  describe("calculateTierProgress", () => {
    it("should return bronze tier with 0 points", () => {
      const progress = calculateTierProgress(0);
      expect(progress.currentTier).toBe("bronze");
      expect(progress.nextTier).toBe("silver");
      expect(progress.currentPoints).toBe(0);
      expect(progress.pointsForNextTier).toBe(TIER_THRESHOLDS.silver);
      expect(progress.progress).toBe(0);
    });

    it("should return bronze tier with partial progress", () => {
      const progress = calculateTierProgress(50);
      expect(progress.currentTier).toBe("bronze");
      expect(progress.nextTier).toBe("silver");
      expect(progress.progress).toBe(50); // 50/100 = 50%
    });

    it("should return silver tier at threshold", () => {
      const progress = calculateTierProgress(100);
      expect(progress.currentTier).toBe("silver");
      expect(progress.nextTier).toBe("gold");
      expect(progress.pointsForNextTier).toBe(TIER_THRESHOLDS.gold);
    });

    it("should return gold tier at threshold", () => {
      const progress = calculateTierProgress(500);
      expect(progress.currentTier).toBe("gold");
      expect(progress.nextTier).toBe("platinum");
      expect(progress.pointsForNextTier).toBe(TIER_THRESHOLDS.platinum);
    });

    it("should return platinum tier with no next tier", () => {
      const progress = calculateTierProgress(1500);
      expect(progress.currentTier).toBe("platinum");
      expect(progress.nextTier).toBe(null);
      expect(progress.progress).toBe(100);
    });

    it("should calculate progress correctly between tiers", () => {
      const progress = calculateTierProgress(300); // silver tier
      // From silver (100) to gold (500), at 300 points = 200 points in tier / 400 points needed = 50%
      expect(progress.currentTier).toBe("silver");
      expect(progress.nextTier).toBe("gold");
      expect(progress.progress).toBe(50);
    });
  });

  describe("getRarityDistribution", () => {
    it("should return correct distribution of rarities", () => {
      const distribution = getRarityDistribution(mockAchievements);
      expect(distribution.common).toBe(1); // first-workout
      expect(distribution.rare).toBe(1); // workouts-10
      expect(distribution.epic).toBe(1); // workouts-50
      expect(distribution.legendary).toBe(1); // workouts-100
    });

    it("should return all zeros for empty achievements", () => {
      const distribution = getRarityDistribution([]);
      expect(distribution.common).toBe(0);
      expect(distribution.rare).toBe(0);
      expect(distribution.epic).toBe(0);
      expect(distribution.legendary).toBe(0);
    });

    it("should handle multiple achievements of same rarity", () => {
      const achievements: Achievement[] = [
        mockAchievements[0], // common
        {
          ...mockAchievements[0],
          id: "first-pr", // also common
        },
      ];
      const distribution = getRarityDistribution(achievements);
      expect(distribution.common).toBe(2);
    });
  });

  describe("getRarestAchievement", () => {
    it("should return the legendary achievement as rarest", () => {
      const rarest = getRarestAchievement(mockAchievements);
      expect(rarest).not.toBeNull();
      expect(rarest?.id).toBe("workouts-100");
      expect(rarest?.rarity).toBe("legendary");
      expect(rarest?.unlockRate).toBe(10);
    });

    it("should return null for empty achievements", () => {
      const rarest = getRarestAchievement([]);
      expect(rarest).toBeNull();
    });

    it("should handle single achievement", () => {
      const rarest = getRarestAchievement([mockAchievements[0]]);
      expect(rarest).not.toBeNull();
      if (rarest) {
        expect(rarest.id).toBe("first-workout");
      }
    });
  });

  describe("sortByRarity", () => {
    it("should sort achievements with legendary first", () => {
      const sorted = sortByRarity(mockAchievements);
      expect(sorted[0].id).toBe("workouts-100"); // legendary
      expect(sorted[1].id).toBe("workouts-50"); // epic
      expect(sorted[2].id).toBe("workouts-10"); // rare
      expect(sorted[3].id).toBe("first-workout"); // common
    });

    it("should handle empty array", () => {
      const sorted = sortByRarity([]);
      expect(sorted).toEqual([]);
    });

    it("should sort by date within same rarity", () => {
      const achievements: Achievement[] = [
        {
          id: "first-workout",
          title: "First Workout",
          description: "Test",
          icon: "🎯",
          date: "2024-01-01",
        },
        {
          id: "first-pr",
          title: "First PR",
          description: "Test",
          icon: "💪",
          date: "2024-01-15",
        },
      ];
      const sorted = sortByRarity(achievements);
      // Both are common, so should be sorted by date (newest first)
      expect(sorted[0].id).toBe("first-pr");
      expect(sorted[1].id).toBe("first-workout");
    });
  });

  describe("getAchievementsByRarity", () => {
    it("should filter achievements by common rarity", () => {
      const common = getAchievementsByRarity(mockAchievements, "common");
      expect(common).toHaveLength(1);
      expect(common[0].id).toBe("first-workout");
    });

    it("should filter achievements by legendary rarity", () => {
      const legendary = getAchievementsByRarity(mockAchievements, "legendary");
      expect(legendary).toHaveLength(1);
      expect(legendary[0].id).toBe("workouts-100");
    });

    it("should return empty array if no achievements match", () => {
      const result = getAchievementsByRarity(
        [mockAchievements[0]],
        "legendary"
      );
      expect(result).toEqual([]);
    });
  });

  describe("calculateRarityCompletion", () => {
    it("should calculate completion percentages for each rarity", () => {
      const completion = calculateRarityCompletion(mockAchievements);

      expect(completion.common.unlocked).toBe(1);
      expect(completion.rare.unlocked).toBe(1);
      expect(completion.epic.unlocked).toBe(1);
      expect(completion.legendary.unlocked).toBe(1);

      // Each rarity should have a total > 0
      expect(completion.common.total).toBeGreaterThan(0);
      expect(completion.rare.total).toBeGreaterThan(0);
      expect(completion.epic.total).toBeGreaterThan(0);
      expect(completion.legendary.total).toBeGreaterThan(0);

      // Percentages should be calculated
      expect(completion.common.percentage).toBeGreaterThan(0);
      expect(completion.rare.percentage).toBeGreaterThan(0);
      expect(completion.epic.percentage).toBeGreaterThan(0);
      expect(completion.legendary.percentage).toBeGreaterThan(0);
    });

    it("should return 0% for empty achievements", () => {
      const completion = calculateRarityCompletion([]);
      expect(completion.common.percentage).toBe(0);
      expect(completion.rare.percentage).toBe(0);
      expect(completion.epic.percentage).toBe(0);
      expect(completion.legendary.percentage).toBe(0);
    });
  });

  describe("getNextLegendary", () => {
    it("should find next legendary achievement to unlock", () => {
      const achievements = [mockAchievements[0]]; // Only common achievement
      const next = getNextLegendary(achievements);

      expect(next).not.toBeNull();
      expect(next?.rarity).toBe("legendary");
      expect(next?.points).toBe(RARITY_POINTS.legendary);
    });

    it("should return null if all legendary achievements are unlocked", () => {
      // Mock all legendary achievements as unlocked
      const allLegendary: Achievement[] = [
        { id: "workouts-100", title: "", description: "", icon: "", date: "" },
        { id: "streak-30", title: "", description: "", icon: "", date: "" },
        { id: "variety-25", title: "", description: "", icon: "", date: "" },
        {
          id: "ultimate-dedication",
          title: "",
          description: "",
          icon: "",
          date: "",
        },
      ];
      const next = getNextLegendary(allLegendary);
      expect(next).toBeNull();
    });
  });

  describe("getPointsUntilNextTier", () => {
    it("should calculate points needed for bronze to silver", () => {
      const result = getPointsUntilNextTier(50);
      expect(result.nextTier).toBe("silver");
      expect(result.pointsNeeded).toBe(50); // 100 - 50
    });

    it("should calculate points needed for silver to gold", () => {
      const result = getPointsUntilNextTier(200);
      expect(result.nextTier).toBe("gold");
      expect(result.pointsNeeded).toBe(300); // 500 - 200
    });

    it("should calculate points needed for gold to platinum", () => {
      const result = getPointsUntilNextTier(1000);
      expect(result.nextTier).toBe("platinum");
      expect(result.pointsNeeded).toBe(500); // 1500 - 1000
    });

    it("should return 0 and null for platinum tier", () => {
      const result = getPointsUntilNextTier(1500);
      expect(result.nextTier).toBeNull();
      expect(result.pointsNeeded).toBe(0);
    });

    it("should return correct value at tier threshold", () => {
      const result = getPointsUntilNextTier(100); // Exactly at silver
      expect(result.nextTier).toBe("gold");
      expect(result.pointsNeeded).toBe(400); // 500 - 100
    });
  });

  describe("Constants validation", () => {
    it("should have valid tier thresholds in ascending order", () => {
      expect(TIER_THRESHOLDS.bronze).toBe(0);
      expect(TIER_THRESHOLDS.silver).toBeGreaterThan(TIER_THRESHOLDS.bronze);
      expect(TIER_THRESHOLDS.gold).toBeGreaterThan(TIER_THRESHOLDS.silver);
      expect(TIER_THRESHOLDS.platinum).toBeGreaterThan(TIER_THRESHOLDS.gold);
    });

    it("should have valid rarity points in ascending order", () => {
      expect(RARITY_POINTS.common).toBeLessThan(RARITY_POINTS.rare);
      expect(RARITY_POINTS.rare).toBeLessThan(RARITY_POINTS.epic);
      expect(RARITY_POINTS.epic).toBeLessThan(RARITY_POINTS.legendary);
    });

    it("should have positive point values", () => {
      expect(RARITY_POINTS.common).toBeGreaterThan(0);
      expect(RARITY_POINTS.rare).toBeGreaterThan(0);
      expect(RARITY_POINTS.epic).toBeGreaterThan(0);
      expect(RARITY_POINTS.legendary).toBeGreaterThan(0);
    });
  });

  describe("Edge cases", () => {
    it("should handle achievements without dates", () => {
      const achievements: Achievement[] = [
        {
          id: "first-workout",
          title: "Test",
          description: "Test",
          icon: "🎯",
          date: "",
        },
      ];
      const sorted = sortByRarity(achievements);
      expect(sorted).toHaveLength(1);
    });

    it("should handle very large point values", () => {
      const progress = calculateTierProgress(999999);
      expect(progress.currentTier).toBe("platinum");
      expect(progress.nextTier).toBeNull();
    });

    it("should handle negative point values as 0", () => {
      const progress = calculateTierProgress(-100);
      // System should treat negative as 0
      expect(progress.currentTier).toBe("bronze");
    });
  });

  describe("Integration tests", () => {
    it("should calculate correct tier for specific achievement combination", () => {
      // Common (5) + Rare (15) = 20 points (Bronze tier)
      const achievements = [mockAchievements[0], mockAchievements[1]];
      const totalPoints = calculateTotalPoints(achievements);
      const tierProgress = calculateTierProgress(totalPoints);

      expect(totalPoints).toBe(20);
      expect(tierProgress.currentTier).toBe("bronze");
      expect(tierProgress.nextTier).toBe("silver");
    });

    it("should handle full progression from bronze to platinum", () => {
      // Test progression through all tiers
      const bronzeProgress = calculateTierProgress(50);
      expect(bronzeProgress.currentTier).toBe("bronze");

      const silverProgress = calculateTierProgress(250);
      expect(silverProgress.currentTier).toBe("silver");

      const goldProgress = calculateTierProgress(800);
      expect(goldProgress.currentTier).toBe("gold");

      const platinumProgress = calculateTierProgress(2000);
      expect(platinumProgress.currentTier).toBe("platinum");
      expect(platinumProgress.nextTier).toBeNull();
    });

    it("should correctly identify rarest from mixed achievements", () => {
      const distribution = getRarityDistribution(mockAchievements);
      const rarest = getRarestAchievement(mockAchievements);
      const completion = calculateRarityCompletion(mockAchievements);

      expect(distribution.legendary).toBe(1);
      expect(rarest?.rarity).toBe("legendary");
      expect(completion.legendary.unlocked).toBe(1);
    });
  });
});

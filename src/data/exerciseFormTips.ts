// Exercise Form Tips & GIF Demonstrations
// Integrated with GymVisual for animated exercise demonstrations

export interface ExerciseFormTips {
  exerciseId: string;
  exerciseName: string;

  // Visual Content
  gifUrl?: string; // Animated GIF from GymVisual
  gymVisualId?: string;
  videoUrl?: string; // YouTube URL for detailed tutorials

  // Form Cues
  setupCues: string[];
  executionCues: string[];
  breathingCues?: string[];

  // Common Mistakes
  commonMistakes: {
    mistake: string;
    correction: string;
    severity: "minor" | "major" | "injury-risk";
  }[];

  // Safety & Tips
  safetyTips: string[];
  proTips: string[];

  // Progressions
  easier?: string[];
  harder?: string[];
  alternatives?: string[];

  // Muscle Activation
  primaryMuscles: string[];
  secondaryMuscles: string[];

  // Programming
  recommendedRepRange?: string;
  recommendedSets?: string;
  restPeriod?: string;

  // Experience Level
  difficulty: "beginner" | "intermediate" | "advanced";
}

/**
 * Extract YouTube video ID from URL and convert to embed format
 */
export function getYouTubeEmbedUrl(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);

  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }

  return null;
}

/**
 * Comprehensive form tips database with GIF support
 */
export const EXERCISE_FORM_TIPS: Record<string, ExerciseFormTips> = {
  "bench-press": {
    exerciseId: "bench-press",
    exerciseName: "Bench Press",
    gifUrl: "https://gymvisual.com/img/p/1/8/2/6/5/18265.gif",
    gymVisualId: "18265",
    videoUrl: "https://www.youtube.com/watch?v=rT7DgCr-3pg",

    setupCues: [
      "Lie flat with eyes under the bar",
      "Feet flat on ground for stable base",
      "Retract shoulder blades (squeeze together and down)",
      "Create slight arch in lower back",
      "Grip bar slightly wider than shoulder width",
      "Keep wrists straight, not bent",
    ],

    executionCues: [
      "Unrack with straight arms over chest",
      "Lower bar to mid-chest in controlled motion",
      "Elbows at 45° angle (not 90°)",
      "Touch chest lightly, don't bounce",
      "Drive feet into ground while pressing",
      "Press up and slightly back toward eyes",
    ],

    breathingCues: [
      "Deep breath at top before lowering",
      "Hold breath during descent (brace core)",
      "Exhale forcefully as you press up",
    ],

    commonMistakes: [
      {
        mistake: "Flaring elbows to 90 degrees",
        correction: "Keep elbows at 45° to reduce shoulder stress",
        severity: "injury-risk",
      },
      {
        mistake: "Bouncing bar off chest",
        correction: "Control descent and touch lightly",
        severity: "major",
      },
      {
        mistake: "Lifting butt off bench",
        correction: "Keep glutes in contact throughout",
        severity: "major",
      },
    ],

    safetyTips: [
      "Always use safety bars or spotter",
      "Never train to failure without spotter",
      "Warm up progressively",
    ],

    proTips: [
      "Leg drive adds 10-15% more strength",
      "Try different grip widths",
      "Pause reps build strength at weak points",
    ],

    easier: ["Incline Bench Press", "Dumbbell Bench Press", "Push-ups"],
    harder: ["Close-Grip Bench", "Pause Bench", "Tempo Bench"],
    alternatives: ["Dumbbell Press", "Floor Press", "Chest Dips"],

    primaryMuscles: ["Pectorals", "Triceps", "Anterior Deltoids"],
    secondaryMuscles: ["Core", "Lats"],

    recommendedRepRange: "6-12",
    recommendedSets: "3-5",
    restPeriod: "2-3 min",
    difficulty: "intermediate",
  },

  squat: {
    exerciseId: "squat",
    exerciseName: "Barbell Back Squat",
    gifUrl: "https://gymvisual.com/img/p/1/0/2/1/3/10213.gif",
    gymVisualId: "10213",
    videoUrl: "https://www.youtube.com/watch?v=ultWZbUMPL8",

    setupCues: [
      "Bar on upper traps (high bar) or rear delts (low bar)",
      "Feet shoulder-width or slightly wider",
      "Toes pointed outward 15-30°",
      "Squeeze shoulder blades together",
      "Brace core before descending",
    ],

    executionCues: [
      "Deep breath, brace core hard",
      "Push hips back to initiate",
      "Bend knees simultaneously",
      "Descend until hip crease below knee",
      "Keep chest up throughout",
      "Knees track over toes",
      "Drive through heels to stand",
    ],

    breathingCues: [
      "Deep breath at top",
      "Brace 360° around core",
      "Hold breath entire rep",
      "Exhale at top, re-brace",
    ],

    commonMistakes: [
      {
        mistake: "Knees caving inward",
        correction: "Push knees out toward toes",
        severity: "injury-risk",
      },
      {
        mistake: "Heels coming off ground",
        correction: "Keep weight on mid-foot",
        severity: "major",
      },
      {
        mistake: "Good morning squat",
        correction: "Keep chest up, brace harder",
        severity: "major",
      },
    ],

    safetyTips: [
      "ALWAYS use safety bars",
      "Learn how to bail safely",
      "Neutral neck position",
      "If back rounds, reduce weight",
    ],

    proTips: [
      "Screw feet into ground",
      'Think "spread the floor"',
      "Pause squats build power",
    ],

    easier: ["Goblet Squat", "Box Squat", "Leg Press"],
    harder: ["Pause Squat", "Front Squat", "Deficit Squat"],

    primaryMuscles: ["Quadriceps", "Glutes", "Hamstrings"],
    secondaryMuscles: ["Core", "Erectors", "Calves"],

    recommendedRepRange: "5-12",
    recommendedSets: "3-5",
    restPeriod: "2-4 min",
    difficulty: "intermediate",
  },

  deadlift: {
    exerciseId: "deadlift",
    exerciseName: "Conventional Deadlift",
    gifUrl: "https://gymvisual.com/img/p/1/0/2/9/9/10299.gif",
    gymVisualId: "10299",
    videoUrl: "https://www.youtube.com/watch?v=op9kVnSso6Q",

    setupCues: [
      "Feet hip-width apart under bar",
      "Bar over mid-foot",
      "Bend down and grip bar",
      "Shins touch bar",
      "Chest up, shoulders over bar",
      "Take slack out of bar",
    ],

    executionCues: [
      "Big breath, brace core",
      "Drive legs into ground",
      "Keep bar close to body",
      "Extend hips and knees together",
      "Stand tall at top",
      "Control descent, same path",
    ],

    breathingCues: [
      "Deep breath before lift",
      "Hold throughout ascent",
      "Exhale at lockout",
      "Reset breath each rep",
    ],

    commonMistakes: [
      {
        mistake: "Rounded back",
        correction: "Keep spine neutral, reduce weight",
        severity: "injury-risk",
      },
      {
        mistake: "Bar drifting away",
        correction: "Keep bar against legs throughout",
        severity: "major",
      },
      {
        mistake: "Hips rising too fast",
        correction: "Drive legs first, then hips",
        severity: "major",
      },
    ],

    safetyTips: [
      "Perfect form over heavy weight",
      "Use mixed grip carefully",
      "Don't jerk the bar",
      "Drop weight if form breaks",
    ],

    proTips: [
      "Pull slack out before lifting",
      "Imagine leg press with bar",
      "Chalk helps grip",
    ],

    easier: ["Romanian Deadlift", "Rack Pulls", "Trap Bar Deadlift"],
    harder: ["Deficit Deadlift", "Pause Deadlift", "Snatch Grip Deadlift"],

    primaryMuscles: ["Hamstrings", "Glutes", "Erectors"],
    secondaryMuscles: ["Traps", "Lats", "Core"],

    recommendedRepRange: "5-8",
    recommendedSets: "3-5",
    restPeriod: "3-5 min",
    difficulty: "advanced",
  },

  "pull-up": {
    exerciseId: "pull-up",
    exerciseName: "Pull-Up",
    gifUrl: "https://gymvisual.com/img/p/4/1/4/4/4144.gif",
    gymVisualId: "4144",

    setupCues: [
      "Grip bar slightly wider than shoulders",
      "Hang with arms fully extended",
      "Engage lats by pulling shoulders down",
      "Cross legs or keep straight",
    ],

    executionCues: [
      "Pull elbows down and back",
      "Lead with chest, not chin",
      "Pull until chin over bar",
      "Control descent",
      "Full arm extension at bottom",
    ],

    breathingCues: ["Exhale while pulling up", "Inhale on descent"],

    commonMistakes: [
      {
        mistake: "Kipping or swinging",
        correction: "Control movement, no momentum",
        severity: "major",
      },
      {
        mistake: "Not going full ROM",
        correction: "Full extension at bottom",
        severity: "minor",
      },
    ],

    safetyTips: [
      "Warm up shoulders thoroughly",
      "Use assistance if needed",
      "Don't drop suddenly",
    ],

    proTips: [
      "Imagine pulling elbows to hips",
      "Negative reps build strength",
      "Try different grip widths",
    ],

    easier: ["Assisted Pull-Up", "Lat Pulldown", "Inverted Row"],
    harder: ["Weighted Pull-Up", "L-Sit Pull-Up", "One-Arm Pull-Up"],

    primaryMuscles: ["Lats", "Biceps"],
    secondaryMuscles: ["Traps", "Rear Delts", "Core"],

    recommendedRepRange: "5-12",
    recommendedSets: "3-4",
    restPeriod: "2-3 min",
    difficulty: "intermediate",
  },

  "overhead-press": {
    exerciseId: "overhead-press",
    exerciseName: "Overhead Press",
    gifUrl: "https://gymvisual.com/img/p/1/0/2/8/3/10283.gif",
    gymVisualId: "10283",

    setupCues: [
      "Bar at collarbone height",
      "Grip just outside shoulders",
      "Elbows slightly in front of bar",
      "Feet hip-width apart",
      "Brace core tight",
    ],

    executionCues: [
      "Press bar straight up",
      "Move head back slightly",
      "Lock out overhead",
      "Shrug shoulders at top",
      "Lower under control",
    ],

    breathingCues: [
      "Breath and brace at bottom",
      "Hold during press",
      "Exhale at lockout",
    ],

    commonMistakes: [
      {
        mistake: "Leaning back too much",
        correction: "Keep torso nearly vertical",
        severity: "injury-risk",
      },
      {
        mistake: "Pressing forward",
        correction: "Press straight up",
        severity: "major",
      },
    ],

    safetyTips: [
      "Don't hyperextend back",
      "Use safety bars",
      "Warm up rotator cuffs",
    ],

    proTips: [
      "Squeeze glutes for stability",
      "Push through the bar",
      "Try push press for strength",
    ],

    easier: ["Seated Overhead Press", "Dumbbell Press", "Machine Press"],
    harder: ["Push Press", "Behind Neck Press", "Z-Press"],

    primaryMuscles: ["Deltoids", "Triceps"],
    secondaryMuscles: ["Upper Chest", "Core"],

    recommendedRepRange: "6-10",
    recommendedSets: "3-5",
    restPeriod: "2-3 min",
    difficulty: "intermediate",
  },

  "barbell-row": {
    exerciseId: "barbell-row",
    exerciseName: "Barbell Row",
    gifUrl: "https://gymvisual.com/img/p/1/0/2/2/1/10221.gif",
    gymVisualId: "10221",

    setupCues: [
      "Hinge at hips, torso 45° angle",
      "Grip slightly wider than shoulders",
      "Back flat, core braced",
      "Arms fully extended",
    ],

    executionCues: [
      "Pull bar to lower chest/upper abs",
      "Lead with elbows",
      "Squeeze shoulder blades together",
      "Control descent",
      "Keep torso stable",
    ],

    breathingCues: ["Exhale during pull", "Inhale on descent"],

    commonMistakes: [
      {
        mistake: "Standing too upright",
        correction: "Maintain hip hinge",
        severity: "major",
      },
      {
        mistake: "Using momentum",
        correction: "Controlled movement only",
        severity: "major",
      },
    ],

    safetyTips: [
      "Don't round lower back",
      "Start with lighter weight",
      "Warm up lower back",
    ],

    proTips: [
      "Think elbows back, not hands up",
      "Pause at top for better contraction",
      "Try underhand grip variation",
    ],

    easier: ["Cable Row", "Chest-Supported Row", "Dumbbell Row"],
    harder: ["Pendlay Row", "Yates Row", "T-Bar Row"],

    primaryMuscles: ["Lats", "Rhomboids", "Traps"],
    secondaryMuscles: ["Biceps", "Rear Delts", "Erectors"],

    recommendedRepRange: "8-12",
    recommendedSets: "3-4",
    restPeriod: "2-3 min",
    difficulty: "intermediate",
  },
};

/**
 * Get form tips for an exercise by name or ID
 */
export function getFormTips(exerciseNameOrId: string): ExerciseFormTips | null {
  // Normalize the input to lowercase and replace spaces with hyphens
  const normalizedId = exerciseNameOrId.toLowerCase().replace(/\s+/g, "-");

  // Try direct match first
  if (EXERCISE_FORM_TIPS[normalizedId]) {
    return EXERCISE_FORM_TIPS[normalizedId];
  }

  // Try to find by exercise name
  const found = Object.values(EXERCISE_FORM_TIPS).find(
    (tip) => tip.exerciseName.toLowerCase() === exerciseNameOrId.toLowerCase()
  );

  return found || null;
}

/**
 * Check if form tips exist for an exercise
 */
export function hasFormTips(exerciseNameOrId: string): boolean {
  return getFormTips(exerciseNameOrId) !== null;
}

// Exercise Form Tips & Videos System - UPDATED with GIF Support
// Now supports both YouTube videos AND animated GIFs from GymVisual

export interface ExerciseFormTips {
  exerciseId: string;
  exerciseName: string;
  
  // Visual Content (Video OR GIF or Both!)
  videoUrl?: string; // YouTube, Vimeo
  gifUrl?: string; // Animated GIF (e.g., from GymVisual)
  gifThumbnail?: string;
  videoThumbnail?: string;
  videoDuration?: string;
  
  // GymVisual specific
  gymVisualId?: string; // e.g., "18265" from the URL
  
  // Form Cues
  setupCues: string[];
  executionCues: string[];
  breathingCues?: string[];
  
  // Common Mistakes
  commonMistakes: {
    mistake: string;
    correction: string;
    severity: 'minor' | 'major' | 'injury-risk';
  }[];
  
  // Safety & Tips
  safetyTips: string[];
  proTips: string[];
  
  // Progressions & Regressions
  easier?: string[];
  harder?: string[];
  alternatives?: string[];
  
  // Equipment Setup
  equipmentSetup?: string[];
  
  // Muscle Activation
  primaryMuscles: string[];
  secondaryMuscles: string[];
  stabilizers?: string[];
  
  // Rep Ranges & Programming
  recommendedRepRange?: string;
  recommendedSets?: string;
  restPeriod?: string;
  
  // Experience Level
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  prerequisites?: string[];
  
  // Additional Resources
  externalLinks?: {
    title: string;
    url: string;
    type: 'article' | 'video' | 'study';
  }[];
}

/**
 * GymVisual GIF styles available
 */
export type GymVisualStyle = 
  | 'basic_grey'
  | 'basic_black' 
  | 'realistic'
  | 'minimal'
  | 'neon';

/**
 * Generate GymVisual GIF URL
 */
export function getGymVisualGifUrl(
  exerciseId: string, 
  style: GymVisualStyle = 'basic_grey'
): string {
  return `https://gymvisual.com/img/p/1/8/${exerciseId}/${style}.gif`;
}

/**
 * Comprehensive form tips database with GIF support
 */
export const EXERCISE_FORM_TIPS: Record<string, ExerciseFormTips> = {
  'bench-press': {
    exerciseId: 'bench-press',
    exerciseName: 'Bench Press',
    
    // YouTube video for detailed explanation
    videoUrl: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
    videoDuration: '10:23',
    
    // GIF for quick visual reference
    gifUrl: 'https://gymvisual.com/img/p/1/8/2/6/5/18265.gif',
    gymVisualId: '18265',
    
    setupCues: [
      'Lie flat on bench with eyes under the bar',
      'Feet flat on the ground, creating stable base',
      'Retract shoulder blades (squeeze together and down)',
      'Create slight arch in lower back',
      'Grip bar slightly wider than shoulder width',
      'Wrists should be straight, not bent back',
    ],
    
    executionCues: [
      'Unrack bar with straight arms over chest',
      'Lower bar to mid-chest in controlled motion',
      'Elbows at 45-degree angle (not flared to 90°)',
      'Touch chest lightly, don\'t bounce',
      'Drive feet into ground as you press',
      'Press bar up and slightly back toward eyes',
      'Full arm extension at top',
    ],
    
    breathingCues: [
      'Deep breath at top before lowering',
      'Hold breath during descent (brace core)',
      'Exhale forcefully as you press up',
    ],
    
    commonMistakes: [
      {
        mistake: 'Flaring elbows out to 90 degrees',
        correction: 'Keep elbows at 45-degree angle to reduce shoulder stress',
        severity: 'injury-risk',
      },
      {
        mistake: 'Bouncing bar off chest',
        correction: 'Control the descent and touch lightly',
        severity: 'major',
      },
      {
        mistake: 'Lifting butt off bench',
        correction: 'Keep glutes in contact with bench throughout',
        severity: 'major',
      },
      {
        mistake: 'Not retracting shoulder blades',
        correction: 'Pull shoulder blades together and down before unracking',
        severity: 'injury-risk',
      },
    ],
    
    safetyTips: [
      'Always use safety bars or a spotter for heavy sets',
      'Don\'t lock elbows aggressively at top',
      'Warm up with empty bar and progressive sets',
      'Never train to failure without a spotter',
    ],
    
    proTips: [
      'Leg drive can add 10-15% more strength',
      'Try different grip widths to find your strongest position',
      'Pause reps build strength at weak points',
      'Progressive overload: add 2.5-5 lbs every 1-2 weeks',
    ],
    
    easier: [
      'Incline Bench Press',
      'Dumbbell Bench Press',
      'Push-ups',
      'Machine Chest Press',
    ],
    
    harder: [
      'Decline Bench Press',
      'Close-Grip Bench Press',
      'Pause Bench Press',
      'Tempo Bench',
    ],
    
    alternatives: [
      'Dumbbell Bench Press',
      'Floor Press',
      'Push-ups',
      'Chest Dips',
    ],
    
    primaryMuscles: ['Pectorals', 'Triceps', 'Anterior Deltoids'],
    secondaryMuscles: ['Core', 'Lats'],
    
    recommendedRepRange: '6-12',
    recommendedSets: '3-5',
    restPeriod: '2-3 minutes',
    
    difficulty: 'intermediate',
    
    externalLinks: [
      {
        title: 'Jeff Nippard: Bench Press Science',
        url: 'https://www.youtube.com/watch?v=rT7DgCr-3pg',
        type: 'video',
      },
    ],
  },

  'squat': {
    exerciseId: 'squat',
    exerciseName: 'Barbell Back Squat',
    
    videoUrl: 'https://www.youtube.com/watch?v=ultWZbUMPL8',
    gifUrl: 'https://gymvisual.com/img/p/1/0/2/1/3/10213.gif',
    gymVisualId: '10213',
    
    setupCues: [
      'Bar rests on upper traps (high bar) or rear delts (low bar)',
      'Grip bar with hands as narrow as comfortable',
      'Feet shoulder-width or slightly wider',
      'Toes pointed slightly outward (15-30 degrees)',
      'Squeeze shoulder blades together',
      'Brace core before descending',
    ],
    
    executionCues: [
      'Take deep breath, brace core hard',
      'Initiate by pushing hips back',
      'Simultaneously bend knees',
      'Descend until hip crease below knee',
      'Keep chest up throughout',
      'Knees track over toes',
      'Drive through heels to stand',
      'Extend hips and knees together',
    ],
    
    breathingCues: [
      'Deep breath at top, brace 360° around core',
      'Hold breath entire rep',
      'Exhale at top, re-brace between reps',
    ],
    
    commonMistakes: [
      {
        mistake: 'Knees caving inward (valgus)',
        correction: 'Push knees out in direction of toes',
        severity: 'injury-risk',
      },
      {
        mistake: 'Heels coming off ground',
        correction: 'Keep weight on mid-foot, improve ankle mobility',
        severity: 'major',
      },
      {
        mistake: 'Good morning squat (hips rise first)',
        correction: 'Keep chest up, brace core harder',
        severity: 'major',
      },
      {
        mistake: 'Not hitting depth',
        correction: 'Work on mobility, go lighter',
        severity: 'minor',
      },
    ],
    
    safetyTips: [
      'ALWAYS use safety bars in squat rack',
      'Learn how to bail safely',
      'Don\'t look up or down - neutral neck',
      'If back rounds, weight is too heavy',
    ],
    
    proTips: [
      'Screw feet into ground for stability',
      'Think "spread the floor apart" with feet',
      'Pause squats build explosive power',
      'Box squats teach proper depth',
    ],
    
    easier: [
      'Goblet Squat',
      'Box Squat',
      'Front Squat',
      'Leg Press',
    ],
    
    harder: [
      'Pause Squat',
      'Front Squat',
      'Tempo Squat',
      'Deficit Squat',
    ],
    
    primaryMuscles: ['Quadriceps', 'Glutes', 'Hamstrings'],
    secondaryMuscles: ['Core', 'Erectors', 'Calves'],
    
    recommendedRepRange: '5-12',
    recommendedSets: '3-5',
    restPeriod: '2-4 minutes',
    
    difficulty: 'intermediate',
  },

  'deadlift': {
    exerciseId: 'deadlift',
    exerciseName: 'Conventional Deadlift',
    
    videoUrl: 'https://www.youtube.com/watch?v=op9kVnSso6Q',
    gifUrl: 'https://gymvisual.com/img/p/1/0/2/9/9/10299.gif',
    gymVisualId: '10299',
    
    setupCues: [
      'Bar over mid-foot (shoelace area)',
      'Feet hip-width apart',
      'Bend at hips to reach bar',
      'Grip just outside legs',
      'Drop shins to bar without moving bar',
      'Chest up, shoulders over bar',
      'Neutral spine',
    ],
    
    executionCues: [
      'Take big breath, brace core HARD',
      'Pull slack out of bar',
      'Push floor away with legs',
      'Bar stays in contact with legs',
      'Hips and shoulders rise together',
      'Extend knees first, then hips',
      'Lock out by squeezing glutes',
    ],
    
    breathingCues: [
      'Deep breath before pulling',
      'Hold breath through entire rep',
      'Exhale at lockout',
    ],
    
    commonMistakes: [
      {
        mistake: 'Rounded lower back',
        correction: 'Reduce weight, strengthen core',
        severity: 'injury-risk',
      },
      {
        mistake: 'Bar drifts away from body',
        correction: 'Keep bar scraping legs, engage lats',
        severity: 'major',
      },
      {
        mistake: 'Hips rise before shoulders',
        correction: 'Think "push floor away" not "pull weight"',
        severity: 'major',
      },
      {
        mistake: 'Hyperextending at top',
        correction: 'Lock out with glutes, don\'t lean back',
        severity: 'minor',
      },
    ],
    
    safetyTips: [
      'If back rounds, weight is too heavy',
      'Use mixed grip or straps for heavy weights',
      'Don\'t jerk the bar',
      'Consider trap bar if conventional hurts back',
    ],
    
    proTips: [
      'Engage lats by "bending the bar"',
      'Treat it like a push (legs) not a pull',
      'Video from side to check back position',
      'Use chalk for better grip',
    ],
    
    easier: [
      'Trap Bar Deadlift',
      'Romanian Deadlift',
      'Rack Pulls',
      'Sumo Deadlift',
    ],
    
    harder: [
      'Deficit Deadlift',
      'Paused Deadlift',
      'Tempo Deadlift',
      'Snatch Grip Deadlift',
    ],
    
    primaryMuscles: ['Hamstrings', 'Glutes', 'Lower Back'],
    secondaryMuscles: ['Traps', 'Lats', 'Core', 'Forearms'],
    
    recommendedRepRange: '3-8',
    recommendedSets: '3-5',
    restPeriod: '3-5 minutes',
    
    difficulty: 'intermediate',
  },

  // Quick add more with GIFs!
  'pull-ups': {
    exerciseId: 'pull-ups',
    exerciseName: 'Pull-ups',
    gifUrl: 'https://gymvisual.com/img/p/4/1/4/4/4144.gif',
    gymVisualId: '4144',
    
    setupCues: [
      'Hang from bar with hands shoulder-width apart',
      'Palms facing away (pronated grip)',
      'Full arm extension at bottom',
      'Engage shoulder blades',
    ],
    
    executionCues: [
      'Pull elbows down and back',
      'Lead with chest, not chin',
      'Pull until chin over bar',
      'Control descent to full extension',
    ],
    
    commonMistakes: [
      {
        mistake: 'Kipping or using momentum',
        correction: 'Control the movement, no swinging',
        severity: 'major',
      },
      {
        mistake: 'Not going to full extension',
        correction: 'Arms fully straight at bottom',
        severity: 'minor',
      },
    ],
    
    safetyTips: [
      'Warm up shoulders first',
      'Progress with negatives if needed',
      'Stop if you feel shoulder pain',
    ],
    
    proTips: [
      'Use slower tempo (3 sec down)',
      'Try different grip widths',
      'Add weight once you can do 10+ reps',
    ],
    
    easier: [
      'Assisted Pull-ups',
      'Negative Pull-ups',
      'Inverted Rows',
      'Lat Pulldowns',
    ],
    
    harder: [
      'Weighted Pull-ups',
      'Wide-Grip Pull-ups',
      'L-Sit Pull-ups',
    ],
    
    primaryMuscles: ['Latissimus Dorsi', 'Biceps'],
    secondaryMuscles: ['Core', 'Forearms', 'Rear Delts'],
    
    recommendedRepRange: '5-12',
    recommendedSets: '3-4',
    restPeriod: '2-3 minutes',
    
    difficulty: 'intermediate',
  },

  'overhead-press': {
    exerciseId: 'overhead-press',
    exerciseName: 'Overhead Press',
    gifUrl: 'https://gymvisual.com/img/p/1/0/2/8/3/10283.gif',
    gymVisualId: '10283',
    
    setupCues: [
      'Bar at collarbone level',
      'Grip slightly wider than shoulders',
      'Elbows slightly in front of bar',
      'Feet hip-width apart',
      'Brace core hard',
    ],
    
    executionCues: [
      'Press bar straight up',
      'Move head back slightly to clear bar path',
      'Lock out overhead with shrugged traps',
      'Bar should finish over mid-foot',
      'Lower with control',
    ],
    
    commonMistakes: [
      {
        mistake: 'Pressing bar forward (banana path)',
        correction: 'Press straight up, move head back',
        severity: 'major',
      },
      {
        mistake: 'Hyperextending lower back',
        correction: 'Squeeze glutes, brace core harder',
        severity: 'injury-risk',
      },
    ],
    
    safetyTips: [
      'Don\'t lean back excessively',
      'Use safety bars',
      'Warm up shoulders thoroughly',
    ],
    
    proTips: [
      'Think "push head through arms" at top',
      'Squeeze glutes to prevent back arch',
      'Use controlled tempo',
    ],
    
    easier: [
      'Seated Overhead Press',
      'Dumbbell Press',
      'Landmine Press',
    ],
    
    harder: [
      'Push Press',
      'Behind-the-Neck Press',
      'Handstand Push-ups',
    ],
    
    primaryMuscles: ['Shoulders', 'Triceps'],
    secondaryMuscles: ['Upper Chest', 'Core', 'Traps'],
    
    recommendedRepRange: '6-10',
    recommendedSets: '3-5',
    restPeriod: '2-3 minutes',
    
    difficulty: 'intermediate',
  },

  'barbell-row': {
    exerciseId: 'barbell-row',
    exerciseName: 'Barbell Row',
    gifUrl: 'https://gymvisual.com/img/p/1/0/2/2/1/10221.gif',
    gymVisualId: '10221',
    
    setupCues: [
      'Hip hinge position (like deadlift)',
      'Back at 45-degree angle',
      'Grip slightly wider than shoulders',
      'Arms hanging straight down',
      'Neutral spine',
    ],
    
    executionCues: [
      'Pull bar to lower chest/upper abs',
      'Lead with elbows, not hands',
      'Squeeze shoulder blades at top',
      'Keep torso angle consistent',
      'Lower with control',
    ],
    
    commonMistakes: [
      {
        mistake: 'Using momentum (body rocking)',
        correction: 'Keep torso still, control the weight',
        severity: 'major',
      },
      {
        mistake: 'Rounding lower back',
        correction: 'Maintain neutral spine, reduce weight',
        severity: 'injury-risk',
      },
    ],
    
    safetyTips: [
      'Don\'t round back to reach bar',
      'Start light to learn pattern',
      'Brace core throughout',
    ],
    
    proTips: [
      'Retract shoulder blades at top',
      'Aim for lower chest, not neck',
      'Try different grips (overhand, underhand)',
    ],
    
    easier: [
      'Chest-Supported Row',
      'Dumbbell Rows',
      'Cable Rows',
    ],
    
    harder: [
      'Pendlay Rows (from floor each rep)',
      'Meadows Rows',
      'T-Bar Rows',
    ],
    
    primaryMuscles: ['Lats', 'Rhomboids', 'Traps'],
    secondaryMuscles: ['Biceps', 'Rear Delts', 'Erectors'],
    
    recommendedRepRange: '8-12',
    recommendedSets: '3-4',
    restPeriod: '2-3 minutes',
    
    difficulty: 'intermediate',
  },
};

/**
 * Get form tips for an exercise
 */
export function getFormTips(exerciseId: string): ExerciseFormTips | null {
  return EXERCISE_FORM_TIPS[exerciseId] || null;
}

/**
 * Get all exercises with form tips
 */
export function getExercisesWithFormTips(): ExerciseFormTips[] {
  return Object.values(EXERCISE_FORM_TIPS);
}

/**
 * Check if exercise has form tips
 */
export function hasFormTips(exerciseId: string): boolean {
  return exerciseId in EXERCISE_FORM_TIPS;
}

/**
 * Get YouTube video embed URL
 */
export function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = videoUrl.match(regExp);
  
  if (match && match[2].length === 11) {
    return `https://www.youtube.com/embed/${match[2]}`;
  }
  
  return null;
}

/**
 * Get GymVisual GIF URL with style
 */
export function getGymVisualGif(
  gymVisualId: string,
  style: GymVisualStyle = 'basic_grey'
): string {
  return `https://gymvisual.com/img/p/${gymVisualId[0]}/${gymVisualId[1]}/${gymVisualId[2]}/${gymVisualId[3]}/${gymVisualId[4]}/${gymVisualId}/${style}.gif`;
}

/**
 * Common GymVisual exercise IDs (for quick reference)
 */
export const GYMVISUAL_EXERCISE_IDS = {
  benchPress: '18265',
  squat: '10213',
  deadlift: '10299',
  pullUps: '4144',
  overheadPress: '10283',
  barbellRow: '10221',
  bicepCurl: '1649',
  tricepExtension: '1717',
  lateralRaise: '1651',
  legPress: '4639',
  romanianDeadlift: '10305',
  inclineBench: '18263',
  frontSquat: '10215',
  lunges: '4629',
  dips: '4136',
  latPulldown: '1650',
  cableCrossover: '7322',
  facePulls: '7324',
  legCurls: '4641',
  calfRaise: '4627',
};

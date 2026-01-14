import { Exercise } from '@/types/gym';

export const exerciseDatabase: Record<string, Exercise[]> = {
  chest: [
    // Barbell
    { id: 1, name: 'Bench Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', requiresSpotter: true, instructions: 'Lie on bench, grip bar slightly wider than shoulders, lower to chest, press up.' },
    { id: 26, name: 'Incline Bench Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', requiresSpotter: true, instructions: 'Set bench to 30-45°, press bar from chest to full extension.' },
    { id: 5, name: 'Decline Bench Press', equipment: 'barbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'chest', movementPattern: 'push', requiresSpotter: true, instructions: 'Lie on decline bench, lower bar to lower chest, press up.' },
    { id: 27, name: 'Close-Grip Bench Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', requiresSpotter: true, instructions: 'Grip bar with hands closer than shoulder-width, focus on tricep engagement.' },
    { id: 28, name: 'Floor Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Lie on floor, press bar from chest to lockout with limited range of motion.' },
    
    // Dumbbell
    { id: 29, name: 'Dumbbell Bench Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Press dumbbells from chest level to full extension, maintaining control.' },
    { id: 2, name: 'Incline Dumbbell Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Set bench to 30-45°, press dumbbells up and together.' },
    { id: 30, name: 'Decline Dumbbell Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'On decline bench, press dumbbells from chest to full extension.' },
    { id: 31, name: 'Dumbbell Flyes', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Lower dumbbells in wide arc, bring together over chest.' },
    { id: 32, name: 'Incline Dumbbell Flyes', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'On incline bench, perform flye motion targeting upper chest.' },
    { id: 33, name: 'Decline Dumbbell Flyes', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'On decline bench, perform flye motion targeting lower chest.' },
    { id: 34, name: 'Dumbbell Pullovers', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Lower dumbbell behind head in arc motion, pull back over chest.' },
    { id: 35, name: 'Single-Arm Dumbbell Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Press one dumbbell at a time, focusing on stability and control.' },
    
    // Cable
    { id: 36, name: 'Cable Chest Press', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Set cables at chest height, press handles together in front of chest.' },
    { id: 4, name: 'Cable Flyes', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Set cables at chest height, bring handles together in hugging motion.' },
    { id: 37, name: 'Incline Cable Flyes', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Set cables low, pull handles up and together targeting upper chest.' },
    { id: 38, name: 'Decline Cable Flyes', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Set cables high, pull handles down and together targeting lower chest.' },
    { id: 39, name: 'Cable Crossovers', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Cross cables in front of body, squeezing chest muscles.' },
    { id: 40, name: 'Single-Arm Cable Press', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Press one cable handle forward, focusing on stability.' },
    { id: 41, name: 'Low-to-High Cable Flyes', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Start with cables low, pull up and together in arc motion.' },
    { id: 42, name: 'High-to-Low Cable Flyes', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'isolation', instructions: 'Start with cables high, pull down and together in arc motion.' },
    
    // Bodyweight
    { id: 3, name: 'Push-ups', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Hands shoulder-width apart, lower body until chest nearly touches floor.' },
    { id: 43, name: 'Incline Push-ups', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Hands on elevated surface, perform push-up motion.' },
    { id: 44, name: 'Decline Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Feet elevated, hands on ground, perform push-up motion.' },
    { id: 45, name: 'Diamond Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Hands in diamond shape, emphasizes triceps and inner chest.' },
    { id: 46, name: 'Wide-Grip Push-ups', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Hands wider than shoulders, targets outer chest.' },
    { id: 47, name: 'Pike Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Body in pike position, targets shoulders and upper chest.' },
    { id: 48, name: 'Archer Push-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'chest', movementPattern: 'push', prerequisites: ['Upper body strength'], instructions: 'Shift weight to one side during push-up, alternating sides.' },
    { id: 49, name: 'Clap Push-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'chest', movementPattern: 'push', prerequisites: ['Explosive power'], instructions: 'Push up explosively to clap hands, land softly.' },
    { id: 50, name: 'Dips (Parallel Bars)', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'chest', movementPattern: 'push', instructions: 'Lower body between parallel bars, press up to starting position.' }
  ],
  back: [
    // Barbell
    { id: 7, name: 'Deadlift', equipment: 'barbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'back', movementPattern: 'hinge', prerequisites: ['Basic hip hinge knowledge'], instructions: 'Stand with feet hip-width, grip bar, lift by extending hips and knees.' },
    { id: 51, name: 'Bent-Over Rows', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Hinge at hips, pull bar to lower chest, squeeze shoulder blades.' },
    { id: 10, name: 'T-Bar Row', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Straddle bar, pull weight to chest keeping back straight.' },
    { id: 52, name: 'Pendlay Rows', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull bar from floor to chest explosively, return to floor.' },
    { id: 53, name: 'Rack Pulls', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'hinge', instructions: 'Deadlift from elevated position (knee height), focus on upper portion.' },
    { id: 54, name: 'Barbell Shrugs', equipment: 'barbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Shrug shoulders up, hold briefly, lower with control.' },
    
    // Dumbbell
    { id: 55, name: 'Single-Arm Dumbbell Rows', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Support with one hand, pull dumbbell to hip with other arm.' },
    { id: 56, name: 'Bent-Over Dumbbell Rows', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Hinge at hips, pull both dumbbells to lower chest.' },
    { id: 57, name: 'Dumbbell Deadlifts', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'hinge', instructions: 'Hold dumbbells, hinge at hips lowering weights to floor.' },
    { id: 58, name: 'Dumbbell Shrugs', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Hold dumbbells at sides, shrug shoulders up and back.' },
    { id: 59, name: 'Chest-Supported Dumbbell Rows', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Chest on incline bench, pull dumbbells to lower chest.' },
    { id: 60, name: 'Renegade Rows', equipment: 'dumbbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'back', movementPattern: 'pull', prerequisites: ['Core strength'], instructions: 'In plank position, alternate rowing dumbbells to chest.' },
    
    // Cable
    { id: 8, name: 'Seated Cable Row', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull handle to waist, squeeze shoulder blades together.' },
    { id: 6, name: 'Lat Pulldown', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull bar down to upper chest, squeeze shoulder blades together.' },
    { id: 61, name: 'Cable Reverse Flyes', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Pull cables apart with straight arms, squeeze shoulder blades.' },
    { id: 62, name: 'Single-Arm Cable Rows', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull one cable handle to waist, focus on lat engagement.' },
    { id: 63, name: 'Cable Shrugs', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Shrug shoulders using cable resistance.' },
    { id: 64, name: 'Cable Face Pulls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull rope to face, elbows high, targeting rear delts.' },
    { id: 65, name: 'Cable Straight-Arm Pulldowns', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Pull bar down with straight arms, focus on lat contraction.' },
    { id: 66, name: 'Cable High Rows', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Pull high cable to upper chest, elbows back.' },
    
    // Bodyweight
    { id: 9, name: 'Pull-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', prerequisites: ['Upper body strength'], instructions: 'Hang from bar, pull body up until chin over bar.' },
    { id: 67, name: 'Chin-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', prerequisites: ['Upper body strength'], instructions: 'Underhand grip, pull body up until chin over bar.' },
    { id: 68, name: 'Wide-Grip Pull-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'back', movementPattern: 'pull', prerequisites: ['Upper body strength'], instructions: 'Hands wider than shoulders, pull up focusing on lats.' },
    { id: 69, name: 'Neutral-Grip Pull-ups', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', prerequisites: ['Upper body strength'], instructions: 'Palms facing each other, pull body up.' },
    { id: 70, name: 'Inverted Rows', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Under bar, pull chest to bar while body remains straight.' },
    { id: 71, name: 'Superman', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Lie face down, lift chest and legs simultaneously.' },
    { id: 72, name: 'Reverse Snow Angels', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'back', movementPattern: 'isolation', instructions: 'Face down, move arms in snow angel motion.' },
    { id: 73, name: 'Australian Pull-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'back', movementPattern: 'pull', instructions: 'Under bar at angle, pull chest to bar.' }
  ],
  legs: [
    // Barbell
    { id: 11, name: 'Back Squats', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', requiresSpotter: true, instructions: 'Bar on upper back, lower hips until thighs parallel to floor.' },
    { id: 74, name: 'Front Squats', equipment: 'barbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'legs', movementPattern: 'squat', prerequisites: ['Wrist mobility'], instructions: 'Bar in front rack position, squat down keeping chest up.' },
    { id: 13, name: 'Romanian Deadlift', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'hinge', instructions: 'Keep legs slightly bent, hinge at hips lowering bar.' },
    { id: 75, name: 'Sumo Deadlifts', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'hinge', instructions: 'Wide stance, toes out, pull bar up keeping it close to body.' },
    { id: 76, name: 'Bulgarian Split Squats (Barbell)', equipment: 'barbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Rear foot elevated, lunge down with barbell on back.' },
    { id: 77, name: 'Walking Lunges', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step forward into lunge, continue walking forward.' },
    { id: 78, name: 'Reverse Lunges', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step backward into lunge position.' },
    { id: 79, name: 'Step-ups', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step up onto platform, control the descent.' },
    { id: 80, name: 'Barbell Calf Raises', equipment: 'barbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Rise up on toes, hold briefly, lower slowly.' },
    { id: 81, name: 'Stiff-Leg Deadlifts', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'hinge', instructions: 'Keep legs straight, hinge at hips to lower bar.' },
    
    // Dumbbell
    { id: 82, name: 'Goblet Squats', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Hold dumbbell at chest, squat down keeping chest up.' },
    { id: 15, name: 'Dumbbell Lunges', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step forward, lower hips until both knees at 90°.' },
    { id: 83, name: 'Dumbbell Romanian Deadlifts', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'hinge', instructions: 'Hold dumbbells, hinge at hips keeping slight knee bend.' },
    { id: 84, name: 'Dumbbell Step-ups', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step up onto platform holding dumbbells.' },
    { id: 85, name: 'Dumbbell Bulgarian Split Squats', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Rear foot elevated, lunge down holding dumbbells.' },
    { id: 86, name: 'Dumbbell Calf Raises', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Hold dumbbells, rise up on toes.' },
    { id: 87, name: 'Dumbbell Sumo Squats', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Wide stance, hold dumbbell between legs, squat down.' },
    { id: 88, name: 'Single-Leg Romanian Deadlifts', equipment: 'dumbbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'legs', movementPattern: 'hinge', prerequisites: ['Balance'], instructions: 'Stand on one leg, hinge at hip lowering dumbbell.' },
    { id: 89, name: 'Dumbbell Thrusters', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Squat down, press dumbbells overhead as you stand.' },
    
    // Cable
    { id: 90, name: 'Cable Squats', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Hold cable handle, squat down with resistance.' },
    { id: 91, name: 'Cable Lunges', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Hold cable, perform lunges with added resistance.' },
    { id: 92, name: 'Cable Leg Press (Single Leg)', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Single leg press using cable resistance.' },
    { id: 93, name: 'Cable Calf Raises', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Use cable for calf raise resistance.' },
    { id: 94, name: 'Cable Kickbacks', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Ankle strap, kick leg back against resistance.' },
    { id: 95, name: 'Cable Leg Curls (Standing)', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Ankle strap, curl heel toward glutes.' },
    { id: 96, name: 'Cable Adductions', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Pull leg across body against cable resistance.' },
    { id: 97, name: 'Cable Abductions', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Pull leg away from body against cable resistance.' },
    
    // Bodyweight
    { id: 98, name: 'Bodyweight Squats', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Squat down without added weight, focus on form.' },
    { id: 99, name: 'Jump Squats', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Squat down then jump up explosively.' },
    { id: 100, name: 'Pistol Squats', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'legs', movementPattern: 'squat', prerequisites: ['Balance', 'Flexibility'], instructions: 'Single leg squat to full depth.' },
    { id: 101, name: 'Bodyweight Lunges', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step forward into lunge without added weight.' },
    { id: 102, name: 'Bodyweight Reverse Lunges', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step backward into lunge position.' },
    { id: 103, name: 'Side Lunges', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Step to side, lower into lateral lunge.' },
    { id: 104, name: 'Cossack Squats', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', prerequisites: ['Hip mobility'], instructions: 'Wide stance, shift weight to one side in deep squat.' },
    { id: 105, name: 'Single-Leg Glute Bridges', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'hinge', instructions: 'Bridge up on one leg, squeeze glutes at top.' },
    { id: 106, name: 'Bodyweight Calf Raises', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Rise up on toes without added weight.' },
    { id: 107, name: 'Wall Sits', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Sit against wall with thighs parallel to floor.' },
    { id: 108, name: 'Bodyweight Bulgarian Split Squats', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Rear foot elevated, lunge down without added weight.' },
    
    // Machine
    { id: 12, name: 'Leg Press', equipment: 'machine', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'squat', instructions: 'Press weight up with feet shoulder-width apart.' },
    { id: 14, name: 'Leg Curls', equipment: 'machine', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'legs', movementPattern: 'isolation', instructions: 'Curl weight up by flexing knees.' }
  ],
  shoulders: [
    { id: 16, name: 'Overhead Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'shoulders', movementPattern: 'push', instructions: 'Press bar overhead from shoulder level.' },
    { id: 17, name: 'Lateral Raise', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'shoulders', movementPattern: 'isolation', instructions: 'Raise arms to sides until parallel with floor.' },
    { id: 18, name: 'Face Pulls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'shoulders', movementPattern: 'pull', instructions: 'Pull rope to face, elbows high.' },
    { id: 19, name: 'Arnold Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'shoulders', movementPattern: 'push', instructions: 'Start palms facing you, rotate while pressing up.' },
    { id: 20, name: 'Upright Row', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'shoulders', movementPattern: 'pull', instructions: 'Pull bar up to chin, elbows leading.' }
  ],
  triceps: [
    // Barbell
    { id: 109, name: 'Close-Grip Bench Press', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', requiresSpotter: true, instructions: 'Narrow grip on barbell, focus on tricep extension.' },
    { id: 110, name: 'Barbell Overhead Tricep Extension', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lower barbell behind head, extend back up.' },
    { id: 111, name: 'Barbell Skull Crushers', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lower bar to forehead, extend back up.' },
    { id: 112, name: 'JM Press', equipment: 'barbell', difficulty: 'advanced', complexity: 'high', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Hybrid between close-grip bench and skull crusher.' },
    { id: 113, name: 'Floor Press (Close-Grip)', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Close-grip press from floor position.' },
    
    // Dumbbell
    { id: 24, name: 'Dumbbell Overhead Tricep Extension', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lower weight behind head, extend up.' },
    { id: 114, name: 'Dumbbell Skull Crushers', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lower dumbbells to forehead, extend back up.' },
    { id: 115, name: 'Dumbbell Kickbacks', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Bend over, extend dumbbell behind you.' },
    { id: 116, name: 'Single-Arm Overhead Extension', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'One arm overhead extension, focus on control.' },
    { id: 117, name: 'Tate Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Elbows flared, lower dumbbells to chest sides.' },
    { id: 118, name: 'Dumbbell Close-Grip Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Press dumbbells with neutral grip, elbows close.' },
    { id: 119, name: 'Neutral-Grip Dumbbell Press', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Press with palms facing each other.' },
    
    // Cable
    { id: 22, name: 'Cable Tricep Pushdowns (Straight Bar)', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Push bar down, keep elbows at sides.' },
    { id: 120, name: 'Cable Tricep Pushdowns (Rope)', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Push rope down, spread ends apart at bottom.' },
    { id: 121, name: 'Cable Overhead Tricep Extension', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Face away from cable, extend overhead.' },
    { id: 122, name: 'Single-Arm Cable Pushdowns', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'One arm pushdown, focus on tricep contraction.' },
    { id: 123, name: 'Cable Kickbacks', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Bend over, extend cable handle behind you.' },
    { id: 124, name: 'Reverse-Grip Cable Pushdowns', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Underhand grip, push down focusing on triceps.' },
    { id: 125, name: 'Cable Skull Crushers', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lying position, extend cable to forehead level.' },
    
    // Bodyweight
    { id: 126, name: 'Tricep Dips (Parallel Bars)', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Lower body between bars, press up.' },
    { id: 127, name: 'Bench Dips', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Hands on bench, lower body and press up.' },
    { id: 128, name: 'Diamond Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Hands in diamond shape, emphasizes triceps.' },
    { id: 129, name: 'Close-Grip Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Hands close together, targets triceps.' },
    { id: 130, name: 'Pike Push-ups', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Pike position, targets shoulders and triceps.' },
    { id: 131, name: 'Tricep Push-ups (Hands Close)', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'push', instructions: 'Push-ups with hands positioned close together.' }
  ],
  
  biceps: [
    // Barbell
    { id: 132, name: 'Barbell Curls', equipment: 'barbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl barbell up, keep elbows at sides.' },
    { id: 133, name: 'Wide-Grip Barbell Curls', equipment: 'barbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Wider grip on barbell, targets outer biceps.' },
    { id: 134, name: 'Close-Grip Barbell Curls', equipment: 'barbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Narrow grip, targets inner biceps.' },
    { id: 135, name: 'Reverse Barbell Curls', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Overhand grip, targets forearms and biceps.' },
    { id: 25, name: 'Barbell Preacher Curls', equipment: 'barbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Rest arms on preacher bench, curl weight up.' },
    { id: 136, name: '21s (Barbell Curls)', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: '7 bottom half reps, 7 top half reps, 7 full reps.' },
    { id: 137, name: 'Drag Curls', equipment: 'barbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Drag bar up body, elbows move behind torso.' },
    
    // Dumbbell
    { id: 21, name: 'Dumbbell Bicep Curls', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl weights up, keep elbows at sides.' },
    { id: 138, name: 'Alternating Dumbbell Curls', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Alternate curling one dumbbell at a time.' },
    { id: 23, name: 'Hammer Curls', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl with neutral grip, palms facing each other.' },
    { id: 139, name: 'Concentration Curls', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Seated, elbow on knee, curl with focus.' },
    { id: 140, name: 'Incline Dumbbell Curls', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'On incline bench, curl with full stretch.' },
    { id: 141, name: 'Dumbbell Preacher Curls', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Dumbbell version of preacher curls.' },
    { id: 142, name: 'Cross-Body Hammer Curls', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl dumbbell across body to opposite shoulder.' },
    { id: 143, name: 'Zottman Curls', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl up with supinated grip, lower with pronated grip.' },
    { id: 144, name: '21s (Dumbbell Curls)', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: '21-rep protocol with dumbbells.' },
    
    // Cable
    { id: 145, name: 'Cable Bicep Curls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl cable handle up, constant tension.' },
    { id: 146, name: 'Cable Hammer Curls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Neutral grip cable curls.' },
    { id: 147, name: 'Cable Preacher Curls', equipment: 'cable', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Preacher curls using cable resistance.' },
    { id: 148, name: 'Single-Arm Cable Curls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'One arm cable curls for focused contraction.' },
    { id: 149, name: 'Cable Reverse Curls', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Overhand grip cable curls.' },
    { id: 150, name: 'High Cable Curls', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Cables set high, curl down to shoulders.' },
    { id: 151, name: 'Cable Concentration Curls', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Seated cable concentration curls.' },
    { id: 152, name: 'Cable 21s', equipment: 'cable', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: '21-rep protocol using cables.' },
    
    // Bodyweight
    { id: 153, name: 'Chin-ups (Underhand Grip)', equipment: 'bodyweight', difficulty: 'advanced', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'pull', prerequisites: ['Upper body strength'], instructions: 'Underhand grip pull-ups, targets biceps.' },
    { id: 154, name: 'Inverted Rows (Underhand Grip)', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'biceps', movementPattern: 'pull', instructions: 'Underhand grip inverted rows.' },
    { id: 155, name: 'Isometric Hangs', equipment: 'bodyweight', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'pull', instructions: 'Hang from bar with bent arms, hold position.' },
    { id: 156, name: 'Door Frame Curls', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'pull', instructions: 'Use door frame for resistance curls.' },
    { id: 157, name: 'Towel Curls', equipment: 'bodyweight', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'pull', instructions: 'Use towel and body weight for curl resistance.' }
  ],
  
  arms: [
    // Legacy arm exercises (keeping for backwards compatibility) - updated IDs to avoid conflicts
    { id: 221, name: 'Bicep Curl', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl weights up, keep elbows at sides.' },
    { id: 222, name: 'Tricep Pushdown', equipment: 'cable', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Push rope down, keep elbows at sides.' },
    { id: 223, name: 'Hammer Curl', equipment: 'dumbbell', difficulty: 'beginner', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Curl with neutral grip, palms facing each other.' },
    { id: 224, name: 'Overhead Tricep Extension', equipment: 'dumbbell', difficulty: 'intermediate', complexity: 'medium', primaryMuscle: 'triceps', movementPattern: 'isolation', instructions: 'Lower weight behind head, extend up.' },
    { id: 225, name: 'Preacher Curl', equipment: 'barbell', difficulty: 'intermediate', complexity: 'low', primaryMuscle: 'biceps', movementPattern: 'isolation', instructions: 'Rest arms on preacher bench, curl weight up.' }
  ]
};
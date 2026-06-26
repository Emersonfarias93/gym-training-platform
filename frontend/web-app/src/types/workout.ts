export type WorkoutTone = "primary" | "success" | "warning";

export type WorkoutBlock = {
  id: string;
  title: string;
  subtitle: string;
  meta: string;
  tone: WorkoutTone;
};

export type WorkoutExerciseProgress = {
  id: string;
  name: string;
  sets: string;
  progress: number;
};

export type WorkoutOverviewResponse = {
  activeSessions: number;
  weeklyVolumeLabel: string;
  averageDurationLabel: string;
  averageIntensityLabel: string;
  programmedBlocks: WorkoutBlock[];
  currentSession: WorkoutExerciseProgress[];
};

export type GenerateWorkoutInput = {
  focus?: string;
};

export type ManualWorkoutExerciseInput = {
  name: string;
  setsDescription: string;
  repsDescription: string;
  restSeconds?: number;
  loadSuggestion?: string;
  executionNotes?: string;
};

export type ManualWorkoutSessionInput = {
  title: string;
  scheduledDate: string;
  estimatedDurationMinutes: number;
  intensity: string;
  exercises: ManualWorkoutExerciseInput[];
};

export type CreateManualWorkoutInput = {
  title: string;
  goal: string;
  session: ManualWorkoutSessionInput;
};

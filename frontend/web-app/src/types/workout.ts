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

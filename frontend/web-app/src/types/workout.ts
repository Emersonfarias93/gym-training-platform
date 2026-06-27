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

export type WorkoutOrigin = "AI" | "MANUAL";

export type WorkoutPlanStatus = "ACTIVE" | "ARCHIVED";

export type WorkoutPlanSummary = {
  id: string;
  title: string;
  goal: string;
  origin: WorkoutOrigin;
  status: WorkoutPlanStatus;
  active: boolean;
  scheduledDate: string | null;
  intensity: string | null;
  estimatedDurationMinutes: number | null;
  sessionCount: number;
  exerciseCount: number;
  createdAt: string;
};

export type WorkoutExerciseDetail = {
  id: string;
  name: string;
  setsDescription: string;
  repsDescription: string;
  restSeconds: number | null;
  loadSuggestion: string | null;
  executionNotes: string | null;
  progressPercent: number;
  sortOrder: number;
};

export type WorkoutSessionDetail = {
  id: string;
  title: string;
  scheduledDate: string;
  status: string;
  estimatedDurationMinutes: number | null;
  intensity: string | null;
  sortOrder: number;
  exercises: WorkoutExerciseDetail[];
};

export type WorkoutPlanDetail = {
  id: string;
  title: string;
  goal: string;
  origin: WorkoutOrigin;
  status: WorkoutPlanStatus;
  active: boolean;
  createdAt: string;
  sessions: WorkoutSessionDetail[];
};

export type UpdateWorkoutInput = {
  title: string;
  goal: string;
  sessions: ManualWorkoutSessionInput[];
};

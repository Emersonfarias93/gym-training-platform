export type UserPremiumStatusResponse = {
  userId: string;
  premiumActive: boolean;
  planName: string | null;
  status: "NONE" | "ACTIVE" | "TRIALING" | "PAST_DUE" | "CANCELED" | "EXPIRED";
  currentPeriodEnd: string | null;
  lastSyncedAt: string;
};

export type UserAiCoachContextResponse = {
  userId: string;
  fullName: string;
  premiumActive: boolean;
  personalizationEnabled: boolean;
  mainGoal: string | null;
  experienceLevel: string | null;
  activityLevel: string | null;
  preferredTrainingTime: string | null;
  trainingFrequencyPerWeek: number | null;
  dietaryPreference: string | null;
  foodRestrictions: string | null;
  injuryNotes: string | null;
  medicalNotes: string | null;
};

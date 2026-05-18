export type Profile = {
  id: string;
  college_name: string | null;
  major: string | null;
  gender: string | null;
  sleep_schedule: string | null;
  partying_level: number | null;
  sports_interest: string | null;
  study_oriented_level: number | null;
  social_exposure_level: number | null;
  hobbies: string[];
  bio: string | null;
  created_at: string;
  updated_at: string;
};

/** Safe fields for discovery — no email, name, or auth identifiers */
export type PublicProfile = Pick<
  Profile,
  | "college_name"
  | "major"
  | "gender"
  | "sleep_schedule"
  | "partying_level"
  | "sports_interest"
  | "study_oriented_level"
  | "social_exposure_level"
  | "hobbies"
  | "bio"
>;

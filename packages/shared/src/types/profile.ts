/**
 * Adhikaar Citizen Profile Types
 */

export interface CitizenProfile {
  id: string;
  name: string;
  state: string | null;
  district: string | null;
  age: number | null;
  gender: string | null;
  occupation: string | null;
  income_band: string | null;
  category: string | null;
  language: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateProfileDto {
  name: string;
  state?: string | null;
  district?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  income_band?: string | null;
  category?: string | null;
  language?: string | null;
}

export interface UpdateProfileDto {
  name?: string;
  state?: string | null;
  district?: string | null;
  age?: number | null;
  gender?: string | null;
  occupation?: string | null;
  income_band?: string | null;
  category?: string | null;
  language?: string | null;
}

export interface ProfileResponse {
  status?: "ok";
  profile: CitizenProfile | null;
  message?: string;
}

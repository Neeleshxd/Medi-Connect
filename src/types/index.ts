// src/types/index.ts

export interface Doctor {
  id: string;  // Add the id field
  name: string;
  image: string;
  specialty: string[];
  qualifications: string[];
  experience: number;
  clinic?: string;
  location?: string;
  consultationMode?: string[];
  fee?: number;
}


export interface FilterState {
  search: string;
  consultationType: string;
  specialties: string[];
  sortBy: string;
}
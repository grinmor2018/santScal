export enum Seniority {
  JUNIOR = 'junior',
  SENIOR = 'senior',
}

export interface Candidate {
  id?: string;
  name: string;
  surname: string;
  seniority: Seniority;
  yearsOfExperience: number;
  availability: boolean;
} 
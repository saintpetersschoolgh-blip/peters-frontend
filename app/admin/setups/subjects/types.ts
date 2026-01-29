export interface Subject {
  id: string;
  name: string;
  code?: string;
  description?: string;
  department?: string;
  creditHours?: number;
  isCore: boolean;
  isElective: boolean;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubjectFormData {
  name: string;
  code?: string;
  description?: string;
  department?: string;
  creditHours?: number;
  isCore: boolean;
  isElective: boolean;
  isActive: boolean;
}

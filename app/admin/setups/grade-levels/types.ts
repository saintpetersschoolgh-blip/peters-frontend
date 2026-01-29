export interface GradeLevel {
  id: string;
  name: string;
  code?: string;
  description?: string;
}

export interface GradeLevelFormData {
  name: string;
  code?: string;
  description?: string;
}

import { GradeLevel } from '../../../../types';

export interface ClassRoom {
  id: string;
  name: string;
  code?: string;
  description?: string;
  capacity?: number;
  location?: string;
  classTeacherId?: string;
  gradeLevel?: GradeLevel;
  subjectIds: string[];
  studentIds: string[];
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClassRoomFormData {
  name: string;
  code?: string;
  description?: string;
  capacity?: number;
  location?: string;
  classTeacherId?: string;
  gradeLevel?: GradeLevel;
  subjectIds: string[];
  academicYear?: string;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

export interface Teacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  staffNumber?: string;
}

export interface Subject {
  id: string;
  name: string;
  code: string;
}

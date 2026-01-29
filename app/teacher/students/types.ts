export type Gender = 'MALE' | 'FEMALE';
export type StudentStatus = 'ACTIVE' | 'INACTIVE';

export interface AttendanceSummary {
  present: number;
  absent: number;
}

export type AssessmentKind = 'QUIZ' | 'ASSIGNMENT' | 'TEST';

export interface ScoreItem {
  id: string;
  kind: AssessmentKind | 'EXAM';
  title: string;
  date: string; // yyyy-mm-dd
  score: number;
  total: number;
}

export interface TeacherStudent {
  id: string;
  admissionNumber: string; // Student ID / index number
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string; // yyyy-mm-dd
  className: string;
  subjects: string[]; // student subjects (used to intersect teacher subjects)
  status: StudentStatus;
  attendance: AttendanceSummary;
  caScores: ScoreItem[]; // quizzes/assignments/tests
  examScores: ScoreItem[]; // exams (mock)
  createdAt: string;
  updatedAt: string;
}

export interface TeacherRemark {
  id: string;
  studentId: string;
  text: string;
  createdAt: string;
  visibleToAdmin: boolean; // simulate
}


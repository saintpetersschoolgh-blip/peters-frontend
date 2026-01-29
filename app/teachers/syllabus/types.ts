export type TopicStatus = 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';

export type SubmissionStatus = 'DRAFT' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';

export interface AcademicYearOption {
  id: string;
  name: string;
}

export interface TermOption {
  id: string;
  academicYearId: string;
  name: string;
  ended: boolean;
}

export interface ClassOption {
  id: string;
  name: string;
}

export interface SyllabusTopicContent {
  id: string;
  title: string;
  teachingPeriods: number;
  subTopics: string[];
  learningObjectives: string[];
  keyConcepts: string[];
  teachingMaterials: string[];
  referenceMaterials: string[];
}

export interface SyllabusUnit {
  id: string;
  title: string;
  topics: SyllabusTopicContent[];
}

export interface SyllabusSubject {
  id: string;
  academicYearId: string;
  termId: string;
  classId: string;
  name: string;
  units: SyllabusUnit[];
}

export interface TopicProgress {
  status: TopicStatus;
  dateCovered?: string; // yyyy-mm-dd
  notes?: string;
  updatedAt: string;
}

export type TopicProgressMap = Record<string, TopicProgress>;

export interface SyllabusSubmission {
  id: string;
  academicYearId: string;
  termId: string;
  classId: string;
  subjectId: string;
  requiredThresholdPercent: number;
  coveragePercentAtSubmit: number;
  status: SubmissionStatus;
  declarationAccepted: boolean;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerComment?: string;
  updatedAt: string;
}

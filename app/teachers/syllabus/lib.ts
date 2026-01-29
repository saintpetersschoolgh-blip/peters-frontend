import { useState } from 'react';
import type {
  SyllabusSubject,
  SyllabusTopicContent,
  TopicProgressMap,
  TopicStatus,
  SubmissionStatus,
  SyllabusSubmission,
} from './types';

export const PROGRESS_KEY = 'teacher:syllabus:progress:v1';
export const SUBMISSIONS_KEY = 'teacher:syllabus:submissions:v1';
export const SYLLABUS_SUBJECTS_KEY = 'teacher:syllabus:subjects:v1';

export function useLocalStorageState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });

  const save = (next: T) => {
    setValue(next);
    try {
      localStorage.setItem(key, JSON.stringify(next));
    } catch {
      // ignore
    }
  };

  return [value, save] as const;
}

export function getAllTopics(subject: SyllabusSubject): SyllabusTopicContent[] {
  return subject.units.flatMap((u) => u.topics);
}

export function buildFallbackStatuses(subjects: SyllabusSubject[]): Record<string, TopicStatus> {
  const map: Record<string, TopicStatus> = {};
  for (const subj of subjects) {
    for (const topic of getAllTopics(subj)) {
      // mock-data provides `statusHint` on the object; we treat it as optional metadata
      map[topic.id] = ((topic as any).statusHint as TopicStatus) || 'NOT_STARTED';
    }
  }
  return map;
}

export function computeCoveragePercent(
  subject: SyllabusSubject,
  progress: TopicProgressMap,
  fallbackStatuses: Record<string, TopicStatus>,
): { percent: number; completed: number; total: number } {
  const topics = getAllTopics(subject);
  const total = topics.length;
  if (!total) return { percent: 0, completed: 0, total: 0 };
  const completed = topics.filter((t) => (progress[t.id]?.status || fallbackStatuses[t.id] || 'NOT_STARTED') === 'COMPLETED').length;
  return { percent: Math.round((completed / total) * 100), completed, total };
}

export function findSubject(subjects: SyllabusSubject[], subjectId: string): SyllabusSubject | null {
  return subjects.find((s) => s.id === subjectId) || null;
}

export function findTopic(subject: SyllabusSubject, topicId: string): SyllabusTopicContent | null {
  for (const u of subject.units) {
    const t = u.topics.find((x) => x.id === topicId);
    if (t) return t;
  }
  return null;
}

export function getSubmissionKey(params: { academicYearId: string; termId: string; classId: string; subjectId: string }) {
  return `${params.academicYearId}|${params.termId}|${params.classId}|${params.subjectId}`;
}

export function isEditingLockedBySubmission(status: SubmissionStatus): boolean {
  return status === 'SUBMITTED' || status === 'APPROVED';
}

export function defaultSubmission(params: {
  academicYearId: string;
  termId: string;
  classId: string;
  subjectId: string;
  requiredThresholdPercent: number;
}): SyllabusSubmission {
  const now = new Date().toISOString();
  return {
    id: `sub-${Date.now()}`,
    academicYearId: params.academicYearId,
    termId: params.termId,
    classId: params.classId,
    subjectId: params.subjectId,
    requiredThresholdPercent: params.requiredThresholdPercent,
    coveragePercentAtSubmit: 0,
    status: 'DRAFT',
    declarationAccepted: false,
    updatedAt: now,
  };
}

export function getLockReason(opts: { termEnded: boolean; submissionStatus: SubmissionStatus }) {
  if (opts.termEnded) return 'Term ended: progress editing is locked for this term.';
  if (opts.submissionStatus === 'SUBMITTED') return 'Submitted: editing is locked while awaiting approval.';
  if (opts.submissionStatus === 'APPROVED') return 'Approved: editing is locked.';
  return '';
}

export function mergeSyllabusSubjects(mockSubjects: SyllabusSubject[], createdSubjects: SyllabusSubject[]) {
  const byId = new Map<string, SyllabusSubject>();
  for (const s of mockSubjects) byId.set(s.id, s);
  for (const s of createdSubjects) byId.set(s.id, s); // created overrides if same id
  return Array.from(byId.values());
}


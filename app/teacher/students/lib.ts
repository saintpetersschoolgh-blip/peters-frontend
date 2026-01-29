import type { TeacherRemark, TeacherStudent } from './types';
import type { TermOption } from '../../teachers/syllabus/types';

export const TEACHER_STUDENTS_KEY = 'teacher:students:v1';
export const TEACHER_REMARKS_KEY = 'teacher:students:remarks:v1';

export function safeJsonParse<T>(raw: string | null, fallback: T): T {
  try {
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function writeLocalStorage<T>(key: string, value: T) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // ignore
  }
}

export function readLocalStorage<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback;
  return safeJsonParse<T>(localStorage.getItem(key), fallback);
}

export function getTeacherAssignedClasses(): string[] {
  const raw = readLocalStorage<any[]>('teacher:my-classes', []);
  const names = raw
    .map((c) => String(c?.className || c?.name || c?.title || c?.label || '').trim())
    .filter(Boolean);
  const uniq = Array.from(new Set(names));
  if (uniq.length) return uniq;

  // Fallback demo assignment (ensures sample students can show)
  const fallback = ['Grade 10A', 'Grade 10B'];
  try {
    writeLocalStorage('teacher:my-classes', fallback.map((t, i) => ({ id: `mc-auto-${i + 1}`, title: t })));
  } catch {
    // ignore
  }
  return fallback;
}

export function getTeacherAssignedSubjects(): string[] {
  const raw = readLocalStorage<any[]>('teacher:my-subjects', []);
  const names = raw
    .map((s) => String(s?.subjectName || s?.name || s?.title || s?.label || '').trim())
    .filter(Boolean);
  const uniq = Array.from(new Set(names));
  if (uniq.length) return uniq;

  // Fallback demo assignment (ensures sample students can show)
  const fallback = ['Mathematics', 'English Language', 'ICT'];
  try {
    writeLocalStorage('teacher:my-subjects', fallback.map((t, i) => ({ id: `ms-auto-${i + 1}`, title: t })));
  } catch {
    // ignore
  }
  return fallback;
}

export function normalizeText(s: string) {
  return s.trim().toLowerCase();
}

export function intersects(a: string[], b: string[]) {
  const setB = new Set(b.map(normalizeText));
  return a.some((x) => setB.has(normalizeText(x)));
}

export function isStudentVisibleToTeacher(student: TeacherStudent, teacherClasses: string[], teacherSubjects: string[]) {
  const classOk = teacherClasses.length === 0 ? false : teacherClasses.map(normalizeText).includes(normalizeText(student.className));
  const subjectOk = teacherSubjects.length === 0 ? false : intersects(student.subjects || [], teacherSubjects);
  return classOk && subjectOk;
}

export function isTermEnded(terms: TermOption[], termId: string): boolean {
  return terms.find((t) => t.id === termId)?.ended ?? false;
}

function rand(seed: number) {
  // deterministic-ish pseudo random
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
}

function pick<T>(arr: T[], r: number): T {
  return arr[Math.floor(r * arr.length)];
}

function scoreItem(id: string, kind: any, title: string, date: string, score: number, total: number) {
  return { id, kind, title, date, score, total };
}

export function seedTeacherStudents(classes: string[], teacherSubjects: string[]): TeacherStudent[] {
  const today = new Date();
  const yyyyMmDd = (d: Date) => d.toISOString().split('T')[0];
  const addDays = (n: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d;
  };

  const firstNamesMale = ['John', 'Kofi', 'Michael', 'Daniel', 'Yaw', 'Joseph'];
  const firstNamesFemale = ['Jane', 'Ama', 'Sarah', 'Grace', 'Mary', 'Abena'];
  const lastNames = ['Doe', 'Mensah', 'Owusu', 'Boateng', 'Smith', 'Brown'];

  const defaultStudentSubjects = Array.from(new Set([...teacherSubjects, 'English Language'])).filter(Boolean);
  const results: TeacherStudent[] = [];

  let counter = 1;
  for (const cls of classes) {
    for (let i = 0; i < 6; i++) {
      const r = rand(counter * 97);
      const gender = r > 0.5 ? 'MALE' : 'FEMALE';
      const firstName = gender === 'MALE' ? pick(firstNamesMale, r) : pick(firstNamesFemale, r);
      const lastName = pick(lastNames, rand(counter * 131));
      const admissionNumber = `STU${String(counter).padStart(3, '0')}`;

      const totalDays = 40;
      const absent = Math.floor(rand(counter * 23) * 8); // 0..7
      const present = totalDays - absent;

      // Vary performance: low/avg/high
      const tier = rand(counter * 19);
      const base = tier < 0.33 ? 45 : tier < 0.66 ? 65 : 85;

      const caScores = [
        scoreItem(`q-${counter}-1`, 'QUIZ', 'Quiz 1', yyyyMmDd(addDays(-20)), Math.round(base - 10 + rand(counter * 7) * 20), 20),
        scoreItem(`a-${counter}-1`, 'ASSIGNMENT', 'Assignment 1', yyyyMmDd(addDays(-14)), Math.round(base - 15 + rand(counter * 11) * 25), 25),
        scoreItem(`t-${counter}-1`, 'TEST', 'Class Test 1', yyyyMmDd(addDays(-10)), Math.round(base - 20 + rand(counter * 13) * 30), 50),
      ];

      const examScores = [
        scoreItem(`e-${counter}-1`, 'EXAM', 'Mid-Term Exam', yyyyMmDd(addDays(-5)), Math.round(base - 25 + rand(counter * 17) * 40), 100),
      ];

      results.push({
        id: `student-${counter}`,
        admissionNumber,
        firstName,
        lastName,
        gender: gender as any,
        dateOfBirth: yyyyMmDd(new Date(2008, Math.floor(rand(counter * 29) * 12), Math.floor(rand(counter * 31) * 28) + 1)),
        className: cls,
        subjects: defaultStudentSubjects,
        status: rand(counter * 41) > 0.15 ? 'ACTIVE' : 'INACTIVE',
        attendance: { present, absent },
        caScores,
        examScores,
        createdAt: new Date(addDays(-60)).toISOString(),
        updatedAt: new Date(addDays(-2)).toISOString(),
      });

      counter++;
    }
  }

  return results;
}

export function migrateOldMyStudentsIfNeeded() {
  const existing = readLocalStorage<TeacherStudent[] | null>(TEACHER_STUDENTS_KEY, null as any);
  // If we already have non-empty new-format students, don't migrate.
  if (Array.isArray(existing) && existing.length > 0) return;

  const old = readLocalStorage<any[]>('teacher:my-students', []);
  if (!old.length) return;

  const now = new Date().toISOString();
  const converted: TeacherStudent[] = old.map((s, idx) => ({
    id: String(s.id || `student-migrated-${idx + 1}`),
    admissionNumber: String(s.admissionNumber || `STU${String(idx + 1).padStart(3, '0')}`),
    firstName: String(s.firstName || 'Student'),
    lastName: String(s.lastName || `${idx + 1}`),
    gender: (s.gender === 'FEMALE' ? 'FEMALE' : 'MALE') as any,
    dateOfBirth: '2008-01-01',
    className: String(s.className || ''),
    subjects: [],
    status: (s.status === 'INACTIVE' ? 'INACTIVE' : 'ACTIVE') as any,
    attendance: { present: 0, absent: 0 },
    caScores: [],
    examScores: [],
    createdAt: s.createdAt || now,
    updatedAt: s.updatedAt || now,
  }));

  writeLocalStorage(TEACHER_STUDENTS_KEY, converted);
}

export function addRemark(remarksByStudent: Record<string, TeacherRemark[]>, studentId: string, text: string): Record<string, TeacherRemark[]> {
  const now = new Date().toISOString();
  const next: TeacherRemark = {
    id: `remark-${Date.now()}`,
    studentId,
    text,
    createdAt: now,
    visibleToAdmin: true,
  };
  const prev = remarksByStudent[studentId] || [];
  return { ...remarksByStudent, [studentId]: [next, ...prev] };
}


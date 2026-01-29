import type { AcademicYearOption, ClassOption, SyllabusSubject, TermOption, TopicStatus } from './types';

export const MOCK_ACADEMIC_YEARS: AcademicYearOption[] = [
  { id: 'ay-2024-2025', name: '2024-2025' },
  { id: 'ay-2025-2026', name: '2025-2026' },
];

export const MOCK_TERMS: TermOption[] = [
  { id: 't1-2025-2026', academicYearId: 'ay-2025-2026', name: 'Term 1', ended: true },
  { id: 't2-2025-2026', academicYearId: 'ay-2025-2026', name: 'Term 2', ended: false },
  { id: 't3-2025-2026', academicYearId: 'ay-2025-2026', name: 'Term 3', ended: false },
];

export const MOCK_CLASSES: ClassOption[] = [
  { id: 'c-10a', name: 'Grade 10A' },
  { id: 'c-10b', name: 'Grade 10B' },
];

const t = (id: string, title: string, teachingPeriods: number, statusHint: TopicStatus) => ({
  id,
  title,
  teachingPeriods,
  statusHint,
});

export const MOCK_SYLLABUS_SUBJECTS: SyllabusSubject[] = [
  {
    id: 'sub-math-10a-t2',
    academicYearId: 'ay-2025-2026',
    termId: 't2-2025-2026',
    classId: 'c-10a',
    name: 'Mathematics',
    units: [
      {
        id: 'u-math-1',
        title: 'Unit 1: Algebra Foundations',
        topics: [
          {
            ...t('topic-math-1', 'Linear Equations', 3, 'COMPLETED'),
            subTopics: ['Solving one-step equations', 'Solving two-step equations', 'Checking solutions'],
            learningObjectives: [
              'Solve linear equations using inverse operations',
              'Verify solutions by substitution',
              'Model basic word problems using equations',
            ],
            keyConcepts: ['Inverse operations', 'Equality', 'Substitution'],
            teachingMaterials: ['Whiteboard examples', 'Practice worksheet (10 questions)', 'Graph paper'],
            referenceMaterials: ['Textbook Ch. 2', 'Teacher guide notes'],
          },
          {
            ...t('topic-math-2', 'Simultaneous Equations', 4, 'IN_PROGRESS'),
            subTopics: ['Elimination method', 'Substitution method', 'Word problems'],
            learningObjectives: [
              'Solve a system of two linear equations',
              'Choose an appropriate method for a given pair of equations',
            ],
            keyConcepts: ['Elimination', 'Substitution', 'System of equations'],
            teachingMaterials: ['Worked examples', 'Class activity cards'],
            referenceMaterials: ['Textbook Ch. 3', 'Past questions'],
          },
          {
            ...t('topic-math-3', 'Inequalities', 2, 'NOT_STARTED'),
            subTopics: ['Number line representation', 'Solving inequalities', 'Word problems'],
            learningObjectives: [
              'Solve and represent inequalities on a number line',
              'Interpret inequality solutions in context',
            ],
            keyConcepts: ['Inequality symbols', 'Number line', 'Solution set'],
            teachingMaterials: ['Number line charts', 'Mini quizzes'],
            referenceMaterials: ['Textbook Ch. 4'],
          },
        ],
      },
      {
        id: 'u-math-2',
        title: 'Unit 2: Geometry Basics',
        topics: [
          {
            ...t('topic-math-4', 'Angles and Lines', 3, 'NOT_STARTED'),
            subTopics: ['Complementary angles', 'Supplementary angles', 'Parallel lines & transversals'],
            learningObjectives: [
              'Identify angle relationships',
              'Solve unknown angles using properties of parallel lines',
            ],
            keyConcepts: ['Transversal', 'Alternate angles', 'Corresponding angles'],
            teachingMaterials: ['Geometry diagrams', 'Protractor practice'],
            referenceMaterials: ['Textbook Ch. 5'],
          },
        ],
      },
    ],
  },
  {
    id: 'sub-eng-10a-t2',
    academicYearId: 'ay-2025-2026',
    termId: 't2-2025-2026',
    classId: 'c-10a',
    name: 'English Language',
    units: [
      {
        id: 'u-eng-1',
        title: 'Unit 1: Reading & Comprehension',
        topics: [
          {
            ...t('topic-eng-1', 'Identifying Main Ideas', 2, 'COMPLETED'),
            subTopics: ['Topic sentences', 'Supporting details', 'Summarizing'],
            learningObjectives: ['Identify main ideas and supporting details', 'Write a short summary'],
            keyConcepts: ['Main idea', 'Detail', 'Summary'],
            teachingMaterials: ['Short passages', 'Summary template'],
            referenceMaterials: ['Workbook Unit 1'],
          },
          {
            ...t('topic-eng-2', 'Inference & Interpretation', 3, 'IN_PROGRESS'),
            subTopics: ['Context clues', 'Author’s purpose', 'Tone'],
            learningObjectives: ['Infer meaning from context', 'Explain author’s purpose'],
            keyConcepts: ['Inference', 'Tone', 'Purpose'],
            teachingMaterials: ['Reading passage pack', 'Group discussion prompts'],
            referenceMaterials: ['Workbook Unit 2'],
          },
        ],
      },
    ],
  },
  {
    id: 'sub-ict-10b-t1',
    academicYearId: 'ay-2025-2026',
    termId: 't1-2025-2026',
    classId: 'c-10b',
    name: 'ICT',
    units: [
      {
        id: 'u-ict-1',
        title: 'Unit 1: Computer Systems',
        topics: [
          {
            ...t('topic-ict-1', 'Hardware vs Software', 2, 'COMPLETED'),
            subTopics: ['Input devices', 'Output devices', 'System software', 'Application software'],
            learningObjectives: ['Differentiate hardware and software', 'Give examples of each'],
            keyConcepts: ['Hardware', 'Software', 'Peripherals'],
            teachingMaterials: ['Device photos', 'Lab demo'],
            referenceMaterials: ['ICT Textbook Ch. 1'],
          },
          {
            ...t('topic-ict-2', 'File Management', 2, 'COMPLETED'),
            subTopics: ['Folders', 'Naming conventions', 'File extensions', 'Backups'],
            learningObjectives: ['Organize files and folders effectively', 'Explain file extensions'],
            keyConcepts: ['Directory', 'Extension', 'Backup'],
            teachingMaterials: ['Lab exercise sheet'],
            referenceMaterials: ['ICT Textbook Ch. 2'],
          },
        ],
      },
    ],
  },
];

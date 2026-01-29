
// ===== AUTHENTICATION & USER TYPES =====
export enum UserRole {
  ADMIN = 'ADMIN',
  TEACHER = 'TEACHER',
  STUDENT = 'STUDENT',
  PARENT = 'PARENT',
  HEAD_MASTER = 'HEAD_MASTER',
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  [UserRole.ADMIN]: 'Administrator',
  [UserRole.TEACHER]: 'Teacher',
  [UserRole.STUDENT]: 'Student',
  [UserRole.PARENT]: 'Parent',
  [UserRole.HEAD_MASTER]: 'Head-Master',
};

export function formatUserRole(role: UserRole): string {
  return USER_ROLE_LABELS[role] ?? role;
}

export enum UserStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  firstName: string;
  lastName: string;
  profileImage?: string;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
  // Role-specific data
  studentId?: string;
  teacherId?: string;
  parentId?: string;
  adminId?: string;
}

// ===== CORE BUSINESS ENTITIES =====

// 1. CLASSROOM MANAGEMENT
export interface Classroom {
  id: string;
  name: string;
  academicYear: string;
  classMasterId: string;
  classMaster?: Teacher;
  capacity: number;
  currentStudents: number;
  subjects: Subject[];
  teachers: Teacher[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 2. SUBJECT MANAGEMENT
export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  classroomId: string;
  classroom?: Classroom;
  teachers: Teacher[];
  syllabus?: Syllabus;
  totalTopics: number;
  completedTopics: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 3. SYLLABUS MANAGEMENT
export interface Syllabus {
  id: string;
  subjectId: string;
  subject?: Subject;
  totalTopics: number;
  topics: SyllabusTopic[];
  completionPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusTopic {
  id: string;
  syllabusId: string;
  title: string;
  description?: string;
  order: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

// 4. STUDENT MANAGEMENT
export interface Student {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  email?: string;
  parentId: string;
  parent?: Parent;
  classroomId: string;
  classroom?: Classroom;
  isActive: boolean;
  enrolledAt: string;
  lastPromotion?: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// 5. PARENT MANAGEMENT
export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  occupation?: string;
  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  students: Student[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// 6. TEACHER MANAGEMENT
export interface Teacher {
  id: string;
  staffNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  email: string;
  qualifications: string[];
  subjects: Subject[];
  classrooms: Classroom[];
  isActive: boolean;
  joinedAt: string;
  profileImage?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== ATTENDANCE SYSTEMS =====

// 7. STUDENT ATTENDANCE
export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  PERMISSION = 'PERMISSION'
}

export interface StudentAttendance {
  id: string;
  studentId: string;
  student?: Student;
  classroomId: string;
  classroom?: Classroom;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  markedBy?: User;
  remarks?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

// 8. TEACHER ATTENDANCE
export interface TeacherAttendance {
  id: string;
  teacherId: string;
  teacher?: Teacher;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  markedBy?: User;
  remarks?: string;
  createdAt: string;
}

// ===== ACADEMIC SYSTEMS =====

// 9. TIMETABLE MANAGEMENT
export interface TimetableEntry {
  id: string;
  subjectId: string;
  subject?: Subject;
  teacherId: string;
  teacher?: Teacher;
  classroomId: string;
  classroom?: Classroom;
  dayOfWeek: number; // 1-7 (Monday-Sunday)
  startTime: string;
  endTime: string;
  period: number;
  isActive: boolean;
  createdAt: string;
}

// 10. LESSON NOTES
export interface LessonNote {
  id: string;
  timetableId: string;
  timetable?: TimetableEntry;
  topicsCovered: string;
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  homework?: string;
  remarks?: string;
  isApproved: boolean;
  submittedAt: string;
  approvedAt?: string;
  approvedById?: string;
  createdAt: string;
  updatedAt: string;
}

// ===== ASSESSMENT SYSTEMS =====

// 11. EXAM MANAGEMENT
export enum ExamStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  GRADED = 'GRADED'
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  subject?: Subject;
  classroomId: string;
  classroom?: Classroom;
  term: string;
  date: string;
  startTime: string;
  duration: number; // in minutes
  totalScore: number;
  venue: string;
  instructions?: string;
  status: ExamStatus;
  createdById: string;
  createdBy?: User;
  isActive: boolean;
  createdAt: string;
}

// 12. EXAM RESULTS
export interface ExamResult {
  id: string;
  examId: string;
  exam?: Exam;
  studentId: string;
  student?: Student;
  score: number;
  grade: string;
  remarks?: string;
  enteredById: string;
  enteredBy?: User;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

// ===== FINANCIAL SYSTEMS =====

// 13. FEE MANAGEMENT
export interface FeeStructure {
  id: string;
  classroomId: string;
  classroom?: Classroom;
  term: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  labFee?: number;
  libraryFee?: number;
  transportFee?: number;
  otherFees?: { [key: string]: number };
  totalAmount: number;
  isActive: boolean;
  createdAt: string;
}

// ===== COMMUNICATION SYSTEMS =====

// 14. NOTIFICATION SYSTEM
export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'GENERAL' | 'ACADEMIC' | 'FINANCIAL' | 'ATTENDANCE' | 'IMPORTANT';
  recipientType: 'ALL' | 'ROLE' | 'INDIVIDUAL' | 'CLASS';
  recipientRoles?: UserRole[];
  recipientIds?: string[];
  classroomIds?: string[];
  sentById: string;
  sentBy?: User;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

// ===== MONITORING SYSTEMS =====

// 15. PERFORMANCE FLAGS
export enum FlagType {
  ACADEMIC = 'ACADEMIC',
  ATTENDANCE = 'ATTENDANCE',
  FINANCIAL = 'FINANCIAL',
  BEHAVIOR = 'BEHAVIOR'
}

export enum FlagStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED'
}

export interface PerformanceFlag {
  id: string;
  type: FlagType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  entityType: 'STUDENT' | 'TEACHER' | 'CLASSROOM' | 'SUBJECT';
  entityId: string;
  status: FlagStatus;
  raisedById: string;
  raisedBy?: User;
  resolvedById?: string;
  resolvedBy?: User;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  hasRole: (role: UserRole) => boolean;
  hasAnyRole: (roles: UserRole[]) => boolean;
  canAccess: (requiredRoles: UserRole[]) => boolean;
}

// Business Logic Types
export enum PaymentStatus {
  PAID = 'PAID',
  PENDING = 'PENDING',
  OVERDUE = 'OVERDUE'
}

export enum AttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LATE = 'LATE',
  PERMISSION = 'PERMISSION'
}

export enum AssignmentStatus {
  ACTIVE = 'ACTIVE',
  DRAFT = 'DRAFT',
  COMPLETED = 'COMPLETED',
  OVERDUE = 'OVERDUE'
}

export enum ExamStatus {
  UPCOMING = 'UPCOMING',
  IN_PROGRESS = 'IN_PROGRESS',
  GRADED = 'GRADED',
  PENDING_RESULT = 'PENDING_RESULT'
}

export enum FlagStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED'
}

export enum FlagType {
  ACADEMIC = 'ACADEMIC',
  ATTENDANCE = 'ATTENDANCE',
  FINANCIAL = 'FINANCIAL',
  BEHAVIOR = 'BEHAVIOR'
}

export interface AttendanceRecord {
  studentId: string;
  studentName: string;
  status: AttendanceStatus;
  timestamp: string;
  avatar: string;
}

export interface ClassWork {
  id: string;
  title: string;
  subject: string;
  assignedDate: string;
  dueDate: string;
  status: AssignmentStatus;
  submissions: number;
  totalStudents: number;
  class: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  duration: string;
  venue: string;
  status: ExamStatus;
  averageScore?: number;
  gradingProgress: number; // percentage
  class: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  studentName: string;
  class: string;
  totalAmount: number;
  paidAmount: number;
  status: PaymentStatus;
  dueDate: string;
  lastPaymentDate?: string;
  avatar: string;
}

export interface Student {
  id: string;
  name: string;
  grade: string;
  class: string;
  section: string;
  email: string;
  attendance: number;
  lastPaymentStatus: PaymentStatus;
  avatar: string;
}

export interface Teacher {
  id: string;
  name: string;
  subject: string;
  experience: string;
  email: string;
  status: 'Active' | 'On Leave';
  avatar: string;
}

// Business Entity Types
export interface Classroom {
  id: string;
  name: string;
  academicYear: string;
  classMasterId: string;
  classMaster?: Teacher;
  capacity: number;
  currentStudents: number;
  subjects: Subject[];
  teachers: Teacher[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  description?: string;
  classroomId: string;
  classroom?: Classroom;
  teachers: Teacher[];
  syllabus?: Syllabus;
  totalTopics: number;
  completedTopics: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Syllabus {
  id: string;
  subjectId: string;
  subject?: Subject;
  totalTopics: number;
  topics: SyllabusTopic[];
  completionPercentage: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SyllabusTopic {
  id: string;
  syllabusId: string;
  title: string;
  description?: string;
  order: number;
  isCompleted: boolean;
  completedAt?: string;
  createdAt: string;
}

export interface StudentDetail extends Student {
  admissionNumber: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  parentId: string;
  parent?: Parent;
  classroomId: string;
  classroom?: Classroom;
  isActive: boolean;
  enrolledAt: string;
  lastPromotion?: string;
}

export interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  address: string;
  occupation?: string;
  relationship: 'FATHER' | 'MOTHER' | 'GUARDIAN';
  students: StudentDetail[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherDetail extends Teacher {
  staffNumber: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  qualifications: string[];
  subjects: Subject[];
  classrooms: Classroom[];
  isActive: boolean;
  joinedAt: string;
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  student?: StudentDetail;
  classroomId: string;
  classroom?: Classroom;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  markedBy?: User;
  remarks?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TeacherAttendance {
  id: string;
  teacherId: string;
  teacher?: TeacherDetail;
  date: string;
  status: AttendanceStatus;
  markedById: string;
  markedBy?: User;
  remarks?: string;
  createdAt: string;
}

export interface TimetableEntry {
  id: string;
  subjectId: string;
  subject?: Subject;
  teacherId: string;
  teacher?: TeacherDetail;
  classroomId: string;
  classroom?: Classroom;
  dayOfWeek: number; // 1-7 (Monday-Sunday)
  startTime: string;
  endTime: string;
  period: number;
  isActive: boolean;
  createdAt: string;
}

export interface LessonNote {
  id: string;
  timetableId: string;
  timetable?: TimetableEntry;
  topicsCovered: string;
  objectives: string;
  materials: string;
  activities: string;
  assessment: string;
  homework?: string;
  remarks?: string;
  isApproved: boolean;
  submittedAt: string;
  approvedAt?: string;
  approvedById?: string;
}

export interface Exam {
  id: string;
  title: string;
  subjectId: string;
  subject?: Subject;
  classroomId: string;
  classroom?: Classroom;
  term: string;
  date: string;
  startTime: string;
  duration: number; // in minutes
  totalScore: number;
  venue: string;
  instructions?: string;
  status: ExamStatus;
  createdById: string;
  createdBy?: User;
  isActive: boolean;
  createdAt: string;
}

export interface ExamResult {
  id: string;
  examId: string;
  exam?: Exam;
  studentId: string;
  student?: StudentDetail;
  score: number;
  grade: string;
  remarks?: string;
  enteredById: string;
  enteredBy?: User;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FeeStructure {
  id: string;
  classroomId: string;
  classroom?: Classroom;
  term: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  labFee?: number;
  libraryFee?: number;
  transportFee?: number;
  otherFees?: { [key: string]: number };
  totalAmount: number;
  isActive: boolean;
  createdAt: string;
}

export interface FeePayment {
  id: string;
  studentId: string;
  student?: Student;
  feeStructureId: string;
  feeStructure?: FeeStructure;
  amount: number;
  paymentDate: string;
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'CHEQUE' | 'ONLINE';
  transactionId?: string;
  remarks?: string;
  /**
   * Optional status used by the frontend UI.
   * (In real systems this is typically derived from the fee balance.)
   */
  status?: PaymentStatus;
  /** Optional UI-only notes field (kept separate from remarks if needed). */
  notes?: string;
  /** Optional audit fields for demo UI. */
  recordedById?: string;
  receivedById: string;
  receivedBy?: User;
  createdAt: string;
  updatedAt?: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'GENERAL' | 'ACADEMIC' | 'FINANCIAL' | 'ATTENDANCE' | 'IMPORTANT';
  recipientType: 'ALL' | 'ROLE' | 'INDIVIDUAL' | 'CLASS';
  recipientRoles?: UserRole[];
  recipientIds?: string[];
  classroomIds?: string[];
  sentById: string;
  sentBy?: User;
  isRead: boolean;
  readAt?: string;
  createdAt: string;
}

export interface PerformanceFlag {
  id: string;
  type: FlagType;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  title: string;
  description: string;
  entityType: 'STUDENT' | 'TEACHER' | 'CLASSROOM' | 'SUBJECT';
  entityId: string;
  status: FlagStatus;
  raisedById: string;
  raisedBy?: User;
  resolvedById?: string;
  resolvedBy?: User;
  resolvedAt?: string;
  resolution?: string;
  createdAt: string;
  updatedAt: string;
}

// UI Types
export interface Stats {
  totalStudents: number;
  totalTeachers: number;
  averageAttendance: number;
  totalRevenue: number;
}

export interface DashboardViewProps {
  user: User;
  stats: Stats;
}

// ===== COMPREHENSIVE FRONTEND SYSTEM TYPES =====

// 24. ANALYTICS & REPORTING SYSTEMS
export interface AnalyticsMetric {
  id: string;
  name: string;
  value: number;
  change: number;
  changeType: 'INCREASE' | 'DECREASE' | 'STABLE';
  period: string;
  category: 'ACADEMIC' | 'ATTENDANCE' | 'FINANCIAL' | 'BEHAVIOR';
}

export interface StudentAnalytics {
  studentId: string;
  student?: Student;
  performanceTrend: AnalyticsMetric[];
  attendanceRate: number;
  averageScore: number;
  subjectPerformance: { [subjectId: string]: number };
  riskIndicators: string[];
  improvementAreas: string[];
  strengths: string[];
}

export interface TeacherAnalytics {
  teacherId: string;
  teacher?: Teacher;
  classPerformance: { [classroomId: string]: number };
  subjectExpertise: { [subjectId: string]: number };
  studentImprovement: number;
  lessonCompletion: number;
  attendanceRate: number;
}

export interface ClassroomAnalytics {
  classroomId: string;
  classroom?: Classroom;
  averagePerformance: number;
  attendanceRate: number;
  topPerformers: Student[];
  atRiskStudents: Student[];
  subjectPerformance: { [subjectId: string]: number };
  teacherPerformance: { [teacherId: string]: number };
}

// 25. SYLLABUS & LESSON MANAGEMENT
export interface SyllabusProgress {
  id: string;
  syllabusId: string;
  syllabus?: Syllabus;
  completedTopics: number;
  totalTopics: number;
  expectedProgress: number;
  actualProgress: number;
  isOnTrack: boolean;
  lastUpdated: string;
  teacherId: string;
  teacher?: Teacher;
}

// 26. REPORT CARDS
export interface ReportCard {
  id: string;
  studentId: string;
  student?: Student;
  academicYear: string;
  term: string;
  subjects: ReportCardSubject[];
  overallGrade: string;
  overallScore: number;
  attendance: number;
  teacherComments: string;
  principalComments: string;
  generatedAt: string;
  publishedAt?: string;
  isPublished: boolean;
}

export interface ReportCardSubject {
  subjectId: string;
  subject?: Subject;
  score: number;
  grade: string;
  teacherId: string;
  teacher?: Teacher;
  comments: string;
}

// 27. ENHANCED NOTIFICATIONS
export interface NotificationAction {
  id: string;
  label: string;
  type: 'LINK' | 'MODAL' | 'REDIRECT';
  target: string;
}

// 28. USER PREFERENCES
export interface UserPreferences {
  id: string;
  userId: string;
  theme: 'LIGHT' | 'DARK' | 'AUTO';
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    academic: boolean;
    attendance: boolean;
    financial: boolean;
  };
  dashboardLayout: string;
  language: string;
  timezone: string;
}

// 29. FORM DATA INTERFACES
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe: boolean;
}

export interface StudentFormData {
  admissionNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  address: string;
  phoneNumber: string;
  emergencyContact: string;
  email?: string;
  parentId: string;
  classroomId: string;
}

export interface TeacherFormData {
  staffNumber: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'MALE' | 'FEMALE';
  phoneNumber: string;
  address: string;
  email: string;
  qualifications: string[];
  subjects: string[];
  classrooms: string[];
}

export interface ClassroomFormData {
  name: string;
  academicYear: string;
  classMasterId: string;
  capacity: number;
}

export interface SubjectFormData {
  code: string;
  name: string;
  description?: string;
  classroomId: string;
  teacherIds: string[];
}

export interface ExamFormData {
  title: string;
  subjectId: string;
  classroomId: string;
  term: string;
  date: string;
  startTime: string;
  duration: number;
  totalScore: number;
  venue: string;
  instructions?: string;
}

export interface FeeStructureFormData {
  classroomId: string;
  term: string;
  academicYear: string;
  tuitionFee: number;
  examFee: number;
  labFee?: number;
  libraryFee?: number;
  transportFee?: number;
  otherFees?: { [key: string]: number };
}

// 30. UI STATE MANAGEMENT
export interface DashboardState {
  role: UserRole;
  user: User | null;
  stats: DashboardStats;
  alerts: Alert[];
  recentActivity: Activity[];
}

export interface DashboardStats {
  totalStudents: number;
  totalTeachers: number;
  totalClassrooms: number;
  totalSubjects: number;
  attendanceRate: number;
  averagePerformance: number;
  totalFees: number;
  pendingPayments: number;
}

export interface Alert {
  id: string;
  type: 'INFO' | 'WARNING' | 'ERROR' | 'SUCCESS';
  title: string;
  message: string;
  actionUrl?: string;
  actionLabel?: string;
  createdAt: string;
  expiresAt?: string;
}

export interface Activity {
  id: string;
  type: 'LOGIN' | 'EXAM_CREATED' | 'RESULT_PUBLISHED' | 'PAYMENT_RECEIVED' | 'ATTENDANCE_MARKED';
  description: string;
  userId: string;
  user?: User;
  entityId?: string;
  entityType?: string;
  createdAt: string;
}

// 31. MODAL & FORM STATE
export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: any;
  onConfirm?: (data: any) => void;
  onCancel?: () => void;
}

export interface FormState {
  isSubmitting: boolean;
  errors: { [key: string]: string };
  data: { [key: string]: any };
}

// 32. ACADEMIC YEAR SETUP
export interface AcademicYear {
  id: string;
  name: string;
  startDate: string; // ISO date string
  endDate: string; // ISO date string
  createdAt: string;
  updatedAt: string;
}

export interface AcademicYearFormData {
  name: string;
  startDate: string;
  endDate: string;
}

// 33. TERM SETUP
export interface Term {
  id: string;
  name: string;
  academicYearId: string;
  academicYear?: AcademicYear;
  startDate: string;
  endDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface TermFormData {
  name: string;
  academicYearId: string;
  startDate: string;
  endDate: string;
}

// 34. GRADE LEVEL SETUP
export interface GradeLevel {
  id: string;
  name: string;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface GradeLevelFormData {
  name: string;
  order: number;
}

// 35. CLASSROOM SETUP
export interface ClassroomSetup {
  id: string;
  name: string;
  gradeLevelId: string;
  gradeLevel?: GradeLevel;
  capacity: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClassroomSetupFormData {
  name: string;
  gradeLevelId: string;
  capacity: number;
}

// 36. SUBJECT SETUP
export interface SubjectSetup {
  id: string;
  name: string;
  code: string;
  gradeLevelId: string;
  gradeLevel?: GradeLevel;
  isCore: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface SubjectSetupFormData {
  name: string;
  code: string;
  gradeLevelId: string;
  isCore: boolean;
}

// 37. PERIOD SETUP
export interface Period {
  id: string;
  name: string;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  createdAt: string;
  updatedAt: string;
}

export interface PeriodFormData {
  name: string;
  startTime: string;
  endTime: string;
}

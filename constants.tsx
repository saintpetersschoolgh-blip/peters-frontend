import React from 'react';
import {
  LayoutDashboard,
  Users,
  UserSquare2,
  BookOpen,
  CreditCard,
  Settings,
  LogOut,
  TrendingUp,
  GraduationUp,
  GraduationCap,
  Calendar,
  MoreVertical,
  Search,
  Bell,
  CheckCircle2,
  AlertCircle,
  Clock,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  User,
  FileText,
  Book,
  PenTool,
  Trophy,
  BarChart3,
  ClipboardList,
  Star,
  FlaskConical,
  Calculator,
  Globe2,
  Languages,
  LayoutGrid,
  List,
  UserCheck,
  Briefcase,
  Users2,
  TrendingDown,
  Award,
  Plus,
  Upload,
  Sun,
  Moon
} from 'lucide-react';
import { Student, Teacher, PaymentStatus, Exam, AttendanceRecord, FeeRecord } from './types';

export const ICONS = {
  // Main navigation
  Home: (props?: any) => <LayoutDashboard size={18} {...props} />,
  Dashboard: (props?: any) => <LayoutDashboard size={18} {...props} />,
  Shield: (props?: any) => <Award size={18} {...props} />,

  // User management
  Students: (props?: any) => <Users size={18} {...props} />,
  Teachers: (props?: any) => <UserSquare2 size={18} {...props} />,
  User: (props?: any) => <User size={18} {...props} />,
  Users: (props?: any) => <Users2 size={18} {...props} />,

  // Academic
  Academics: (props?: any) => <BookOpen size={18} {...props} />,
  Book: (props?: any) => <Book size={18} {...props} />,
  BookOpen: (props?: any) => <BookOpen size={18} {...props} />,
  Trophy: (props?: any) => <Trophy size={18} {...props} />,
  PenTool: (props?: any) => <PenTool size={14} {...props} />,

  // Finance
  Finance: (props?: any) => <CreditCard size={18} {...props} />,
  CreditCard: (props?: any) => <CreditCard size={18} {...props} />,

  // System
  Settings: (props?: any) => <Settings size={18} {...props} />,
  Logout: (props?: any) => <LogOut size={18} {...props} />,
  Bell: (props?: any) => <Bell size={18} {...props} />,
  AlertTriangle: (props?: any) => <AlertCircle size={18} {...props} />,
  Add: (props?: any) => <Plus size={18} {...props} />,
  Import: (props?: any) => <Upload size={18} {...props} />,
  Sun: (props?: any) => <Sun size={18} {...props} />,
  Moon: (props?: any) => <Moon size={18} {...props} />,

  // Analytics
  Trending: (props?: any) => <TrendingUp size={18} {...props} />,
  TrendingDown: (props?: any) => <TrendingDown size={18} {...props} />,
  Cap: (props?: any) => <GraduationCap size={18} {...props} />,
  Calendar: (props?: any) => <Calendar size={18} {...props} />,
  BarChart: (props?: any) => <BarChart3 size={18} {...props} />,

  // UI elements
  More: (props?: any) => <MoreVertical size={18} {...props} />,
  Search: (props?: any) => <Search size={18} {...props} />,
  Check: (props?: any) => <CheckCircle2 size={14} {...props} />,
  Alert: (props?: any) => <AlertCircle size={18} {...props} />,
  Clock: (props?: any) => <Clock size={14} {...props} />,
  Menu: (props?: any) => <Menu size={24} {...props} />,
  Close: (props?: any) => <X size={24} {...props} />,
  ChevronDown: (props?: any) => <ChevronDown size={14} {...props} />,
  ChevronRight: (props?: any) => <ChevronRight size={14} {...props} />,

  // Subjects
  FileText: (props?: any) => <FileText size={18} {...props} />,
  Clipboard: (props?: any) => <ClipboardList size={18} {...props} />,
  Star: (props?: any) => <Star size={14} {...props} />,
  Math: (props?: any) => <Calculator size={18} {...props} />,
  Science: (props?: any) => <FlaskConical size={18} {...props} />,
  English: (props?: any) => <Languages size={18} {...props} />,
  Geography: (props?: any) => <Globe2 size={18} {...props} />,

  // Layout
  Grid: (props?: any) => <LayoutGrid size={14} {...props} />,
  List: (props?: any) => <List size={14} {...props} />,
  LayoutGrid: (props?: any) => <LayoutGrid size={18} {...props} />,

  // Attendance & Status
  UserCheck: (props?: any) => <UserCheck size={18} {...props} />,
  Briefcase: (props?: any) => <Briefcase size={18} {...props} />,
  Gender: (props?: any) => <Users2 size={18} {...props} />,
  Award: (props?: any) => <Award size={18} {...props} />
};

// All data arrays emptied as requested
export const MOCK_STUDENTS: Student[] = [];
export const MOCK_TEACHERS: Teacher[] = [];
export const UPCOMING_EXAMS: Exam[] = [];
export const RECENT_FEES: FeeRecord[] = [];
export const TOP_STUDENTS: Student[] = [];
export const TOP_TEACHERS: Teacher[] = [];
export const RECENT_LESSON_PLANS: any[] = [];
export const DAILY_ATTENDANCE_DATA: any[] = [];
export const TEACHER_WEEKLY_ATTENDANCE: any[] = [];
export const GENDER_DATA: any[] = [];
export const ATTENDANCE_WEEKLY_TREND: any[] = [];
export const ACADEMIC_PERFORMANCE_TREND: any[] = [];
export const PIE_GENDER_DATA: any[] = [];

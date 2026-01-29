'use client';
import TeacherTimetable from '../../../components/TeacherTimetable';
import { MOCK_TEACHERS } from '../../../constants';

export default function TeacherTimetablePage() {
  return <TeacherTimetable teachers={MOCK_TEACHERS} />;
}
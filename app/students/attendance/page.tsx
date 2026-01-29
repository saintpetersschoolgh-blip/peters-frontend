'use client';
import StudentAttendance from '../../../components/StudentAttendance';
import { MOCK_STUDENTS } from '../../../constants';

export default function StudentAttendancePage() {
  // Pass existing mock students so the lookup feature works immediately
  return <StudentAttendance students={MOCK_STUDENTS} />;
}

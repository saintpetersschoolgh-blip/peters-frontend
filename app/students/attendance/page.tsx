'use client';
import StudentAttendanceView from '../../../components/StudentAttendance';
import { MOCK_STUDENTS } from '../../../constants';

export default function StudentAttendancePage() {
  // Pass existing mock students so the lookup feature works immediately
  return <StudentAttendanceView students={MOCK_STUDENTS} />;
}

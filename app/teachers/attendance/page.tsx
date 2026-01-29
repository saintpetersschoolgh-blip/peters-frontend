'use client';
import TeacherAttendance from '../../../components/TeacherAttendance';
import { MOCK_TEACHERS } from '../../../constants';

export default function TeacherAttendancePage() {
  return <TeacherAttendance teachers={MOCK_TEACHERS} />;
}
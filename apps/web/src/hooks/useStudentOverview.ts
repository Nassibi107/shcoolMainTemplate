'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { useStudentProfile } from './useStudentProfile';

export interface StudentGrade {
  id: string;
  score: number;
  maxScore: number;
  term: string;
  subject: { name: string };
}

export interface StudentCertificate {
  id: string;
  type: string;
  issuedAt: string;
}

export function useStudentOverview() {
  const { student, loading: profileLoading } = useStudentProfile();
  const [grades, setGrades] = useState<StudentGrade[]>([]);
  const [certificates, setCertificates] = useState<StudentCertificate[]>([]);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user || !student) return;

    setLoading(true);
    Promise.all([
      api.get(`/schools/${user.school.id}/grades/student/${student.id}`),
      api.get(`/schools/${user.school.id}/certificates/student/${student.id}`),
      api.get(`/schools/${user.school.id}/students/${student.id}/attendance-summary`),
    ])
      .then(([gradesRes, certsRes, attendanceRes]) => {
        setGrades(gradesRes.data ?? []);
        setCertificates(certsRes.data ?? []);
        setAttendanceRate(Number(attendanceRes.data?.attendanceRate ?? 0));
      })
      .catch(() => {
        setGrades([]);
        setCertificates([]);
        setAttendanceRate(0);
      })
      .finally(() => setLoading(false));
  }, [student]);

  return {
    student,
    grades,
    certificates,
    attendanceRate,
    loading: profileLoading || loading,
  };
}

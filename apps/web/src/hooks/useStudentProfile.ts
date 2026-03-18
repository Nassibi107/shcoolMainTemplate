'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

export interface StudentProfile {
  id: string;
  studentCode: string;
  user: { firstName: string; lastName: string; email: string };
  classEnrollments: Array<{ class: { id: string; name: string; code: string } }>;
}

export function useStudentProfile() {
  const [student, setStudent] = useState<StudentProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'STUDENT') return;

    setLoading(true);
    api
      .get(`/schools/${user.school.id}/students/me`)
      .then((res) => setStudent(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load profile'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { student, loading, error, refetch: fetch };
}

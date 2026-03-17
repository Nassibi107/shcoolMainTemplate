'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';
import { buildQueryString } from '@/lib/utils';

export interface Student {
  id: string;
  studentCode: string;
  dateOfBirth?: string;
  gender?: string;
  address?: string;
  isActive: boolean;
  enrollmentDate: string;
  parentId?: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
    avatarUrl?: string;
    isActive: boolean;
  };
  classEnrollments: Array<{
    class: { id: string; name: string; code: string };
  }>;
  payments?: Array<{ status: string; amount: number }>;
}

export interface StudentFilters {
  search?: string;
  classId?: string;
  isActive?: string;
  paymentStatus?: string;
  page?: number;
  limit?: number;
}

interface PaginatedResult {
  data: Student[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export function useStudents(filters: StudentFilters = {}) {
  const [result, setResult] = useState<PaginatedResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const user = getStoredUser();
    if (!user) return;

    setLoading(true);
    api
      .get(`/schools/${user.school.id}/students${buildQueryString(filters as Record<string, string>)}`)
      .then((res) => setResult(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load students'))
      .finally(() => setLoading(false));
  }, [JSON.stringify(filters)]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { ...result, loading, error, refetch: fetch };
}

export async function createStudent(schoolId: string, data: Record<string, unknown>) {
  const res = await api.post(`/schools/${schoolId}/students`, data);
  return res.data;
}

export async function updateStudent(schoolId: string, id: string, data: Record<string, unknown>) {
  const res = await api.patch(`/schools/${schoolId}/students/${id}`, data);
  return res.data;
}

export async function deleteStudent(schoolId: string, id: string) {
  await api.delete(`/schools/${schoolId}/students/${id}`);
}

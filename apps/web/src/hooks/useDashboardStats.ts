'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

interface DashboardStats {
  totalStudents: number;
  activeTeachers: number;
  parentCount?: number;
  absencesToday: number;
  monthlyRevenue: number;
}

export function useDashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    api
      .get(`/schools/${user.school.id}/reports/dashboard-stats`)
      .then((res) => setStats(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load dashboard stats'))
      .finally(() => setLoading(false));
  }, []);

  return { stats, loading, error };
}

export function useMonthlyRevenue() {
  const [data, setData] = useState<Array<{ month: string; revenue: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    api
      .get(`/schools/${user.school.id}/payments/monthly-revenue`)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useGradeDistribution() {
  const [data, setData] = useState<{ A: number; B: number; C: number; D: number; F: number } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    api
      .get(`/schools/${user.school.id}/reports/grade-distribution`)
      .then((res) => setData(res.data))
      .catch(() => setData({ A: 0, B: 0, C: 0, D: 0, F: 0 }))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

export function useAttendanceByClass() {
  const [data, setData] = useState<Array<{ className: string; rate: number }>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    api
      .get(`/schools/${user.school.id}/reports/attendance-by-class`)
      .then((res) => setData(res.data))
      .catch(() => setData([]))
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

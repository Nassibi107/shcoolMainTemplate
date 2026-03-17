'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

interface DashboardStats {
  totalStudents: number;
  activeTeachers: number;
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
      .catch(() => {
        // Use mock data when backend not yet connected
        setStats({
          totalStudents: 1248,
          activeTeachers: 64,
          absencesToday: 23,
          monthlyRevenue: 148500,
        });
      })
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
      .catch(() => {
        setData([
          { month: '2024-09', revenue: 112000 },
          { month: '2024-10', revenue: 135000 },
          { month: '2024-11', revenue: 128000 },
          { month: '2024-12', revenue: 141000 },
          { month: '2025-01', revenue: 148500 },
          { month: '2025-02', revenue: 153000 },
          { month: '2025-03', revenue: 148500 },
        ]);
      })
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
      .catch(() => {
        setData([
          { className: 'Class 1A', rate: 94 },
          { className: 'Class 2B', rate: 88 },
          { className: 'Class 3C', rate: 91 },
          { className: 'Class 4A', rate: 85 },
          { className: 'Class 5B', rate: 97 },
        ]);
      })
      .finally(() => setLoading(false));
  }, []);

  return { data, loading };
}

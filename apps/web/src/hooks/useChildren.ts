'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

export interface Child {
  id: string;
  studentCode: string;
  user: { firstName: string; lastName: string; email: string };
  classEnrollments: Array<{ class: { id: string; name: string; code: string } }>;
}

export function useChildren() {
  const [children, setChildren] = useState<Child[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const user = getStoredUser();
    if (!user || user.role !== 'PARENT') return;

    setLoading(true);
    api
      .get(`/schools/${user.school.id}/students/my-children`)
      .then((res) => setChildren(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load children'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { children, loading, error, refetch: fetch };
}

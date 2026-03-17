'use client';

import { useState, useEffect } from 'react';
import { AuthUser, getStoredUser, isAuthenticated } from '@/lib/auth';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isAuthenticated()) {
      const storedUser = getStoredUser();
      setUser(storedUser);
    }
    setLoading(false);
  }, []);

  return { user, loading, isAuthenticated: !!user };
}

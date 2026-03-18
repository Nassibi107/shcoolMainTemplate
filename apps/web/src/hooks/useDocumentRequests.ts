'use client';

import { useState, useEffect, useCallback } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

export type DocumentRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DocumentRequest {
  id: string;
  studentId: string;
  documentType: string;
  note?: string | null;
  status: DocumentRequestStatus;
  approverNote?: string | null;
  certificateId?: string | null;
  approvedAt?: string | null;
  rejectedAt?: string | null;
  createdAt: string;
  student?: {
    user: { firstName: string; lastName: string };
    classEnrollments?: Array<{ class: { name: string } }>;
  };
  certificate?: { id: string };
}

export function useDocumentRequests() {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const user = getStoredUser();
    if (!user) return;

    setLoading(true);
    api
      .get(`/schools/${user.school.id}/document-requests/my`)
      .then((res) => setRequests(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load document requests'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { requests, loading, error, refetch: fetch };
}

export function useDocumentRequestsAdmin(status?: DocumentRequestStatus) {
  const [requests, setRequests] = useState<DocumentRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(() => {
    const user = getStoredUser();
    if (!user) return;

    setLoading(true);
    const params = status ? `?status=${status}` : '';
    api
      .get(`/schools/${user.school.id}/document-requests${params}`)
      .then((res) => setRequests(res.data))
      .catch((err) => setError(err.response?.data?.message ?? 'Failed to load document requests'))
      .finally(() => setLoading(false));
  }, [status]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { requests, loading, error, refetch: fetch };
}

const PENDING_COUNT_POLL_MS = 30000;

export function useDocumentRequestPendingCount() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const user = getStoredUser();
    if (!user) return;

    const fetch = () => {
      api
        .get(`/schools/${user.school.id}/document-requests/pending-count`)
        .then((res) => setCount(res.data))
        .catch(() => setCount(0));
    };

    fetch();
    const interval = setInterval(fetch, PENDING_COUNT_POLL_MS);
    return () => clearInterval(interval);
  }, []);

  return count;
}

export async function createDocumentRequest(
  schoolId: string,
  data: { studentId: string; documentType: string; note?: string },
) {
  const res = await api.post(`/schools/${schoolId}/document-requests`, data);
  return res.data;
}

export async function approveDocumentRequest(schoolId: string, id: string, note?: string) {
  const res = await api.patch(`/schools/${schoolId}/document-requests/${id}/approve`, { note });
  return res.data;
}

export async function rejectDocumentRequest(schoolId: string, id: string, note?: string) {
  const res = await api.patch(`/schools/${schoolId}/document-requests/${id}/reject`, { note });
  return res.data;
}

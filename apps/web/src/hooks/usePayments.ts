'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import api from '@/lib/api';
import { getStoredUser } from '@/lib/auth';

export type PaymentStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface PaymentRecord {
  id: string;
  amount: number;
  status: PaymentStatus;
  dueDate: string;
  paidAt?: string | null;
  reference?: string | null;
  student: { user: { firstName: string; lastName: string } };
  feeType: { id: string; name: string; category: string };
}

export interface FeeTypeOption {
  id: string;
  name: string;
  category: string;
  amount: number | string;
}

export interface PaymentSummary {
  totalCollected: number;
  pending: number;
  overdue: number;
}

export function usePayments() {
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [feeTypes, setFeeTypes] = useState<FeeTypeOption[]>([]);
  const [summary, setSummary] = useState<PaymentSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    const user = getStoredUser();
    if (!user) return;

    setLoading(true);
    setError(null);
    try {
      const [paymentsRes, summaryRes, feeTypesRes] = await Promise.all([
        api.get(`/schools/${user.school.id}/payments`),
        api.get(`/schools/${user.school.id}/payments/summary`),
        api.get(`/schools/${user.school.id}/payments/fee-types`),
      ]);
      setPayments(paymentsRes.data ?? []);
      setSummary(summaryRes.data ?? null);
      setFeeTypes(feeTypesRes.data ?? []);
    } catch (err: any) {
      setPayments([]);
      setSummary(null);
      setFeeTypes([]);
      setError(err?.response?.data?.message ?? 'Failed to load payments');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetch();
  }, [fetch]);

  const stats = useMemo(() => {
    const total = payments.length;
    const paid = payments.filter((p) => p.status === 'PAID').length;
    const overdueCount = payments.filter((p) => p.status === 'OVERDUE').length;
    const collectionRate = total > 0 ? Math.round((paid / total) * 100) : 0;
    return { total, paid, overdueCount, collectionRate };
  }, [payments]);

  return { payments, feeTypes, summary, stats, loading, error, refetch: fetch };
}

export async function createPayment(data: {
  schoolId: string;
  studentId: string;
  feeTypeId: string;
  amount: number;
  dueDate: string;
  note?: string;
}) {
  const res = await api.post(`/schools/${data.schoolId}/payments`, {
    studentId: data.studentId,
    feeTypeId: data.feeTypeId,
    amount: data.amount,
    dueDate: data.dueDate,
    note: data.note,
  });
  return res.data;
}

export async function markPaymentAsPaid(data: {
  schoolId: string;
  paymentId: string;
  reference?: string;
}) {
  const res = await api.patch(`/schools/${data.schoolId}/payments/${data.paymentId}/status`, {
    status: 'PAID',
    reference: data.reference,
  });
  return res.data;
}

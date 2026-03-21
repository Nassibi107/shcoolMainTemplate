'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';

type ManagedLeave = {
  id: string;
  teacherName: string;
  teacherEmail?: string;
  startDate: string;
  endDate: string;
  reason: string;
  status: LeaveStatus;
  note?: string;
  createdAt: string;
};

const STATUS_VARIANT: Record<LeaveStatus, 'warning' | 'success' | 'danger' | 'secondary'> = {
  PENDING: 'warning',
  APPROVED: 'success',
  REJECTED: 'danger',
  CANCELLED: 'secondary',
};

export default function AdminLeavesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [statusFilter, setStatusFilter] = useState<LeaveStatus | ''>('');
  const [leaves, setLeaves] = useState<ManagedLeave[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewing, setReviewing] = useState<ManagedLeave | null>(null);
  const [reviewAction, setReviewAction] = useState<'approve' | 'reject'>('approve');
  const [reviewNote, setReviewNote] = useState('');
  const [saving, setSaving] = useState(false);

  async function loadData() {
    if (!user) return;
    setLoading(true);
    const query = statusFilter ? `?status=${statusFilter}` : '';
    try {
      const res = await api.get(`/schools/${user.school.id}/leaves${query}`);
      setLeaves((res.data ?? []).map((r: any) => ({
        id: r.id,
        teacherName: `${r.teacher?.user?.firstName ?? ''} ${r.teacher?.user?.lastName ?? ''}`.trim(),
        teacherEmail: r.teacher?.user?.email ?? '',
        startDate: r.startDate,
        endDate: r.endDate,
        reason: r.reason,
        status: r.status,
        note: r.note ?? undefined,
        createdAt: r.createdAt,
      })));
    } catch {
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadData();
  }, [user, statusFilter]);

  const columns: Column<ManagedLeave>[] = useMemo(() => [
    {
      key: 'teacherName',
      header: 'Teacher',
      render: (r) => (
        <div>
          <p className="font-medium">{r.teacherName || 'Unknown'}</p>
          <p className="text-xs text-muted">{r.teacherEmail || '—'}</p>
        </div>
      ),
    },
    { key: 'startDate', header: 'Start', render: (r) => <span>{formatDate(r.startDate)}</span> },
    { key: 'endDate', header: 'End', render: (r) => <span>{formatDate(r.endDate)}</span> },
    { key: 'reason', header: 'Reason', render: (r) => <span className="text-sm">{r.reason}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge> },
    {
      key: 'actions',
      header: 'Actions',
      render: (r) => (
        <div className="flex gap-2">
          <Button size="sm" variant="ghost" disabled={r.status !== 'PENDING'} onClick={() => openReview(r, 'approve')}>Approve</Button>
          <Button size="sm" variant="ghost" disabled={r.status !== 'PENDING'} onClick={() => openReview(r, 'reject')}>Reject</Button>
        </div>
      ),
    },
  ], []);

  function openReview(row: ManagedLeave, action: 'approve' | 'reject') {
    setReviewing(row);
    setReviewAction(action);
    setReviewNote('');
  }

  async function submitReview() {
    if (!reviewing || !user) return;
    setSaving(true);
    try {
      await api.patch(
        `/schools/${user.school.id}/leaves/${reviewing.id}/${reviewAction}`,
        { note: reviewNote || undefined },
      );
      setReviewing(null);
      await loadData();
      toast.success(`Leave request ${reviewAction}d`);
    } catch (e: any) {
      toast.error(e?.response?.data?.message ?? 'Failed to review request');
    } finally {
      setSaving(false);
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Leave Requests">
      <div className="flex justify-between items-center mb-4">
        <select
          className="input-field w-48"
          value={statusFilter}
          onChange={(e) => setStatusFilter((e.target.value || '') as LeaveStatus | '')}
        >
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="APPROVED">Approved</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <DataTable
        columns={columns}
        data={leaves}
        keyExtractor={(r) => r.id}
        emptyMessage={loading ? 'Loading leave requests…' : 'No leave requests found.'}
      />

      <Modal
        isOpen={Boolean(reviewing)}
        onClose={() => setReviewing(null)}
        title={reviewAction === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
        size="md"
      >
        <div className="space-y-4">
          <textarea
            className="input-field w-full resize-none"
            rows={3}
            value={reviewNote}
            onChange={(e) => setReviewNote(e.target.value)}
            placeholder="Optional note"
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setReviewing(null)}>Cancel</Button>
            <Button onClick={submitReview} disabled={saving}>{saving ? 'Saving…' : 'Confirm'}</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

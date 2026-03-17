'use client';

import { useState } from 'react';
import { Plus, CalendarDays } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

type LeaveStatus = 'PENDING' | 'APPROVED' | 'REJECTED';
type LeaveType = 'SICK' | 'PERSONAL' | 'EMERGENCY' | 'VACATION' | 'OTHER';

interface LeaveRequest {
  id: string;
  type: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  submittedAt: string;
  reviewNote?: string;
}

const MOCK_LEAVES: LeaveRequest[] = [
  { id: '1', type: 'SICK', startDate: '2024-03-10', endDate: '2024-03-11', days: 2, reason: 'Medical appointment and recovery', status: 'APPROVED', submittedAt: '2024-03-09', reviewNote: 'Approved. Please submit medical certificate.' },
  { id: '2', type: 'PERSONAL', startDate: '2024-03-22', endDate: '2024-03-22', days: 1, reason: 'Family event', status: 'PENDING', submittedAt: '2024-03-15' },
  { id: '3', type: 'VACATION', startDate: '2024-04-15', endDate: '2024-04-19', days: 5, reason: 'Annual leave', status: 'PENDING', submittedAt: '2024-03-01' },
  { id: '4', type: 'EMERGENCY', startDate: '2024-02-05', endDate: '2024-02-06', days: 2, reason: 'Family emergency', status: 'APPROVED', submittedAt: '2024-02-05' },
  { id: '5', type: 'SICK', startDate: '2024-01-20', endDate: '2024-01-20', days: 1, reason: 'Flu symptoms', status: 'REJECTED', submittedAt: '2024-01-19', reviewNote: 'Short notice. Please plan ahead.' },
];

const STATUS_CONFIG: Record<LeaveStatus, { variant: 'success' | 'warning' | 'danger'; label: string }> = {
  APPROVED: { variant: 'success', label: 'Approved' },
  PENDING: { variant: 'warning', label: 'Pending' },
  REJECTED: { variant: 'danger', label: 'Rejected' },
};

const TYPE_LABELS: Record<LeaveType, string> = {
  SICK: 'Sick Leave', PERSONAL: 'Personal', EMERGENCY: 'Emergency', VACATION: 'Vacation', OTHER: 'Other',
};

export default function TeacherLeavePage() {
  const { user, loading } = useAuth();
  const [leaves, setLeaves] = useState<LeaveRequest[]>(MOCK_LEAVES);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ type: 'PERSONAL' as LeaveType, startDate: '', endDate: '', reason: '' });

  function handleSubmit() {
    if (!form.startDate || !form.endDate || !form.reason) return;
    const start = new Date(form.startDate);
    const end = new Date(form.endDate);
    const days = Math.max(1, Math.round((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    setLeaves((prev) => [{
      id: String(Date.now()),
      type: form.type,
      startDate: form.startDate,
      endDate: form.endDate,
      days,
      reason: form.reason,
      status: 'PENDING',
      submittedAt: new Date().toISOString().slice(0, 10),
    }, ...prev]);
    setIsCreateOpen(false);
    setForm({ type: 'PERSONAL', startDate: '', endDate: '', reason: '' });
  }

  const columns: Column<LeaveRequest>[] = [
    { key: 'type', header: 'Type', render: (r) => <span className="text-sm font-medium">{TYPE_LABELS[r.type]}</span> },
    { key: 'startDate', header: 'Start Date', sortable: true, render: (r) => <span className="text-sm text-muted">{formatDate(r.startDate)}</span> },
    { key: 'endDate', header: 'End Date', render: (r) => <span className="text-sm text-muted">{formatDate(r.endDate)}</span> },
    { key: 'days', header: 'Days', render: (r) => <span className="font-mono font-semibold">{r.days}</span> },
    { key: 'reason', header: 'Reason', render: (r) => <span className="text-sm text-muted truncate max-w-xs block">{r.reason}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_CONFIG[r.status].variant}>{STATUS_CONFIG[r.status].label}</Badge> },
    { key: 'submittedAt', header: 'Submitted', render: (r) => <span className="text-xs text-muted">{formatDate(r.submittedAt)}</span> },
  ];

  const usedDays = leaves.filter((l) => l.status === 'APPROVED').reduce((s, l) => s + l.days, 0);
  const pendingDays = leaves.filter((l) => l.status === 'PENDING').reduce((s, l) => s + l.days, 0);
  const totalAllowance = 20;

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Leave Requests">
      {/* Balance cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Allowance', value: `${totalAllowance} days`, color: 'text-primary' },
          { label: 'Used', value: `${usedDays} days`, color: 'text-danger' },
          { label: 'Pending', value: `${pendingDays} days`, color: 'text-warning' },
          { label: 'Remaining', value: `${totalAllowance - usedDays - pendingDays} days`, color: 'text-success' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Balance bar */}
      <div className="bg-card rounded-card shadow-card p-4 mb-6">
        <div className="flex items-center justify-between text-sm mb-2">
          <span className="text-muted">Leave Balance</span>
          <span className="font-medium">{usedDays}/{totalAllowance} days used</span>
        </div>
        <div className="w-full h-2.5 bg-border rounded-full overflow-hidden">
          <div className="h-full rounded-full bg-accent" style={{ width: `${Math.min(100, (usedDays / totalAllowance) * 100)}%` }} />
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-primary">My Leave History</h3>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
          Submit Request
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={leaves}
        keyExtractor={(r) => r.id}
        emptyMessage="No leave requests submitted."
        emptyAction={<Button size="sm" onClick={() => setIsCreateOpen(true)}>Submit First Request</Button>}
      />

      {/* Review notes */}
      {leaves.some((l) => l.reviewNote) && (
        <Card className="mt-6">
          <CardHeader><CardTitle>Review Notes</CardTitle></CardHeader>
          <div className="space-y-3">
            {leaves.filter((l) => l.reviewNote).map((l) => (
              <div key={l.id} className={`p-3 rounded-lg border ${l.status === 'APPROVED' ? 'bg-success/5 border-success/20' : 'bg-danger/5 border-danger/20'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant={STATUS_CONFIG[l.status].variant}>{STATUS_CONFIG[l.status].label}</Badge>
                  <span className="text-xs text-muted">{TYPE_LABELS[l.type]} · {formatDate(l.startDate)}</span>
                </div>
                <p className="text-sm">{l.reviewNote}</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Submit Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Submit Leave Request" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Leave Type</label>
            <select className="input-field w-full" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value as LeaveType }))}>
              {Object.entries(TYPE_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1">Start Date</label>
              <input type="date" className="input-field w-full" value={form.startDate} onChange={(e) => setForm((p) => ({ ...p, startDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1">End Date</label>
              <input type="date" className="input-field w-full" value={form.endDate} min={form.startDate} onChange={(e) => setForm((p) => ({ ...p, endDate: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Reason</label>
            <textarea className="input-field w-full resize-none" rows={3} value={form.reason} onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))} placeholder="Please describe your reason…" />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={!form.startDate || !form.endDate || !form.reason}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { Download, Search, CreditCard, TrendingUp, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { usePayments, createPayment, markPaymentAsPaid } from '@/hooks/usePayments';
import { useStudents } from '@/hooks/useStudents';
import { formatCurrency, formatDate } from '@/lib/utils';
import api from '@/lib/api';

interface Payment {
  id: string;
  student: string;
  feeType: string;
  amount: number;
  paid: number;
  dueDate: string;
  paidDate?: string;
  status: 'PAID' | 'PENDING' | 'OVERDUE' | 'CANCELLED';
  method?: string;
  reference?: string;
  studentId: string;
  feeTypeId: string;
}

const STATUS_VARIANTS: Record<Payment['status'], 'success' | 'warning' | 'danger' | 'secondary'> = {
  PAID: 'success', PENDING: 'warning', OVERDUE: 'danger', CANCELLED: 'secondary',
};

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState({
    studentId: '',
    feeTypeId: '',
    amount: '',
    dueDate: '',
    note: '',
  });

  const { payments, feeTypes, summary, stats, loading, refetch } = usePayments();
  const { data: students } = useStudents({ page: 1, limit: 100 });

  const data: Payment[] = payments.map((p) => ({
    id: p.id,
    student: `${p.student.user.firstName} ${p.student.user.lastName}`,
    feeType: p.feeType.name,
    amount: Number(p.amount),
    paid: p.status === 'PAID' ? Number(p.amount) : 0,
    dueDate: p.dueDate,
    paidDate: p.paidAt ?? undefined,
    status: p.status,
    method: p.reference ?? undefined,
    reference: p.reference ?? undefined,
    studentId: '',
    feeTypeId: p.feeType.id,
  }));

  const filtered = data.filter((p) => {
    const matchSearch = !search || p.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchFee = !feeTypeFilter || p.feeType === feeTypeFilter;
    return matchSearch && matchStatus && matchFee;
  });

  const totalCollected = summary?.totalCollected ?? 0;
  const totalPending = summary?.pending ?? 0;
  const overdueCount = stats.overdueCount;
  const collectionRate = stats.collectionRate;

  const paymentColumns: Column<Payment>[] = [
    { key: 'student', header: 'Student', sortable: true, render: (r) => <span className="font-medium">{r.student}</span> },
    { key: 'feeType', header: 'Fee Type', render: (r) => <span className="text-sm">{r.feeType}</span> },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-mono font-semibold">{formatCurrency(r.amount)}</p>
          {r.status === 'PAID' && <p className="text-xs text-success">Paid: {formatCurrency(r.paid)}</p>}
        </div>
      ),
    },
    { key: 'dueDate', header: 'Due Date', sortable: true, render: (r) => <span className="text-sm text-muted">{formatDate(r.dueDate)}</span> },
    { key: 'paidDate', header: 'Paid Date', render: (r) => <span className="text-sm text-muted">{r.paidDate ? formatDate(r.paidDate) : '—'}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANTS[r.status]}>{r.status}</Badge> },
    { key: 'method', header: 'Method', render: (r) => <span className="text-sm text-muted">{r.method ?? '—'}</span> },
    {
      key: 'actions',
      header: '',
      render: (r) => r.status !== 'PAID' ? (
        <Button size="sm" variant="ghost" onClick={() => handleMarkPaid(r.id)}>Mark Paid</Button>
      ) : null,
      className: 'text-right',
    },
  ];

  async function handleMarkPaid(id: string) {
    if (!user) return;
    try {
      await markPaymentAsPaid({ schoolId: user.school.id, paymentId: id });
      toast.success('Payment marked as paid');
      refetch();
    } catch {
      toast.error('Failed to update payment');
    }
  }

  async function handleCreatePayment() {
    if (!user) return;
    if (!form.studentId || !form.feeTypeId || !form.amount || !form.dueDate) {
      toast.error('Please fill all required fields');
      return;
    }
    setIsSubmitting(true);
    try {
      await createPayment({
        schoolId: user.school.id,
        studentId: form.studentId,
        feeTypeId: form.feeTypeId,
        amount: Number(form.amount),
        dueDate: form.dueDate,
        note: form.note || undefined,
      });
      toast.success('Payment added successfully');
      setIsCreateOpen(false);
      setForm({ studentId: '', feeTypeId: '', amount: '', dueDate: '', note: '' });
      refetch();
    } catch {
      toast.error('Failed to add payment');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleExport() {
    if (!user) return;
    try {
      const res = await api.get(`/schools/${user.school.id}/payments/export/excel`, {
        responseType: 'blob',
      });
      const url = URL.createObjectURL(
        new Blob([res.data], {
          type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        }),
      );
      const a = document.createElement('a');
      a.href = url;
      a.download = `payments-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Export started');
    } catch {
      toast.error('Export failed');
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Payments">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Collected', value: formatCurrency(totalCollected), icon: CheckCircle, color: 'text-success' },
          { label: 'Pending Amount', value: formatCurrency(totalPending), icon: AlertCircle, color: 'text-warning' },
          { label: 'Overdue', value: `${overdueCount} students`, icon: CreditCard, color: 'text-danger' },
          { label: 'Collection Rate', value: `${collectionRate}%`, icon: TrendingUp, color: 'text-accent' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted">{s.label}</p>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className={`text-xl font-bold font-heading ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-52" />
          </div>
          <Select options={[{ value: '', label: 'All Status' }, { value: 'PAID', label: 'Paid' }, { value: 'PENDING', label: 'Pending' }, { value: 'OVERDUE', label: 'Overdue' }, { value: 'CANCELLED', label: 'Cancelled' }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" />
          <Select options={[{ value: '', label: 'All Fee Types' }, ...feeTypes.map((f) => ({ value: f.name, label: f.name }))]} value={feeTypeFilter} onChange={(e) => setFeeTypeFilter(e.target.value)} className="w-44" />
        </div>
        <div className="flex items-center gap-2">
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Add Payment
          </Button>
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export Excel
          </Button>
        </div>
      </div>

      <DataTable
        columns={paymentColumns}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage={loading ? 'Loading payment records…' : 'No payment records found.'}
      />

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add Manual Payment" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Student</label>
            <select
              className="input-field w-full"
              value={form.studentId}
              onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
            >
              <option value="">Select student</option>
              {(students ?? []).map((s) => (
                <option key={s.id} value={s.id}>
                  {s.user.firstName} {s.user.lastName}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Fee Type</label>
            <select
              className="input-field w-full"
              value={form.feeTypeId}
              onChange={(e) => {
                const value = e.target.value;
                const feeType = feeTypes.find((f) => f.id === value);
                setForm((p) => ({
                  ...p,
                  feeTypeId: value,
                  amount: feeType ? String(Number(feeType.amount)) : p.amount,
                }));
              }}
            >
              <option value="">Select fee type</option>
              {feeTypes.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Amount</label>
            <input
              type="number"
              min="0"
              step="0.01"
              className="input-field w-full"
              value={form.amount}
              onChange={(e) => setForm((p) => ({ ...p, amount: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Due Date</label>
            <input
              type="date"
              className="input-field w-full"
              value={form.dueDate}
              onChange={(e) => setForm((p) => ({ ...p, dueDate: e.target.value }))}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <textarea
              rows={3}
              className="input-field w-full"
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreatePayment} disabled={isSubmitting}>
              {isSubmitting ? 'Saving…' : 'Save Payment'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

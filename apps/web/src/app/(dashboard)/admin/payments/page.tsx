'use client';

import { useState } from 'react';
import { Download, Search, CreditCard, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency, formatDate } from '@/lib/utils';

type PaymentStatus = 'PAID' | 'PENDING' | 'OVERDUE' | 'PARTIAL';

interface Payment {
  id: string;
  student: string;
  class: string;
  feeType: string;
  amount: number;
  paid: number;
  dueDate: string;
  paidDate?: string;
  status: PaymentStatus;
  method?: string;
}

interface TeacherSalary {
  id: string;
  teacher: string;
  amount: number;
  month: string;
  status: 'PAID' | 'PENDING';
  paidDate?: string;
}

const MOCK_PAYMENTS: Payment[] = [
  { id: '1', student: 'Ahmed Hassan', class: '3B', feeType: 'Tuition Fee', amount: 1200, paid: 1200, dueDate: '2024-03-01', paidDate: '2024-02-28', status: 'PAID', method: 'Bank Transfer' },
  { id: '2', student: 'Sara Ali', class: '3B', feeType: 'Tuition Fee', amount: 1200, paid: 600, dueDate: '2024-03-01', status: 'PARTIAL', method: 'Cash' },
  { id: '3', student: 'Mohamed Saad', class: '3A', feeType: 'Tuition Fee', amount: 1200, paid: 0, dueDate: '2024-02-01', status: 'OVERDUE' },
  { id: '4', student: 'Fatima Omar', class: '3A', feeType: 'Activity Fee', amount: 150, paid: 150, dueDate: '2024-03-15', paidDate: '2024-03-10', status: 'PAID', method: 'Online' },
  { id: '5', student: 'Youssef Malik', class: '2A', feeType: 'Tuition Fee', amount: 1100, paid: 0, dueDate: '2024-03-01', status: 'PENDING' },
  { id: '6', student: 'Nour Hassan', class: '2A', feeType: 'Bus Fee', amount: 300, paid: 300, dueDate: '2024-03-01', paidDate: '2024-02-25', status: 'PAID', method: 'Bank Transfer' },
  { id: '7', student: 'Karim Ali', class: '4A', feeType: 'Tuition Fee', amount: 1300, paid: 0, dueDate: '2024-02-15', status: 'OVERDUE' },
  { id: '8', student: 'Lena Riad', class: '4A', feeType: 'Lab Fee', amount: 200, paid: 200, dueDate: '2024-03-20', paidDate: '2024-03-18', status: 'PAID', method: 'Online' },
];

const MOCK_SALARIES: TeacherSalary[] = [
  { id: '1', teacher: 'James Johnson', amount: 4500, month: 'March 2024', status: 'PAID', paidDate: '2024-03-01' },
  { id: '2', teacher: 'Wei Chen', amount: 4200, month: 'March 2024', status: 'PENDING' },
  { id: '3', teacher: 'Sarah Miller', amount: 4300, month: 'March 2024', status: 'PAID', paidDate: '2024-03-01' },
  { id: '4', teacher: 'Omar Hassan', amount: 3900, month: 'March 2024', status: 'PENDING' },
  { id: '5', teacher: 'Priya Sharma', amount: 4100, month: 'March 2024', status: 'PAID', paidDate: '2024-03-02' },
];

const STATUS_VARIANTS: Record<PaymentStatus, 'success' | 'warning' | 'danger' | 'secondary'> = {
  PAID: 'success', PENDING: 'warning', OVERDUE: 'danger', PARTIAL: 'secondary',
};

export default function AdminPaymentsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'fees' | 'salaries'>('fees');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [feeTypeFilter, setFeeTypeFilter] = useState('');

  const filtered = MOCK_PAYMENTS.filter((p) => {
    const matchSearch = !search || p.student.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchFee = !feeTypeFilter || p.feeType === feeTypeFilter;
    return matchSearch && matchStatus && matchFee;
  });

  const totalCollected = filtered.filter((p) => p.status === 'PAID').reduce((s, p) => s + p.paid, 0);
  const totalPending = filtered.filter((p) => p.status !== 'PAID').reduce((s, p) => s + (p.amount - p.paid), 0);
  const overdueCount = filtered.filter((p) => p.status === 'OVERDUE').length;
  const collectionRate = filtered.length > 0 ? Math.round((filtered.filter((p) => p.status === 'PAID').length / filtered.length) * 100) : 0;

  const paymentColumns: Column<Payment>[] = [
    { key: 'student', header: 'Student', sortable: true, render: (r) => <span className="font-medium">{r.student}</span> },
    { key: 'class', header: 'Class', render: (r) => <Badge variant="secondary">{r.class}</Badge> },
    { key: 'feeType', header: 'Fee Type', render: (r) => <span className="text-sm">{r.feeType}</span> },
    {
      key: 'amount',
      header: 'Amount',
      sortable: true,
      render: (r) => (
        <div>
          <p className="font-mono font-semibold">{formatCurrency(r.amount)}</p>
          {r.status === 'PARTIAL' && <p className="text-xs text-warning">Paid: {formatCurrency(r.paid)}</p>}
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
        <Button size="sm" variant="ghost">Mark Paid</Button>
      ) : null,
      className: 'text-right',
    },
  ];

  const salaryColumns: Column<TeacherSalary>[] = [
    { key: 'teacher', header: 'Teacher', render: (r) => <span className="font-medium">{r.teacher}</span> },
    { key: 'month', header: 'Month', render: (r) => <span className="text-sm">{r.month}</span> },
    { key: 'amount', header: 'Amount', sortable: true, render: (r) => <span className="font-mono font-semibold">{formatCurrency(r.amount)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={r.status === 'PAID' ? 'success' : 'warning'}>{r.status}</Badge> },
    { key: 'paidDate', header: 'Paid Date', render: (r) => <span className="text-sm text-muted">{r.paidDate ? formatDate(r.paidDate) : '—'}</span> },
    {
      key: 'actions',
      header: '',
      render: (r) => r.status === 'PENDING' ? <Button size="sm">Pay Now</Button> : null,
      className: 'text-right',
    },
  ];

  function handleExport() {
    const data = activeTab === 'fees' ? filtered : MOCK_SALARIES;
    const csv = activeTab === 'fees'
      ? ['Student,Class,Fee Type,Amount,Paid,Due Date,Paid Date,Status', ...filtered.map((p) => `${p.student},${p.class},${p.feeType},${p.amount},${p.paid},${p.dueDate},${p.paidDate ?? ''},${p.status}`)].join('\n')
      : ['Teacher,Month,Amount,Status,Paid Date', ...MOCK_SALARIES.map((s) => `${s.teacher},${s.month},${s.amount},${s.status},${s.paidDate ?? ''}`)].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeTab}-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
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

      {/* Tabs */}
      <div className="flex border-b border-border mb-6">
        {(['fees', 'salaries'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
              activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-app-text'
            }`}
          >
            {tab === 'fees' ? 'Student Fees' : 'Teacher Salaries'}
          </button>
        ))}
      </div>

      {/* Toolbar */}
      {activeTab === 'fees' && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
              <input type="text" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-52" />
            </div>
            <Select options={[{ value: '', label: 'All Status' }, { value: 'PAID', label: 'Paid' }, { value: 'PENDING', label: 'Pending' }, { value: 'OVERDUE', label: 'Overdue' }, { value: 'PARTIAL', label: 'Partial' }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-36" />
            <Select options={[{ value: '', label: 'All Fee Types' }, { value: 'Tuition Fee', label: 'Tuition Fee' }, { value: 'Activity Fee', label: 'Activity Fee' }, { value: 'Bus Fee', label: 'Bus Fee' }, { value: 'Lab Fee', label: 'Lab Fee' }]} value={feeTypeFilter} onChange={(e) => setFeeTypeFilter(e.target.value)} className="w-40" />
          </div>
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>Export CSV</Button>
        </div>
      )}

      {activeTab === 'fees' && (
        <DataTable columns={paymentColumns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No payment records found." />
      )}

      {activeTab === 'salaries' && (
        <>
          <div className="flex justify-end mb-4">
            <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>Export CSV</Button>
          </div>
          <DataTable columns={salaryColumns} data={MOCK_SALARIES} keyExtractor={(r) => r.id} emptyMessage="No salary records." />
        </>
      )}
    </DashboardLayout>
  );
}

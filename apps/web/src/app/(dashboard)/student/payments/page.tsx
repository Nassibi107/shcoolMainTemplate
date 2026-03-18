'use client';

import { useEffect, useMemo, useState } from 'react';
import { Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import api from '@/lib/api';
import { formatCurrency, formatDate } from '@/lib/utils';

type StudentPayment = {
  id: string;
  amount: number;
  status: 'PENDING' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  paidAt?: string | null;
  feeType: { name: string };
  reference?: string | null;
};

const STATUS_VARIANT: Record<StudentPayment['status'], 'success' | 'warning' | 'danger' | 'secondary'> = {
  PAID: 'success',
  PENDING: 'warning',
  OVERDUE: 'danger',
  CANCELLED: 'secondary',
};

function getMonthOptions() {
  const now = new Date();
  const options: Array<{ value: string; label: string }> = [{ value: '', label: 'All months' }];
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    options.push({ value, label: d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }) });
  }
  return options;
}

export default function StudentPaymentsPage() {
  const { user, loading: authLoading } = useAuth();
  const [month, setMonth] = useState('');
  const [payments, setPayments] = useState<StudentPayment[]>([]);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<'pdf' | 'excel' | null>(null);

  const monthOptions = useMemo(() => getMonthOptions(), []);

  useEffect(() => {
    if (!user) return;
    setLoading(true);
    const query = month ? `?month=${month}` : '';
    api
      .get(`/schools/${user.school.id}/payments/my${query}`)
      .then((res) => setPayments(res.data ?? []))
      .catch(() => setPayments([]))
      .finally(() => setLoading(false));
  }, [user, month]);

  async function exportReport(format: 'pdf' | 'excel') {
    if (!user) return;
    setExporting(format);
    try {
      const query = month ? `?month=${month}` : '';
      const url = `/schools/${user.school.id}/payments/my/export/${format}${query}`;
      const res = await api.get(url, { responseType: 'blob' });
      const mime = format === 'pdf'
        ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const blob = new Blob([res.data], { type: mime });
      const href = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = href;
      a.download = `my-payments-${month || 'all'}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(href);
    } finally {
      setExporting(null);
    }
  }

  const total = payments.reduce((sum, p) => sum + Number(p.amount), 0);
  const paid = payments.filter((p) => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0);
  const pending = total - paid;

  const columns: Column<StudentPayment>[] = [
    { key: 'feeType', header: 'Fee Type', render: (r) => <span className="font-medium">{r.feeType.name}</span> },
    { key: 'amount', header: 'Amount', render: (r) => <span className="font-mono">{formatCurrency(Number(r.amount))}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_VARIANT[r.status]}>{r.status}</Badge> },
    { key: 'dueDate', header: 'Due Date', render: (r) => <span>{formatDate(r.dueDate)}</span> },
    { key: 'paidAt', header: 'Paid At', render: (r) => <span>{r.paidAt ? formatDate(r.paidAt) : '—'}</span> },
    { key: 'reference', header: 'Reference', render: (r) => <span className="text-muted text-xs">{r.reference ?? '—'}</span> },
  ];

  if (authLoading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Payments">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-card rounded-card shadow-card p-4">
          <p className="text-sm text-muted">Total</p>
          <p className="text-xl font-bold font-heading text-primary">{formatCurrency(total)}</p>
        </div>
        <div className="bg-card rounded-card shadow-card p-4">
          <p className="text-sm text-muted">Paid</p>
          <p className="text-xl font-bold font-heading text-success">{formatCurrency(paid)}</p>
        </div>
        <div className="bg-card rounded-card shadow-card p-4">
          <p className="text-sm text-muted">Pending</p>
          <p className="text-xl font-bold font-heading text-warning">{formatCurrency(pending)}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
        <Select
          options={monthOptions}
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="w-52"
        />
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => exportReport('pdf')}
            disabled={exporting !== null}
          >
            {exporting === 'pdf' ? 'Exporting…' : 'Monthly PDF'}
          </Button>
          <Button
            size="sm"
            variant="ghost"
            leftIcon={<Download className="w-4 h-4" />}
            onClick={() => exportReport('excel')}
            disabled={exporting !== null}
          >
            {exporting === 'excel' ? 'Exporting…' : 'Monthly Excel'}
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={payments}
        keyExtractor={(r) => r.id}
        emptyMessage={loading ? 'Loading payments…' : 'No payment records for this period.'}
      />
    </DashboardLayout>
  );
}

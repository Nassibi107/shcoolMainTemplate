'use client';

import { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

interface Student {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  class: string;
  isActive: boolean;
  enrollmentDate: string;
  paymentStatus: 'PAID' | 'PENDING' | 'OVERDUE';
}

const MOCK_STUDENTS: Student[] = [
  { id: '1', code: 'STU-001', firstName: 'Ahmed', lastName: 'Hassan', email: 'ahmed@school.com', class: '3B', isActive: true, enrollmentDate: '2023-09-01', paymentStatus: 'PAID' },
  { id: '2', code: 'STU-002', firstName: 'Sara', lastName: 'Ali', email: 'sara@school.com', class: '3B', isActive: true, enrollmentDate: '2023-09-01', paymentStatus: 'PENDING' },
  { id: '3', code: 'STU-003', firstName: 'Mohamed', lastName: 'Saad', email: 'mohamed@school.com', class: '3A', isActive: true, enrollmentDate: '2022-09-01', paymentStatus: 'OVERDUE' },
  { id: '4', code: 'STU-004', firstName: 'Fatima', lastName: 'Omar', email: 'fatima@school.com', class: '3A', isActive: true, enrollmentDate: '2023-09-01', paymentStatus: 'PAID' },
  { id: '5', code: 'STU-005', firstName: 'Youssef', lastName: 'Malik', email: 'youssef@school.com', class: '2A', isActive: false, enrollmentDate: '2022-09-01', paymentStatus: 'PENDING' },
  { id: '6', code: 'STU-006', firstName: 'Nour', lastName: 'Hassan', email: 'nour@school.com', class: '2A', isActive: true, enrollmentDate: '2024-01-15', paymentStatus: 'PAID' },
];

const PAYMENT_VARIANTS: Record<string, 'success' | 'warning' | 'danger'> = { PAID: 'success', PENDING: 'warning', OVERDUE: 'danger' };

export default function AssistantStudentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [students, setStudents] = useState<Student[]>(MOCK_STUDENTS);

  const filtered = students.filter((s) => {
    const name = `${s.firstName} ${s.lastName}`.toLowerCase();
    return (
      (!search || name.includes(search.toLowerCase()) || s.code.includes(search)) &&
      (!classFilter || s.class === classFilter) &&
      (!statusFilter || (statusFilter === 'active' ? s.isActive : !s.isActive))
    );
  });

  const columns: Column<Student>[] = [
    {
      key: 'name',
      header: 'Student',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar firstName={r.firstName} lastName={r.lastName} size="sm" />
          <div>
            <p className="font-medium text-sm">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-muted">{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: 'ID', render: (r) => <span className="font-mono text-xs text-muted bg-surface px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'class', header: 'Class', render: (r) => <Badge variant="secondary">{r.class}</Badge> },
    { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'muted'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'paymentStatus', header: 'Payment', render: (r) => <Badge variant={PAYMENT_VARIANTS[r.paymentStatus]}>{r.paymentStatus}</Badge> },
    { key: 'enrollmentDate', header: 'Enrolled', sortable: true, render: (r) => <span className="text-sm text-muted">{formatDate(r.enrollmentDate)}</span> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm">View</Button>
          <Button variant="ghost" size="sm">Edit</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  function handleExport() {
    const csv = ['Code,First Name,Last Name,Email,Class,Status,Payment,Enrolled',
      ...filtered.map((s) => `${s.code},${s.firstName},${s.lastName},${s.email},${s.class},${s.isActive ? 'Active' : 'Inactive'},${s.paymentStatus},${s.enrollmentDate}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'students.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Students">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: students.length },
          { label: 'Active', value: students.filter((s) => s.isActive).length },
          { label: 'Paid', value: students.filter((s) => s.paymentStatus === 'PAID').length },
          { label: 'Overdue', value: students.filter((s) => s.paymentStatus === 'OVERDUE').length },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search students…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-56" />
          </div>
          <Select options={[{ value: '', label: 'All Classes' }, { value: '2A', label: '2A' }, { value: '3A', label: '3A' }, { value: '3B', label: '3B' }]} value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-32" />
          <Select options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]} value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-32" />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>Export CSV</Button>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No students found." />
    </DashboardLayout>
  );
}

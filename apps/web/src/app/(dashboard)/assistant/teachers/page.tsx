'use client';

import { useState } from 'react';
import { Search, Mail, Phone, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

interface Teacher {
  id: string;
  code: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  isActive: boolean;
  hireDate: string;
  classes: string[];
}

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', code: 'TCH-001', firstName: 'James', lastName: 'Johnson', email: 'james@school.com', phone: '+1-555-0101', specialization: 'Mathematics', isActive: true, hireDate: '2021-09-01', classes: ['3A', '4B', '2C'] },
  { id: '2', code: 'TCH-002', firstName: 'Wei', lastName: 'Chen', email: 'wei@school.com', phone: '+1-555-0102', specialization: 'Physics', isActive: true, hireDate: '2020-09-01', classes: ['4A'] },
  { id: '3', code: 'TCH-003', firstName: 'Sarah', lastName: 'Miller', email: 'sarah@school.com', phone: '+1-555-0103', specialization: 'English', isActive: true, hireDate: '2019-09-01', classes: ['2B', '3A'] },
  { id: '4', code: 'TCH-004', firstName: 'Omar', lastName: 'Hassan', email: 'omar@school.com', phone: '+1-555-0104', specialization: 'History', isActive: false, hireDate: '2022-01-15', classes: [] },
  { id: '5', code: 'TCH-005', firstName: 'Priya', lastName: 'Sharma', email: 'priya@school.com', phone: '+1-555-0105', specialization: 'Science', isActive: true, hireDate: '2023-09-01', classes: ['5A', '5B'] },
];

export default function AssistantTeachersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = MOCK_TEACHERS.filter((t) => !search ||
    `${t.firstName} ${t.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    t.specialization.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Teacher>[] = [
    {
      key: 'name',
      header: 'Teacher',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <Avatar firstName={r.firstName} lastName={r.lastName} size="sm" />
          <div>
            <p className="font-medium text-sm">{r.firstName} {r.lastName}</p>
            <p className="text-xs text-muted flex items-center gap-1"><Mail className="w-3 h-3" />{r.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'code', header: 'ID', render: (r) => <span className="font-mono text-xs bg-surface px-2 py-0.5 rounded text-muted">{r.code}</span> },
    { key: 'specialization', header: 'Subject', render: (r) => <Badge variant="secondary">{r.specialization}</Badge> },
    { key: 'phone', header: 'Phone', render: (r) => <span className="text-sm text-muted flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span> },
    { key: 'classes', header: 'Classes', render: (r) => <span className="text-sm text-muted">{r.classes.length > 0 ? r.classes.join(', ') : '—'}</span> },
    { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'muted'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'hireDate', header: 'Hired', sortable: true, render: (r) => <span className="text-sm text-muted">{formatDate(r.hireDate)}</span> },
  ];

  function handleExport() {
    const csv = ['Code,Name,Email,Phone,Specialization,Status,Hire Date',
      ...filtered.map((t) => `${t.code},${t.firstName} ${t.lastName},${t.email},${t.phone},${t.specialization},${t.isActive ? 'Active' : 'Inactive'},${t.hireDate}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'teachers.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Teachers">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total Teachers', value: MOCK_TEACHERS.length }, { label: 'Active', value: MOCK_TEACHERS.filter((t) => t.isActive).length }, { label: 'Inactive', value: MOCK_TEACHERS.filter((t) => !t.isActive).length }].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" placeholder="Search teachers…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-64" />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>Export CSV</Button>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No teachers found." />
    </DashboardLayout>
  );
}

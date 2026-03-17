'use client';

import { useState } from 'react';
import { Plus, Search, Download, Mail, Phone } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

interface Teacher {
  id: string;
  employeeCode: string;
  specialization: string;
  isActive: boolean;
  hireDate: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    phone?: string | null;
    avatarUrl?: string | null;
  };
  subjects: { name: string }[];
  classes: { name: string }[];
}

const MOCK_TEACHERS: Teacher[] = [
  { id: '1', employeeCode: 'TCH-001', specialization: 'Mathematics', isActive: true, hireDate: '2021-09-01', user: { firstName: 'James', lastName: 'Johnson', email: 'james@school.com', phone: '+1-555-0101' }, subjects: [{ name: 'Math' }, { name: 'Statistics' }], classes: [{ name: '3A' }, { name: '4B' }] },
  { id: '2', employeeCode: 'TCH-002', specialization: 'Physics', isActive: true, hireDate: '2020-09-01', user: { firstName: 'Wei', lastName: 'Chen', email: 'wei@school.com', phone: '+1-555-0102' }, subjects: [{ name: 'Physics' }], classes: [{ name: '4A' }] },
  { id: '3', employeeCode: 'TCH-003', specialization: 'English', isActive: true, hireDate: '2019-09-01', user: { firstName: 'Sarah', lastName: 'Miller', email: 'sarah@school.com', phone: '+1-555-0103' }, subjects: [{ name: 'English' }, { name: 'Literature' }], classes: [{ name: '2B' }, { name: '3A' }] },
  { id: '4', employeeCode: 'TCH-004', specialization: 'History', isActive: false, hireDate: '2022-01-15', user: { firstName: 'Omar', lastName: 'Hassan', email: 'omar@school.com', phone: '+1-555-0104' }, subjects: [{ name: 'History' }], classes: [] },
  { id: '5', employeeCode: 'TCH-005', specialization: 'Chemistry', isActive: true, hireDate: '2023-09-01', user: { firstName: 'Priya', lastName: 'Sharma', email: 'priya@school.com' }, subjects: [{ name: 'Chemistry' }, { name: 'Biology' }], classes: [{ name: '5A' }, { name: '5B' }] },
];

interface TeacherFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  hireDate: string;
}

function TeacherForm({ onSubmit, defaultValues, isEditing }: {
  onSubmit: (v: TeacherFormValues) => void;
  defaultValues?: Partial<TeacherFormValues>;
  isEditing?: boolean;
}) {
  const [form, setForm] = useState<TeacherFormValues>({
    firstName: defaultValues?.firstName ?? '',
    lastName: defaultValues?.lastName ?? '',
    email: defaultValues?.email ?? '',
    phone: defaultValues?.phone ?? '',
    specialization: defaultValues?.specialization ?? '',
    hireDate: defaultValues?.hireDate ?? '',
  });

  function set(field: keyof TeacherFormValues, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">First Name</label>
          <input className="input-field w-full" value={form.firstName} onChange={(e) => set('firstName', e.target.value)} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Last Name</label>
          <input className="input-field w-full" value={form.lastName} onChange={(e) => set('lastName', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Email</label>
        <input type="email" className="input-field w-full" value={form.email} onChange={(e) => set('email', e.target.value)} required />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Phone</label>
          <input className="input-field w-full" value={form.phone} onChange={(e) => set('phone', e.target.value)} />
        </div>
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Specialization</label>
          <input className="input-field w-full" value={form.specialization} onChange={(e) => set('specialization', e.target.value)} required />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Hire Date</label>
        <input type="date" className="input-field w-full" value={form.hireDate} onChange={(e) => set('hireDate', e.target.value)} />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="submit">{isEditing ? 'Save Changes' : 'Add Teacher'}</Button>
      </div>
    </form>
  );
}

export default function AdminTeachersPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState<Teacher | null>(null);
  const [teachers, setTeachers] = useState<Teacher[]>(MOCK_TEACHERS);

  const filtered = teachers.filter((t) => {
    const name = `${t.user.firstName} ${t.user.lastName}`.toLowerCase();
    const matchesSearch = !search || name.includes(search.toLowerCase()) || t.user.email.includes(search.toLowerCase()) || t.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || (statusFilter === 'active' ? t.isActive : !t.isActive);
    return matchesSearch && matchesStatus;
  });

  const columns: Column<Teacher>[] = [
    {
      key: 'user',
      header: 'Teacher',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar src={row.user.avatarUrl} firstName={row.user.firstName} lastName={row.user.lastName} size="sm" />
          <div>
            <p className="font-medium text-app-text text-sm">{row.user.firstName} {row.user.lastName}</p>
            <p className="text-xs text-muted flex items-center gap-1"><Mail className="w-3 h-3" />{row.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'employeeCode',
      header: 'ID',
      render: (row) => <span className="font-mono text-xs text-muted bg-surface px-2 py-0.5 rounded">{row.employeeCode}</span>,
    },
    {
      key: 'specialization',
      header: 'Specialization',
      render: (row) => <Badge variant="secondary">{row.specialization}</Badge>,
    },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.slice(0, 2).map((s) => (
            <span key={s.name} className="text-xs bg-accent/10 text-accent rounded px-1.5 py-0.5">{s.name}</span>
          ))}
          {row.subjects.length > 2 && <span className="text-xs text-muted">+{row.subjects.length - 2}</span>}
        </div>
      ),
    },
    {
      key: 'classes',
      header: 'Classes',
      render: (row) => <span className="text-sm text-muted">{row.classes.length > 0 ? row.classes.map((c) => c.name).join(', ') : '—'}</span>,
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => <Badge variant={row.isActive ? 'success' : 'muted'}>{row.isActive ? 'Active' : 'Inactive'}</Badge>,
    },
    {
      key: 'hireDate',
      header: 'Hired',
      sortable: true,
      render: (row) => <span className="text-sm text-muted">{formatDate(row.hireDate)}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setEditingTeacher(row)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setTeachers((prev) => prev.filter((t) => t.id !== row.id))}>Remove</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  function handleExport() {
    const csv = ['Employee Code,First Name,Last Name,Email,Specialization,Status,Hire Date',
      ...filtered.map((t) => `${t.employeeCode},${t.user.firstName},${t.user.lastName},${t.user.email},${t.specialization},${t.isActive ? 'Active' : 'Inactive'},${t.hireDate}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'teachers.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Teachers">
      {/* Summary cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Teachers', value: teachers.length },
          { label: 'Active', value: teachers.filter((t) => t.isActive).length },
          { label: 'Inactive', value: teachers.filter((t) => !t.isActive).length },
          { label: 'Subjects Covered', value: new Set(teachers.flatMap((t) => t.subjects.map((s) => s.name))).size },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{stat.value}</p>
            <p className="text-sm text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search teachers…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 w-64"
            />
          </div>
          <Select
            options={[{ value: '', label: 'All Status' }, { value: 'active', label: 'Active' }, { value: 'inactive', label: 'Inactive' }]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
            Export CSV
          </Button>
          <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
            Add Teacher
          </Button>
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage="No teachers found."
        emptyAction={<Button size="sm" onClick={() => setIsCreateOpen(true)}>Add First Teacher</Button>}
      />

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Add New Teacher" size="lg">
        <TeacherForm
          onSubmit={(values) => {
            const newTeacher: Teacher = {
              id: String(Date.now()),
              employeeCode: `TCH-${String(teachers.length + 1).padStart(3, '0')}`,
              specialization: values.specialization,
              isActive: true,
              hireDate: values.hireDate || new Date().toISOString().slice(0, 10),
              user: { firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone },
              subjects: [],
              classes: [],
            };
            setTeachers((prev) => [...prev, newTeacher]);
            setIsCreateOpen(false);
          }}
        />
      </Modal>

      <Modal isOpen={!!editingTeacher} onClose={() => setEditingTeacher(null)} title="Edit Teacher" size="lg">
        {editingTeacher && (
          <TeacherForm
            isEditing
            defaultValues={{
              firstName: editingTeacher.user.firstName,
              lastName: editingTeacher.user.lastName,
              email: editingTeacher.user.email,
              phone: editingTeacher.user.phone ?? '',
              specialization: editingTeacher.specialization,
              hireDate: editingTeacher.hireDate,
            }}
            onSubmit={(values) => {
              setTeachers((prev) => prev.map((t) => t.id === editingTeacher.id
                ? { ...t, specialization: values.specialization, hireDate: values.hireDate, user: { ...t.user, firstName: values.firstName, lastName: values.lastName, email: values.email, phone: values.phone } }
                : t
              ));
              setEditingTeacher(null);
            }}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}

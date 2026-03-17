'use client';

import { useState } from 'react';
import { Plus, Search, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge, PaymentStatusBadge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { Avatar } from '@/components/ui/Avatar';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';
import { StudentForm, StudentFormValues } from '@/components/students/StudentForm';
import { useStudents, createStudent, updateStudent, deleteStudent, Student } from '@/hooks/useStudents';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

const notify = {
  success: (msg: string) => console.log('[success]', msg),
  error: (msg: string) => console.error('[error]', msg),
};

export default function AdminStudentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [paymentFilter, setPaymentFilter] = useState('');
  const [page, setPage] = useState(1);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);

  const { data, meta, loading, refetch } = useStudents({
    search: search || undefined,
    isActive: statusFilter || undefined,
    paymentStatus: paymentFilter || undefined,
    page,
    limit: 20,
  });

  const columns: Column<Student>[] = [
    {
      key: 'user',
      header: 'Student',
      render: (row) => (
        <div className="flex items-center gap-2.5">
          <Avatar
            src={row.user.avatarUrl}
            firstName={row.user.firstName}
            lastName={row.user.lastName}
            size="sm"
          />
          <div>
            <p className="font-medium text-app-text text-sm">
              {row.user.firstName} {row.user.lastName}
            </p>
            <p className="text-xs text-muted">{row.user.email}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'studentCode',
      header: 'ID',
      sortable: true,
      render: (row) => (
        <span className="font-mono text-xs text-muted bg-surface px-2 py-0.5 rounded">
          {row.studentCode}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (row) => {
        const cls = row.classEnrollments?.[0]?.class;
        return cls ? (
          <Badge variant="secondary">{cls.name}</Badge>
        ) : (
          <span className="text-muted text-sm">—</span>
        );
      },
    },
    {
      key: 'isActive',
      header: 'Status',
      render: (row) => (
        <Badge variant={row.isActive ? 'success' : 'muted'}>
          {row.isActive ? 'Active' : 'Inactive'}
        </Badge>
      ),
    },
    {
      key: 'payment',
      header: 'Payment',
      render: (row) => {
        const latestPayment = row.payments?.[0];
        return latestPayment ? (
          <PaymentStatusBadge status={latestPayment.status} />
        ) : (
          <span className="text-muted text-sm">—</span>
        );
      },
    },
    {
      key: 'enrollmentDate',
      header: 'Enrolled',
      sortable: true,
      render: (row) => (
        <span className="text-sm text-muted">{formatDate(row.enrollmentDate)}</span>
      ),
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setEditingStudent(row)}
          >
            Edit
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => handleDelete(row.id)}
          >
            Remove
          </Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  async function handleCreate(values: StudentFormValues) {
    if (!user) return;
    try {
      await createStudent(user.school.id, values);
      setIsCreateOpen(false);
      refetch();
      notify.success('Student enrolled successfully');
    } catch {
      notify.error('Failed to enroll student');
    }
  }

  async function handleUpdate(values: StudentFormValues) {
    if (!user || !editingStudent) return;
    try {
      await updateStudent(user.school.id, editingStudent.id, values);
      setEditingStudent(null);
      refetch();
      notify.success('Student updated successfully');
    } catch {
      notify.error('Failed to update student');
    }
  }

  async function handleDelete(id: string) {
    if (!user || !confirm('Are you sure you want to remove this student?')) return;
    try {
      await deleteStudent(user.school.id, id);
      refetch();
      notify.success('Student removed');
    } catch {
      notify.error('Failed to remove student');
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Students">
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-1 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input
              type="text"
              placeholder="Search students…"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              className="input-field pl-9 w-64"
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'true', label: 'Active' },
              { value: 'false', label: 'Inactive' },
            ]}
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
            className="w-36"
          />
          <Select
            options={[
              { value: '', label: 'All Payments' },
              { value: 'PAID', label: 'Paid' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'OVERDUE', label: 'Overdue' },
            ]}
            value={paymentFilter}
            onChange={(e) => { setPaymentFilter(e.target.value); setPage(1); }}
            className="w-40"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />}>
            Export
          </Button>
          <Button
            size="sm"
            leftIcon={<Plus className="w-4 h-4" />}
            onClick={() => setIsCreateOpen(true)}
          >
            Enroll Student
          </Button>
        </div>
      </div>

      {/* Stats bar */}
      {meta && (
        <p className="text-sm text-muted mb-4">
          Showing <span className="font-semibold text-app-text">{data?.length ?? 0}</span> of{' '}
          <span className="font-semibold text-app-text">{meta.total}</span> students
        </p>
      )}

      {/* Table */}
      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <DataTable
          columns={columns}
          data={data ?? []}
          keyExtractor={(r) => r.id}
          emptyMessage="No students found. Try adjusting your filters."
          emptyAction={
            <Button size="sm" onClick={() => setIsCreateOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
              Enroll First Student
            </Button>
          }
        />
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted">
            Page {meta.page} of {meta.totalPages}
          </p>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Previous
            </Button>
            <Button
              variant="ghost"
              size="sm"
              disabled={page >= meta.totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Enroll New Student"
        size="lg"
      >
        <StudentForm onSubmit={handleCreate} />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editingStudent}
        onClose={() => setEditingStudent(null)}
        title="Edit Student"
        size="lg"
      >
        {editingStudent && (
          <StudentForm
            isEditing
            defaultValues={{
              firstName: editingStudent.user.firstName,
              lastName: editingStudent.user.lastName,
              phone: editingStudent.user.phone,
              dateOfBirth: editingStudent.dateOfBirth?.slice(0, 10),
              gender: (editingStudent.gender as any) ?? '',
              address: editingStudent.address ?? '',
            }}
            onSubmit={handleUpdate}
          />
        )}
      </Modal>
    </DashboardLayout>
  );
}


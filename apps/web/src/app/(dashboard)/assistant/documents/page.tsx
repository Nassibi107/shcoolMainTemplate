'use client';

import { useState } from 'react';
import { Search, Download, FileText, Check, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useDocumentRequestsAdmin, approveDocumentRequest, rejectDocumentRequest, DocumentRequest } from '@/hooks/useDocumentRequests';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';
import { SkeletonTable } from '@/components/ui/LoadingSkeleton';

const STATUS_CONFIG: Record<string, { variant: 'warning' | 'secondary' | 'success' | 'danger'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  APPROVED: { variant: 'success', label: 'Approved' },
  REJECTED: { variant: 'danger', label: 'Rejected' },
};

async function downloadCertificate(schoolId: string, certificateId: string, filename: string) {
  const res = await api.get(`/schools/${schoolId}/certificates/download/${certificateId}`, {
    responseType: 'blob',
  });
  const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename || 'certificate.pdf';
  a.click();
  URL.revokeObjectURL(url);
}

export default function AssistantDocumentsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [rejectModal, setRejectModal] = useState<{ id: string; note: string } | null>(null);
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const { requests, loading, refetch } = useDocumentRequestsAdmin();

  const filtered = requests.filter((d) => {
    const studentName = d.student
      ? `${d.student.user.firstName} ${d.student.user.lastName}`
      : '';
    const matchSearch =
      !search ||
      studentName.toLowerCase().includes(search.toLowerCase()) ||
      d.documentType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  async function handleApprove(id: string) {
    if (!user) return;
    setApprovingId(id);
    try {
      await approveDocumentRequest(user.school.id, id);
      refetch();
      toast.success('Request approved');
    } catch {
      toast.error('Failed to approve');
    } finally {
      setApprovingId(null);
    }
  }

  async function handleReject() {
    if (!user || !rejectModal) return;
    try {
      await rejectDocumentRequest(user.school.id, rejectModal.id, rejectModal.note);
      setRejectModal(null);
      refetch();
      toast.success('Request rejected');
    } catch {
      toast.error('Failed to reject');
    }
  }

  async function handleDownload(req: DocumentRequest) {
    const certId = req.certificateId ?? (req as any).certificate?.id;
    if (!user || !certId) return;
    try {
      await downloadCertificate(
        user.school.id,
        certId,
        `${req.documentType.replace(/\s+/g, '-')}.pdf`,
      );
      toast.success('Download started');
    } catch {
      toast.error('Failed to download');
    }
  }

  const columns: Column<DocumentRequest & { requester?: { firstName: string; lastName: string }; student?: { user: { firstName: string; lastName: string }; classEnrollments?: Array<{ class: { name: string } }> } }>[] = [
    {
      key: 'student',
      header: 'Student',
      render: (r) => (
        <span className="font-medium">
          {r.student ? `${r.student.user.firstName} ${r.student.user.lastName}` : '—'}
        </span>
      ),
    },
    {
      key: 'class',
      header: 'Class',
      render: (r) => (
        <Badge variant="secondary">
          {r.student?.classEnrollments?.[0]?.class?.name ?? '—'}
        </Badge>
      ),
    },
    {
      key: 'type',
      header: 'Document Type',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-muted" />
          <span className="text-sm">{r.documentType}</span>
        </div>
      ),
    },
    {
      key: 'requester',
      header: 'Requested By',
      render: (r) => (
        <Badge variant="secondary">
          {(r as any).requester
            ? `${(r as any).requester.firstName} ${(r as any).requester.lastName}`
            : '—'}
        </Badge>
      ),
    },
    {
      key: 'requestDate',
      header: 'Date',
      sortable: true,
      render: (r) => <span className="text-sm text-muted">{formatDate(r.createdAt)}</span>,
    },
    {
      key: 'status',
      header: 'Status',
      render: (r) => <Badge variant={STATUS_CONFIG[r.status]?.variant ?? 'secondary'}>{STATUS_CONFIG[r.status]?.label ?? r.status}</Badge>,
    },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          {r.status === 'PENDING' && (
            <>
              <Button
                size="sm"
                onClick={() => handleApprove(r.id)}
                disabled={approvingId === r.id}
              >
                {approvingId === r.id ? 'Approving…' : 'Approve'}
              </Button>
              <Button
                size="sm"
                variant="danger"
                onClick={() => setRejectModal({ id: r.id, note: '' })}
              >
                Reject
              </Button>
            </>
          )}
          {r.status === 'APPROVED' && (r.certificateId || (r as any).certificate?.id) && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Download className="w-3 h-3" />}
              onClick={() => handleDownload(r)}
            >
              PDF
            </Button>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Document Requests">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total', value: requests.length },
          { label: 'Pending', value: requests.filter((d) => d.status === 'PENDING').length },
          { label: 'Approved', value: requests.filter((d) => d.status === 'APPROVED').length },
          { label: 'Rejected', value: requests.filter((d) => d.status === 'REJECTED').length },
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
            <input
              type="text"
              placeholder="Search…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 w-52"
            />
          </div>
          <Select
            options={[
              { value: '', label: 'All Status' },
              { value: 'PENDING', label: 'Pending' },
              { value: 'APPROVED', label: 'Approved' },
              { value: 'REJECTED', label: 'Rejected' },
            ]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      {loading ? (
        <SkeletonTable rows={8} />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          keyExtractor={(r) => r.id}
          emptyMessage="No document requests found."
        />
      )}

      <Modal
        isOpen={!!rejectModal}
        onClose={() => setRejectModal(null)}
        title="Reject Document Request"
        size="md"
      >
        {rejectModal && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Reason (optional)</label>
              <textarea
                className="input-field w-full"
                rows={3}
                value={rejectModal.note}
                onChange={(e) => setRejectModal((p) => p && { ...p, note: e.target.value })}
                placeholder="Provide a reason for rejection…"
              />
            </div>
            <div className="flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setRejectModal(null)}>
                Cancel
              </Button>
              <Button variant="danger" onClick={handleReject}>
                Reject
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </DashboardLayout>
  );
}

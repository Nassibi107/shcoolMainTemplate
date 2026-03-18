'use client';

import { useState } from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { useChildren } from '@/hooks/useChildren';
import { useDocumentRequests, createDocumentRequest, DocumentRequest } from '@/hooks/useDocumentRequests';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';
import api from '@/lib/api';

const DOC_TYPES = ['Registration Certificate', 'Attendance Certificate', 'Grade Report', 'Completion Certificate', 'Good Conduct Certificate', 'Medical Exemption'];

const STATUS_CONFIG: Record<string, { variant: 'success' | 'warning' | 'secondary' | 'danger'; label: string }> = {
  APPROVED: { variant: 'success', label: 'Ready' },
  PENDING: { variant: 'warning', label: 'Pending' },
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

export default function ParentDocumentsPage() {
  const { user, loading } = useAuth();
  const { children, loading: childrenLoading } = useChildren();
  const { requests, loading: requestsLoading, refetch } = useDocumentRequests();
  const toast = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ studentId: '', type: DOC_TYPES[0], note: '' });
  const [submitting, setSubmitting] = useState(false);

  const selectedChild = children.find((c) => c.id === form.studentId);

  async function handleRequest() {
    if (!user || !form.studentId) return;
    setSubmitting(true);
    try {
      await createDocumentRequest(user.school.id, {
        studentId: form.studentId,
        documentType: form.type,
        note: form.note || undefined,
      });
      setIsOpen(false);
      setForm((p) => ({ ...p, studentId: p.studentId, type: DOC_TYPES[0], note: '' }));
      refetch();
      toast.success('Document request submitted');
    } catch {
      toast.error('Failed to submit request');
    } finally {
      setSubmitting(false);
    }
  }

  async function handleDownload(req: DocumentRequest) {
    const certId = req.certificateId ?? req.certificate?.id;
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

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Document Requests">
      {children.length > 0 && (
        <div className="mb-4 px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-card text-sm text-secondary font-medium">
          Requesting for: <span className="font-bold">{selectedChild ? `${selectedChild.user.firstName} ${selectedChild.user.lastName}` : children[0]?.user.firstName + ' ' + children[0]?.user.lastName}</span>
          {selectedChild?.classEnrollments?.[0] && (
            <> · Class {selectedChild.classEnrollments[0].class.name}</>
          )}
        </div>
      )}

      <div className="bg-accent/5 border border-accent/20 rounded-card p-4 mb-6 flex items-start gap-3">
        <FileText className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">Official Document Requests</p>
          <p className="text-xs text-muted mt-0.5">Documents are typically ready within 1–2 working days. You will be notified when your document is ready for download.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-primary">My Requests ({requests.length})</h3>
        {children.length > 0 && (
          <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsOpen(true)}>Request Document</Button>
        )}
      </div>

      <div className="space-y-3">
        {requestsLoading && (
          <div className="py-10 text-center text-muted text-sm">Loading…</div>
        )}
        {!requestsLoading && requests.length === 0 && (
          <p className="text-sm text-muted text-center py-10">No document requests yet.</p>
        )}
        {!requestsLoading &&
          requests.map((doc) => (
            <div key={doc.id} className="bg-card rounded-card shadow-card p-4 flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'APPROVED' ? 'bg-success/10' : doc.status === 'REJECTED' ? 'bg-danger/10' : 'bg-accent/10'}`}>
                <FileText className={`w-6 h-6 ${doc.status === 'APPROVED' ? 'text-success' : doc.status === 'REJECTED' ? 'text-danger' : 'text-accent'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold">{doc.documentType}</p>
                  {doc.student && (
                    <span className="text-xs bg-surface border border-border rounded px-1.5 py-0.5 text-muted">
                      {doc.student.user.firstName} {doc.student.user.lastName}
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted mt-0.5">
                  Requested: {formatDate(doc.createdAt)}
                  {doc.approvedAt && ` · Issued: ${formatDate(doc.approvedAt)}`}
                  {doc.rejectedAt && ` · Rejected: ${formatDate(doc.rejectedAt)}`}
                </p>
                {doc.status === 'REJECTED' && doc.approverNote && (
                  <p className="text-xs text-danger mt-1">Reason: {doc.approverNote}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Badge variant={STATUS_CONFIG[doc.status]?.variant ?? 'secondary'}>
                  {STATUS_CONFIG[doc.status]?.label ?? doc.status}
                </Badge>
                {doc.status === 'APPROVED' && (doc.certificateId || doc.certificate?.id) && (
                  <Button
                    size="sm"
                    variant="ghost"
                    leftIcon={<Download className="w-3 h-3" />}
                    onClick={() => handleDownload(doc)}
                  >
                    Download
                  </Button>
                )}
              </div>
            </div>
          ))}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Request Official Document" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Child</label>
            <select
              className="input-field w-full"
              value={form.studentId}
              onChange={(e) => setForm((p) => ({ ...p, studentId: e.target.value }))}
              required
            >
              <option value="">Select child</option>
              {children.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.user.firstName} {c.user.lastName}
                  {c.classEnrollments?.[0] && ` · ${c.classEnrollments[0].class.name}`}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select className="input-field w-full" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {DOC_TYPES.map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Note (optional)</label>
            <textarea
              className="input-field w-full"
              rows={2}
              value={form.note}
              onChange={(e) => setForm((p) => ({ ...p, note: e.target.value }))}
              placeholder="Any additional details…"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleRequest} disabled={!form.studentId || submitting}>
              {submitting ? 'Submitting…' : 'Submit Request'}
            </Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

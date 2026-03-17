'use client';

import { useState } from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

type DocStatus = 'READY' | 'PENDING' | 'PROCESSING';

interface DocRequest {
  id: string;
  type: string;
  language: string;
  requestDate: string;
  issuedDate?: string;
  status: DocStatus;
}

const DOC_TYPES = ['Registration Certificate', 'Attendance Certificate', 'Grade Report', 'Completion Certificate', 'Good Conduct Certificate', 'Medical Exemption'];
const LANGUAGES = ['English', 'Arabic', 'French'];

const INITIAL_DOCS: DocRequest[] = [
  { id: '1', type: 'Registration Certificate', language: 'English', requestDate: '2024-09-15', issuedDate: '2024-09-16', status: 'READY' },
  { id: '2', type: 'Grade Report', language: 'Arabic', requestDate: '2024-03-14', status: 'PROCESSING' },
];

const STATUS_CONFIG: Record<DocStatus, { variant: 'success' | 'warning' | 'secondary'; label: string }> = {
  READY: { variant: 'success', label: 'Ready' },
  PROCESSING: { variant: 'secondary', label: 'Processing' },
  PENDING: { variant: 'warning', label: 'Pending' },
};

export default function ParentDocumentsPage() {
  const { user, loading } = useAuth();
  const [docs, setDocs] = useState<DocRequest[]>(INITIAL_DOCS);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ type: DOC_TYPES[0], language: 'English' });

  function handleRequest() {
    setDocs((prev) => [{
      id: String(Date.now()),
      type: form.type,
      language: form.language,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'PENDING',
    }, ...prev]);
    setIsOpen(false);
  }

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Document Requests">
      <div className="mb-4 px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-card text-sm text-secondary font-medium">
        Requesting for: <span className="font-bold">Ahmed Hassan</span> · Class 3B
      </div>

      <div className="bg-accent/5 border border-accent/20 rounded-card p-4 mb-6 flex items-start gap-3">
        <FileText className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium">Official Document Requests</p>
          <p className="text-xs text-muted mt-0.5">Documents are typically ready within 1–2 working days. You will be notified when your document is ready for download.</p>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-primary">My Requests ({docs.length})</h3>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsOpen(true)}>Request Document</Button>
      </div>

      <div className="space-y-3">
        {docs.map((doc) => (
          <div key={doc.id} className="bg-card rounded-card shadow-card p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${doc.status === 'READY' ? 'bg-success/10' : 'bg-accent/10'}`}>
              <FileText className={`w-6 h-6 ${doc.status === 'READY' ? 'text-success' : 'text-accent'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-semibold">{doc.type}</p>
                <span className="text-xs bg-surface border border-border rounded px-1.5 py-0.5 text-muted">{doc.language}</span>
              </div>
              <p className="text-xs text-muted mt-0.5">Requested: {formatDate(doc.requestDate)}{doc.issuedDate ? ` · Issued: ${formatDate(doc.issuedDate)}` : ''}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge variant={STATUS_CONFIG[doc.status].variant}>{STATUS_CONFIG[doc.status].label}</Badge>
              {doc.status === 'READY' && (
                <Button size="sm" variant="ghost" leftIcon={<Download className="w-3 h-3" />}>Download</Button>
              )}
            </div>
          </div>
        ))}
        {docs.length === 0 && <p className="text-sm text-muted text-center py-10">No document requests yet.</p>}
      </div>

      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Request Official Document" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Document Type</label>
            <select className="input-field w-full" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {DOC_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Language</label>
            <select className="input-field w-full" value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3 text-xs text-muted">
            Processing time: <span className="font-medium text-app-text">1–2 working days</span>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

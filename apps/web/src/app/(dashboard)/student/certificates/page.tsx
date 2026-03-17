'use client';

import { useState } from 'react';
import { Plus, Download, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

type CertStatus = 'READY' | 'PENDING' | 'PROCESSING';

interface Certificate {
  id: string;
  type: string;
  requestDate: string;
  issuedDate?: string;
  status: CertStatus;
  language: string;
}

const CERT_TYPES = ['Registration Certificate', 'Attendance Certificate', 'Grade Report', 'Completion Certificate', 'Good Conduct Certificate'];
const LANGUAGES = ['English', 'Arabic', 'French'];

const INITIAL_CERTS: Certificate[] = [
  { id: '1', type: 'Registration Certificate', requestDate: '2024-09-15', issuedDate: '2024-09-16', status: 'READY', language: 'English' },
  { id: '2', type: 'Attendance Certificate', requestDate: '2024-03-16', status: 'PROCESSING', language: 'English' },
  { id: '3', type: 'Grade Report', requestDate: '2024-02-01', issuedDate: '2024-02-03', status: 'READY', language: 'Arabic' },
];

const STATUS_CONFIG: Record<CertStatus, { variant: 'success' | 'warning' | 'secondary'; label: string; description: string }> = {
  READY: { variant: 'success', label: 'Ready', description: 'Available for download' },
  PROCESSING: { variant: 'secondary', label: 'Processing', description: 'Being prepared (1–2 working days)' },
  PENDING: { variant: 'warning', label: 'Pending', description: 'Awaiting review' },
};

export default function StudentCertificatesPage() {
  const { user, loading } = useAuth();
  const [certs, setCerts] = useState<Certificate[]>(INITIAL_CERTS);
  const [isOpen, setIsOpen] = useState(false);
  const [form, setForm] = useState({ type: CERT_TYPES[0], language: 'English' });

  function handleRequest() {
    setCerts((prev) => [{
      id: String(Date.now()),
      type: form.type,
      requestDate: new Date().toISOString().slice(0, 10),
      status: 'PENDING',
      language: form.language,
    }, ...prev]);
    setIsOpen(false);
  }

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Certificates">
      {/* Info banner */}
      <div className="bg-accent/5 border border-accent/20 rounded-card p-4 mb-6 flex items-start gap-3">
        <FileText className="w-5 h-5 text-accent mt-0.5 shrink-0" />
        <div>
          <p className="text-sm font-medium text-app-text">Certificate Requests</p>
          <p className="text-xs text-muted mt-0.5">Certificates are typically ready within 1–2 working days after your request. Download as PDF once ready.</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-heading font-semibold text-primary">My Certificates ({certs.length})</h3>
        <Button leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsOpen(true)}>
          Request Certificate
        </Button>
      </div>

      {/* Certificate cards */}
      <div className="space-y-3">
        {certs.map((cert) => (
          <div key={cert.id} className="bg-card rounded-card shadow-card p-4 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${cert.status === 'READY' ? 'bg-success/10' : cert.status === 'PROCESSING' ? 'bg-accent/10' : 'bg-warning/10'}`}>
              <FileText className={`w-6 h-6 ${cert.status === 'READY' ? 'text-success' : cert.status === 'PROCESSING' ? 'text-accent' : 'text-warning'}`} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="font-semibold text-app-text">{cert.type}</p>
                <span className="text-xs bg-surface border border-border rounded px-1.5 py-0.5 text-muted">{cert.language}</span>
              </div>
              <div className="flex items-center gap-3 mt-1">
                <p className="text-xs text-muted">Requested: {formatDate(cert.requestDate)}</p>
                {cert.issuedDate && <p className="text-xs text-muted">Issued: {formatDate(cert.issuedDate)}</p>}
              </div>
              <p className="text-xs text-muted mt-0.5">{STATUS_CONFIG[cert.status].description}</p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <Badge variant={STATUS_CONFIG[cert.status].variant}>{STATUS_CONFIG[cert.status].label}</Badge>
              {cert.status === 'READY' && (
                <Button size="sm" leftIcon={<Download className="w-3 h-3" />} variant="ghost">
                  Download PDF
                </Button>
              )}
            </div>
          </div>
        ))}

        {certs.length === 0 && (
          <div className="text-center py-16">
            <FileText className="w-12 h-12 text-muted/40 mx-auto mb-3" />
            <p className="text-muted font-medium">No certificates yet</p>
            <Button className="mt-4" onClick={() => setIsOpen(true)}>Request Your First Certificate</Button>
          </div>
        )}
      </div>

      {/* Request Modal */}
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title="Request Certificate" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Certificate Type</label>
            <select className="input-field w-full" value={form.type} onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}>
              {CERT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Language</label>
            <select className="input-field w-full" value={form.language} onChange={(e) => setForm((p) => ({ ...p, language: e.target.value }))}>
              {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
            </select>
          </div>
          <div className="bg-surface border border-border rounded-lg p-3">
            <p className="text-xs text-muted">Processing time: <span className="font-medium text-app-text">1–2 working days</span></p>
            <p className="text-xs text-muted mt-1">You will be notified when your certificate is ready.</p>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsOpen(false)}>Cancel</Button>
            <Button onClick={handleRequest}>Submit Request</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

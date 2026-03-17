'use client';

import { useState } from 'react';
import { Plus, Download, FileText, Eye } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

type CertStatus = 'READY' | 'PENDING' | 'PROCESSING';

interface CertificateRequest {
  id: string;
  student: string;
  class: string;
  type: string;
  requestDate: string;
  status: CertStatus;
  issuedDate?: string;
}

interface CertificateTemplate {
  id: string;
  name: string;
  type: string;
  language: string;
  isActive: boolean;
  lastUsed: string;
}

const MOCK_REQUESTS: CertificateRequest[] = [
  { id: '1', student: 'Ahmed Hassan', class: '3B', type: 'Registration Certificate', requestDate: '2024-03-15', status: 'READY', issuedDate: '2024-03-16' },
  { id: '2', student: 'Sara Ali', class: '3B', type: 'Attendance Certificate', requestDate: '2024-03-16', status: 'PROCESSING' },
  { id: '3', student: 'Mohamed Saad', class: '3A', type: 'Completion Certificate', requestDate: '2024-03-14', status: 'PENDING' },
  { id: '4', student: 'Fatima Omar', class: '3A', type: 'Grade Report', requestDate: '2024-03-17', status: 'READY', issuedDate: '2024-03-17' },
  { id: '5', student: 'Youssef Malik', class: '2A', type: 'Registration Certificate', requestDate: '2024-03-13', status: 'READY', issuedDate: '2024-03-14' },
];

const MOCK_TEMPLATES: CertificateTemplate[] = [
  { id: '1', name: 'Registration Certificate EN', type: 'Registration Certificate', language: 'English', isActive: true, lastUsed: '2024-03-17' },
  { id: '2', name: 'شهادة التسجيل AR', type: 'Registration Certificate', language: 'Arabic', isActive: true, lastUsed: '2024-03-10' },
  { id: '3', name: 'Attestation de Présence FR', type: 'Attendance Certificate', language: 'French', isActive: true, lastUsed: '2024-03-12' },
  { id: '4', name: 'Completion Certificate EN', type: 'Completion Certificate', language: 'English', isActive: false, lastUsed: '2024-02-01' },
  { id: '5', name: 'Grade Report EN', type: 'Grade Report', language: 'English', isActive: true, lastUsed: '2024-03-15' },
];

const STATUS_CONFIG: Record<CertStatus, { variant: 'success' | 'warning' | 'secondary'; label: string }> = {
  READY: { variant: 'success', label: 'Ready' },
  PENDING: { variant: 'warning', label: 'Pending' },
  PROCESSING: { variant: 'secondary', label: 'Processing' },
};

function GenerateCertificateModal({ onClose }: { onClose: () => void }) {
  const [student, setStudent] = useState('');
  const [certType, setCertType] = useState('Registration Certificate');
  const [lang, setLang] = useState('English');

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Student</label>
        <select className="input-field w-full" value={student} onChange={(e) => setStudent(e.target.value)}>
          <option value="">— Select Student —</option>
          {['Ahmed Hassan', 'Sara Ali', 'Mohamed Saad', 'Fatima Omar', 'Youssef Malik'].map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Certificate Type</label>
        <select className="input-field w-full" value={certType} onChange={(e) => setCertType(e.target.value)}>
          {['Registration Certificate', 'Attendance Certificate', 'Completion Certificate', 'Grade Report'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Language</label>
        <select className="input-field w-full" value={lang} onChange={(e) => setLang(e.target.value)}>
          {['English', 'Arabic', 'French'].map((l) => <option key={l} value={l}>{l}</option>)}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button variant="ghost" onClick={onClose}>Cancel</Button>
        <Button onClick={onClose} leftIcon={<Download className="w-4 h-4" />}>Generate PDF</Button>
      </div>
    </div>
  );
}

export default function AdminCertificatesPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'requests' | 'templates'>('requests');
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [requests, setRequests] = useState<CertificateRequest[]>(MOCK_REQUESTS);

  const requestColumns: Column<CertificateRequest>[] = [
    { key: 'student', header: 'Student', render: (r) => <span className="font-medium">{r.student}</span> },
    { key: 'class', header: 'Class', render: (r) => <Badge variant="secondary">{r.class}</Badge> },
    { key: 'type', header: 'Certificate Type', render: (r) => <span className="text-sm">{r.type}</span> },
    { key: 'requestDate', header: 'Requested', render: (r) => <span className="text-sm text-muted">{formatDate(r.requestDate)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_CONFIG[r.status].variant}>{STATUS_CONFIG[r.status].label}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          {r.status === 'PENDING' && (
            <Button size="sm" onClick={() => setRequests((prev) => prev.map((req) => req.id === r.id ? { ...req, status: 'PROCESSING' as CertStatus } : req))}>
              Process
            </Button>
          )}
          {r.status === 'PROCESSING' && (
            <Button size="sm" onClick={() => setRequests((prev) => prev.map((req) => req.id === r.id ? { ...req, status: 'READY' as CertStatus, issuedDate: new Date().toISOString().slice(0, 10) } : req))}>
              Mark Ready
            </Button>
          )}
          {r.status === 'READY' && (
            <Button size="sm" variant="ghost" leftIcon={<Download className="w-3 h-3" />}>
              Download
            </Button>
          )}
        </div>
      ),
      className: 'text-right',
    },
  ];

  const templateColumns: Column<CertificateTemplate>[] = [
    {
      key: 'name',
      header: 'Template',
      render: (r) => (
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-accent" />
          <span className="font-medium">{r.name}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Type', render: (r) => <span className="text-sm">{r.type}</span> },
    { key: 'language', header: 'Language', render: (r) => <Badge variant="secondary">{r.language}</Badge> },
    { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'muted'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    { key: 'lastUsed', header: 'Last Used', render: (r) => <span className="text-sm text-muted">{formatDate(r.lastUsed)}</span> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          <Button size="sm" variant="ghost" leftIcon={<Eye className="w-3 h-3" />}>Preview</Button>
          <Button size="sm" variant="ghost">Edit</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Certificates & Documents">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Requests', value: requests.length },
          { label: 'Ready', value: requests.filter((r) => r.status === 'READY').length },
          { label: 'Processing', value: requests.filter((r) => r.status === 'PROCESSING').length },
          { label: 'Pending', value: requests.filter((r) => r.status === 'PENDING').length },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex border-b border-border flex-1">
          {(['requests', 'templates'] as const).map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)}
              className={`px-5 py-2.5 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${activeTab === tab ? 'border-accent text-accent' : 'border-transparent text-muted hover:text-app-text'}`}>
              {tab === 'requests' ? 'Document Requests' : 'Templates'}
            </button>
          ))}
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsGenerateOpen(true)} className="ml-4 shrink-0">
          Generate Certificate
        </Button>
      </div>

      {activeTab === 'requests' && (
        <DataTable columns={requestColumns} data={requests} keyExtractor={(r) => r.id} emptyMessage="No certificate requests." />
      )}
      {activeTab === 'templates' && (
        <DataTable columns={templateColumns} data={MOCK_TEMPLATES} keyExtractor={(r) => r.id} emptyMessage="No templates found." />
      )}

      <Modal isOpen={isGenerateOpen} onClose={() => setIsGenerateOpen(false)} title="Generate Certificate" size="md">
        <GenerateCertificateModal onClose={() => setIsGenerateOpen(false)} />
      </Modal>
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { Search, Download, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { formatDate } from '@/lib/utils';

type DocStatus = 'PENDING' | 'PROCESSING' | 'READY' | 'DELIVERED';

interface DocRequest {
  id: string;
  student: string;
  class: string;
  type: string;
  language: string;
  requestedBy: 'STUDENT' | 'PARENT';
  requestDate: string;
  status: DocStatus;
}

const MOCK_DOCS: DocRequest[] = [
  { id: '1', student: 'Ahmed Hassan', class: '3B', type: 'Registration Certificate', language: 'English', requestedBy: 'PARENT', requestDate: '2024-03-17', status: 'PENDING' },
  { id: '2', student: 'Sara Ali', class: '3B', type: 'Attendance Certificate', language: 'Arabic', requestedBy: 'STUDENT', requestDate: '2024-03-16', status: 'PROCESSING' },
  { id: '3', student: 'Mohamed Saad', class: '3A', type: 'Completion Certificate', language: 'English', requestedBy: 'PARENT', requestDate: '2024-03-15', status: 'READY' },
  { id: '4', student: 'Fatima Omar', class: '3A', type: 'Grade Report', language: 'French', requestedBy: 'STUDENT', requestDate: '2024-03-14', status: 'DELIVERED' },
  { id: '5', student: 'Youssef Malik', class: '2A', type: 'Registration Certificate', language: 'Arabic', requestedBy: 'PARENT', requestDate: '2024-03-13', status: 'PENDING' },
  { id: '6', student: 'Nour Hassan', class: '2A', type: 'Good Conduct Certificate', language: 'English', requestedBy: 'PARENT', requestDate: '2024-03-12', status: 'READY' },
];

const STATUS_CONFIG: Record<DocStatus, { variant: 'warning' | 'secondary' | 'success' | 'muted'; label: string }> = {
  PENDING: { variant: 'warning', label: 'Pending' },
  PROCESSING: { variant: 'secondary', label: 'Processing' },
  READY: { variant: 'success', label: 'Ready' },
  DELIVERED: { variant: 'muted', label: 'Delivered' },
};

const NEXT_STATUS: Record<DocStatus, DocStatus | null> = {
  PENDING: 'PROCESSING', PROCESSING: 'READY', READY: 'DELIVERED', DELIVERED: null,
};

export default function AssistantDocumentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [docs, setDocs] = useState<DocRequest[]>(MOCK_DOCS);

  const filtered = docs.filter((d) => {
    const matchSearch = !search || d.student.toLowerCase().includes(search.toLowerCase()) || d.type.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  function advance(id: string) {
    setDocs((prev) => prev.map((d) => {
      if (d.id !== id) return d;
      const next = NEXT_STATUS[d.status];
      return next ? { ...d, status: next } : d;
    }));
  }

  const columns: Column<DocRequest>[] = [
    { key: 'student', header: 'Student', render: (r) => <span className="font-medium">{r.student}</span> },
    { key: 'class', header: 'Class', render: (r) => <Badge variant="secondary">{r.class}</Badge> },
    {
      key: 'type',
      header: 'Document Type',
      render: (r) => (
        <div className="flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5 text-muted" />
          <span className="text-sm">{r.type}</span>
        </div>
      ),
    },
    { key: 'language', header: 'Language', render: (r) => <span className="text-sm text-muted">{r.language}</span> },
    { key: 'requestedBy', header: 'Requested By', render: (r) => <Badge variant={r.requestedBy === 'PARENT' ? 'secondary' : 'muted'}>{r.requestedBy}</Badge> },
    { key: 'requestDate', header: 'Date', sortable: true, render: (r) => <span className="text-sm text-muted">{formatDate(r.requestDate)}</span> },
    { key: 'status', header: 'Status', render: (r) => <Badge variant={STATUS_CONFIG[r.status].variant}>{STATUS_CONFIG[r.status].label}</Badge> },
    {
      key: 'actions',
      header: '',
      render: (r) => (
        <div className="flex items-center gap-2 justify-end">
          {NEXT_STATUS[r.status] && (
            <Button size="sm" onClick={() => advance(r.id)}>
              {r.status === 'PENDING' ? 'Process' : r.status === 'PROCESSING' ? 'Mark Ready' : 'Mark Delivered'}
            </Button>
          )}
          {r.status === 'READY' && (
            <Button size="sm" variant="ghost" leftIcon={<Download className="w-3 h-3" />}>PDF</Button>
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
          { label: 'Total', value: docs.length },
          { label: 'Pending', value: docs.filter((d) => d.status === 'PENDING').length },
          { label: 'Processing', value: docs.filter((d) => d.status === 'PROCESSING').length },
          { label: 'Ready', value: docs.filter((d) => d.status === 'READY').length },
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
            <input type="text" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-52" />
          </div>
          <Select
            options={[{ value: '', label: 'All Status' }, { value: 'PENDING', label: 'Pending' }, { value: 'PROCESSING', label: 'Processing' }, { value: 'READY', label: 'Ready' }, { value: 'DELIVERED', label: 'Delivered' }]}
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-36"
          />
        </div>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage="No document requests found."
      />
    </DashboardLayout>
  );
}

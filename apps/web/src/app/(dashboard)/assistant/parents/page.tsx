'use client';

import { useState } from 'react';
import { Search, Mail, Phone, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';

interface Parent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  children: { name: string; class: string }[];
  isActive: boolean;
}

const MOCK_PARENTS: Parent[] = [
  { id: '1', firstName: 'Khalid', lastName: 'Hassan', email: 'khalid@email.com', phone: '+1-555-1001', children: [{ name: 'Ahmed Hassan', class: '3B' }], isActive: true },
  { id: '2', firstName: 'Rana', lastName: 'Ali', email: 'rana@email.com', phone: '+1-555-1002', children: [{ name: 'Sara Ali', class: '3B' }], isActive: true },
  { id: '3', firstName: 'Tarek', lastName: 'Saad', email: 'tarek@email.com', phone: '+1-555-1003', children: [{ name: 'Mohamed Saad', class: '3A' }], isActive: true },
  { id: '4', firstName: 'Heba', lastName: 'Omar', email: 'heba@email.com', phone: '+1-555-1004', children: [{ name: 'Fatima Omar', class: '3A' }, { name: 'Karim Omar', class: '2A' }], isActive: true },
  { id: '5', firstName: 'Sameh', lastName: 'Malik', email: 'sameh@email.com', phone: '+1-555-1005', children: [{ name: 'Youssef Malik', class: '2A' }], isActive: false },
];

export default function AssistantParentsPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');

  const filtered = MOCK_PARENTS.filter((p) => !search ||
    `${p.firstName} ${p.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
    p.email.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<Parent>[] = [
    {
      key: 'name',
      header: 'Parent',
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
    { key: 'phone', header: 'Phone', render: (r) => <span className="text-sm text-muted flex items-center gap-1"><Phone className="w-3 h-3" />{r.phone}</span> },
    {
      key: 'children',
      header: 'Children',
      render: (r) => (
        <div className="space-y-0.5">
          {r.children.map((c) => (
            <div key={c.name} className="flex items-center gap-1.5">
              <span className="text-sm">{c.name}</span>
              <Badge variant="secondary">{c.class}</Badge>
            </div>
          ))}
        </div>
      ),
    },
    { key: 'isActive', header: 'Status', render: (r) => <Badge variant={r.isActive ? 'success' : 'muted'}>{r.isActive ? 'Active' : 'Inactive'}</Badge> },
    {
      key: 'actions',
      header: '',
      render: () => (
        <div className="flex gap-2 justify-end">
          <Button variant="ghost" size="sm">Contact</Button>
          <Button variant="ghost" size="sm">View</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  function handleExport() {
    const csv = ['Name,Email,Phone,Children,Status',
      ...filtered.map((p) => `${p.firstName} ${p.lastName},${p.email},${p.phone},"${p.children.map((c) => `${c.name} (${c.class})`).join('; ')}",${p.isActive ? 'Active' : 'Inactive'}`)
    ].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'parents.csv'; a.click();
    URL.revokeObjectURL(url);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Parents">
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[{ label: 'Total Parents', value: MOCK_PARENTS.length }, { label: 'Active', value: MOCK_PARENTS.filter((p) => p.isActive).length }, { label: 'Children', value: MOCK_PARENTS.reduce((s, p) => s + p.children.length, 0) }].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{s.value}</p>
            <p className="text-sm text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" placeholder="Search parents…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-64" />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>Export CSV</Button>
      </div>

      <DataTable columns={columns} data={filtered} keyExtractor={(r) => r.id} emptyMessage="No parents found." />
    </DashboardLayout>
  );
}

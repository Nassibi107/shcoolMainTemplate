'use client';

import { useState } from 'react';
import { Download, Search } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { exportGradesToExcel } from '@/lib/excel';

interface GradeRecord {
  id: string;
  student: string;
  class: string;
  subject: string;
  score: number;
  maxScore: number;
  term: string;
  teacher: string;
  date: string;
}

const MOCK_GRADES: GradeRecord[] = [
  { id: '1', student: 'Ahmed Hassan', class: '3B', subject: 'Mathematics', score: 87, maxScore: 100, term: 'T2', teacher: 'James Johnson', date: '2024-03-10' },
  { id: '2', student: 'Sara Ali', class: '3B', subject: 'Physics', score: 92, maxScore: 100, term: 'T2', teacher: 'Wei Chen', date: '2024-03-10' },
  { id: '3', student: 'Mohamed Saad', class: '3A', subject: 'Mathematics', score: 74, maxScore: 100, term: 'T2', teacher: 'James Johnson', date: '2024-03-11' },
  { id: '4', student: 'Fatima Omar', class: '3A', subject: 'English', score: 95, maxScore: 100, term: 'T2', teacher: 'Sarah Miller', date: '2024-03-11' },
  { id: '5', student: 'Youssef Malik', class: '2A', subject: 'Chemistry', score: 68, maxScore: 100, term: 'T2', teacher: 'Priya Sharma', date: '2024-03-12' },
  { id: '6', student: 'Nour Hassan', class: '2A', subject: 'Biology', score: 81, maxScore: 100, term: 'T2', teacher: 'Priya Sharma', date: '2024-03-12' },
  { id: '7', student: 'Karim Ali', class: '4A', subject: 'History', score: 78, maxScore: 100, term: 'T2', teacher: 'Omar Hassan', date: '2024-03-13' },
  { id: '8', student: 'Lena Riad', class: '4A', subject: 'Mathematics', score: 91, maxScore: 100, term: 'T2', teacher: 'James Johnson', date: '2024-03-13' },
];

function gradeFromPct(pct: number): { letter: string; variant: 'success' | 'secondary' | 'warning' | 'danger' } {
  if (pct >= 90) return { letter: 'A', variant: 'success' };
  if (pct >= 80) return { letter: 'B', variant: 'secondary' };
  if (pct >= 70) return { letter: 'C', variant: 'warning' };
  if (pct >= 60) return { letter: 'D', variant: 'warning' };
  return { letter: 'F', variant: 'danger' };
}

export default function AdminGradesPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [search, setSearch] = useState('');
  const [classFilter, setClassFilter] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [termFilter, setTermFilter] = useState('');

  const filtered = MOCK_GRADES.filter((g) => {
    const matchSearch = !search || g.student.toLowerCase().includes(search.toLowerCase());
    const matchClass = !classFilter || g.class === classFilter;
    const matchSubject = !subjectFilter || g.subject === subjectFilter;
    const matchTerm = !termFilter || g.term === termFilter;
    return matchSearch && matchClass && matchSubject && matchTerm;
  });

  const avg = filtered.length > 0 ? Math.round(filtered.reduce((s, g) => s + (g.score / g.maxScore) * 100, 0) / filtered.length) : 0;
  const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  filtered.forEach((g) => {
    const pct = (g.score / g.maxScore) * 100;
    const { letter } = gradeFromPct(pct);
    distribution[letter as keyof typeof distribution]++;
  });

  const columns: Column<GradeRecord>[] = [
    {
      key: 'student',
      header: 'Student',
      sortable: true,
      render: (row) => <span className="font-medium text-app-text">{row.student}</span>,
    },
    {
      key: 'class',
      header: 'Class',
      render: (row) => <Badge variant="secondary">{row.class}</Badge>,
    },
    {
      key: 'subject',
      header: 'Subject',
      sortable: true,
      render: (row) => <span className="text-sm">{row.subject}</span>,
    },
    {
      key: 'score',
      header: 'Score',
      sortable: true,
      render: (row) => (
        <div className="flex items-center gap-2">
          <span className="font-mono font-semibold">{row.score}<span className="text-muted font-normal">/{row.maxScore}</span></span>
          <div className="w-16 h-1.5 bg-border rounded-full">
            <div className="h-1.5 rounded-full bg-accent" style={{ width: `${(row.score / row.maxScore) * 100}%` }} />
          </div>
        </div>
      ),
    },
    {
      key: 'grade',
      header: 'Grade',
      render: (row) => {
        const pct = Math.round((row.score / row.maxScore) * 100);
        const { letter, variant } = gradeFromPct(pct);
        return (
          <div className="flex items-center gap-2">
            <Badge variant={variant}>{letter}</Badge>
            <span className="text-xs text-muted">{pct}%</span>
          </div>
        );
      },
    },
    {
      key: 'teacher',
      header: 'Teacher',
      render: (row) => <span className="text-sm text-muted">{row.teacher}</span>,
    },
    {
      key: 'term',
      header: 'Term',
      render: (row) => <span className="text-xs bg-surface border border-border rounded px-2 py-0.5">{row.term}</span>,
    },
  ];

  function handleExport() {
    exportGradesToExcel(filtered.map((g) => {
      const pct = Math.round((g.score / g.maxScore) * 100);
      const { letter } = gradeFromPct(pct);
      return { student: g.student, class: g.class, subject: g.subject, score: g.score, maxScore: g.maxScore, percentage: `${pct}%`, grade: letter, teacher: g.teacher, term: g.term };
    }));
    toast.success(`Exported ${filtered.length} grade records to Excel`);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Grades">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="bg-card rounded-card shadow-card p-4">
          <p className="text-2xl font-bold font-heading text-primary">{avg}%</p>
          <p className="text-sm text-muted mt-0.5">Class Average</p>
        </div>
        {Object.entries(distribution).map(([letter, count]) => (
          <div key={letter} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{count}</p>
            <p className="text-sm text-muted mt-0.5">Grade {letter}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
            <input type="text" placeholder="Search student…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-52" />
          </div>
          <Select options={[{ value: '', label: 'All Classes' }, { value: '2A', label: '2A' }, { value: '3A', label: '3A' }, { value: '3B', label: '3B' }, { value: '4A', label: '4A' }]} value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="w-32" />
          <Select options={[{ value: '', label: 'All Subjects' }, { value: 'Mathematics', label: 'Mathematics' }, { value: 'Physics', label: 'Physics' }, { value: 'English', label: 'English' }, { value: 'Chemistry', label: 'Chemistry' }, { value: 'Biology', label: 'Biology' }, { value: 'History', label: 'History' }]} value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)} className="w-40" />
          <Select options={[{ value: '', label: 'All Terms' }, { value: 'T1', label: 'Term 1' }, { value: 'T2', label: 'Term 2' }, { value: 'T3', label: 'Term 3' }]} value={termFilter} onChange={(e) => setTermFilter(e.target.value)} className="w-32" />
        </div>
        <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
          Export CSV
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage="No grade records match your filters."
      />
    </DashboardLayout>
  );
}

'use client';

import { useState } from 'react';
import { Download, FileBarChart, Users, CreditCard, CalendarCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend,
} from 'recharts';

const MONTHLY_REVENUE = [
  { month: 'Sep', revenue: 42000, target: 40000 },
  { month: 'Oct', revenue: 44500, target: 42000 },
  { month: 'Nov', revenue: 41200, target: 42000 },
  { month: 'Dec', revenue: 38000, target: 42000 },
  { month: 'Jan', revenue: 45800, target: 44000 },
  { month: 'Feb', revenue: 47200, target: 44000 },
  { month: 'Mar', revenue: 49100, target: 46000 },
];

const ATTENDANCE_TREND = [
  { week: 'W1', rate: 94.2 }, { week: 'W2', rate: 92.8 }, { week: 'W3', rate: 95.1 },
  { week: 'W4', rate: 93.5 }, { week: 'W5', rate: 91.2 }, { week: 'W6', rate: 96.0 },
  { week: 'W7', rate: 94.8 }, { week: 'W8', rate: 93.1 },
];

const GRADE_DISTRIBUTION = [
  { name: 'A (90–100%)', value: 38, color: '#22c55e' },
  { name: 'B (80–89%)', value: 52, color: '#3b82f6' },
  { name: 'C (70–79%)', value: 29, color: '#f59e0b' },
  { name: 'D (60–69%)', value: 12, color: '#f97316' },
  { name: 'F (< 60%)', value: 5, color: '#ef4444' },
];

const CLASS_ATTENDANCE = [
  { class: '1A', rate: 96 }, { class: '1B', rate: 94 }, { class: '2A', rate: 91 },
  { class: '3A', rate: 93 }, { class: '3B', rate: 97 }, { class: '4A', rate: 89 },
];

const REPORTS_LIST = [
  { id: '1', name: 'Monthly Attendance Report', description: 'Full attendance breakdown by class and student', type: 'Attendance', icon: CalendarCheck },
  { id: '2', name: 'Financial Summary Report', description: 'Fee collection, outstanding payments, salary summary', type: 'Financial', icon: CreditCard },
  { id: '3', name: 'Academic Performance Report', description: 'Grade distribution and subject performance analysis', type: 'Academic', icon: FileBarChart },
  { id: '4', name: 'Student Enrollment Report', description: 'Enrollment trends and demographics overview', type: 'Students', icon: Users },
];

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('T2');
  const [selectedClass, setSelectedClass] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);

  function handleGenerate(reportId: string, format: 'pdf' | 'excel') {
    setGenerating(reportId);
    setTimeout(() => {
      setGenerating(null);
      const filename = `report-${reportId}-${new Date().toISOString().slice(0, 10)}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      const blob = new Blob([`Mock ${format.toUpperCase()} report content`], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    }, 1200);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Reports & Analytics">
      {/* Filters */}
      <div className="flex items-center gap-3 mb-6">
        <Select options={[{ value: 'T1', label: 'Term 1' }, { value: 'T2', label: 'Term 2' }, { value: 'T3', label: 'Term 3' }]} value={selectedTerm} onChange={(e) => setSelectedTerm(e.target.value)} className="w-32" />
        <Select options={[{ value: '', label: 'All Classes' }, { value: '1A', label: '1A' }, { value: '2A', label: '2A' }, { value: '3A', label: '3A' }, { value: '3B', label: '3B' }, { value: '4A', label: '4A' }]} value={selectedClass} onChange={(e) => setSelectedClass(e.target.value)} className="w-36" />
      </div>

      {/* Quick Reports */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
        {REPORTS_LIST.map((report) => {
          const Icon = report.icon;
          return (
            <div key={report.id} className="bg-card rounded-card shadow-card p-5 flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5 text-accent" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-app-text">{report.name}</p>
                <p className="text-xs text-muted mt-0.5">{report.description}</p>
                <Badge variant="secondary" className="mt-2">{report.type}</Badge>
              </div>
              <div className="flex flex-col gap-2 shrink-0">
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download className="w-3 h-3" />}
                  onClick={() => handleGenerate(report.id, 'pdf')}
                  disabled={generating === report.id}
                >
                  {generating === report.id ? 'Generating…' : 'PDF'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download className="w-3 h-3" />}
                  onClick={() => handleGenerate(report.id, 'excel')}
                  disabled={generating === report.id}
                >
                  Excel
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Revenue */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Revenue vs Target</CardTitle>
            <Badge variant="success">+8.2% vs last year</Badge>
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHLY_REVENUE} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="var(--color-border)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Attendance Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Attendance Rate Trend</CardTitle>
            <Badge variant="secondary">Weekly avg</Badge>
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={ATTENDANCE_TREND} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis domain={[88, 98]} tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance']} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Line type="monotone" dataKey="rate" stroke="var(--color-accent)" strokeWidth={2.5} dot={{ r: 3, fill: 'var(--color-accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade distribution */}
        <Card>
          <CardHeader><CardTitle>Grade Distribution</CardTitle></CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={GRADE_DISTRIBUTION} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {GRADE_DISTRIBUTION.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                </Pie>
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Legend iconType="circle" iconSize={10} wrapperStyle={{ fontSize: 11 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Attendance by class */}
        <Card>
          <CardHeader><CardTitle>Attendance Rate by Class</CardTitle></CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CLASS_ATTENDANCE} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="class" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip formatter={(v: number) => [`${v}%`, 'Attendance']} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="rate" fill="var(--color-secondary)" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

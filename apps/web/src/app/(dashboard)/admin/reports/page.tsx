'use client';

import { useState } from 'react';
import { Download, FileBarChart, Users, CreditCard, CalendarCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';
import { useMonthlyRevenue, useAttendanceByClass, useGradeDistribution } from '@/hooks/useDashboardStats';
import { formatCurrency } from '@/lib/utils';
import api from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from 'recharts';

const REPORTS_LIST = [
  { id: 'summary', key: '1', name: 'Summary Report', description: 'Dashboard stats, attendance by class, monthly revenue', type: 'Summary', icon: FileBarChart },
  { id: 'summary', key: '2', name: 'Financial Summary Report', description: 'Fee collection and revenue overview', type: 'Financial', icon: CreditCard },
  { id: 'summary', key: '3', name: 'Attendance Report', description: 'Attendance breakdown by class', type: 'Attendance', icon: CalendarCheck },
  { id: 'summary', key: '4', name: 'Academic Performance Report', description: 'Grade distribution overview', type: 'Academic', icon: Users },
];

const GRADE_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#f97316', '#ef4444'];

export default function AdminReportsPage() {
  const { user } = useAuth();
  const [selectedTerm, setSelectedTerm] = useState('T2');
  const [selectedClass, setSelectedClass] = useState('');
  const [generating, setGenerating] = useState<string | null>(null);

  const { data: revenueData } = useMonthlyRevenue();
  const { data: attendanceData } = useAttendanceByClass();
  const { data: gradeDist } = useGradeDistribution();

  const monthlyRevenueChart = (revenueData ?? []).map((r) => ({
    month: r.month.slice(-2) === '09' ? 'Sep' : r.month.slice(-2) === '10' ? 'Oct' : r.month.slice(-2) === '11' ? 'Nov' : r.month.slice(-2) === '12' ? 'Dec' : r.month.slice(-2) === '01' ? 'Jan' : r.month.slice(-2) === '02' ? 'Feb' : r.month.slice(-2) === '03' ? 'Mar' : r.month,
    revenue: r.revenue,
    target: r.revenue * 0.95,
  }));

  const gradeDistributionChart = [
    { name: 'A (90–100%)', value: gradeDist?.A ?? 0, color: GRADE_COLORS[0] },
    { name: 'B (80–89%)', value: gradeDist?.B ?? 0, color: GRADE_COLORS[1] },
    { name: 'C (70–79%)', value: gradeDist?.C ?? 0, color: GRADE_COLORS[2] },
    { name: 'D (60–69%)', value: gradeDist?.D ?? 0, color: GRADE_COLORS[3] },
    { name: 'F (< 60%)', value: gradeDist?.F ?? 0, color: GRADE_COLORS[4] },
  ];

  async function handleGenerate(reportId: string, format: 'pdf' | 'excel', loadingKey: string) {
    if (!user) return;
    setGenerating(loadingKey);
    try {
      const res = await api.get(
        `/schools/${user.school.id}/reports/export/${reportId}/${format}`,
        { responseType: 'blob' },
      );
      const mime = format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `report-${reportId}-${new Date().toISOString().slice(0, 10)}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      // ignore - user will see no download
    } finally {
      setGenerating(null);
    }
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
            <div key={report.key} className="bg-card rounded-card shadow-card p-5 flex items-start gap-4">
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
                  onClick={() => handleGenerate(report.id, 'pdf', report.key)}
                  disabled={generating === report.key}
                >
                  {generating === report.key ? 'Generating…' : 'PDF'}
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  leftIcon={<Download className="w-3 h-3" />}
                  onClick={() => handleGenerate(report.id, 'excel', report.key)}
                  disabled={generating === report.key}
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
            <CardTitle>Monthly Revenue</CardTitle>
          </CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyRevenueChart} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={(v: number) => [formatCurrency(v), '']} contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="revenue" name="Revenue" fill="var(--color-accent)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Grade distribution */}
        <Card>
          <CardHeader><CardTitle>Grade Distribution</CardTitle></CardHeader>
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={gradeDistributionChart} cx="50%" cy="50%" innerRadius={55} outerRadius={90} paddingAngle={3} dataKey="value">
                  {gradeDistributionChart.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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
              <BarChart data={attendanceData ?? []} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" horizontal={false} />
                <XAxis type="number" domain={[80, 100]} tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `${v}%`} />
                <YAxis type="category" dataKey="className" tick={{ fontSize: 11, fill: 'var(--color-muted)' }} axisLine={false} tickLine={false} />
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

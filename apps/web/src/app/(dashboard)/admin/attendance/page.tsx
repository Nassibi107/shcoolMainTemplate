'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Download } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { exportAttendanceToExcel } from '@/lib/excel';
import { formatDate } from '@/lib/utils';

type AttendanceStatus = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface DailyRecord {
  studentId: string;
  name: string;
  class: string;
  status: AttendanceStatus;
  note?: string;
}

const MOCK_DAILY: DailyRecord[] = [
  { studentId: '1', name: 'Ahmed Hassan', class: '3B', status: 'PRESENT' },
  { studentId: '2', name: 'Sara Ali', class: '3B', status: 'ABSENT', note: 'No notice' },
  { studentId: '3', name: 'Mohamed Saad', class: '3B', status: 'LATE', note: 'Arrived 15 min late' },
  { studentId: '4', name: 'Fatima Omar', class: '3B', status: 'PRESENT' },
  { studentId: '5', name: 'Youssef Malik', class: '3B', status: 'EXCUSED', note: 'Medical appointment' },
  { studentId: '6', name: 'Nour Hassan', class: '3A', status: 'PRESENT' },
  { studentId: '7', name: 'Karim Ali', class: '3A', status: 'PRESENT' },
  { studentId: '8', name: 'Lena Riad', class: '3A', status: 'ABSENT' },
  { studentId: '9', name: 'Omar Farouk', class: '2A', status: 'PRESENT' },
  { studentId: '10', name: 'Hana Sami', class: '2A', status: 'LATE' },
];

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; variant: 'success' | 'danger' | 'warning' | 'secondary'; dot: string }> = {
  PRESENT: { label: 'Present', variant: 'success', dot: 'bg-success' },
  ABSENT: { label: 'Absent', variant: 'danger', dot: 'bg-danger' },
  LATE: { label: 'Late', variant: 'warning', dot: 'bg-warning' },
  EXCUSED: { label: 'Excused', variant: 'secondary', dot: 'bg-muted' },
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function buildHeatmapData(year: number, month: number): { day: number; rate: number }[] {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  return Array.from({ length: daysInMonth }, (_, i) => ({
    day: i + 1,
    rate: Math.random() > 0.3 ? Math.round(85 + Math.random() * 15) : 0,
  }));
}

function rateToColor(rate: number): string {
  if (rate === 0) return 'bg-surface border border-border';
  if (rate >= 95) return 'bg-success';
  if (rate >= 90) return 'bg-success/70';
  if (rate >= 85) return 'bg-warning/70';
  if (rate >= 75) return 'bg-warning';
  return 'bg-danger/70';
}

export default function AdminAttendancePage() {
  const { user } = useAuth();
  const toast = useToast();
  const today = new Date();
  const [heatYear] = useState(today.getFullYear());
  const [heatMonth, setHeatMonth] = useState(today.getMonth());
  const [classFilter, setClassFilter] = useState('');
  const [records, setRecords] = useState<DailyRecord[]>(MOCK_DAILY);

  const heatData = buildHeatmapData(heatYear, heatMonth);
  const firstDayOfMonth = new Date(heatYear, heatMonth, 1).getDay();

  const filteredRecords = classFilter
    ? records.filter((r) => r.class === classFilter)
    : records;

  const summary = {
    present: filteredRecords.filter((r) => r.status === 'PRESENT').length,
    absent: filteredRecords.filter((r) => r.status === 'ABSENT').length,
    late: filteredRecords.filter((r) => r.status === 'LATE').length,
    excused: filteredRecords.filter((r) => r.status === 'EXCUSED').length,
  };

  function handleStatusChange(studentId: string, status: AttendanceStatus) {
    setRecords((prev) => prev.map((r) => r.studentId === studentId ? { ...r, status } : r));
  }

  function handleExport() {
    exportAttendanceToExcel(
      filteredRecords.map((r) => ({ name: r.name, class: r.class, status: r.status, note: r.note ?? '' })),
      today.toISOString().slice(0, 10)
    );
    toast.success(`Exported ${filteredRecords.length} attendance records to Excel`);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Attendance">
      {/* Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Present', value: summary.present, color: 'text-success' },
          { label: 'Absent', value: summary.absent, color: 'text-danger' },
          { label: 'Late', value: summary.late, color: 'text-warning' },
          { label: 'Excused', value: summary.excused, color: 'text-muted' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label} today</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Heatmap */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Monthly Overview</CardTitle>
            <div className="flex items-center gap-1">
              <button onClick={() => setHeatMonth((m) => Math.max(0, m - 1))} className="p-1 rounded hover:bg-surface">
                <ChevronLeft className="w-4 h-4 text-muted" />
              </button>
              <span className="text-sm font-medium w-8 text-center">{MONTHS[heatMonth]}</span>
              <button onClick={() => setHeatMonth((m) => Math.min(11, m + 1))} className="p-1 rounded hover:bg-surface">
                <ChevronRight className="w-4 h-4 text-muted" />
              </button>
            </div>
          </CardHeader>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs text-muted font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDayOfMonth }, (_, i) => <div key={`empty-${i}`} />)}
              {heatData.map(({ day, rate }) => (
                <div
                  key={day}
                  className={`aspect-square rounded-sm flex items-center justify-center text-xs font-medium cursor-default ${rateToColor(rate)} ${rate > 0 ? 'text-white' : 'text-muted'}`}
                  title={rate > 0 ? `${MONTHS[heatMonth]} ${day}: ${rate}% present` : `${MONTHS[heatMonth]} ${day}: No school`}
                >
                  {day}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-3 mt-4 flex-wrap">
              {[
                { label: '≥ 95%', color: 'bg-success' },
                { label: '85–94%', color: 'bg-success/70' },
                { label: '75–84%', color: 'bg-warning' },
                { label: '< 75%', color: 'bg-danger/70' },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-1">
                  <div className={`w-3 h-3 rounded-sm ${l.color}`} />
                  <span className="text-xs text-muted">{l.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Daily Register */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <div>
              <CardTitle>Daily Register</CardTitle>
              <p className="text-xs text-muted mt-0.5">{formatDate(today)}</p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                options={[
                  { value: '', label: 'All Classes' },
                  { value: '3B', label: 'Class 3B' },
                  { value: '3A', label: 'Class 3A' },
                  { value: '2A', label: 'Class 2A' },
                ]}
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                className="w-36"
              />
              <Button variant="ghost" size="sm" leftIcon={<Download className="w-4 h-4" />} onClick={handleExport}>
                Export
              </Button>
            </div>
          </CardHeader>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 text-muted font-medium">Student</th>
                  <th className="text-left py-2 px-2 text-muted font-medium">Class</th>
                  <th className="text-center py-2 px-2 text-muted font-medium">Status</th>
                  <th className="text-left py-2 px-2 text-muted font-medium">Note</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.studentId} className="border-b border-border/40 hover:bg-surface/60">
                    <td className="py-2.5 px-4 font-medium">{record.name}</td>
                    <td className="py-2.5 px-2">
                      <Badge variant="secondary">{record.class}</Badge>
                    </td>
                    <td className="py-2.5 px-2 text-center">
                      <select
                        value={record.status}
                        onChange={(e) => handleStatusChange(record.studentId, e.target.value as AttendanceStatus)}
                        className={`text-xs font-medium rounded-full px-2 py-0.5 border-0 cursor-pointer focus:outline-none focus:ring-1 focus:ring-accent ${
                          record.status === 'PRESENT' ? 'bg-success/10 text-success' :
                          record.status === 'ABSENT' ? 'bg-danger/10 text-danger' :
                          record.status === 'LATE' ? 'bg-warning/10 text-warning' :
                          'bg-surface text-muted'
                        }`}
                      >
                        <option value="PRESENT">Present</option>
                        <option value="ABSENT">Absent</option>
                        <option value="LATE">Late</option>
                        <option value="EXCUSED">Excused</option>
                      </select>
                    </td>
                    <td className="py-2.5 px-2 text-xs text-muted">{record.note ?? '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Absence Alerts */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Absence Alerts</CardTitle>
          <Badge variant="danger">{records.filter((r) => r.status === 'ABSENT').length} alerts</Badge>
        </CardHeader>
        <div className="space-y-3">
          {records.filter((r) => r.status === 'ABSENT').map((r) => (
            <div key={r.studentId} className="flex items-center justify-between p-3 bg-danger/5 border border-danger/20 rounded-lg">
              <div>
                <p className="font-medium text-sm">{r.name} <span className="text-muted font-normal">· {r.class}</span></p>
                <p className="text-xs text-muted mt-0.5">{r.note ?? 'No reason provided'}</p>
              </div>
              <Button size="sm" variant="ghost">Notify Parent</Button>
            </div>
          ))}
          {records.filter((r) => r.status === 'ABSENT').length === 0 && (
            <p className="text-sm text-muted text-center py-4">No absences today.</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

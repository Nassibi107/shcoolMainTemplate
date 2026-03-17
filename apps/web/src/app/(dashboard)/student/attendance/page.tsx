'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

type Status = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface AttendanceDay {
  date: string;
  status: Status;
  subject?: string;
}

const STATUS_CONFIG: Record<Status, { label: string; dot: string; badge: 'success' | 'danger' | 'warning' | 'secondary' }> = {
  PRESENT: { label: 'Present', dot: 'bg-success', badge: 'success' },
  ABSENT: { label: 'Absent', dot: 'bg-danger', badge: 'danger' },
  LATE: { label: 'Late', dot: 'bg-warning', badge: 'warning' },
  EXCUSED: { label: 'Excused', dot: 'bg-muted', badge: 'secondary' },
};

function generateAttendance(): AttendanceDay[] {
  const records: AttendanceDay[] = [];
  const start = new Date('2024-09-01');
  const end = new Date('2024-03-17');
  const cur = new Date(start);
  while (cur <= end) {
    const day = cur.getDay();
    if (day !== 0 && day !== 6) {
      const rand = Math.random();
      const status: Status = rand < 0.88 ? 'PRESENT' : rand < 0.93 ? 'LATE' : rand < 0.97 ? 'EXCUSED' : 'ABSENT';
      records.push({ date: cur.toISOString().slice(0, 10), status });
    }
    cur.setDate(cur.getDate() + 1);
  }
  return records;
}

const ALL_RECORDS = generateAttendance();
const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function StudentAttendancePage() {
  const { user, loading } = useAuth();
  const today = new Date();
  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());

  const total = ALL_RECORDS.length;
  const present = ALL_RECORDS.filter((r) => r.status === 'PRESENT').length;
  const absent = ALL_RECORDS.filter((r) => r.status === 'ABSENT').length;
  const late = ALL_RECORDS.filter((r) => r.status === 'LATE').length;
  const excused = ALL_RECORDS.filter((r) => r.status === 'EXCUSED').length;
  const rate = total > 0 ? ((present + late) / total * 100).toFixed(1) : '0';

  const monthStr = `${viewYear}-${String(viewMonth + 1).padStart(2, '0')}`;
  const monthRecords = ALL_RECORDS.filter((r) => r.date.startsWith(monthStr));
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstDay = new Date(viewYear, viewMonth, 1).getDay();

  function getStatusForDay(day: number): Status | null {
    const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
    return monthRecords.find((r) => r.date === dateStr)?.status ?? null;
  }

  function dayColor(status: Status | null): string {
    if (!status) return 'text-muted/30';
    return { PRESENT: 'bg-success text-white', ABSENT: 'bg-danger text-white', LATE: 'bg-warning text-white', EXCUSED: 'bg-surface text-muted border border-border' }[status];
  }

  function prevMonth() {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  }
  function nextMonth() {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  }

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Attendance">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 mb-6">
        <div className="col-span-2 sm:col-span-1 bg-card rounded-card shadow-card p-4">
          <p className="text-3xl font-bold font-heading text-accent">{rate}%</p>
          <p className="text-sm text-muted mt-0.5">Overall Rate</p>
        </div>
        {[
          { label: 'Present', value: present, color: 'text-success' },
          { label: 'Late', value: late, color: 'text-warning' },
          { label: 'Excused', value: excused, color: 'text-muted' },
          { label: 'Absent', value: absent, color: 'text-danger' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="xl:col-span-1">
          <CardHeader>
            <CardTitle>Monthly View</CardTitle>
            <div className="flex items-center gap-1">
              <button onClick={prevMonth} className="p-1 rounded hover:bg-surface"><ChevronLeft className="w-4 h-4 text-muted" /></button>
              <span className="text-sm font-medium w-20 text-center">{MONTHS[viewMonth]} {viewYear}</span>
              <button onClick={nextMonth} className="p-1 rounded hover:bg-surface"><ChevronRight className="w-4 h-4 text-muted" /></button>
            </div>
          </CardHeader>
          <div className="p-4">
            <div className="grid grid-cols-7 gap-1 mb-2">
              {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                <div key={i} className="text-center text-xs text-muted font-medium">{d}</div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: firstDay }, (_, i) => <div key={`e-${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const status = getStatusForDay(day);
                return (
                  <div
                    key={day}
                    title={status ?? 'No school'}
                    className={`aspect-square rounded-sm flex items-center justify-center text-xs font-medium ${dayColor(status)}`}
                  >
                    {day}
                  </div>
                );
              })}
            </div>
            <div className="flex flex-wrap gap-2 mt-4">
              {Object.entries(STATUS_CONFIG).map(([s, c]) => (
                <div key={s} className="flex items-center gap-1">
                  <div className={`w-2.5 h-2.5 rounded-sm ${c.dot}`} />
                  <span className="text-[11px] text-muted">{c.label}</span>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Recent records */}
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle>Recent Records</CardTitle>
            <span className="text-xs text-muted">{MONTHS[viewMonth]} {viewYear} · {monthRecords.length} school days</span>
          </CardHeader>
          <div className="overflow-y-auto max-h-96">
            <table className="w-full text-sm">
              <thead className="sticky top-0 bg-card">
                <tr className="border-b border-border">
                  <th className="text-left py-2 px-4 text-muted font-medium">Date</th>
                  <th className="text-left py-2 px-2 text-muted font-medium">Day</th>
                  <th className="text-center py-2 px-2 text-muted font-medium">Status</th>
                </tr>
              </thead>
              <tbody>
                {[...monthRecords].reverse().map((r) => {
                  const d = new Date(r.date);
                  return (
                    <tr key={r.date} className="border-b border-border/40 hover:bg-surface/60">
                      <td className="py-2.5 px-4 font-mono text-sm">{r.date}</td>
                      <td className="py-2.5 px-2 text-muted text-sm">{d.toLocaleDateString('en-US', { weekday: 'short' })}</td>
                      <td className="py-2.5 px-2 text-center">
                        <Badge variant={STATUS_CONFIG[r.status].badge}>{STATUS_CONFIG[r.status].label}</Badge>
                      </td>
                    </tr>
                  );
                })}
                {monthRecords.length === 0 && (
                  <tr><td colSpan={3} className="py-8 text-center text-muted text-sm">No records for this month.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

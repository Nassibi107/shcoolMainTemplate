'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

type Status = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

const STATUS_CONFIG: Record<Status, { label: string; badge: 'success' | 'danger' | 'warning' | 'secondary' }> = {
  PRESENT: { label: 'Present', badge: 'success' },
  ABSENT: { label: 'Absent', badge: 'danger' },
  LATE: { label: 'Late', badge: 'warning' },
  EXCUSED: { label: 'Excused', badge: 'secondary' },
};

const RECENT: { date: string; day: string; status: Status; note?: string }[] = [
  { date: 'Mar 17, 2024', day: 'Monday', status: 'PRESENT' },
  { date: 'Mar 14, 2024', day: 'Friday', status: 'PRESENT' },
  { date: 'Mar 13, 2024', day: 'Thursday', status: 'LATE', note: 'Arrived 10 minutes late' },
  { date: 'Mar 12, 2024', day: 'Wednesday', status: 'PRESENT' },
  { date: 'Mar 11, 2024', day: 'Tuesday', status: 'ABSENT', note: 'Medical appointment' },
  { date: 'Mar 10, 2024', day: 'Monday', status: 'EXCUSED', note: 'School trip' },
  { date: 'Mar 07, 2024', day: 'Friday', status: 'PRESENT' },
  { date: 'Mar 06, 2024', day: 'Thursday', status: 'PRESENT' },
  { date: 'Mar 05, 2024', day: 'Wednesday', status: 'PRESENT' },
  { date: 'Mar 04, 2024', day: 'Tuesday', status: 'PRESENT' },
];

export default function ParentAttendancePage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const present = RECENT.filter((r) => r.status === 'PRESENT').length;
  const absent = RECENT.filter((r) => r.status === 'ABSENT').length;
  const late = RECENT.filter((r) => r.status === 'LATE').length;
  const rate = (((present + late) / RECENT.length) * 100).toFixed(0);

  return (
    <DashboardLayout user={user} pageTitle="Child's Attendance">
      <div className="mb-4 px-4 py-3 bg-secondary/5 border border-secondary/20 rounded-card text-sm text-secondary font-medium">
        Viewing: <span className="font-bold">Ahmed Hassan</span> · Class 3B
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Attendance Rate', value: `${rate}%`, color: 'text-accent' },
          { label: 'Present', value: present, color: 'text-success' },
          { label: 'Absent', value: absent, color: 'text-danger' },
          { label: 'Late', value: late, color: 'text-warning' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className={`text-2xl font-bold font-heading ${s.color}`}>{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Attendance — Last 10 Days</CardTitle>
        </CardHeader>
        <div className="divide-y divide-border">
          {RECENT.map((r, i) => (
            <div key={i} className="flex items-start gap-4 py-3">
              <div className="w-20 shrink-0">
                <p className="text-xs font-medium text-muted">{r.day}</p>
                <p className="text-xs text-muted/70">{r.date}</p>
              </div>
              <div className="flex-1">
                {r.note && <p className="text-xs text-muted mt-0.5">{r.note}</p>}
              </div>
              <Badge variant={STATUS_CONFIG[r.status].badge}>{STATUS_CONFIG[r.status].label}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}

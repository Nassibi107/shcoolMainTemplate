'use client';

import { CalendarDays, BookOpen, UserX, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function ParentDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Child Overview">
      <div className="mb-6 p-4 bg-secondary/10 rounded-card border border-secondary/20">
        <p className="text-sm text-secondary font-medium">Monitoring: <span className="font-bold">Ahmed Hassan</span> · Class 3B</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Attendance Rate" value="94.3%" subtitle="this term" icon={CalendarDays} trend={1.2} />
        <KpiCard title="Current Class" value="3B" subtitle="Academic Year 2024-25" icon={BookOpen} />
        <KpiCard title="Absences" value="4" subtitle="this term" icon={UserX} />
        <KpiCard title="Avg. Grade" value="85.2%" subtitle="across all subjects" icon={FileText} trend={3.5} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
          </CardHeader>
          <div className="space-y-2">
            {[
              { date: 'Mon, Mar 17', status: 'PRESENT' },
              { date: 'Tue, Mar 18', status: 'PRESENT' },
              { date: 'Wed, Mar 19', status: 'ABSENT' },
              { date: 'Thu, Mar 20', status: 'PRESENT' },
              { date: 'Fri, Mar 21', status: 'LATE' },
            ].map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/40">
                <span className="text-sm">{a.date}</span>
                <Badge variant={a.status === 'PRESENT' ? 'success' : a.status === 'ABSENT' ? 'danger' : 'warning'}>
                  {a.status}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Document Requests</CardTitle>
            <Button size="sm" variant="ghost">Request</Button>
          </CardHeader>
          <p className="text-sm text-muted">No pending document requests.</p>
        </Card>
      </div>
    </DashboardLayout>
  );
}

'use client';

import { GraduationCap, UserCheck, Users, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

export default function AssistantDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Assistant Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Total Students" value="1,248" subtitle="enrolled" icon={GraduationCap} />
        <KpiCard title="Active Teachers" value="64" subtitle="this year" icon={UserCheck} />
        <KpiCard title="Parents" value="892" subtitle="registered" icon={Users} />
        <KpiCard title="Pending Docs" value="7" subtitle="document requests" icon={FileText} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Document Request Queue</CardTitle>
          </CardHeader>
          <div className="space-y-3">
            {[
              { student: 'Ahmed Hassan', type: 'Registration Certificate', date: 'Mar 17' },
              { student: 'Sara Ali', type: 'Attendance Certificate', date: 'Mar 16' },
              { student: 'Mohamed Saad', type: 'Completion Certificate', date: 'Mar 15' },
            ].map((req, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                <div>
                  <p className="font-medium text-sm">{req.student}</p>
                  <p className="text-xs text-muted">{req.type} · {req.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="warning">Pending</Badge>
                  <Button size="sm">Process</Button>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Add Student', href: '/assistant/students' },
              { label: 'Add Teacher', href: '/assistant/teachers' },
              { label: 'Contact Parent', href: '/assistant/parents' },
              { label: 'View Documents', href: '/assistant/documents' },
            ].map((action, i) => (
              <a
                key={i}
                href={action.href}
                className="flex items-center justify-center p-3 bg-surface hover:bg-accent/10 rounded-lg border border-border text-sm font-medium text-app-text hover:text-accent transition-all duration-150"
              >
                {action.label}
              </a>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

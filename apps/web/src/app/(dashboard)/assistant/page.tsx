'use client';

import Link from 'next/link';
import { GraduationCap, UserCheck, Users, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useDashboardStats } from '@/hooks/useDashboardStats';
import { useDocumentRequestPendingCount } from '@/hooks/useDocumentRequests';

export default function AssistantDashboardPage() {
  const { user, loading } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const pendingDocs = useDocumentRequestPendingCount();

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Assistant Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Total Students" value={stats?.totalStudents.toLocaleString() ?? '—'} subtitle="enrolled" icon={GraduationCap} loading={statsLoading} />
        <KpiCard title="Active Teachers" value={stats?.activeTeachers.toLocaleString() ?? '—'} subtitle="this year" icon={UserCheck} loading={statsLoading} />
        <KpiCard title="Parents" value={stats ? String(stats.parentCount ?? '—') : '—'} subtitle="registered" icon={Users} loading={statsLoading} />
        <KpiCard title="Pending Docs" value={String(pendingDocs)} subtitle="document requests" icon={FileText} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card>
          <CardHeader>
            <CardTitle>Document Request Queue</CardTitle>
            <Link href="/assistant/documents">
              <Button size="sm" variant="ghost">View all</Button>
            </Link>
          </CardHeader>
          <div className="space-y-3">
            {pendingDocs === 0 ? (
              <p className="text-sm text-muted py-4 text-center">No pending document requests</p>
            ) : (
              <p className="text-sm text-muted py-4 text-center">
                <Link href="/assistant/documents" className="text-accent hover:underline font-medium">
                  {pendingDocs} pending request{pendingDocs !== 1 ? 's' : ''} — View all
                </Link>
              </p>
            )}
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

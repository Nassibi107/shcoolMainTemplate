'use client';

import { CalendarDays, BookOpen, UserX, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { useStudentOverview } from '@/hooks/useStudentOverview';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  const { student, grades, certificates, attendanceRate, loading: overviewLoading } = useStudentOverview();
  if (loading || !user) return null;
  if (overviewLoading) return null;
  const avgGrade = grades.length > 0
    ? Math.round((grades.reduce((sum, g) => sum + (Number(g.score) / Number(g.maxScore || 100)) * 100, 0) / grades.length) * 10) / 10
    : 0;
  const absences = Math.max(0, 100 - Math.round(attendanceRate));
  const currentClass = student?.classEnrollments?.[0]?.class?.name ?? '—';
  const latestTerm = grades[0]?.term ?? 'Current';

  return (
    <DashboardLayout user={user} pageTitle="My Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Attendance Rate" value={`${attendanceRate}%`} subtitle="this term" icon={CalendarDays} />
        <KpiCard title="Current Class" value={currentClass} subtitle="Academic Year" icon={BookOpen} />
        <KpiCard title="Absences" value={String(absences)} subtitle="estimated this term" icon={UserX} />
        <KpiCard title="Avg. Grade" value={`${avgGrade}%`} subtitle="across all subjects" icon={FileText} />
      </div>

      {/* Grades table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Grades — {latestTerm}</CardTitle>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-2 text-muted font-medium">Subject</th>
                <th className="text-center py-2 text-muted font-medium">Score</th>
                <th className="text-center py-2 text-muted font-medium">Grade</th>
                <th className="text-right py-2 text-muted font-medium">%</th>
              </tr>
            </thead>
            <tbody>
              {grades.map((g) => {
                const pct = Math.round((Number(g.score) / Number(g.maxScore)) * 100);
                const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : 'D';
                const variant = pct >= 90 ? 'success' : pct >= 80 ? 'secondary' : pct >= 70 ? 'warning' : 'danger';
                return (
                  <tr key={g.id} className="border-b border-border/40 hover:bg-surface/60">
                    <td className="py-3 font-medium">{g.subject?.name ?? '—'}</td>
                    <td className="py-3 text-center font-mono">{g.score}/{g.maxScore}</td>
                    <td className="py-3 text-center"><Badge variant={variant as any}>{grade}</Badge></td>
                    <td className="py-3 text-right font-mono text-muted">{pct}%</td>
                  </tr>
                );
              })}
              {grades.length === 0 && (
                <tr>
                  <td className="py-4 text-center text-muted" colSpan={4}>No grades available.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <Link href="/student/documents">
            <Button size="sm" variant="ghost">Request New</Button>
          </Link>
        </CardHeader>
        <div className="space-y-3">
          {certificates.map((cert) => (
            <div key={cert.id} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{cert.type}</p>
                <p className="text-xs text-muted">{formatDate(cert.issuedAt)}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="success">Ready</Badge>
              </div>
            </div>
          ))}
          {certificates.length === 0 && (
            <p className="text-sm text-muted py-3">No certificates yet.</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

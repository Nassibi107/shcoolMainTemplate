'use client';

import { CalendarDays, BookOpen, UserX, FileText } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';

const MOCK_GRADES = [
  { subject: 'Mathematics', score: 87, maxScore: 100, term: '2024-T2' },
  { subject: 'Physics', score: 92, maxScore: 100, term: '2024-T2' },
  { subject: 'English', score: 78, maxScore: 100, term: '2024-T2' },
  { subject: 'History', score: 84, maxScore: 100, term: '2024-T2' },
];

export default function StudentDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const attendanceRate = '94.3';

  return (
    <DashboardLayout user={user} pageTitle="My Overview">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="Attendance Rate" value={`${attendanceRate}%`} subtitle="this term" icon={CalendarDays} trend={2.1} />
        <KpiCard title="Current Class" value="3B" subtitle="Academic Year 2024-25" icon={BookOpen} />
        <KpiCard title="Absences" value="4" subtitle="this term" icon={UserX} />
        <KpiCard title="Avg. Grade" value="85.2%" subtitle="across all subjects" icon={FileText} trend={3.5} />
      </div>

      {/* Grades table */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>My Grades — Term 2</CardTitle>
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
              {MOCK_GRADES.map((g, i) => {
                const pct = Math.round((g.score / g.maxScore) * 100);
                const grade = pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : 'D';
                const variant = pct >= 90 ? 'success' : pct >= 80 ? 'secondary' : pct >= 70 ? 'warning' : 'danger';
                return (
                  <tr key={i} className="border-b border-border/40 hover:bg-surface/60">
                    <td className="py-3 font-medium">{g.subject}</td>
                    <td className="py-3 text-center font-mono">{g.score}/{g.maxScore}</td>
                    <td className="py-3 text-center"><Badge variant={variant as any}>{grade}</Badge></td>
                    <td className="py-3 text-right font-mono text-muted">{pct}%</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Certificates */}
      <Card>
        <CardHeader>
          <CardTitle>My Certificates</CardTitle>
          <Button size="sm" variant="ghost">Request New</Button>
        </CardHeader>
        <div className="space-y-3">
          {[
            { type: 'Registration Certificate', date: 'Sep 2024', status: 'Ready' },
            { type: 'Attendance Certificate', date: 'Requested', status: 'Pending' },
          ].map((cert, i) => (
            <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
              <div>
                <p className="font-medium text-sm">{cert.type}</p>
                <p className="text-xs text-muted">{cert.date}</p>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={cert.status === 'Ready' ? 'success' : 'warning'}>{cert.status}</Badge>
                {cert.status === 'Ready' && (
                  <Button size="sm" variant="ghost">Download</Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}

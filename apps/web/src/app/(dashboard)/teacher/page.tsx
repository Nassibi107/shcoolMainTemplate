'use client';

import { CalendarDays, ClipboardList, BarChart3 } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const MOCK_SCHEDULE = [
  { time: '08:00–09:00', Monday: 'Mathematics · 3A', Tuesday: '', Wednesday: 'Mathematics · 3A', Thursday: '', Friday: 'Mathematics · 3A' },
  { time: '09:00–10:00', Monday: '', Tuesday: 'Physics · 4B', Wednesday: '', Thursday: 'Physics · 4B', Friday: '' },
  { time: '10:00–11:00', Monday: 'Mathematics · 2C', Tuesday: 'Mathematics · 2C', Wednesday: '', Thursday: '', Friday: '' },
  { time: '11:00–12:00', Monday: '', Tuesday: '', Wednesday: 'Physics · 3A', Thursday: 'Physics · 3A', Friday: '' },
];

export default function TeacherDashboardPage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard title="My Classes" value="5" subtitle="active this term" icon={BookIcon} trend={0} />
        <KpiCard title="Today's Lessons" value="3" subtitle="scheduled today" icon={CalendarDays} />
        <KpiCard title="Students" value="124" subtitle="across all classes" icon={ClipboardList} />
        <KpiCard title="Pending Grades" value="18" subtitle="need to be entered" icon={BarChart3} trend={-5} />
      </div>

      {/* Weekly timetable */}
      <Card className="mb-6 overflow-x-auto">
        <CardHeader>
          <CardTitle>This Week's Schedule</CardTitle>
          <span className="text-xs text-muted">Week of Mar 17–21, 2025</span>
        </CardHeader>
        <table className="w-full text-sm min-w-[640px]">
          <thead>
            <tr>
              <th className="text-left pb-3 pr-4 text-muted font-medium w-32">Time</th>
              {DAYS.map((d) => (
                <th key={d} className="text-center pb-3 text-muted font-medium">{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {MOCK_SCHEDULE.map((slot) => (
              <tr key={slot.time} className="border-t border-border/50">
                <td className="py-3 pr-4 text-xs font-mono text-muted whitespace-nowrap">{slot.time}</td>
                {DAYS.map((day) => {
                  const lesson = (slot as Record<string, string>)[day];
                  return (
                    <td key={day} className="py-2 px-2 text-center">
                      {lesson ? (
                        <div className="bg-accent/10 text-accent text-xs font-medium rounded-lg px-2 py-1.5 leading-tight">
                          {lesson}
                        </div>
                      ) : (
                        <div className="h-8" />
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>

      {/* Recent grade entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Grade Entries</CardTitle>
        </CardHeader>
        <div className="space-y-0 divide-y divide-border">
          {['Ahmed Hassan · Math · 87/100', 'Sara Ali · Physics · 92/100', 'Mohamed Saad · Math · 74/100'].map(
            (entry, i) => (
              <div key={i} className="flex items-center justify-between py-3">
                <p className="text-sm text-app-text">{entry}</p>
                <Badge variant="success">Posted</Badge>
              </div>
            ),
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

function BookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className}>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

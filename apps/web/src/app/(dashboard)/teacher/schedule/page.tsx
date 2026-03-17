'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

interface Lesson {
  subject: string;
  class: string;
  room: string;
  color: string;
}

const SCHEDULE: Record<string, Record<string, Lesson | null>> = {
  '08:00': { Monday: { subject: 'Mathematics', class: '3A', room: 'R101', color: 'bg-blue-100 text-blue-700 border-blue-200' }, Tuesday: null, Wednesday: { subject: 'Mathematics', class: '3A', room: 'R101', color: 'bg-blue-100 text-blue-700 border-blue-200' }, Thursday: null, Friday: { subject: 'Mathematics', class: '3A', room: 'R101', color: 'bg-blue-100 text-blue-700 border-blue-200' } },
  '09:00': { Monday: { subject: 'Mathematics', class: '4B', room: 'R201', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, Tuesday: { subject: 'Mathematics', class: '4B', room: 'R201', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, Wednesday: null, Thursday: { subject: 'Mathematics', class: '4B', room: 'R201', color: 'bg-indigo-100 text-indigo-700 border-indigo-200' }, Friday: null },
  '10:00': { Monday: null, Tuesday: { subject: 'Statistics', class: '5A', room: 'R301', color: 'bg-violet-100 text-violet-700 border-violet-200' }, Wednesday: { subject: 'Statistics', class: '5A', room: 'R301', color: 'bg-violet-100 text-violet-700 border-violet-200' }, Thursday: null, Friday: { subject: 'Statistics', class: '5A', room: 'R301', color: 'bg-violet-100 text-violet-700 border-violet-200' } },
  '11:00': { Monday: { subject: 'Mathematics', class: '2C', room: 'R102', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }, Tuesday: { subject: 'Mathematics', class: '2C', room: 'R102', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }, Wednesday: null, Thursday: { subject: 'Mathematics', class: '2C', room: 'R102', color: 'bg-cyan-100 text-cyan-700 border-cyan-200' }, Friday: null },
  '12:00': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
  '13:00': { Monday: { subject: 'Mathematics', class: '3B', room: 'R103', color: 'bg-teal-100 text-teal-700 border-teal-200' }, Tuesday: null, Wednesday: { subject: 'Mathematics', class: '3B', room: 'R103', color: 'bg-teal-100 text-teal-700 border-teal-200' }, Thursday: { subject: 'Mathematics', class: '3B', room: 'R103', color: 'bg-teal-100 text-teal-700 border-teal-200' }, Friday: null },
  '14:00': { Monday: null, Tuesday: { subject: 'Office Hours', class: '—', room: 'Staff Room', color: 'bg-surface text-muted border-border' }, Wednesday: null, Thursday: { subject: 'Office Hours', class: '—', room: 'Staff Room', color: 'bg-surface text-muted border-border' }, Friday: null },
  '15:00': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
};

export default function TeacherSchedulePage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const totalLessons = Object.values(SCHEDULE).flatMap(Object.values).filter(Boolean).length;
  const classes = ['3A', '3B', '4B', '2C', '5A'];

  return (
    <DashboardLayout user={user} pageTitle="My Schedule">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Weekly Lessons', value: totalLessons },
          { label: 'Classes', value: classes.length },
          { label: 'Teaching Hours', value: `${totalLessons}h` },
          { label: 'This Week', value: 'Mar 17–21' },
        ].map((s) => (
          <div key={s.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{s.value}</p>
            <p className="text-sm text-muted mt-0.5">{s.label}</p>
          </div>
        ))}
      </div>

      {/* Timetable */}
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Weekly Timetable</CardTitle>
          <span className="text-xs text-muted">Week of March 17–21, 2025</span>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 pr-4 text-muted font-medium w-20">Time</th>
                {DAYS.map((d) => (
                  <th key={d} className="text-center py-3 px-2 text-muted font-medium">{d}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {HOURS.map((hour) => {
                const isBreak = hour === '12:00';
                return (
                  <tr key={hour} className="border-t border-border/40">
                    <td className="py-2 pr-4 text-xs font-mono text-muted whitespace-nowrap align-top pt-3">{hour}</td>
                    {DAYS.map((day) => {
                      const lesson = SCHEDULE[hour]?.[day];
                      if (isBreak) {
                        return day === 'Monday' ? (
                          <td key={day} colSpan={5} className="py-2 px-2 text-center">
                            <div className="bg-surface border border-border/50 rounded-lg px-3 py-2 text-xs text-muted">
                              — Lunch Break —
                            </div>
                          </td>
                        ) : null;
                      }
                      return (
                        <td key={day} className="py-1.5 px-1">
                          {lesson ? (
                            <div className={`rounded-lg border px-2.5 py-2 text-xs leading-tight ${lesson.color}`}>
                              <p className="font-semibold">{lesson.subject}</p>
                              <p className="opacity-75 mt-0.5">Class {lesson.class}</p>
                              <p className="opacity-60 mt-0.5">{lesson.room}</p>
                            </div>
                          ) : (
                            <div className="h-14" />
                          )}
                        </td>
                      );
                    })}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Class Legend */}
      <Card className="mt-6">
        <CardHeader><CardTitle>My Classes</CardTitle></CardHeader>
        <div className="flex flex-wrap gap-3">
          {[
            { class: '2C', subject: 'Mathematics', students: 28 },
            { class: '3A', subject: 'Mathematics', students: 31 },
            { class: '3B', subject: 'Mathematics', students: 29 },
            { class: '4B', subject: 'Mathematics', students: 27 },
            { class: '5A', subject: 'Statistics', students: 24 },
          ].map((c) => (
            <div key={c.class} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border flex-1 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                {c.class}
              </div>
              <div>
                <p className="font-medium text-sm">{c.subject}</p>
                <p className="text-xs text-muted">{c.students} students</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  );
}

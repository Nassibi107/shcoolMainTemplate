'use client';

import { useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

interface TeacherLesson {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  class: { id: string; name: string; code: string };
  subject: { name: string; color: string };
}

export default function TeacherSchedulePage() {
  const { user, loading } = useAuth();
  const [selectedClass, setSelectedClass] = useState('');
  const [classes, setClasses] = useState<Array<{ id: string; name: string; code: string }>>([]);
  const [lessons, setLessons] = useState<TeacherLesson[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    const query = selectedClass ? `?classId=${selectedClass}` : '';
    setDataLoading(true);
    api
      .get(`/schools/${user.school.id}/classes/timetable/teacher/me${query}`)
      .then((res) => {
        setClasses(res.data?.classes ?? []);
        setLessons(res.data?.lessons ?? []);
      })
      .catch(() => {
        setClasses([]);
        setLessons([]);
      })
      .finally(() => setDataLoading(false));
  }, [user, selectedClass]);

  if (loading || !user) return null;

  const totalLessons = lessons.length;
  const totalHours = lessons.reduce((sum, l) => {
    const start = Number(l.startTime.slice(0, 2));
    const end = Number(l.endTime.slice(0, 2));
    return sum + Math.max(1, end - start);
  }, 0);
  const usedClassIds = new Set(lessons.map((l) => l.class.id));
  const classCount = usedClassIds.size;

  const scheduleMap = useMemo(() => {
    const map = new Map<string, TeacherLesson>();
    for (const lesson of lessons) {
      const key = `${lesson.dayOfWeek}-${lesson.startTime.slice(0, 5)}`;
      map.set(key, lesson);
    }
    return map;
  }, [lessons]);

  return (
    <DashboardLayout user={user} pageTitle="My Schedule">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Weekly Lessons', value: totalLessons },
          { label: 'Classes', value: classCount },
          { label: 'Teaching Hours', value: `${totalHours}h` },
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
          <div className="flex items-center gap-3">
            <span className="text-xs text-muted">Week of March 17–21, 2025</span>
            <Select
              options={[{ value: '', label: 'All My Classes' }, ...classes.map((c) => ({ value: c.id, label: c.name }))]}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-44"
            />
          </div>
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
                      const lesson = scheduleMap.get(`${dayIndexToDb(day)}-${hour}`);
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
                            <div
                              className="rounded-lg border px-2.5 py-2 text-xs leading-tight"
                              style={{
                                backgroundColor: `${lesson.subject.color}20`,
                                borderColor: lesson.subject.color,
                                color: '#1C2B3A',
                              }}
                            >
                              <p className="font-semibold">{lesson.subject.name}</p>
                              <p className="opacity-75 mt-0.5">Class {lesson.class.name}</p>
                              <p className="opacity-60 mt-0.5">{lesson.room ?? '—'}</p>
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
          {classes.map((c) => (
            <div key={c.id} className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border flex-1 min-w-[140px]">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                {c.code}
              </div>
              <div>
                <p className="font-medium text-sm">{c.name}</p>
                <p className="text-xs text-muted">Assigned class</p>
              </div>
            </div>
          ))}
          {classes.length === 0 && !dataLoading && (
            <p className="text-sm text-muted">No classes assigned yet.</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  );
}

function dayIndexToDb(day: string): number {
  const map: Record<string, number> = {
    Monday: 1,
    Tuesday: 2,
    Wednesday: 3,
    Thursday: 4,
    Friday: 5,
  };
  return map[day] ?? 1;
}

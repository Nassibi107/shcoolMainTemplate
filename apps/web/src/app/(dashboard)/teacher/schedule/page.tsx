'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';

const WEEKDAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'] as const;

interface Lesson {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  class: { name: string; code: string };
  subject: { name: string };
}

function parseLesson(raw: unknown, index: number): Lesson | null {
  if (!raw || typeof raw !== 'object') return null;
  const o = raw as Record<string, unknown>;
  const dayOfWeek = Number(o.dayOfWeek);
  const startTime = typeof o.startTime === 'string' ? o.startTime : '';
  const endTime = typeof o.endTime === 'string' ? o.endTime : '';
  if (!Number.isFinite(dayOfWeek) || !startTime || !endTime) return null;

  const cls = (o.class as Record<string, unknown>) ?? {};
  const subj = (o.subject as Record<string, unknown>) ?? {};
  return {
    id: String(o.id ?? `l-${index}`),
    dayOfWeek,
    startTime,
    endTime,
    room: typeof o.room === 'string' ? o.room : null,
    class: {
      name: String(cls.name ?? o.className ?? '-'),
      code: String(cls.code ?? o.classCode ?? '-'),
    },
    subject: {
      name: String(subj.name ?? o.subjectName ?? 'Subject'),
    },
  };
}

export default function TeacherSchedulePage() {
  const { user, loading } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMsg, setErrorMsg] = useState<string>('');

  const schoolId = user?.school?.id ?? null;

  const fetchSchedule = useCallback(async () => {
    if (!schoolId) return;
    setStatus('loading');
    setErrorMsg('');
    try {
      const res = await api.get(`/schools/${schoolId}/teachers/me/schedule`);
      const data = res.data;
      const arr: unknown[] = Array.isArray(data)
        ? data
        : Array.isArray(data?.data)
          ? data.data
          : Array.isArray(data?.schedule)
            ? data.schedule
            : [];
      const parsed = arr
        .map((row, i) => parseLesson(row, i))
        .filter((l): l is Lesson => l !== null);
      setLessons(parsed);
      setStatus('success');
    } catch {
      setLessons([]);
      setStatus('error');
      setErrorMsg('Could not load schedule. Please refresh.');
    }
  }, [schoolId]);

  useEffect(() => {
    if (loading || !schoolId) return;
    fetchSchedule();
  }, [loading, schoolId, fetchSchedule]);

  const timeSlots = useMemo(() => {
    const set = new Set(lessons.map((l) => `${l.startTime}-${l.endTime}`));
    return Array.from(set).sort();
  }, [lessons]);

  const grid = useMemo(() => {
    const m = new Map<string, Lesson>();
    lessons.forEach((l) => m.set(`${l.dayOfWeek}-${l.startTime}-${l.endTime}`, l));
    return m;
  }, [lessons]);

  const classCodes = useMemo(() => {
    return Array.from(new Set(lessons.map((l) => l.class?.code).filter(Boolean))) as string[];
  }, [lessons]);

  if (loading || !user) return null;
  if (!schoolId) {
    return (
      <DashboardLayout user={user} pageTitle="My Schedule">
        <div className="rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
          Missing school information. Please log out and log in again.
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout user={user} pageTitle="My Schedule">
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold text-primary">{lessons.length}</p>
            <p className="text-sm text-muted">Weekly Lessons</p>
          </div>
          <div className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold text-primary">{classCodes.length}</p>
            <p className="text-sm text-muted">Classes</p>
          </div>
          <div className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold text-primary">{lessons.length}h</p>
            <p className="text-sm text-muted">Teaching Hours</p>
          </div>
        </div>

        <Card className="overflow-x-auto">
          <CardHeader>
            <CardTitle>Weekly Timetable</CardTitle>
          </CardHeader>
          <div className="overflow-x-auto">
            {errorMsg && (
              <div className="mb-4 rounded-lg border border-danger/20 bg-danger/5 px-4 py-3 text-sm text-danger">
                {errorMsg}
              </div>
            )}
            {status === 'loading' && (
              <div className="py-16 text-center text-muted">Loading schedule...</div>
            )}
            {status === 'success' && timeSlots.length === 0 && (
              <div className="py-16 text-center text-muted">No lessons scheduled.</div>
            )}
            {status === 'success' && timeSlots.length > 0 && (
              <table className="w-full text-sm min-w-[640px]">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 pr-4 text-muted font-medium w-24">Time</th>
                    {WEEKDAYS.map((d) => (
                      <th key={d} className="text-center py-3 px-2 text-muted font-medium">
                        {d}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timeSlots.map((slot) => (
                    <tr key={slot} className="border-t border-border/50">
                      <td className="py-2 pr-4 text-xs font-mono text-muted align-top pt-3">
                        {slot}
                      </td>
                      {WEEKDAYS.map((_, dayIndex) => {
                        const lesson = grid.get(`${dayIndex}-${slot}`);
                        return (
                          <td key={`${slot}-${dayIndex}`} className="py-1.5 px-1 align-top">
                            {lesson ? (
                              <div className="rounded-lg border border-border px-2.5 py-2 text-xs bg-surface">
                                <p className="font-semibold">{lesson.subject.name}</p>
                                <p className="opacity-75 mt-0.5">
                                  Class {lesson.class?.code ?? '-'}
                                </p>
                                <p className="opacity-60 mt-0.5">{lesson.room ?? '-'}</p>
                              </div>
                            ) : (
                              <div className="h-12" />
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </Card>

        {classCodes.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>My Classes</CardTitle>
            </CardHeader>
            <div className="flex flex-wrap gap-3">
              {classCodes.map((code) => (
                <div
                  key={code}
                  className="flex items-center gap-3 p-3 bg-surface rounded-lg border border-border min-w-[140px]"
                >
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center font-bold text-accent text-sm">
                    {code}
                  </div>
                  <p className="text-sm font-medium">Assigned class</p>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

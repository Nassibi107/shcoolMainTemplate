'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, Tooltip } from 'recharts';

interface SubjectGrade {
  subject: string;
  teacher: string;
  quiz1: number;
  quiz2: number;
  midterm: number;
  project: number;
  final: number | null;
  average: number;
}

const GRADES_BY_TERM: Record<string, SubjectGrade[]> = {
  T1: [
    { subject: 'Mathematics', teacher: 'Mr. Johnson', quiz1: 82, quiz2: 85, midterm: 79, project: 88, final: 84, average: 83 },
    { subject: 'English', teacher: 'Ms. Miller', quiz1: 90, quiz2: 88, midterm: 92, project: 94, final: 91, average: 91 },
    { subject: 'Science', teacher: 'Ms. Sharma', quiz1: 75, quiz2: 78, midterm: 72, project: 80, final: 76, average: 76 },
    { subject: 'History', teacher: 'Mr. Hassan', quiz1: 88, quiz2: 85, midterm: 82, project: 90, final: 86, average: 86 },
    { subject: 'Physics', teacher: 'Mr. Chen', quiz1: 70, quiz2: 72, midterm: 68, project: 75, final: 71, average: 71 },
  ],
  T2: [
    { subject: 'Mathematics', teacher: 'Mr. Johnson', quiz1: 87, quiz2: 90, midterm: 84, project: 92, final: null, average: 88 },
    { subject: 'English', teacher: 'Ms. Miller', quiz1: 93, quiz2: 91, midterm: 95, project: 97, final: null, average: 94 },
    { subject: 'Science', teacher: 'Ms. Sharma', quiz1: 80, quiz2: 82, midterm: 78, project: 85, final: null, average: 81 },
    { subject: 'History', teacher: 'Mr. Hassan', quiz1: 84, quiz2: 88, midterm: 86, project: 92, final: null, average: 87 },
    { subject: 'Physics', teacher: 'Mr. Chen', quiz1: 76, quiz2: 80, midterm: 74, project: 82, final: null, average: 78 },
  ],
};

function letterGrade(avg: number): { letter: string; variant: 'success' | 'secondary' | 'warning' | 'danger' } {
  if (avg >= 90) return { letter: 'A', variant: 'success' };
  if (avg >= 80) return { letter: 'B', variant: 'secondary' };
  if (avg >= 70) return { letter: 'C', variant: 'warning' };
  if (avg >= 60) return { letter: 'D', variant: 'warning' };
  return { letter: 'F', variant: 'danger' };
}

export default function StudentGradesPage() {
  const { user, loading } = useAuth();
  const [term, setTerm] = useState('T2');
  const grades = GRADES_BY_TERM[term] ?? [];
  const overallAvg = Math.round(grades.reduce((s, g) => s + g.average, 0) / grades.length);
  const { letter, variant } = letterGrade(overallAvg);

  const radarData = grades.map((g) => ({ subject: g.subject, score: g.average, fullMark: 100 }));

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Grades">
      {/* Term selector & overview */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <Select
          options={[{ value: 'T1', label: 'Term 1' }, { value: 'T2', label: 'Term 2' }]}
          value={term}
          onChange={(e) => setTerm(e.target.value)}
          className="w-36"
        />
        <div className="flex items-center gap-4">
          <div className="text-right">
            <p className="text-sm text-muted">Overall Average</p>
            <p className="text-2xl font-bold font-heading text-primary">{overallAvg}%</p>
          </div>
          <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold text-white ${variant === 'success' ? 'bg-success' : variant === 'secondary' ? 'bg-accent' : variant === 'warning' ? 'bg-warning' : 'bg-danger'}`}>
            {letter}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Grades table */}
        <div className="xl:col-span-2 space-y-3">
          {grades.map((g) => {
            const { letter: l, variant: v } = letterGrade(g.average);
            return (
              <div key={g.subject} className="bg-card rounded-card shadow-card p-4">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="font-semibold text-app-text">{g.subject}</p>
                    <p className="text-xs text-muted">{g.teacher}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-lg font-bold font-heading">{g.average}%</p>
                    </div>
                    <Badge variant={v} className="text-sm px-2.5 py-1">{l}</Badge>
                  </div>
                </div>
                {/* Score bar */}
                <div className="w-full h-1.5 bg-border rounded-full mb-3">
                  <div className={`h-1.5 rounded-full ${v === 'success' ? 'bg-success' : v === 'secondary' ? 'bg-accent' : v === 'warning' ? 'bg-warning' : 'bg-danger'}`} style={{ width: `${g.average}%` }} />
                </div>
                {/* Assessment breakdown */}
                <div className="grid grid-cols-5 gap-2">
                  {[
                    { label: 'Quiz 1', value: g.quiz1 },
                    { label: 'Quiz 2', value: g.quiz2 },
                    { label: 'Midterm', value: g.midterm },
                    { label: 'Project', value: g.project },
                    { label: 'Final', value: g.final },
                  ].map((a) => (
                    <div key={a.label} className="text-center">
                      <p className="text-[11px] text-muted">{a.label}</p>
                      <p className="font-mono font-semibold text-sm mt-0.5">{a.value !== null ? a.value : <span className="text-muted">—</span>}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Radar chart */}
        <Card>
          <CardHeader><CardTitle>Performance Radar</CardTitle></CardHeader>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--color-border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: 'var(--color-muted)' }} />
                <Radar dataKey="score" stroke="var(--color-accent)" fill="var(--color-accent)" fillOpacity={0.2} strokeWidth={2} />
                <Tooltip contentStyle={{ background: 'var(--color-card)', border: '1px solid var(--color-border)', borderRadius: 8, fontSize: 12 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

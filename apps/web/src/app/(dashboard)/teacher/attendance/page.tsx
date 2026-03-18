'use client';

import { useState } from 'react';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Select } from '@/components/ui/Select';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { formatDate } from '@/lib/utils';

type Status = 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED';

interface Student {
  id: string;
  name: string;
  code: string;
}

const CLASSES = ['3A', '3B', '4B', '2C', '5A'];

const STUDENTS_BY_CLASS: Record<string, Student[]> = {
  '3A': [
    { id: '1', name: 'Ahmed Hassan', code: 'STU-001' },
    { id: '2', name: 'Sara Ali', code: 'STU-002' },
    { id: '3', name: 'Mohamed Saad', code: 'STU-003' },
    { id: '4', name: 'Fatima Omar', code: 'STU-004' },
    { id: '5', name: 'Youssef Malik', code: 'STU-005' },
  ],
  '3B': [
    { id: '6', name: 'Nour Hassan', code: 'STU-006' },
    { id: '7', name: 'Karim Ali', code: 'STU-007' },
    { id: '8', name: 'Lena Riad', code: 'STU-008' },
    { id: '9', name: 'Omar Farouk', code: 'STU-009' },
  ],
  '4B': [{ id: '10', name: 'Hana Sami', code: 'STU-010' }, { id: '11', name: 'Tariq Nour', code: 'STU-011' }],
  '2C': [{ id: '12', name: 'Rana Kareem', code: 'STU-012' }, { id: '13', name: 'Bilal Hassan', code: 'STU-013' }],
  '5A': [{ id: '14', name: 'Dina Farid', code: 'STU-014' }, { id: '15', name: 'Samir Lotfy', code: 'STU-015' }],
};

export default function TeacherAttendancePage() {
  const { user, loading } = useAuth();
  const [selectedClass, setSelectedClass] = useState('3A');
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const toast = useToast();
  const [statuses, setStatuses] = useState<Record<string, Status>>({});
  const [saved, setSaved] = useState(false);

  const students = STUDENTS_BY_CLASS[selectedClass] ?? [];

  function getStatus(id: string): Status {
    return statuses[id] ?? 'PRESENT';
  }

  function setStatus(id: string, status: Status) {
    setStatuses((prev) => ({ ...prev, [id]: status }));
    setSaved(false);
  }

  function markAll(status: Status) {
    const update: Record<string, Status> = {};
    students.forEach((s) => { update[s.id] = status; });
    setStatuses((prev) => ({ ...prev, ...update }));
    setSaved(false);
  }

  function handleSave() {
    setSaved(true);
    toast.success(`Attendance saved for Class ${selectedClass} — ${formatDate(date)}`);
    setTimeout(() => setSaved(false), 2000);
  }

  const counts = {
    present: students.filter((s) => getStatus(s.id) === 'PRESENT').length,
    absent: students.filter((s) => getStatus(s.id) === 'ABSENT').length,
    late: students.filter((s) => getStatus(s.id) === 'LATE').length,
    excused: students.filter((s) => getStatus(s.id) === 'EXCUSED').length,
  };

  if (loading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Attendance Entry">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader><CardTitle>Session</CardTitle></CardHeader>
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-muted mb-1">Class</label>
                <Select
                  options={CLASSES.map((c) => ({ value: c, label: `Class ${c}` }))}
                  value={selectedClass}
                  onChange={(e) => { setSelectedClass(e.target.value); setStatuses({}); }}
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-muted mb-1">Date</label>
                <input type="date" className="input-field w-full" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
          </Card>

          {/* Summary */}
          <Card>
            <CardHeader><CardTitle>Summary</CardTitle></CardHeader>
            <div className="space-y-2">
              {[
                { label: 'Present', value: counts.present, color: 'text-success' },
                { label: 'Absent', value: counts.absent, color: 'text-danger' },
                { label: 'Late', value: counts.late, color: 'text-warning' },
                { label: 'Excused', value: counts.excused, color: 'text-muted' },
              ].map((s) => (
                <div key={s.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted">{s.label}</span>
                  <span className={`font-semibold text-sm ${s.color}`}>{s.value}</span>
                </div>
              ))}
              <div className="border-t border-border pt-2 flex items-center justify-between">
                <span className="text-sm font-medium">Total</span>
                <span className="font-bold text-sm">{students.length}</span>
              </div>
            </div>
          </Card>

          {/* Quick actions */}
          <div className="space-y-2">
            <Button variant="ghost" size="sm" className="w-full" onClick={() => markAll('PRESENT')}>Mark All Present</Button>
            <Button variant="ghost" size="sm" className="w-full" onClick={() => markAll('ABSENT')}>Mark All Absent</Button>
          </div>
        </div>

        {/* Register */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <div>
              <CardTitle>Class {selectedClass} — {formatDate(date)}</CardTitle>
              <p className="text-xs text-muted mt-0.5">{students.length} students</p>
            </div>
            <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave} disabled={saved}>
              {saved ? 'Saved!' : 'Save Attendance'}
            </Button>
          </CardHeader>
          <div className="divide-y divide-border">
            {students.map((student, i) => {
              const status = getStatus(student.id);
              return (
                <div key={student.id} className="flex items-center gap-4 py-3 px-1">
                  <span className="text-sm text-muted w-6 text-right shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{student.name}</p>
                    <p className="text-xs text-muted font-mono">{student.code}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    {(['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'] as Status[]).map((s) => (
                      <button
                        key={s}
                        onClick={() => setStatus(student.id, s)}
                        className={`text-xs font-medium px-2.5 py-1 rounded-full border transition-all ${
                          status === s
                            ? s === 'PRESENT' ? 'bg-success text-white border-success' :
                              s === 'ABSENT' ? 'bg-danger text-white border-danger' :
                              s === 'LATE' ? 'bg-warning text-white border-warning' :
                              'bg-muted text-white border-muted'
                            : 'bg-transparent text-muted border-border hover:border-muted'
                        }`}
                      >
                        {s.charAt(0) + s.slice(1).toLowerCase()}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}

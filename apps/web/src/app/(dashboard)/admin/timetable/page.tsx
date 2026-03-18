'use client';

import { useState, useEffect } from 'react';
import { Download, CalendarDays } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/Select';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';
import api from '@/lib/api';
import { useToast } from '@/components/ui/Toast';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const TIME_SLOTS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'];

interface Lesson {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string | null;
  class: { id: string; name: string; code: string };
  subject: { id: string; name: string; code: string; color: string };
  teacher: { id: string; user: { firstName: string; lastName: string } };
}

export default function AdminTimetablePage() {
  const { user } = useAuth();
  const toast = useToast();
  const [viewMode, setViewMode] = useState<'class' | 'teacher'>('class');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedTeacher, setSelectedTeacher] = useState('');
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [classes, setClasses] = useState<Array<{ id: string; name: string }>>([]);
  const [teachers, setTeachers] = useState<Array<{ id: string; name: string }>>([]);
  const [subjects, setSubjects] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({
    classId: '',
    subjectId: '',
    teacherId: '',
    dayOfWeek: '1',
    startTime: '08:00',
    endTime: '09:00',
    room: '',
  });

  useEffect(() => {
    if (!user) return;

    api
      .get(`/schools/${user.school.id}/classes/timetable`)
      .then((res) => {
        const data = res.data?.lessons ?? [];
        setLessons(data);

        const classMap = new Map<string, string>();
        const teacherSet = new Set<string>();
        data.forEach((l: Lesson) => {
          classMap.set(l.class.id, l.class.name);
          if (l.teacher?.user) {
            teacherSet.add(`${l.teacher.user.firstName} ${l.teacher.user.lastName}`);
          }
        });
        setClasses(Array.from(classMap.entries()).map(([id, name]) => ({ id, name })));
        setTeachers(Array.from(teacherSet).map((name) => ({ id: name, name })));
      })
      .catch(() => setLessons([]))
      .finally(() => setLoading(false));

    api
      .get(`/schools/${user.school.id}/classes/timetable/options`)
      .then((res) => {
        const classesData = res.data?.classes ?? [];
        const teachersData = res.data?.teachers ?? [];
        const subjectsData = res.data?.subjects ?? [];
        setClasses(classesData.map((c: any) => ({ id: c.id, name: c.name })));
        setTeachers(teachersData.map((t: any) => ({ id: t.id, name: `${t.user.firstName} ${t.user.lastName}` })));
        setSubjects(subjectsData.map((s: any) => ({ id: s.id, name: s.name })));
      })
      .catch(() => {
        setSubjects([]);
      });
  }, [user]);

  const filteredLessons = lessons.filter((l) => {
    if (viewMode === 'class' && selectedClass) return l.class.id === selectedClass;
    if (viewMode === 'teacher' && selectedTeacher) {
      const teacherName = `${l.teacher.user.firstName} ${l.teacher.user.lastName}`;
      return teacherName === selectedTeacher;
    }
    return true;
  });

  const getCellContent = (dayIndex: number, timeSlot: string) => {
    const slotStart = timeSlot.slice(0, 5);
    return filteredLessons.filter((l) => {
      const dayMatch = l.dayOfWeek === dayIndex + 1;
      const lessonStart = (l.startTime || '').slice(0, 5);
      return dayMatch && lessonStart === slotStart;
    });
  };

  async function handleExportPdf() {
    if (!user) return;
    try {
      const res = await api.get(`/schools/${user.school.id}/reports/export/summary/pdf`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-${new Date().toISOString().slice(0, 10)}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Timetable exported');
    } catch {
      toast.error('Export failed');
    }
  }

  async function handleExportExcel() {
    if (!user) return;
    try {
      const res = await api.get(`/schools/${user.school.id}/reports/export/summary/excel`, { responseType: 'blob' });
      const url = URL.createObjectURL(new Blob([res.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
      const a = document.createElement('a');
      a.href = url;
      a.download = `timetable-${new Date().toISOString().slice(0, 10)}.xlsx`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success('Timetable exported');
    } catch {
      toast.error('Export failed');
    }
  }

  async function handleCreateLesson() {
    if (!user) return;
    if (!form.classId || !form.subjectId || !form.teacherId) {
      toast.error('Please fill required fields');
      return;
    }
    setCreating(true);
    try {
      await api.post(`/schools/${user.school.id}/classes/timetable/lessons`, {
        classId: form.classId,
        subjectId: form.subjectId,
        teacherId: form.teacherId,
        dayOfWeek: Number(form.dayOfWeek),
        startTime: form.startTime,
        endTime: form.endTime,
        room: form.room || undefined,
      });
      toast.success('Lesson created');
      setIsCreateOpen(false);
      const refresh = await api.get(`/schools/${user.school.id}/classes/timetable`);
      setLessons(refresh.data?.lessons ?? []);
    } catch (err: any) {
      toast.error(err?.response?.data?.message ?? 'Failed to create lesson');
    } finally {
      setCreating(false);
    }
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Timetable Generator">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex rounded-lg border border-border overflow-hidden">
            <button
              onClick={() => setViewMode('class')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'class' ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-app-text'}`}
            >
              By Class
            </button>
            <button
              onClick={() => setViewMode('teacher')}
              className={`px-4 py-2 text-sm font-medium ${viewMode === 'teacher' ? 'bg-accent text-white' : 'bg-surface text-muted hover:text-app-text'}`}
            >
              By Teacher
            </button>
          </div>
          {viewMode === 'class' && (
            <Select
              options={[{ value: '', label: 'All Classes' }, ...classes.map((c) => ({ value: c.id, label: c.name }))]}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="w-40"
            />
          )}
          {viewMode === 'teacher' && (
            <Select
              options={[{ value: '', label: 'All Teachers' }, ...teachers.map((t) => ({ value: t.id, label: t.name }))]}
              value={selectedTeacher}
              onChange={(e) => setSelectedTeacher(e.target.value)}
              className="w-40"
            />
          )}
        </div>
        <div className="flex gap-2">
          <Button size="sm" onClick={() => setIsCreateOpen(true)}>
            Add Lesson
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportPdf}>
            PDF
          </Button>
          <Button size="sm" variant="ghost" leftIcon={<Download className="w-4 h-4" />} onClick={handleExportExcel}>
            Excel
          </Button>
        </div>
      </div>

      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create Timetable Lesson" size="md">
        <div className="space-y-4">
          <Select
            options={[{ value: '', label: 'Select class' }, ...classes.map((c) => ({ value: c.id, label: c.name }))]}
            value={form.classId}
            onChange={(e) => setForm((p) => ({ ...p, classId: e.target.value }))}
          />
          <Select
            options={[{ value: '', label: 'Select teacher' }, ...teachers.map((t) => ({ value: t.id, label: t.name }))]}
            value={form.teacherId}
            onChange={(e) => setForm((p) => ({ ...p, teacherId: e.target.value }))}
          />
          <Select
            options={[{ value: '', label: 'Select subject' }, ...subjects.map((s) => ({ value: s.id, label: s.name }))]}
            value={form.subjectId}
            onChange={(e) => setForm((p) => ({ ...p, subjectId: e.target.value }))}
          />
          <Select
            options={[
              { value: '1', label: 'Monday' },
              { value: '2', label: 'Tuesday' },
              { value: '3', label: 'Wednesday' },
              { value: '4', label: 'Thursday' },
              { value: '5', label: 'Friday' },
            ]}
            value={form.dayOfWeek}
            onChange={(e) => setForm((p) => ({ ...p, dayOfWeek: e.target.value }))}
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              type="time"
              className="input-field"
              value={form.startTime}
              onChange={(e) => setForm((p) => ({ ...p, startTime: e.target.value }))}
            />
            <input
              type="time"
              className="input-field"
              value={form.endTime}
              onChange={(e) => setForm((p) => ({ ...p, endTime: e.target.value }))}
            />
          </div>
          <input
            type="text"
            placeholder="Room"
            className="input-field"
            value={form.room}
            onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))}
          />
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
            <Button onClick={handleCreateLesson} disabled={creating}>
              {creating ? 'Creating…' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      <div className="bg-card rounded-card shadow-card overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-muted">Loading timetable…</div>
        ) : filteredLessons.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <CalendarDays className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p>No lessons found. Add lessons to classes to build the timetable.</p>
          </div>
        ) : (
          <table className="w-full min-w-[600px] border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="p-3 text-left text-sm font-semibold text-muted w-24">Time</th>
                {DAYS.map((day) => (
                  <th key={day} className="p-3 text-center text-sm font-semibold text-primary border-l border-border">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {TIME_SLOTS.map((time) => (
                <tr key={time} className="border-b border-border hover:bg-surface/30">
                  <td className="p-2 text-sm text-muted font-mono">{time}</td>
                  {DAYS.map((_, dayIndex) => {
                    const cells = getCellContent(dayIndex, time);
                    return (
                      <td key={dayIndex} className="p-2 border-l border-border align-top min-w-[120px]">
                        {cells.map((l) => (
                          <div
                            key={l.id}
                            className="p-2 rounded-lg text-xs mb-1"
                            style={{ backgroundColor: `${l.subject.color}20`, borderLeft: `3px solid ${l.subject.color}` }}
                          >
                            <p className="font-semibold truncate">{l.subject.name}</p>
                            <p className="text-muted truncate">
                              {viewMode === 'class'
                                ? `${l.teacher.user.firstName} ${l.teacher.user.lastName}`
                                : l.class.name}
                            </p>
                            {l.room && <p className="text-muted text-[10px]">Room: {l.room}</p>}
                          </div>
                        ))}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </DashboardLayout>
  );
}

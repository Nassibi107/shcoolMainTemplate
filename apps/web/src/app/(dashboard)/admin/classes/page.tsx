'use client';

import { useState } from 'react';
import { Plus, Search, BookOpen } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { DataTable, Column } from '@/components/ui/DataTable';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

interface SchoolClass {
  id: string;
  name: string;
  grade: string;
  capacity: number;
  studentsCount: number;
  teacher: string;
  subjects: string[];
  room: string;
}

const MOCK_CLASSES: SchoolClass[] = [
  { id: '1', name: '1A', grade: 'Grade 1', capacity: 30, studentsCount: 28, teacher: 'James Johnson', subjects: ['Math', 'Science', 'English', 'History'], room: 'Room 101' },
  { id: '2', name: '1B', grade: 'Grade 1', capacity: 30, studentsCount: 25, teacher: 'Sarah Miller', subjects: ['Math', 'Science', 'English', 'Art'], room: 'Room 102' },
  { id: '3', name: '2A', grade: 'Grade 2', capacity: 32, studentsCount: 30, teacher: 'Wei Chen', subjects: ['Math', 'Physics', 'English', 'History'], room: 'Room 201' },
  { id: '4', name: '3A', grade: 'Grade 3', capacity: 32, studentsCount: 31, teacher: 'Omar Hassan', subjects: ['Math', 'Chemistry', 'English', 'Biology'], room: 'Room 301' },
  { id: '5', name: '3B', grade: 'Grade 3', capacity: 32, studentsCount: 29, teacher: 'Priya Sharma', subjects: ['Math', 'Physics', 'English', 'Chemistry'], room: 'Room 302' },
  { id: '6', name: '4A', grade: 'Grade 4', capacity: 30, studentsCount: 27, teacher: 'James Johnson', subjects: ['Math', 'Physics', 'Literature', 'Biology'], room: 'Room 401' },
];

interface ClassFormValues {
  name: string;
  grade: string;
  capacity: string;
  teacher: string;
  room: string;
}

function ClassForm({ onSubmit, onClose, defaultValues, isEditing }: {
  onSubmit: (v: ClassFormValues) => void;
  onClose: () => void;
  defaultValues?: Partial<ClassFormValues>;
  isEditing?: boolean;
}) {
  const [form, setForm] = useState<ClassFormValues>({
    name: defaultValues?.name ?? '',
    grade: defaultValues?.grade ?? 'Grade 1',
    capacity: defaultValues?.capacity ?? '30',
    teacher: defaultValues?.teacher ?? '',
    room: defaultValues?.room ?? '',
  });

  return (
    <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Class Name</label>
          <input className="input-field w-full" placeholder="e.g. 5A" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} required />
        </div>
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Grade Level</label>
          <select className="input-field w-full" value={form.grade} onChange={(e) => setForm((p) => ({ ...p, grade: e.target.value }))}>
            {['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6', 'Grade 7', 'Grade 8'].map((g) => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Capacity</label>
          <input type="number" className="input-field w-full" value={form.capacity} onChange={(e) => setForm((p) => ({ ...p, capacity: e.target.value }))} min="1" max="60" />
        </div>
        <div>
          <label className="block text-sm font-medium text-app-text mb-1">Room</label>
          <input className="input-field w-full" placeholder="e.g. Room 501" value={form.room} onChange={(e) => setForm((p) => ({ ...p, room: e.target.value }))} />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-app-text mb-1">Homeroom Teacher</label>
        <select className="input-field w-full" value={form.teacher} onChange={(e) => setForm((p) => ({ ...p, teacher: e.target.value }))}>
          <option value="">— Unassigned —</option>
          {['James Johnson', 'Wei Chen', 'Sarah Miller', 'Omar Hassan', 'Priya Sharma'].map((t) => (
            <option key={t} value={t}>{t}</option>
          ))}
        </select>
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
        <Button type="submit">{isEditing ? 'Save Changes' : 'Create Class'}</Button>
      </div>
    </form>
  );
}

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TIMES = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];
const TIMETABLE: Record<string, Record<string, string>> = {
  '08:00': { Mon: 'Mathematics', Tue: 'English', Wed: 'Science', Thu: 'Mathematics', Fri: 'Art' },
  '09:00': { Mon: 'English', Tue: 'Mathematics', Wed: 'History', Thu: 'English', Fri: 'Mathematics' },
  '10:00': { Mon: 'Science', Tue: 'Physics', Wed: 'Mathematics', Thu: 'Science', Fri: 'English' },
  '11:00': { Mon: 'History', Tue: 'Art', Wed: 'English', Thu: 'History', Fri: 'Science' },
  '12:00': { Mon: '— Break —', Tue: '— Break —', Wed: '— Break —', Thu: '— Break —', Fri: '— Break —' },
  '13:00': { Mon: 'Chemistry', Tue: 'Biology', Wed: 'Physics', Thu: 'Chemistry', Fri: 'Biology' },
  '14:00': { Mon: 'PE', Tue: 'Music', Wed: 'PE', Thu: 'Music', Fri: 'PE' },
};
const SUBJECT_COLORS: Record<string, string> = {
  Mathematics: 'bg-blue-100 text-blue-700',
  English: 'bg-green-100 text-green-700',
  Science: 'bg-purple-100 text-purple-700',
  History: 'bg-amber-100 text-amber-700',
  Physics: 'bg-cyan-100 text-cyan-700',
  Chemistry: 'bg-rose-100 text-rose-700',
  Biology: 'bg-emerald-100 text-emerald-700',
  Art: 'bg-pink-100 text-pink-700',
  Music: 'bg-violet-100 text-violet-700',
  PE: 'bg-orange-100 text-orange-700',
  '— Break —': 'bg-surface text-muted',
};

export default function AdminClassesPage() {
  const { user } = useAuth();
  const [search, setSearch] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<SchoolClass | null>(null);
  const [viewingTimetable, setViewingTimetable] = useState<SchoolClass | null>(null);
  const [classes, setClasses] = useState<SchoolClass[]>(MOCK_CLASSES);

  const filtered = classes.filter((c) =>
    !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.grade.toLowerCase().includes(search.toLowerCase()) || c.teacher.toLowerCase().includes(search.toLowerCase())
  );

  const columns: Column<SchoolClass>[] = [
    {
      key: 'name',
      header: 'Class',
      render: (row) => (
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
            <BookOpen className="w-4 h-4 text-accent" />
          </div>
          <div>
            <p className="font-semibold text-app-text">{row.name}</p>
            <p className="text-xs text-muted">{row.grade}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'teacher',
      header: 'Homeroom Teacher',
      render: (row) => <span className="text-sm">{row.teacher || <span className="text-muted">Unassigned</span>}</span>,
    },
    {
      key: 'studentsCount',
      header: 'Students',
      sortable: true,
      render: (row) => (
        <div>
          <span className="font-semibold text-app-text">{row.studentsCount}</span>
          <span className="text-muted text-sm"> / {row.capacity}</span>
          <div className="w-24 h-1.5 bg-border rounded-full mt-1">
            <div
              className="h-1.5 rounded-full bg-accent"
              style={{ width: `${Math.min(100, (row.studentsCount / row.capacity) * 100)}%` }}
            />
          </div>
        </div>
      ),
    },
    {
      key: 'subjects',
      header: 'Subjects',
      render: (row) => (
        <div className="flex flex-wrap gap-1">
          {row.subjects.slice(0, 3).map((s) => <span key={s} className="text-xs bg-surface border border-border text-app-text rounded px-1.5 py-0.5">{s}</span>)}
          {row.subjects.length > 3 && <span className="text-xs text-muted">+{row.subjects.length - 3}</span>}
        </div>
      ),
    },
    {
      key: 'room',
      header: 'Room',
      render: (row) => <span className="text-sm text-muted">{row.room || '—'}</span>,
    },
    {
      key: 'actions',
      header: '',
      render: (row) => (
        <div className="flex items-center gap-2 justify-end">
          <Button variant="ghost" size="sm" onClick={() => setViewingTimetable(row)}>Timetable</Button>
          <Button variant="ghost" size="sm" onClick={() => setEditingClass(row)}>Edit</Button>
          <Button variant="danger" size="sm" onClick={() => setClasses((prev) => prev.filter((c) => c.id !== row.id))}>Delete</Button>
        </div>
      ),
      className: 'text-right',
    },
  ];

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Classes">
      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total Classes', value: classes.length },
          { label: 'Total Students', value: classes.reduce((s, c) => s + c.studentsCount, 0) },
          { label: 'Total Capacity', value: classes.reduce((s, c) => s + c.capacity, 0) },
          { label: 'Avg. Class Size', value: Math.round(classes.reduce((s, c) => s + c.studentsCount, 0) / classes.length) },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-card shadow-card p-4">
            <p className="text-2xl font-bold font-heading text-primary">{stat.value}</p>
            <p className="text-sm text-muted mt-0.5">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input type="text" placeholder="Search classes…" value={search} onChange={(e) => setSearch(e.target.value)} className="input-field pl-9 w-64" />
        </div>
        <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsCreateOpen(true)}>
          New Class
        </Button>
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        keyExtractor={(r) => r.id}
        emptyMessage="No classes found."
        emptyAction={<Button size="sm" onClick={() => setIsCreateOpen(true)}>Create First Class</Button>}
      />

      {/* Create Modal */}
      <Modal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} title="Create New Class" size="md">
        <ClassForm
          onClose={() => setIsCreateOpen(false)}
          onSubmit={(values) => {
            setClasses((prev) => [...prev, {
              id: String(Date.now()), name: values.name, grade: values.grade,
              capacity: Number(values.capacity), studentsCount: 0,
              teacher: values.teacher, subjects: [], room: values.room,
            }]);
            setIsCreateOpen(false);
          }}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal isOpen={!!editingClass} onClose={() => setEditingClass(null)} title="Edit Class" size="md">
        {editingClass && (
          <ClassForm
            isEditing
            onClose={() => setEditingClass(null)}
            defaultValues={{ name: editingClass.name, grade: editingClass.grade, capacity: String(editingClass.capacity), teacher: editingClass.teacher, room: editingClass.room }}
            onSubmit={(values) => {
              setClasses((prev) => prev.map((c) => c.id === editingClass.id
                ? { ...c, name: values.name, grade: values.grade, capacity: Number(values.capacity), teacher: values.teacher, room: values.room }
                : c
              ));
              setEditingClass(null);
            }}
          />
        )}
      </Modal>

      {/* Timetable Modal */}
      <Modal isOpen={!!viewingTimetable} onClose={() => setViewingTimetable(null)} title={`Timetable — Class ${viewingTimetable?.name ?? ''}`} size="xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[560px]">
            <thead>
              <tr>
                <th className="text-left pb-3 text-muted font-medium w-20">Time</th>
                {DAYS.map((d) => <th key={d} className="text-center pb-3 text-muted font-medium">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {TIMES.map((time) => (
                <tr key={time} className="border-t border-border/50">
                  <td className="py-2 pr-4 text-xs font-mono text-muted">{time}</td>
                  {DAYS.map((day) => {
                    const subject = TIMETABLE[time]?.[day] ?? '';
                    const color = SUBJECT_COLORS[subject] ?? 'bg-surface text-muted';
                    return (
                      <td key={day} className="py-1.5 px-1 text-center">
                        {subject ? (
                          <span className={`inline-block text-xs font-medium rounded-lg px-2 py-1 leading-tight ${color}`}>{subject}</span>
                        ) : <div className="h-7" />}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

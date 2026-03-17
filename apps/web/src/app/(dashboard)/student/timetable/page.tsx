'use client';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { useAuth } from '@/hooks/useAuth';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];
const HOURS = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00'];

interface Lesson { subject: string; teacher: string; room: string; color: string; }

const TIMETABLE: Record<string, Record<string, Lesson | null>> = {
  '08:00': { Monday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'R101', color: 'bg-blue-50 text-blue-700 border-blue-200' }, Tuesday: { subject: 'English', teacher: 'Ms. Miller', room: 'R205', color: 'bg-green-50 text-green-700 border-green-200' }, Wednesday: { subject: 'Science', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-purple-50 text-purple-700 border-purple-200' }, Thursday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'R101', color: 'bg-blue-50 text-blue-700 border-blue-200' }, Friday: { subject: 'Art', teacher: 'Mr. Hassan', room: 'Art Room', color: 'bg-pink-50 text-pink-700 border-pink-200' } },
  '09:00': { Monday: { subject: 'English', teacher: 'Ms. Miller', room: 'R205', color: 'bg-green-50 text-green-700 border-green-200' }, Tuesday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'R101', color: 'bg-blue-50 text-blue-700 border-blue-200' }, Wednesday: { subject: 'History', teacher: 'Mr. Hassan', room: 'R302', color: 'bg-amber-50 text-amber-700 border-amber-200' }, Thursday: { subject: 'English', teacher: 'Ms. Miller', room: 'R205', color: 'bg-green-50 text-green-700 border-green-200' }, Friday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'R101', color: 'bg-blue-50 text-blue-700 border-blue-200' } },
  '10:00': { Monday: { subject: 'Science', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-purple-50 text-purple-700 border-purple-200' }, Tuesday: { subject: 'Physics', teacher: 'Mr. Chen', room: 'Lab B', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }, Wednesday: { subject: 'Mathematics', teacher: 'Mr. Johnson', room: 'R101', color: 'bg-blue-50 text-blue-700 border-blue-200' }, Thursday: { subject: 'Science', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-purple-50 text-purple-700 border-purple-200' }, Friday: { subject: 'English', teacher: 'Ms. Miller', room: 'R205', color: 'bg-green-50 text-green-700 border-green-200' } },
  '11:00': { Monday: { subject: 'History', teacher: 'Mr. Hassan', room: 'R302', color: 'bg-amber-50 text-amber-700 border-amber-200' }, Tuesday: null, Wednesday: { subject: 'English', teacher: 'Ms. Miller', room: 'R205', color: 'bg-green-50 text-green-700 border-green-200' }, Thursday: { subject: 'Physics', teacher: 'Mr. Chen', room: 'Lab B', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }, Friday: { subject: 'Science', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-purple-50 text-purple-700 border-purple-200' } },
  '12:00': { Monday: null, Tuesday: null, Wednesday: null, Thursday: null, Friday: null },
  '13:00': { Monday: { subject: 'Chemistry', teacher: 'Ms. Sharma', room: 'Lab C', color: 'bg-rose-50 text-rose-700 border-rose-200' }, Tuesday: { subject: 'Biology', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' }, Wednesday: { subject: 'Physics', teacher: 'Mr. Chen', room: 'Lab B', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' }, Thursday: { subject: 'Chemistry', teacher: 'Ms. Sharma', room: 'Lab C', color: 'bg-rose-50 text-rose-700 border-rose-200' }, Friday: { subject: 'Biology', teacher: 'Ms. Sharma', room: 'Lab A', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' } },
  '14:00': { Monday: { subject: 'PE', teacher: 'Coach Ali', room: 'Gym', color: 'bg-orange-50 text-orange-700 border-orange-200' }, Tuesday: { subject: 'Music', teacher: 'Ms. Riad', room: 'Music Room', color: 'bg-violet-50 text-violet-700 border-violet-200' }, Wednesday: { subject: 'PE', teacher: 'Coach Ali', room: 'Gym', color: 'bg-orange-50 text-orange-700 border-orange-200' }, Thursday: { subject: 'Music', teacher: 'Ms. Riad', room: 'Music Room', color: 'bg-violet-50 text-violet-700 border-violet-200' }, Friday: null },
};

export default function StudentTimetablePage() {
  const { user, loading } = useAuth();
  if (loading || !user) return null;

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
  const todayLessons = Object.entries(TIMETABLE).flatMap(([time, days]) => {
    const lesson = days[today];
    return lesson ? [{ time, ...lesson }] : [];
  });

  return (
    <DashboardLayout user={user} pageTitle="My Timetable">
      {/* Today's schedule */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Today — {today}</CardTitle>
          <span className="text-xs text-muted">{todayLessons.length} lessons</span>
        </CardHeader>
        {todayLessons.length === 0 ? (
          <p className="text-sm text-muted text-center py-8">No classes today.</p>
        ) : (
          <div className="flex gap-3 overflow-x-auto pb-1">
            {todayLessons.map((lesson) => (
              <div key={lesson.time} className={`shrink-0 rounded-xl border p-3 min-w-[140px] ${lesson.color}`}>
                <p className="text-[11px] font-mono opacity-70 mb-1">{lesson.time}</p>
                <p className="font-semibold text-sm">{lesson.subject}</p>
                <p className="text-[11px] opacity-75 mt-0.5">{lesson.teacher}</p>
                <p className="text-[11px] opacity-60">{lesson.room}</p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Full week timetable */}
      <Card className="overflow-x-auto">
        <CardHeader>
          <CardTitle>Weekly Schedule</CardTitle>
          <span className="text-xs text-muted">Class 3B · Academic Year 2024–25</span>
        </CardHeader>
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 pr-4 text-muted font-medium w-20">Time</th>
              {DAYS.map((d) => (
                <th key={d} className={`text-center py-3 px-2 font-medium ${d === today ? 'text-accent' : 'text-muted'}`}>
                  {d.slice(0, 3)}
                  {d === today && <span className="block w-1.5 h-1.5 bg-accent rounded-full mx-auto mt-1" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {HOURS.map((hour) => {
              const isBreak = hour === '12:00';
              return (
                <tr key={hour} className="border-t border-border/40">
                  <td className="py-2 pr-4 text-xs font-mono text-muted align-top pt-3">{hour}</td>
                  {isBreak ? (
                    <td colSpan={5} className="py-2 px-2">
                      <div className="bg-surface border border-border/50 rounded-lg px-3 py-2 text-xs text-muted text-center">— Lunch Break —</div>
                    </td>
                  ) : DAYS.map((day) => {
                    const lesson = TIMETABLE[hour]?.[day];
                    return (
                      <td key={day} className="py-1.5 px-1">
                        {lesson ? (
                          <div className={`rounded-lg border px-2 py-2 text-xs leading-tight ${lesson.color}`}>
                            <p className="font-semibold">{lesson.subject}</p>
                            <p className="opacity-70 mt-0.5 truncate">{lesson.teacher}</p>
                            <p className="opacity-50 mt-0.5">{lesson.room}</p>
                          </div>
                        ) : <div className="h-14" />}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </Card>
    </DashboardLayout>
  );
}

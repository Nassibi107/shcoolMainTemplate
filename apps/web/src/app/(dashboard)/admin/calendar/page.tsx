'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useAuth } from '@/hooks/useAuth';

type EventType = 'HOLIDAY' | 'EXAM' | 'ACTIVITY' | 'MEETING' | 'DEADLINE';

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  type: EventType;
  description?: string;
  allDay?: boolean;
}

const EVENT_CONFIG: Record<EventType, { color: string; bg: string; badge: 'success' | 'danger' | 'warning' | 'secondary' | 'muted' }> = {
  HOLIDAY: { color: 'text-success', bg: 'bg-success', badge: 'success' },
  EXAM: { color: 'text-danger', bg: 'bg-danger', badge: 'danger' },
  ACTIVITY: { color: 'text-accent', bg: 'bg-accent', badge: 'secondary' },
  MEETING: { color: 'text-warning', bg: 'bg-warning', badge: 'warning' },
  DEADLINE: { color: 'text-muted', bg: 'bg-muted', badge: 'muted' },
};

const MOCK_EVENTS: CalendarEvent[] = [
  { id: '1', title: 'Spring Break', date: '2024-03-25', type: 'HOLIDAY', allDay: true },
  { id: '2', title: 'Mathematics Exam — Grade 3', date: '2024-03-18', type: 'EXAM' },
  { id: '3', title: 'Physics Exam — Grade 4', date: '2024-03-19', type: 'EXAM' },
  { id: '4', title: 'Science Fair', date: '2024-03-20', type: 'ACTIVITY', description: 'Annual science fair in the main hall' },
  { id: '5', title: 'Parent-Teacher Meeting', date: '2024-03-22', type: 'MEETING', description: 'Q2 progress discussion' },
  { id: '6', title: 'Report Cards Due', date: '2024-03-28', type: 'DEADLINE' },
  { id: '7', title: 'Sports Day', date: '2024-03-15', type: 'ACTIVITY', description: 'Annual inter-class competition' },
  { id: '8', title: 'English Essay Deadline', date: '2024-03-14', type: 'DEADLINE' },
  { id: '9', title: 'Staff Meeting', date: '2024-03-12', type: 'MEETING' },
  { id: '10', title: 'National Day', date: '2024-03-06', type: 'HOLIDAY', allDay: true },
];

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function AdminCalendarPage() {
  const { user } = useAuth();
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [events, setEvents] = useState<CalendarEvent[]>(MOCK_EVENTS);
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', type: 'ACTIVITY' as EventType, description: '' });

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  const monthStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}`;

  const eventsThisMonth = events.filter((e) => e.date.startsWith(monthStr));

  function getEventsForDay(day: number) {
    const dateStr = `${monthStr}-${String(day).padStart(2, '0')}`;
    return events.filter((e) => e.date === dateStr);
  }

  function prevMonth() {
    if (currentMonth === 0) { setCurrentMonth(11); setCurrentYear((y) => y - 1); }
    else setCurrentMonth((m) => m - 1);
  }

  function nextMonth() {
    if (currentMonth === 11) { setCurrentMonth(0); setCurrentYear((y) => y + 1); }
    else setCurrentMonth((m) => m + 1);
  }

  function handleAddEvent() {
    if (!newEvent.title || !newEvent.date) return;
    setEvents((prev) => [...prev, { ...newEvent, id: String(Date.now()) }]);
    setIsAddOpen(false);
    setNewEvent({ title: '', date: '', type: 'ACTIVITY', description: '' });
  }

  function removeEvent(id: string) {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Academic Calendar">
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Calendar Grid */}
        <div className="xl:col-span-3 bg-card rounded-card shadow-card p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-surface transition-colors">
                <ChevronLeft className="w-4 h-4 text-muted" />
              </button>
              <h2 className="font-heading font-bold text-xl text-primary">{MONTHS[currentMonth]} {currentYear}</h2>
              <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-surface transition-colors">
                <ChevronRight className="w-4 h-4 text-muted" />
              </button>
            </div>
            <Button size="sm" leftIcon={<Plus className="w-4 h-4" />} onClick={() => setIsAddOpen(true)}>
              Add Event
            </Button>
          </div>

          {/* Week days header */}
          <div className="grid grid-cols-7 mb-2">
            {WEEK_DAYS.map((d) => (
              <div key={d} className="text-center text-xs font-medium text-muted py-2">{d}</div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDay }, (_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const dayEvents = getEventsForDay(day);
              const isToday = today.getFullYear() === currentYear && today.getMonth() === currentMonth && today.getDate() === day;
              const isSelected = selectedDay === day;

              return (
                <div
                  key={day}
                  onClick={() => setSelectedDay(isSelected ? null : day)}
                  className={`min-h-[72px] p-1.5 rounded-lg border cursor-pointer transition-all ${
                    isToday ? 'border-accent bg-accent/5' :
                    isSelected ? 'border-accent/50 bg-surface' :
                    'border-transparent hover:border-border hover:bg-surface/60'
                  }`}
                >
                  <span className={`text-xs font-medium inline-flex items-center justify-center w-6 h-6 rounded-full ${
                    isToday ? 'bg-accent text-white' : 'text-app-text'
                  }`}>
                    {day}
                  </span>
                  <div className="mt-1 space-y-0.5">
                    {dayEvents.slice(0, 2).map((ev) => (
                      <div
                        key={ev.id}
                        className={`text-white text-[10px] font-medium rounded px-1 py-0.5 truncate ${EVENT_CONFIG[ev.type].bg}`}
                      >
                        {ev.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[10px] text-muted">+{dayEvents.length - 2} more</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar */}
        <div className="xl:col-span-1 space-y-4">
          {/* Legend */}
          <div className="bg-card rounded-card shadow-card p-4">
            <h3 className="font-heading font-semibold text-primary mb-3 text-sm">Event Types</h3>
            <div className="space-y-2">
              {Object.entries(EVENT_CONFIG).map(([type, config]) => (
                <div key={type} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${config.bg}`} />
                  <span className="text-sm text-app-text capitalize">{type.toLowerCase()}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming events */}
          <div className="bg-card rounded-card shadow-card p-4">
            <h3 className="font-heading font-semibold text-primary mb-3 text-sm">
              {selectedDay
                ? `Events — ${MONTHS[currentMonth].slice(0, 3)} ${selectedDay}`
                : `This Month (${eventsThisMonth.length})`
              }
            </h3>
            <div className="space-y-2 max-h-80 overflow-y-auto">
              {(selectedDay ? getEventsForDay(selectedDay) : eventsThisMonth).map((ev) => (
                <div key={ev.id} className="flex items-start gap-2 p-2 rounded-lg hover:bg-surface group">
                  <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${EVENT_CONFIG[ev.type].bg}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-app-text truncate">{ev.title}</p>
                    <p className="text-[10px] text-muted">{ev.date}</p>
                  </div>
                  <button onClick={() => removeEvent(ev.id)} className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <X className="w-3 h-3 text-muted hover:text-danger" />
                  </button>
                </div>
              ))}
              {(selectedDay ? getEventsForDay(selectedDay) : eventsThisMonth).length === 0 && (
                <p className="text-xs text-muted text-center py-4">No events.</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add Event Modal */}
      <Modal isOpen={isAddOpen} onClose={() => setIsAddOpen(false)} title="Add Calendar Event" size="md">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Event Title</label>
            <input className="input-field w-full" value={newEvent.title} onChange={(e) => setNewEvent((p) => ({ ...p, title: e.target.value }))} placeholder="e.g. Final Exams" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-app-text mb-1">Date</label>
              <input type="date" className="input-field w-full" value={newEvent.date} onChange={(e) => setNewEvent((p) => ({ ...p, date: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-app-text mb-1">Type</label>
              <select className="input-field w-full" value={newEvent.type} onChange={(e) => setNewEvent((p) => ({ ...p, type: e.target.value as EventType }))}>
                {Object.keys(EVENT_CONFIG).map((t) => <option key={t} value={t}>{t.charAt(0) + t.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-app-text mb-1">Description (optional)</label>
            <textarea className="input-field w-full resize-none" rows={3} value={newEvent.description} onChange={(e) => setNewEvent((p) => ({ ...p, description: e.target.value }))} placeholder="Additional details…" />
          </div>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleAddEvent} disabled={!newEvent.title || !newEvent.date}>Add Event</Button>
          </div>
        </div>
      </Modal>
    </DashboardLayout>
  );
}

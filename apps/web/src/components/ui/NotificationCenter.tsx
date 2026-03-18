'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Bell, X, CheckCheck, GraduationCap, CreditCard,
  CalendarX, FileText, Info, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type NotifCategory = 'grade' | 'payment' | 'absence' | 'certificate' | 'system';

export interface Notification {
  id: string;
  category: NotifCategory;
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
  actionLabel?: string;
  actionHref?: string;
}

const CATEGORY_CONFIG: Record<NotifCategory, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  grade:       { icon: GraduationCap, color: 'text-accent',   bg: 'bg-accent/10' },
  payment:     { icon: CreditCard,    color: 'text-warning',  bg: 'bg-warning/10' },
  absence:     { icon: CalendarX,     color: 'text-danger',   bg: 'bg-danger/10' },
  certificate: { icon: FileText,      color: 'text-success',  bg: 'bg-success/10' },
  system:      { icon: Info,          color: 'text-muted',    bg: 'bg-surface' },
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: '1', category: 'grade', title: 'New Grade Posted', body: 'Mathematics midterm grade has been posted: 87/100', timestamp: '5 min ago', isRead: false, actionLabel: 'View Grades', actionHref: '/student/grades' },
  { id: '2', category: 'absence', title: 'Absence Alert', body: 'Ahmed Hassan was marked absent today (3rd consecutive day)', timestamp: '1 hr ago', isRead: false, actionLabel: 'View Attendance', actionHref: '/admin/attendance' },
  { id: '3', category: 'payment', title: 'Payment Due Tomorrow', body: 'Tuition fee for Sara Ali (Class 3B) is due on March 18', timestamp: '2 hrs ago', isRead: false, actionLabel: 'View Payments', actionHref: '/admin/payments' },
  { id: '4', category: 'certificate', title: 'Certificate Ready', body: "Ahmed Hassan's Registration Certificate is ready for download", timestamp: '3 hrs ago', isRead: true, actionLabel: 'Download', actionHref: '/admin/certificates' },
  { id: '5', category: 'grade', title: 'Grades Published', body: 'Physics Term 2 grades have been published for Class 4A', timestamp: 'Yesterday', isRead: true },
  { id: '6', category: 'payment', title: 'Payment Overdue', body: 'Mohamed Saad (STU-003) has an overdue tuition fee of $1,200', timestamp: 'Yesterday', isRead: true, actionLabel: 'View', actionHref: '/admin/payments' },
  { id: '7', category: 'system', title: 'System Maintenance', body: 'Scheduled maintenance tonight from 11 PM to 1 AM', timestamp: '2 days ago', isRead: true },
];

const CATEGORIES: { key: NotifCategory | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'grade', label: 'Grades' },
  { key: 'absence', label: 'Absences' },
  { key: 'payment', label: 'Payments' },
  { key: 'certificate', label: 'Certificates' },
  { key: 'system', label: 'System' },
];

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [activeCategory, setActiveCategory] = useState<NotifCategory | 'all'>('all');
  const panelRef = useRef<HTMLDivElement>(null);

  const unread = notifications.filter((n) => !n.isRead).length;

  const filtered = notifications.filter((n) =>
    activeCategory === 'all' || n.category === activeCategory
  );

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  }

  function markRead(id: string) {
    setNotifications((prev) => prev.map((n) => n.id === id ? { ...n, isRead: true } : n));
  }

  function dismiss(id: string) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  return (
    <div className="relative" ref={panelRef}>
      {/* Bell button */}
      <button
        onClick={() => setIsOpen((p) => !p)}
        className="relative p-2 rounded-lg hover:bg-surface text-muted hover:text-primary transition-colors"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unread > 0 && (
          <span className="absolute top-1 right-1 min-w-[18px] h-[18px] bg-danger rounded-full text-white text-[9px] font-bold flex items-center justify-center px-0.5 leading-none">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {/* Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-card rounded-card shadow-card-hover border border-border z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-primary" />
              <span className="font-heading font-bold text-primary text-sm">Notifications</span>
              {unread > 0 && (
                <span className="text-xs bg-danger text-white font-bold rounded-full px-1.5 py-0.5">{unread}</span>
              )}
            </div>
            <div className="flex items-center gap-2">
              {unread > 0 && (
                <button
                  onClick={markAllRead}
                  className="flex items-center gap-1 text-xs text-accent hover:underline"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Mark all read
                </button>
              )}
              <button onClick={() => setIsOpen(false)} className="text-muted hover:text-primary transition-colors p-0.5">
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Category tabs */}
          <div className="flex gap-1 px-3 py-2 border-b border-border overflow-x-auto">
            {CATEGORIES.map((cat) => {
              const count = cat.key === 'all'
                ? notifications.filter((n) => !n.isRead).length
                : notifications.filter((n) => n.category === cat.key && !n.isRead).length;
              return (
                <button
                  key={cat.key}
                  onClick={() => setActiveCategory(cat.key)}
                  className={cn(
                    'shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                    activeCategory === cat.key
                      ? 'bg-accent text-white'
                      : 'bg-surface text-muted hover:text-app-text hover:bg-border'
                  )}
                >
                  {cat.label}
                  {count > 0 && (
                    <span className={cn(
                      'text-[10px] font-bold rounded-full px-1 leading-tight',
                      activeCategory === cat.key ? 'bg-white/20 text-white' : 'bg-danger/10 text-danger'
                    )}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted">
                <Bell className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No notifications here</p>
              </div>
            )}
            {filtered.map((notif) => {
              const config = CATEGORY_CONFIG[notif.category];
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-surface/60 cursor-pointer group transition-colors',
                    !notif.isRead && 'bg-accent/3'
                  )}
                >
                  {/* Category icon */}
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm leading-tight', !notif.isRead ? 'font-semibold text-app-text' : 'font-medium text-app-text/80')}>
                        {notif.title}
                      </p>
                      <div className="flex items-center gap-1.5 shrink-0">
                        {!notif.isRead && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                        <button
                          onClick={(e) => { e.stopPropagation(); dismiss(notif.id); }}
                          className="opacity-0 group-hover:opacity-100 transition-opacity text-muted hover:text-danger"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{notif.body}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted/70">{notif.timestamp}</span>
                      {notif.actionLabel && (
                        <a
                          href={notif.actionHref ?? '#'}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-semibold text-accent hover:underline"
                        >
                          {notif.actionLabel} →
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-surface/50 text-center">
            <button className="text-xs text-accent hover:underline font-medium">
              View all notifications
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

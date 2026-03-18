'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell, X, CheckCheck, GraduationCap, CreditCard,
  CalendarX, FileText, Info,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

export type NotifCategory = 'grade' | 'payment' | 'absence' | 'certificate' | 'system' | 'document_request';

const CATEGORY_CONFIG: Record<string, { icon: React.ComponentType<{ className?: string }>; color: string; bg: string }> = {
  GRADE_POSTED:     { icon: GraduationCap, color: 'text-accent',   bg: 'bg-accent/10' },
  PAYMENT_DUE:      { icon: CreditCard,    color: 'text-warning',  bg: 'bg-warning/10' },
  ABSENCE_ALERT:    { icon: CalendarX,     color: 'text-danger',   bg: 'bg-danger/10' },
  DOCUMENT_READY:   { icon: FileText,      color: 'text-success',  bg: 'bg-success/10' },
  DOCUMENT_REQUEST: { icon: FileText,      color: 'text-accent',   bg: 'bg-accent/10' },
  SYSTEM:           { icon: Info,          color: 'text-muted',    bg: 'bg-surface' },
};

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} min ago`;
  if (diffHours < 24) return `${diffHours} hr ago`;
  if (diffDays < 7) return diffDays === 1 ? 'Yesterday' : `${diffDays} days ago`;
  return date.toLocaleDateString();
}

export function NotificationCenter() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const panelRef = useRef<HTMLDivElement>(null);
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(10);

  const unread = unreadCount;

  const filtered = notifications.filter((n) =>
    activeCategory === 'all' || n.type === activeCategory
  );

  function handleMarkRead(id: string) {
    markAsRead(id);
  }

  function handleMarkAllRead() {
    markAllAsRead();
  }

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [isOpen]);

  const categoryTypes = ['all', 'DOCUMENT_REQUEST', 'DOCUMENT_READY', 'GRADE_POSTED', 'PAYMENT_DUE', 'ABSENCE_ALERT', 'SYSTEM'];

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
                  onClick={handleMarkAllRead}
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
            <button
              onClick={() => setActiveCategory('all')}
              className={cn(
                'shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium transition-all',
                activeCategory === 'all'
                  ? 'bg-accent text-white'
                  : 'bg-surface text-muted hover:text-app-text hover:bg-border'
              )}
            >
              All
              {unread > 0 && (
                <span className={cn(
                  'text-[10px] font-bold rounded-full px-1 leading-tight',
                  activeCategory === 'all' ? 'bg-white/20 text-white' : 'bg-danger/10 text-danger'
                )}>
                  {unread}
                </span>
              )}
            </button>
          </div>

          {/* Notification list */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {loading && (
              <div className="flex flex-col items-center justify-center py-10 text-muted">
                <div className="animate-pulse">Loading…</div>
              </div>
            )}
            {!loading && filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-10 text-muted">
                <Bell className="w-8 h-8 mb-2 opacity-30" />
                <p className="text-sm">No notifications here</p>
              </div>
            )}
            {!loading && filtered.map((notif) => {
              const config = CATEGORY_CONFIG[notif.type] ?? CATEGORY_CONFIG.SYSTEM;
              const Icon = config.icon;
              return (
                <div
                  key={notif.id}
                  onClick={() => handleMarkRead(notif.id)}
                  className={cn(
                    'flex items-start gap-3 px-4 py-3 hover:bg-surface/60 cursor-pointer group transition-colors',
                    !notif.isRead && 'bg-accent/3'
                  )}
                >
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5', config.bg)}>
                    <Icon className={cn('w-4 h-4', config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn('text-sm leading-tight', !notif.isRead ? 'font-semibold text-app-text' : 'font-medium text-app-text/80')}>
                        {notif.title}
                      </p>
                      {!notif.isRead && <span className="w-2 h-2 rounded-full bg-accent shrink-0" />}
                    </div>
                    <p className="text-xs text-muted mt-0.5 leading-relaxed">{notif.body}</p>
                    <div className="flex items-center justify-between mt-1.5">
                      <span className="text-[10px] text-muted/70">{formatTimestamp(notif.createdAt)}</span>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={(e) => e.stopPropagation()}
                          className="text-[11px] font-semibold text-accent hover:underline"
                        >
                          View →
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div className="px-4 py-2.5 border-t border-border bg-surface/50 text-center">
            <Link href="/notifications" className="text-xs text-accent hover:underline font-medium">
              View all notifications
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

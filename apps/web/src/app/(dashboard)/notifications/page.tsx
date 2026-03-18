'use client';

import { Bell, CheckCheck } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/hooks/useAuth';
import { useNotifications } from '@/hooks/useNotifications';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

function formatTimestamp(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

const TYPE_CONFIG: Record<string, { icon: string; color: string }> = {
  DOCUMENT_REQUEST: { icon: '📄', color: 'bg-accent/10 text-accent' },
  DOCUMENT_READY: { icon: '✅', color: 'bg-success/10 text-success' },
  GRADE_POSTED: { icon: '📊', color: 'bg-accent/10 text-accent' },
  PAYMENT_DUE: { icon: '💳', color: 'bg-warning/10 text-warning' },
  ABSENCE_ALERT: { icon: '⚠️', color: 'bg-danger/10 text-danger' },
  SYSTEM: { icon: 'ℹ️', color: 'bg-surface text-muted' },
};

export default function NotificationsPage() {
  const { user, loading: authLoading } = useAuth();
  const { notifications, unreadCount, loading, markAsRead, markAllAsRead } = useNotifications(50);

  if (authLoading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Notifications">
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-muted">
          {unreadCount > 0
            ? `${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}`
            : 'All caught up!'}
        </p>
        {unreadCount > 0 && (
          <Button size="sm" variant="ghost" leftIcon={<CheckCheck className="w-4 h-4" />} onClick={markAllAsRead}>
            Mark all as read
          </Button>
        )}
      </div>

      <div className="bg-card rounded-card shadow-card divide-y divide-border">
        {loading && (
          <div className="p-8 text-center text-muted">Loading notifications…</div>
        )}
        {!loading && notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 text-muted">
            <Bell className="w-12 h-12 mb-3 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        )}
        {!loading &&
          notifications.map((notif) => {
            const config = TYPE_CONFIG[notif.type] ?? TYPE_CONFIG.SYSTEM;
            return (
              <div
                key={notif.id}
                onClick={() => markAsRead(notif.id)}
                className={cn(
                  'flex items-start gap-4 p-4 hover:bg-surface/50 cursor-pointer transition-colors',
                  !notif.isRead && 'bg-accent/3'
                )}
              >
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg', config.color)}>
                  {config.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={cn('font-medium', !notif.isRead ? 'text-app-text' : 'text-app-text/80')}>
                    {notif.title}
                  </p>
                  <p className="text-sm text-muted mt-0.5">{notif.body}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted/70">{formatTimestamp(notif.createdAt)}</span>
                    {notif.link && (
                      <a
                        href={notif.link}
                        className="text-xs font-semibold text-accent hover:underline"
                        onClick={(e) => e.stopPropagation()}
                      >
                        View →
                      </a>
                    )}
                  </div>
                </div>
                {!notif.isRead && (
                  <span className="w-2 h-2 rounded-full bg-accent shrink-0 mt-2" />
                )}
              </div>
            );
          })}
      </div>
    </DashboardLayout>
  );
}

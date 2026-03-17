'use client';

import { Bell, Search, Globe } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Avatar } from '../ui/Avatar';
import { AuthUser } from '@/lib/auth';

interface TopNavProps {
  user: AuthUser;
  pageTitle?: string;
}

const LANGUAGES = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'ar', label: 'AR' },
];

export function TopNav({ user, pageTitle }: TopNavProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [lang, setLang] = useState('en');
  const [unreadCount] = useState(3);

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      {/* Page title */}
      <div>
        {pageTitle && (
          <h1 className="font-heading font-bold text-primary text-lg">{pageTitle}</h1>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-surface rounded-input px-2 py-1.5 border border-border">
          <Globe className="w-3.5 h-3.5 text-muted" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs text-app-text bg-transparent border-none outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>
                {l.label}
              </option>
            ))}
          </select>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen((p) => !p)}
            className="relative p-2 rounded-lg hover:bg-surface text-muted hover:text-primary transition-colors"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-4 h-4 bg-danger rounded-full text-white text-[10px] font-bold flex items-center justify-center">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-card rounded-card shadow-card-hover border border-border z-50 animate-fade-in overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="font-semibold text-primary text-sm">Notifications</span>
                <button className="text-xs text-accent hover:underline">Mark all read</button>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-border">
                {['New grade posted for Math', '3 absences this week', 'Payment due tomorrow'].map((msg, i) => (
                  <div key={i} className={cn('px-4 py-3 text-sm hover:bg-surface cursor-pointer', i < unreadCount && 'bg-accent/5')}>
                    <div className="flex gap-2 items-start">
                      <span className={cn('w-2 h-2 rounded-full mt-1.5 shrink-0', i < unreadCount ? 'bg-accent' : 'bg-border')} />
                      <p className="text-app-text">{msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User avatar */}
        <div className="flex items-center gap-2.5 pl-2 border-l border-border">
          <Avatar
            src={user.avatarUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size="sm"
          />
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-primary leading-tight">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-xs text-muted capitalize">{user.role.toLowerCase()}</p>
          </div>
        </div>
      </div>
    </header>
  );
}

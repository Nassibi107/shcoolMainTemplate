'use client';

import { Globe } from 'lucide-react';
import { useState } from 'react';
import { AuthUser } from '@/lib/auth';
import { Avatar } from '../ui/Avatar';
import { NotificationCenter } from '../ui/NotificationCenter';
import Link from 'next/link';

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
  const [lang, setLang] = useState('en');

  return (
    <header className="h-16 bg-card border-b border-border flex items-center justify-between px-6 shrink-0">
      {/* Page title */}
      <div>
        {pageTitle && (
          <h1 className="font-heading font-bold text-primary text-lg">{pageTitle}</h1>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        {/* Language selector */}
        <div className="flex items-center gap-1 bg-surface rounded-lg px-2 py-1.5 border border-border">
          <Globe className="w-3.5 h-3.5 text-muted" />
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            className="text-xs text-app-text bg-transparent border-none outline-none cursor-pointer"
          >
            {LANGUAGES.map((l) => (
              <option key={l.code} value={l.code}>{l.label}</option>
            ))}
          </select>
        </div>

        {/* Notification Center */}
        <NotificationCenter />

        {/* User avatar — links to account page */}
        <Link
          href={`/${user.role.toLowerCase()}/account`}
          className="flex items-center gap-2.5 pl-2 border-l border-border hover:opacity-80 transition-opacity"
        >
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
        </Link>
      </div>
    </header>
  );
}

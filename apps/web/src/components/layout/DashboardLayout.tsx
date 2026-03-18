'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { AuthUser } from '@/lib/auth';

interface DashboardLayoutProps {
  user: AuthUser;
  pageTitle?: string;
  children: ReactNode;
}

export function DashboardLayout({ user, pageTitle, children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar user={user} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <TopNav user={user} pageTitle={pageTitle} />
        <main className="flex-1 overflow-y-auto bg-surface p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

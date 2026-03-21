'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  CreditCard,
  FileText,
  CalendarDays,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  UserCheck,
  ClipboardList,
  BarChart3,
  School,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { AuthUser, logout } from '@/lib/auth';
import { Avatar } from '../ui/Avatar';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

const navByRole: Record<string, NavItem[]> = {
  ADMIN: [
    { label: 'Dashboard',     href: '/admin',              icon: LayoutDashboard },
    { label: 'Students',      href: '/admin/students',     icon: GraduationCap },
    { label: 'Teachers',      href: '/admin/teachers',     icon: UserCheck },
    { label: 'Classes',       href: '/admin/classes',      icon: BookOpen },
    { label: 'Timetable',     href: '/admin/timetable',   icon: CalendarDays },
    { label: 'Attendance',    href: '/admin/attendance',   icon: ClipboardList },
    { label: 'Grades',        href: '/admin/grades',       icon: BarChart3 },
    { label: 'Payments',      href: '/admin/payments',     icon: CreditCard },
    { label: 'Certificates',  href: '/admin/certificates', icon: FileText },
    { label: 'Documents',     href: '/admin/documents',    icon: FileText },
    { label: 'Calendar',      href: '/admin/calendar',     icon: CalendarDays },
    { label: 'Reports',       href: '/admin/reports',      icon: BarChart3 },
    { label: 'Leave Requests',href: '/admin/leaves',       icon: FileText },
    { label: 'Settings',      href: '/admin/settings',     icon: Settings },
  ],
  ASSISTANT: [
    { label: 'Dashboard',  href: '/assistant',          icon: LayoutDashboard },
    { label: 'Timetable',  href: '/assistant/timetable', icon: CalendarDays },
    { label: 'Students',   href: '/assistant/students', icon: GraduationCap },
    { label: 'Teachers',   href: '/assistant/teachers', icon: UserCheck },
    { label: 'Parents',    href: '/assistant/parents',  icon: Users },
    { label: 'Payments',   href: '/assistant/payments', icon: CreditCard },
    { label: 'Documents',  href: '/assistant/documents',icon: FileText },
    { label: 'Leave Requests',href: '/assistant/leaves', icon: FileText },
  ],
  TEACHER: [
    { label: 'Dashboard',  href: '/teacher',            icon: LayoutDashboard },
    { label: 'Schedule',   href: '/teacher/schedule',   icon: CalendarDays },
    { label: 'Attendance', href: '/teacher/attendance', icon: ClipboardList },
    { label: 'Gradebook',  href: '/teacher/gradebook',  icon: BarChart3 },
    { label: 'Leave',      href: '/teacher/leave',      icon: FileText },
  ],
  STUDENT: [
    { label: 'Dashboard',  href: '/student',             icon: LayoutDashboard },
    { label: 'Timetable',  href: '/student/timetable',   icon: CalendarDays },
    { label: 'Grades',     href: '/student/grades',      icon: BarChart3 },
    { label: 'Attendance', href: '/student/attendance',  icon: ClipboardList },
    { label: 'Payments',   href: '/student/payments',    icon: CreditCard },
    { label: 'Certificates',href: '/student/certificates',icon: FileText },
    { label: 'Documents',  href: '/student/documents',  icon: FileText },
  ],
  PARENT: [
    { label: 'Dashboard',  href: '/parent',              icon: LayoutDashboard },
    { label: 'Timetable',  href: '/parent/timetable',    icon: CalendarDays },
    { label: 'Grades',     href: '/parent/grades',       icon: BarChart3 },
    { label: 'Attendance', href: '/parent/attendance',   icon: ClipboardList },
    { label: 'Documents',  href: '/parent/documents',    icon: FileText },
  ],
};

interface SidebarProps {
  user: AuthUser;
}

export function Sidebar({ user }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const navItems = navByRole[user.role] ?? [];

  async function handleLogout() {
    await logout();
    window.location.href = '/login';
  }

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-primary text-white transition-all duration-300 shrink-0 relative',
        collapsed ? 'w-16' : 'w-60',
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/10">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shrink-0">
          <School className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <div className="overflow-hidden">
            <p className="font-heading font-bold text-white text-base leading-tight truncate">
              Scope School
            </p>
            <p className="text-white/50 text-xs truncate">{user.school.name}</p>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-0.5">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            item.href === `/${user.role.toLowerCase()}`
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-accent text-white'
                  : 'text-white/70 hover:bg-white/10 hover:text-white',
                collapsed && 'justify-center',
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className="w-4.5 h-4.5 shrink-0 w-5 h-5" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* User + Logout */}
      <div className="border-t border-white/10 p-3 space-y-2">
        <div className={cn('flex items-center gap-2.5', collapsed && 'justify-center')}>
          <Avatar
            src={user.avatarUrl}
            firstName={user.firstName}
            lastName={user.lastName}
            size="sm"
            className="shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden flex-1 min-w-0">
              <p className="text-white text-xs font-semibold truncate">
                {user.firstName} {user.lastName}
              </p>
              <p className="text-white/50 text-xs truncate capitalize">
                {user.role.toLowerCase()}
              </p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm text-white/70 hover:bg-white/10 hover:text-white transition-all duration-150',
            collapsed && 'justify-center',
          )}
          title={collapsed ? 'Logout' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed((prev) => !prev)}
        className="absolute -right-3 top-16 w-6 h-6 bg-accent rounded-full flex items-center justify-center shadow-md hover:scale-110 transition-transform"
      >
        {collapsed ? (
          <ChevronRight className="w-3 h-3 text-white" />
        ) : (
          <ChevronLeft className="w-3 h-3 text-white" />
        )}
      </button>
    </aside>
  );
}

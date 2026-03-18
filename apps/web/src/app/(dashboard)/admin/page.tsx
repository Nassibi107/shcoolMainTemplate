'use client';

import { GraduationCap, UserCheck, CreditCard, UserX } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { KpiCard } from '@/components/dashboard/KpiCard';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { AttendanceChart } from '@/components/dashboard/AttendanceChart';
import { GradeDistributionChart } from '@/components/dashboard/GradeDistributionChart';
import { useDashboardStats, useMonthlyRevenue, useAttendanceByClass, useGradeDistribution } from '@/hooks/useDashboardStats';
import { useAuth } from '@/hooks/useAuth';
import { formatCurrency } from '@/lib/utils';
import { useNotifications } from '@/hooks/useNotifications';

export default function AdminDashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const { stats, loading: statsLoading } = useDashboardStats();
  const { data: revenueData, loading: revenueLoading } = useMonthlyRevenue();
  const { data: attendanceData, loading: attendanceLoading } = useAttendanceByClass();
  const { data: gradeDistribution, loading: gradeLoading } = useGradeDistribution();
  const { notifications } = useNotifications(5);

  if (authLoading || !user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Dashboard">
      {/* KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5 mb-8">
        <KpiCard
          title="Total Students"
          value={stats?.totalStudents.toLocaleString() ?? '—'}
          subtitle="vs last month"
          icon={GraduationCap}
          trend={4.2}
          loading={statsLoading}
        />
        <KpiCard
          title="Active Teachers"
          value={stats?.activeTeachers.toLocaleString() ?? '—'}
          subtitle="vs last month"
          icon={UserCheck}
          trend={2.1}
          loading={statsLoading}
        />
        <KpiCard
          title="Monthly Revenue"
          value={stats ? formatCurrency(stats.monthlyRevenue) : '—'}
          subtitle="vs last month"
          icon={CreditCard}
          trend={5.8}
          loading={statsLoading}
        />
        <KpiCard
          title="Absences Today"
          value={stats?.absencesToday.toLocaleString() ?? '—'}
          subtitle="across all classes"
          icon={UserX}
          trend={-8.3}
          loading={statsLoading}
        />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        <div className="xl:col-span-2">
          <RevenueChart data={revenueData} loading={revenueLoading} />
        </div>
        <GradeDistributionChart
          data={gradeDistribution ?? { A: 0, B: 0, C: 0, D: 0, F: 0 }}
          loading={gradeLoading}
        />
      </div>

      {/* Attendance chart */}
      <div className="mb-8">
        <AttendanceChart data={attendanceData} loading={attendanceLoading} />
      </div>

      {/* Recent activity */}
      <div className="bg-card rounded-card shadow-card p-6">
        <h3 className="font-heading font-bold text-primary mb-4">Recent Activity</h3>
        <div className="space-y-0 divide-y divide-border">
          {notifications.length === 0 && (
            <p className="text-sm text-muted py-3">No recent activity.</p>
          )}
          {notifications.map((item) => (
            <div key={item.id} className="flex items-start gap-3 py-3">
              <div
                className={`mt-1 w-2 h-2 rounded-full shrink-0 ${
                  item.type === 'DOCUMENT_READY' ? 'bg-success' :
                  item.type === 'ABSENCE_ALERT' ? 'bg-danger' :
                  item.type === 'WARNING' ? 'bg-warning' : 'bg-accent'
                }`}
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-app-text">{item.title}</p>
                <p className="text-xs text-muted mt-0.5 truncate">{item.body}</p>
              </div>
              <span className="text-xs text-muted whitespace-nowrap shrink-0">
                {new Date(item.createdAt).toLocaleTimeString()}
              </span>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}

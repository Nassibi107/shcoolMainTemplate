'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';

interface AttendanceChartProps {
  data: Array<{ className: string; rate: number }>;
  loading?: boolean;
}

function getBarColor(rate: number): string {
  if (rate >= 90) return '#2EC4A9';
  if (rate >= 80) return '#F5A623';
  return '#E85D4A';
}

export function AttendanceChart({ data, loading = false }: AttendanceChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Attendance Rate by Class</CardTitle>
        <span className="text-xs text-muted">All time</span>
      </CardHeader>
      {loading ? (
        <Skeleton className="h-56 w-full mt-2" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }} barSize={32}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" vertical={false} />
            <XAxis
              dataKey="className"
              tick={{ fontSize: 11, fill: '#8A9BB0' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              domain={[0, 100]}
              tickFormatter={(v) => `${v}%`}
              tick={{ fontSize: 11, fill: '#8A9BB0' }}
              axisLine={false}
              tickLine={false}
              width={40}
            />
            <Tooltip
              formatter={(value: number) => [`${value}%`, 'Attendance']}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 13,
                boxShadow: '0 2px 12px rgba(15,31,61,0.08)',
              }}
            />
            <Bar dataKey="rate" radius={[4, 4, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getBarColor(entry.rate)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

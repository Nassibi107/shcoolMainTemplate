'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';
import { formatCurrency } from '@/lib/utils';

interface RevenueChartProps {
  data: Array<{ month: string; revenue: number }>;
  loading?: boolean;
}

function formatMonth(month: string) {
  const [year, m] = month.split('-');
  return new Date(parseInt(year), parseInt(m) - 1).toLocaleDateString('en-US', {
    month: 'short',
    year: '2-digit',
  });
}

export function RevenueChart({ data, loading = false }: RevenueChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Revenue</CardTitle>
        <span className="text-xs text-muted">Last 7 months</span>
      </CardHeader>
      {loading ? (
        <Skeleton className="h-56 w-full mt-2" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={data} margin={{ top: 4, right: 8, bottom: 4, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E2E8F0" />
            <XAxis
              dataKey="month"
              tickFormatter={formatMonth}
              tick={{ fontSize: 11, fill: '#8A9BB0' }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              tick={{ fontSize: 11, fill: '#8A9BB0' }}
              axisLine={false}
              tickLine={false}
              width={48}
            />
            <Tooltip
              formatter={(value: number) => [formatCurrency(value), 'Revenue']}
              labelFormatter={formatMonth}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 13,
                boxShadow: '0 2px 12px rgba(15,31,61,0.08)',
              }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#00C2A8"
              strokeWidth={2.5}
              dot={{ fill: '#00C2A8', r: 4, strokeWidth: 0 }}
              activeDot={{ r: 6, strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

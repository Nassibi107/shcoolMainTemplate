'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Card, CardHeader, CardTitle } from '../ui/Card';
import { Skeleton } from '../ui/LoadingSkeleton';

interface GradeDistributionChartProps {
  data: { A: number; B: number; C: number; D: number; F: number };
  loading?: boolean;
}

const GRADE_COLORS = {
  A: '#2EC4A9',
  B: '#00C2A8',
  C: '#F5A623',
  D: '#3D5A80',
  F: '#E85D4A',
};

export function GradeDistributionChart({ data, loading = false }: GradeDistributionChartProps) {
  const chartData = Object.entries(data).map(([grade, count]) => ({ grade, count }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Grade Distribution</CardTitle>
        <span className="text-xs text-muted">Current term</span>
      </CardHeader>
      {loading ? (
        <Skeleton className="h-56 w-full mt-2" />
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={3}
              dataKey="count"
              nameKey="grade"
            >
              {chartData.map((entry) => (
                <Cell
                  key={entry.grade}
                  fill={GRADE_COLORS[entry.grade as keyof typeof GRADE_COLORS]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number, name: string) => [value, `Grade ${name}`]}
              contentStyle={{
                borderRadius: 8,
                border: '1px solid #E2E8F0',
                fontSize: 13,
                boxShadow: '0 2px 12px rgba(15,31,61,0.08)',
              }}
            />
            <Legend
              formatter={(value) => `Grade ${value}`}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: 12 }}
            />
          </PieChart>
        </ResponsiveContainer>
      )}
    </Card>
  );
}

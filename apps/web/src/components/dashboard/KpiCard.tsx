'use client';

import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/LoadingSkeleton';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ComponentType<{ className?: string }>;
  trend?: number;
  loading?: boolean;
  valueClassName?: string;
}

export function KpiCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  loading = false,
  valueClassName,
}: KpiCardProps) {
  if (loading) {
    return (
      <div className="bg-card rounded-card shadow-card p-6 space-y-3">
        <div className="flex justify-between">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-9 w-9 rounded-lg" />
        </div>
        <Skeleton className="h-8 w-20" />
        <Skeleton className="h-3 w-36" />
      </div>
    );
  }

  return (
    <div className="bg-card rounded-card shadow-card p-6 hover:shadow-card-hover transition-shadow duration-200">
      <div className="flex items-start justify-between mb-4">
        <p className="text-sm font-medium text-muted">{title}</p>
        <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center shrink-0">
          <Icon className="w-5 h-5 text-accent" />
        </div>
      </div>

      <p
        className={cn(
          'font-heading font-bold text-primary text-3xl tracking-tight font-mono',
          valueClassName,
        )}
      >
        {value}
      </p>

      {(subtitle || trend !== undefined) && (
        <div className="flex items-center gap-2 mt-2">
          {trend !== undefined && (
            <span
              className={cn(
                'inline-flex items-center gap-0.5 text-xs font-semibold',
                trend >= 0 ? 'text-success' : 'text-danger',
              )}
            >
              {trend >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              {Math.abs(trend)}%
            </span>
          )}
          {subtitle && <p className="text-xs text-muted">{subtitle}</p>}
        </div>
      )}
    </div>
  );
}

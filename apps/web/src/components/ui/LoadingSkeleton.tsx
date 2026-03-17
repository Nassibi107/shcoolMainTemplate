import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  count?: number;
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton', className)} />;
}

export function SkeletonCard() {
  return (
    <div className="bg-card rounded-card shadow-card p-6 space-y-3">
      <Skeleton className="h-4 w-24" />
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  );
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <div className="bg-card rounded-card shadow-card overflow-hidden">
      <div className="p-4 border-b border-border">
        <Skeleton className="h-8 w-64" />
      </div>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <th key={i} className="p-4 text-left">
                <Skeleton className="h-4 w-20" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-b border-border/50">
              {Array.from({ length: 5 }).map((_, j) => (
                <td key={j} className="p-4">
                  <Skeleton className="h-4 w-full max-w-xs" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-4 border-b border-border/50">
      <Skeleton className="h-8 w-8 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-3 w-28" />
      </div>
      <Skeleton className="h-6 w-16 rounded-full" />
    </div>
  );
}

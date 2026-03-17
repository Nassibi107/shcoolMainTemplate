import { cn } from '@/lib/utils';

type BadgeVariant = 'success' | 'warning' | 'danger' | 'muted' | 'primary' | 'secondary';

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  success: 'bg-success/15 text-success',
  warning: 'bg-warning/15 text-warning',
  danger:  'bg-danger/15 text-danger',
  muted:   'bg-muted/15 text-muted',
  primary: 'bg-primary/10 text-primary',
  secondary: 'bg-secondary/15 text-secondary',
};

export function Badge({ variant = 'muted', children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide',
        variantClasses[variant],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function PaymentStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    PAID: 'success',
    PENDING: 'warning',
    OVERDUE: 'danger',
    CANCELLED: 'muted',
  };
  const labels: Record<string, string> = {
    PAID: 'Paid',
    PENDING: 'Pending',
    OVERDUE: 'Overdue',
    CANCELLED: 'Cancelled',
  };
  return <Badge variant={map[status] ?? 'muted'}>{labels[status] ?? status}</Badge>;
}

export function AttendanceStatusBadge({ status }: { status: string }) {
  const map: Record<string, BadgeVariant> = {
    PRESENT: 'success',
    ABSENT: 'danger',
    LATE: 'warning',
    EXCUSED: 'muted',
  };
  return <Badge variant={map[status] ?? 'muted'}>{status}</Badge>;
}

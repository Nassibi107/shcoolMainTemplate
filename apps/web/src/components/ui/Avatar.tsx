import Image from 'next/image';
import { cn, getInitials } from '@/lib/utils';

interface AvatarProps {
  src?: string | null;
  firstName: string;
  lastName: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

const sizeClasses = {
  sm: 'w-7 h-7 text-xs',
  md: 'w-9 h-9 text-sm',
  lg: 'w-12 h-12 text-base',
  xl: 'w-16 h-16 text-lg',
};

export function Avatar({ src, firstName, lastName, size = 'md', className }: AvatarProps) {
  const initials = getInitials(firstName, lastName);

  if (src) {
    return (
      <div className={cn('relative rounded-full overflow-hidden shrink-0', sizeClasses[size], className)}>
        <Image src={src} alt={`${firstName} ${lastName}`} fill className="object-cover" />
      </div>
    );
  }

  return (
    <div
      className={cn(
        'rounded-full shrink-0 flex items-center justify-center font-semibold bg-secondary/20 text-secondary select-none',
        sizeClasses[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}

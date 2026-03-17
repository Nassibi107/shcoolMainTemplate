import { InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftAddon?: React.ReactNode;
  rightAddon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftAddon, rightAddon, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-app-text">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {leftAddon && (
            <span className="absolute left-3 text-muted">{leftAddon}</span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'input-field',
              leftAddon && 'pl-9',
              rightAddon && 'pr-9',
              error && 'border-danger focus:ring-danger/40 focus:border-danger',
              className,
            )}
            {...props}
          />
          {rightAddon && (
            <span className="absolute right-3 text-muted">{rightAddon}</span>
          )}
        </div>
        {error && <p className="text-xs text-danger mt-0.5">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';

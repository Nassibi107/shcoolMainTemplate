'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { X, CheckCircle2, AlertCircle, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextValue {
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const add = useCallback((type: ToastType, message: string) => {
    const id = `toast-${Date.now()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    setTimeout(() => remove(id), 4000);
  }, [remove]);

  const ctx: ToastContextValue = {
    success: (msg) => add('success', msg),
    error: (msg) => add('error', msg),
    info: (msg) => add('info', msg),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={remove} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastItem({ toast, onRemove }: { toast: Toast; onRemove: (id: string) => void }) {
  const icons: Record<ToastType, ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-success" />,
    error:   <AlertCircle className="w-5 h-5 text-danger" />,
    info:    <Info className="w-5 h-5 text-accent" />,
  };

  const bgClasses: Record<ToastType, string> = {
    success: 'border-l-4 border-success',
    error:   'border-l-4 border-danger',
    info:    'border-l-4 border-accent',
  };

  return (
    <div
      className={cn(
        'flex items-start gap-3 bg-card rounded-card shadow-card-hover px-4 py-3 animate-fade-in',
        bgClasses[toast.type],
      )}
    >
      {icons[toast.type]}
      <p className="flex-1 text-sm text-app-text">{toast.message}</p>
      <button
        onClick={() => onRemove(toast.id)}
        className="text-muted hover:text-primary transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}

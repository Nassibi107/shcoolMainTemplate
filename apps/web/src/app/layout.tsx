import type { Metadata } from 'next';
import './globals.css';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'Scope School',
  description: 'Modern School Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-surface text-app-text">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}

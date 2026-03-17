import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Scope School',
  description: 'Modern School Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-body bg-surface text-app-text">
        {children}
      </body>
    </html>
  );
}

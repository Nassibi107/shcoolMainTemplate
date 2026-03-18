import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function getUiPrefs() {
  if (typeof window === 'undefined') {
    return { locale: 'fr-MA', currency: 'MAD' };
  }
  const locale = localStorage.getItem('ui:language') || 'fr-MA';
  const currency = localStorage.getItem('ui:currency') || 'MAD';
  return { locale, currency };
}

export function formatCurrency(amount: number, currency?: string): string {
  const prefs = getUiPrefs();
  const selectedCurrency = currency || prefs.currency || 'MAD';
  return new Intl.NumberFormat(prefs.locale || 'fr-MA', { style: 'currency', currency: selectedCurrency }).format(amount);
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions): string {
  const prefs = getUiPrefs();
  return new Intl.DateTimeFormat(prefs.locale || 'fr-MA', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    ...options,
  }).format(new Date(date));
}

export function getInitials(firstName: string, lastName: string): string {
  return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
}

export function truncate(text: string, maxLength: number): string {
  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text;
}

export function buildQueryString(params: Record<string, string | number | boolean | undefined>): string {
  const searchParams = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value !== undefined && value !== '') {
      searchParams.set(key, String(value));
    }
  }
  const qs = searchParams.toString();
  return qs ? `?${qs}` : '';
}

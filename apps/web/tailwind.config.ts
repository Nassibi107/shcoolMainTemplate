import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F1F3D',
        accent: '#00C2A8',
        secondary: '#3D5A80',
        surface: '#F4F7FA',
        'app-text': '#1C2B3A',
        muted: '#8A9BB0',
        warning: '#F5A623',
        danger: '#E85D4A',
        success: '#2EC4A9',
        border: '#E2E8F0',
        card: '#FFFFFF',
      },
      fontFamily: {
        heading: ['Plus Jakarta Sans', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      borderRadius: {
        card: '12px',
        input: '8px',
        badge: '6px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(15,31,61,0.08)',
        'card-hover': '0 4px 24px rgba(15,31,61,0.14)',
      },
      transitionDuration: {
        DEFAULT: '200ms',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-in': {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease forwards',
        'slide-in': 'slide-in 0.2s ease forwards',
        shimmer: 'shimmer 1.5s linear infinite',
      },
    },
  },
  plugins: [],
};

export default config;

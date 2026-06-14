import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#070a12',
        surface: '#0d1320',
        panel: '#111827',
        line: 'rgba(255,255,255,0.1)',
        muted: '#94a3b8',
        premium: '#8b5cf6',
        success: '#22c55e',
        warning: '#f59e0b',
        danger: '#ef4444',
      },
      boxShadow: {
        glow: '0 24px 80px rgba(34, 197, 94, 0.16)',
        premium: '0 24px 80px rgba(139, 92, 246, 0.2)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config

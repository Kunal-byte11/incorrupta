import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        police: {
          navy: '#070D1E',
          slate: '#0E172E',
          elevated: '#182442',
          border: '#233560',
          focus: '#00B4D8',
        },
        accent: {
          gold: '#D4AF37',
          cyan: '#00B4D8',
          blue: '#3B82F6',
        },
        status: {
          pristine: '#10B981',
          malkhana: '#F59E0B',
          fsl: '#6366F1',
          tamper: '#EF4444',
        },
        hash: {
          mono: '#34D399',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
      },
    },
  },
  plugins: [],
} satisfies Config;

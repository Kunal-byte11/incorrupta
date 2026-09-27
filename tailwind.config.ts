import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        police: {
          navy: '#0B2545',
          slate: '#F8FAFC',
          elevated: '#F1F5F9',
          border: '#E2E8F0',
          focus: '#0284C7',
        },
        sovereign: {
          lightBg: '#F8FAFC',
          lightSurface: '#FFFFFF',
          lightSurfaceMuted: '#F1F5F9',
          lightBorder: '#E2E8F0',
          lightBorderStrong: '#CBD5E1',
          navy: '#0B2545',
          navyHover: '#133E7C',
          navyLight: '#EBF3FE',
          gold: '#B45309',
          goldLight: '#FEF3C7',
          goldBorder: '#FCD34D',
          emerald: '#059669',
          emeraldLight: '#ECFDF5',
          emeraldBorder: '#A7F3D0',
          danger: '#DC2626',
          dangerLight: '#FEF2F2',
          dangerBorder: '#FECACA',
          textDark: '#0F172A',
          textMuted: '#64748B',
          textSubtle: '#94A3B8',
          bed: '#F8FAFC',
          base: '#F1F5F9',
          pane: '#FFFFFF',
          card: '#FFFFFF',
          elevated: '#F8FAFC',
          high: '#F1F5F9',
          border: '#E2E8F0',
          borderLight: '#CBD5E1',
          goldDeep: '#92400E',
        },
        accent: {
          gold: '#B45309',
          cyan: '#0284C7',
          blue: '#2563EB',
        },
        status: {
          pristine: '#059669',
          malkhana: '#B45309',
          fsl: '#4F46E5',
          tamper: '#DC2626',
        },
        hash: {
          mono: '#059669',
        },
      },
      fontFamily: {
        sans: ['Inter', '"Noto Sans Devanagari"', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['"JetBrains Mono"', '"Fira Code"', 'monospace'],
        deva: ['"Noto Sans Devanagari"', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;

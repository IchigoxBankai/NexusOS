import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
    '../../packages/*/src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nexus: {
          50: '#F5F7FC',
          100: '#EBF0FA',
          200: '#D7E2F6',
          300: '#BDCEEE',
          400: '#94B2E3',
          500: '#6892D5',
          600: '#4A74BC',
          700: '#3A5C9B',
          800: '#2A4372',
          900: '#182642',
        },
        aurora: {
          bg: '#EAF0F9',
          lilac: '#E8ECFB',
          periwinkle: '#DFE7FB',
          blush: '#FBEBE8',
          lavender: '#EFE9FD',
          mint: '#E6F4F1',
          sky: '#E1EDFB',
        },
        surface: {
          glass: 'rgba(255, 255, 255, 0.78)',
          'glass-elevated': 'rgba(255, 255, 255, 0.92)',
          'glass-border': 'rgba(255, 255, 255, 0.65)',
          pill: '#F1F3F8',
          'pill-hover': '#E5E9F2',
          card: '#FFFFFF',
        },
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
        pill: '9999px',
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(110, 123, 163, 0.10)',
        'glass-hover': '0 12px 40px 0 rgba(110, 123, 163, 0.16)',
        'soft-card': '0 2px 12px -2px rgba(90, 105, 143, 0.08), 0 1px 3px 0 rgba(90, 105, 143, 0.04)',
        pill: '0 1px 3px 0 rgba(0, 0, 0, 0.04)',
      },
      backdropBlur: {
        xs: '2px',
        md: '12px',
        xl: '24px',
      },
      backgroundImage: {
        'nexus-aurora': 'radial-gradient(at 15% 15%, #E1EDFB 0px, transparent 50%), radial-gradient(at 85% 10%, #FBEBE8 0px, transparent 45%), radial-gradient(at 50% 50%, #EFE9FD 0px, transparent 55%), radial-gradient(at 80% 85%, #DFE7FB 0px, transparent 50%), radial-gradient(at 10% 90%, #E8ECFB 0px, transparent 50%)',
      },
    },
  },
  plugins: [],
};

export default config;

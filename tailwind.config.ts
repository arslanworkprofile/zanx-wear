import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './hooks/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '1.5rem',
      screens: { '2xl': '1440px' },
    },
    extend: {
      colors: {
        // ZANX WEAR luxury monochrome system
        matte: {
          black: '#0B0B0C',
          900: '#111113',
          800: '#18181B',
        },
        ash: {
          DEFAULT: '#6C6E72',
          light: '#8B8D91',
          dark: '#4A4B4E',
        },
        graphite: '#232326',
        silver: {
          DEFAULT: '#C8CBD0',
          soft: '#DADCE0',
          hair: 'rgba(200,203,208,0.14)',
        },
        fog: '#F2F2F0',
        paper: '#FAFAF9',
        line: 'rgba(255,255,255,0.08)',
      },
      fontFamily: {
        display: ['var(--font-poppins)', 'sans-serif'],
        body: ['var(--font-outfit)', 'sans-serif'],
      },
      letterSpacing: {
        tightest2: '-0.04em',
        widest2: '0.28em',
      },
      backgroundImage: {
        'grain': "url('/textures/grain.png')",
        'steel-gradient': 'linear-gradient(135deg, #18181B 0%, #0B0B0C 55%, #232326 100%)',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.28)',
        premium: '0 20px 60px -15px rgba(0,0,0,0.5)',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(24px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        marquee: 'marquee 28s linear infinite',
        'fade-up': 'fade-up 0.8s cubic-bezier(0.22,1,0.36,1) forwards',
        shimmer: 'shimmer 2.2s linear infinite',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;

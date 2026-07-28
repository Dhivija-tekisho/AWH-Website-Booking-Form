import type { Config } from 'tailwindcss';

/** Colors come from CSS variables in src/theme.css — edit them there. */
const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ivory: 'var(--color-ivory)',
        cloud: 'var(--color-cloud)',
        mist: { DEFAULT: 'var(--color-mist)', 2: 'var(--color-mist-2)' },
        emerald: {
          DEFAULT: 'var(--color-emerald)',
          2: 'var(--color-emerald-2)',
          deep: 'var(--color-emerald-deep)',
        },
        jade: {
          DEFAULT: 'var(--color-jade)',
          bright: 'var(--color-jade-bright)',
          soft: 'var(--color-jade-soft)',
        },
        gold: {
          DEFAULT: 'var(--color-gold)',
          2: 'var(--color-gold-2)',
          soft: 'var(--color-gold-soft)',
        },
        rose: { DEFAULT: 'var(--color-rose)', soft: 'var(--color-rose-soft)' },
        ink: {
          DEFAULT: 'var(--color-ink)',
          soft: 'var(--color-ink-soft)',
          faint: 'var(--color-ink-faint)',
        },
        line: { DEFAULT: 'var(--color-line)', soft: 'var(--color-line-soft)' },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        sm: '14px',
        DEFAULT: '20px',
        lg: '28px',
        xl: '36px',
        pill: '100px',
      },
      boxShadow: {
        sm: '0 1px 2px rgba(9,50,41,.05), 0 6px 18px rgba(9,50,41,.06)',
        md: '0 14px 40px rgba(9,50,41,.10), 0 3px 10px rgba(9,50,41,.05)',
        gold: '0 14px 40px rgba(198,161,91,.28)',
      },
      keyframes: {
        popIn: {
          from: { transform: 'scale(.4)', opacity: '0' },
          to: { transform: 'scale(1)', opacity: '1' },
        },
      },
      animation: {
        popIn: 'popIn .5s cubic-bezier(.2,1.3,.4,1)',
      },
    },
  },
  plugins: [],
};

export default config;

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        background: '#0F172A', // dark navy page background (slate-900)
        surface: '#1E293B', // card/panel background (slate-800)
        border: '#334155', // slate-700, dividers on dark surfaces
        muted: '#94A3B8', // slate-400, secondary text on dark surfaces
        // Brand theme: dark navy surfaces, orange as the primary accent,
        // light green kept as a small secondary accent (e.g. streaks).
        primary: {
          DEFAULT: '#F97316', // orange-500
          light: 'rgba(249,115,22,0.15)',
          dark: '#EA580C',
        },
        accent: {
          DEFAULT: '#22C55E', // light green
          light: 'rgba(34,197,94,0.15)',
          dark: '#16A34A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.06)',
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        arabic: ['"Noto Naskh Arabic"', '"Amiri"', 'serif'],
      },
      colors: {
        // Patient space — teal / warm paper
        patient: {
          50: '#f3faf9',
          100: '#d7f0ec',
          200: '#b0e1d9',
          300: '#7fcac4',
          400: '#4fabaa',
          500: '#2f8e8e',
          600: '#1f7272',
          700: '#1c5b5d',
          800: '#1b4949',
          900: '#193d3d',
          950: '#0c2323',
        },
        // Doctor space — navy / clinical
        doctor: {
          50: '#f1f5fb',
          100: '#e0e9f5',
          200: '#c7d8ea',
          300: '#a0bfdb',
          400: '#6f9bc6',
          500: '#4d7eaf',
          600: '#3a6493',
          700: '#325278',
          800: '#2d4663',
          900: '#283c55',
          950: '#1a2740',
        },
        // CTCAE grade ramp — signature visual element
        grade: {
          0: '#5bb98a', // green
          1: '#a8c95b', // light green
          2: '#f0b94a', // amber
          3: '#e8783a', // orange
          4: '#c5303a', // deep red
        },
        paper: {
          50: '#fbf8f3',
          100: '#f6f1e7',
          200: '#ece3d0',
        },
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(28, 60, 60, 0.08), 0 4px 24px -8px rgba(28, 60, 60, 0.06)',
        card: '0 1px 3px rgba(28, 60, 60, 0.06), 0 8px 24px -12px rgba(28, 60, 60, 0.12)',
        alert: '0 0 0 1px rgba(197, 48, 58, 0.15), 0 8px 24px -8px rgba(197, 48, 58, 0.25)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};

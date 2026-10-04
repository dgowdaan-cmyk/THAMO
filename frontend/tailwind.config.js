/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#070D1E',
          850: '#0B132B',
          800: '#1C2541',
          700: '#263454',
          600: '#3A506B',
        },
        teal: {
          50: '#F0FDFA',
          100: '#CCFBF1',
          400: '#2DD4BF',
          500: '#14B8A6',
          600: '#0D9488',
          700: '#0F766E',
          accent: '#5BC0BE'
        },
        alert: {
          critical: '#DC2626',
          warning: '#D97706',
          caution: '#EAB308',
          safe: '#059669',
          neutral: '#64748B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rail: {
          50: '#F0F7FF',
          100: '#E0EFFE',
          200: '#BAE0FD',
          300: '#7CD4FC',
          400: '#38BDF8', // Accent
          500: '#2563EB', // Primary Blue
          600: '#1D4ED8',
          700: '#1E40AF',
          800: '#1E3A8A',
          900: '#0F172A', // Text Dark
          bg: '#F1F5F9',  // Cool grey canvas background
          card: '#FFFFFF',
        }
      },
      borderRadius: {
        'btn': '14px',
        'card': '20px',
        'modal': '24px',
      },
      fontFamily: {
        sans: ['Geist', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(15, 23, 42, 0.05), 0 2px 6px -1px rgba(15, 23, 42, 0.03)',
        'soft-lg': '0 10px 30px -4px rgba(15, 23, 42, 0.08), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'glow': '0 0 25px -5px rgba(37, 99, 235, 0.3)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'hero-red': {
          50: '#fff1f2',
          100: '#ffe4e6',
          400: '#ff6b7e',
          500: '#f83d54',
          600: '#e51d3a',
          900: '#881428',
        },
        'hero-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#2563eb',
          600: '#1d4ed8',
          900: '#1e3a8a',
        },
        'archive-zinc': {
          50: '#fafafa',
          100: '#f4f4f5',
          200: '#e4e4e7',
          300: '#d4d4d8',
          400: '#a1a1aa',
          500: '#71717a',
          600: '#52525b',
          700: '#3f3f46',
          800: '#27272a',
          900: '#18181b',
          950: '#09090b',
        }
      },
      animation: {
        'hero-enter': 'heroEnter 0.3s cubic-bezier(0.2, 0, 0, 1)',
        'slide-up': 'slideUp 0.25s cubic-bezier(0.2, 0, 0, 1)',
      },
      keyframes: {
        heroEnter: {
          '0%': {
            opacity: '0',
            transform: 'translateY(8px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(6px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
      },
    },
  },
  plugins: [],
}

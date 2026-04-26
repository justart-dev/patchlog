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
        'electric-yellow': {
          400: '#facc15',
          500: '#eab308',
        },
        'comic-purple': {
          400: '#c084fc',
          500: '#a855f7',
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
        'hero-enter': 'heroEnter 0.8s cubic-bezier(0.16, 1, 0.3, 1)',
        'power-pulse': 'powerPulse 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'float': 'float 3s ease-in-out infinite',
        'comic-pop': 'comicPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'reveal': 'reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1)',
      },
      keyframes: {
        heroEnter: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.98) translateY(10px)'
          },
          '100%': {
            opacity: '1',
            transform: 'scale(1) translateY(0)'
          },
        },
        powerPulse: {
          '0%, 100%': {
            opacity: '1',
            transform: 'scale(1)',
          },
          '50%': {
            opacity: '0.8',
            transform: 'scale(1.02)',
          },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(248, 61, 84, 0.2), 0 0 40px rgba(37, 99, 235, 0.1)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(248, 61, 84, 0.4), 0 0 60px rgba(37, 99, 235, 0.3)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        float: {
          '0%, 100%': {
            transform: 'translateY(0px)'
          },
          '50%': {
            transform: 'translateY(-6px)'
          },
        },
        comicPop: {
          '0%': {
            transform: 'scale(0.95) rotate(-1deg)'
          },
          '50%': {
            transform: 'scale(1.02) rotate(0.5deg)'
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)'
          },
        },
        reveal: {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(0)' },
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f83d54 0%, #2563eb 100%)',
        'hero-gradient-dark': 'linear-gradient(135deg, #c1122d 0%, #1e3a8a 100%)',
        'power-gradient': 'linear-gradient(45deg, #facc15 0%, #a855f7 100%)',
        'comic-radial': 'radial-gradient(circle at 50% 50%, rgba(248, 61, 84, 0.05) 0%, transparent 70%)',
        'noise': "url(\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAMAAAAp4XiDAAAAUVBMVEWFhYWDg4N3dy95eXl6enqBgYGHh4d8fHx9fX1+fn6AgIB/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f39/f3wAAAAMWHRSTlMGP0y3uL9XmMSZKNz9M9L998KAobCAgP40989VAAAAaklEQVQ4y2NgYAz8n4gwAi0vRE6Yn69gdXQWIifD6vgsRE6S1fFZDJyYnK9gdXQWIifD6vgsRE6S1fFZDJyYnK9gdXQWIifD6vgsRE6S1fFZDJyYnK9gdXQWIifD6vgsRE6S1fFZDJyYnK9gdXQWIn8AGv0Uf6vC43QAAAAASUVORK5CYII=\")",
      },
      boxShadow: {
        'hero': '0 10px 40px rgba(0, 0, 0, 0.1), 0 0 20px rgba(37, 99, 235, 0.05)',
        'hero-hover': '0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(37, 99, 235, 0.1)',
        'comic': '2px 2px 0px rgba(0, 0, 0, 0.8)',
        'comic-lg': '4px 4px 0px rgba(0, 0, 0, 0.8)',
        'glow-red': '0 0 20px rgba(248, 61, 84, 0.3)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.3)',
        'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.3)',
        'soft-inner': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)',
        'glow-green': '0 0 15px rgba(16, 185, 129, 0.6)',
        'ambient': '0 8px 32px -4px rgba(0, 0, 0, 0.1), 0 4px 12px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
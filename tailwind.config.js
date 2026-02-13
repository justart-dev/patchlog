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
          400: '#ff6b7e',
          500: '#f83d54',
          600: '#e51d3a',
          900: '#881428',
        },
        'hero-blue': {
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
      },
      animation: {
        'hero-enter': 'heroEnter 0.8s ease-out',
        'power-pulse': 'powerPulse 2s ease-in-out infinite',
        'glow-pulse': 'glowPulse 1.5s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'slide-down': 'slideDown 0.6s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'comic-pop': 'comicPop 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
      keyframes: {
        heroEnter: {
          '0%': {
            opacity: '0',
            transform: 'scale(0.9) translateY(20px)'
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
            transform: 'scale(1.05)',
          },
        },
        glowPulse: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(248, 61, 84, 0.5), 0 0 40px rgba(37, 99, 235, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 30px rgba(248, 61, 84, 0.8), 0 0 60px rgba(37, 99, 235, 0.6)',
          },
        },
        slideUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(30px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          },
        },
        slideDown: {
          '0%': {
            opacity: '0',
            transform: 'translateY(-30px)'
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
            transform: 'translateY(-10px)'
          },
        },
        comicPop: {
          '0%': {
            transform: 'scale(0.8) rotate(-2deg)'
          },
          '50%': {
            transform: 'scale(1.1) rotate(1deg)'
          },
          '100%': {
            transform: 'scale(1) rotate(0deg)'
          },
        },
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #f83d54 0%, #2563eb 100%)',
        'hero-gradient-dark': 'linear-gradient(135deg, #c1122d 0%, #1e3a8a 100%)',
        'power-gradient': 'linear-gradient(45deg, #facc15 0%, #a855f7 100%)',
        'comic-radial': 'radial-gradient(circle at 50% 50%, rgba(248, 61, 84, 0.1) 0%, transparent 70%)',
      },
      boxShadow: {
        'hero': '0 10px 40px rgba(248, 61, 84, 0.3), 0 0 20px rgba(37, 99, 235, 0.2)',
        'hero-hover': '0 20px 60px rgba(248, 61, 84, 0.4), 0 0 40px rgba(37, 99, 235, 0.3)',
        'comic': '4px 4px 0px rgba(0, 0, 0, 0.3)',
        'comic-lg': '8px 8px 0px rgba(0, 0, 0, 0.3)',
        'glow-red': '0 0 20px rgba(248, 61, 84, 0.5)',
        'glow-blue': '0 0 20px rgba(37, 99, 235, 0.5)',
        'glow-yellow': '0 0 20px rgba(250, 204, 21, 0.5)',
      },
    },
  },
  plugins: [],
}
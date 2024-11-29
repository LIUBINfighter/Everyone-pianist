/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        piano: {
          white: '#FFFFFF',
          black: '#000000',
          primary: '#2563EB',
          hover: '#1D4ED8',
          pressed: '#1E40AF',
        }
      },
      animation: {
        'key-press': 'keyPress 0.2s ease-in-out',
        'float': 'float 3s ease-in-out infinite',
        'fade-out': 'fadeOut 2s ease-out forwards',
      },
      keyframes: {
        keyPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0', transform: 'translateY(-40px)' },
        }
      }
    },
  },
  plugins: [],
} 
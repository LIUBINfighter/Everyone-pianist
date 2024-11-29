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
      },
      keyframes: {
        keyPress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        }
      }
    },
  },
  plugins: [],
} 
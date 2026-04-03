/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'sans-serif']
      },
      colors: {
        accent: '#22c55e'
      },
      keyframes: {
        'spin-in': {
          from: { transform: 'rotateX(-90deg)', opacity: '0' },
          to: { transform: 'rotateX(0deg)', opacity: '1' }
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' }
        }
      },
      animation: {
        'spin-in': 'spin-in 0.4s ease-out',
        'fade-in': 'fade-in 0.3s ease-out'
      }
    }
  },
  plugins: []
};

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#022c22', // Deep Emerald
        },
        accent: {
          DEFAULT: '#b45309', // Luxury Gold
          hover: '#92400e',
          light: '#fef3c7',
        },
        secondary: {
          DEFAULT: '#fffbeb', // Soft Cream
          dark: '#fef3c7',
        }
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #022c22 0%, #064e3b 100%)',
        'gold-shine': 'linear-gradient(135deg, #b45309 0%, #f59e0b 100%)',
      }
    },
  },
  plugins: [],
}
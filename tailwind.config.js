/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bengkulu: {
          emerald: '#0d5c3a',
          emeraldLight: '#147a4f',
          gold: '#d4af37',
          goldLight: '#f6e05e',
          amber: '#b45309',
          cream: '#fdfbf7',
          navy: '#0f172a'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        serif: ['Amiri', 'Traditional Arabic', 'Georgia', 'serif'],
      }
    },
  },
  plugins: [],
}

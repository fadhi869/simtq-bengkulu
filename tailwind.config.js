/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        obsidian: {
          DEFAULT: '#090a0f',
          surface: '#10121a',
          surfaceLight: '#161922',
          border: 'rgba(255, 255, 255, 0.08)',
          borderHover: 'rgba(255, 255, 255, 0.16)',
        },
        bengkulu: {
          emerald: '#10b981',
          emeraldDark: '#047857',
          gold: '#f59e0b',
          goldMuted: '#d97706',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
        serif: ['Amiri', 'Georgia', 'serif'],
      },
      boxShadow: {
        'glow-emerald': '0 0 35px -5px rgba(16, 185, 129, 0.15)',
        'glow-gold': '0 0 35px -5px rgba(245, 158, 11, 0.15)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#0A0F1D',
          card: '#161F38',
          red: '#EF4444',
          amber: '#F59E0B',
          green: '#10B981',
          blue: '#3B82F6',
          text: '#F3F4F6',
          muted: '#9CA3AF',
        }
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: {
          green: '#047857',
          'green-light': '#A7F3D0',
          amber: '#F59E0B',
          blue: '#2563EB',
          stone: '#78716C',
        },
      },
    },
  },
  plugins: [],
}

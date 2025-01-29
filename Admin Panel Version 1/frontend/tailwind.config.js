/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#FAD791', // Warm Yellow
          dark: '#2D1E12',    // Deep Brown
          light: '#FDEAC9',   // Light Peach
        },
        text: {
          dark: '#1C1C1C',    // Accent Black
          light: '#F9F9F9',   // Soft White
        }
      },
    },
  },
  plugins: [],
}
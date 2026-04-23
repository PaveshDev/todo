/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        headline: ['Manrope', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'sans-serif'],
        label: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        primary: {
          50: '#f0f9fc',
          100: '#e0f2f9',
          200: '#b9e5f3',
          300: '#7dd2f3',
          400: '#6acef0',
          500: '#3bbde8',
          600: '#229cc9',
          700: '#00616c',
          800: '#004f57',
          900: '#00394d',
        },
        secondary: {
          50: '#f0f7fc',
          100: '#ddf0f8',
          200: '#b2e0f1',
          300: '#88ddff',
          400: '#7dd2f3',
          500: '#5cbef0',
          600: '#3b9fc4',
          700: '#006782',
          800: '#004962',
          900: '#003447',
        },
        cyan: {
          50: '#f0f9fc',
          100: '#e0f2f9',
          200: '#b9e5f3',
          300: '#7dd2f3',
          400: '#6acef0',
          500: '#3bbde8',
          600: '#229cc9',
          700: '#00616c',
          800: '#004f57',
          900: '#00394d',
        },
      },
    },
  },
  plugins: [],
}

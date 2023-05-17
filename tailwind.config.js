/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      red: '#F6475D',
      green: '#0DCB81',
      orange: '#D77843',
      yellow: '#f0b90b',
      black: '#000000',
      white: '#ffffff',
      gray: '#252930',
      'gray-light': '#848e9c',
    },
    extend: {
      // fontSize: {
      //   sm: ['12px', '16px'],
      // },
      fontFamily: {
        sans: ['IntIBMPlexSans', 'sans'],
      }
    },
  },
  plugins: [],
}

const { fontFamily } = require("tailwindcss/defaultTheme")

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    colors: {
      red: '#F6475D',
      green: '#0DCB81',
      orange: '#D77843',
      yellow: '#f0b90b',
      black: '#000000',
      white: '#ffffff',
      gray: '#252930',
      'gray-light': '#848e9c',
      'gray-lighter': '#eaecef',
      'gray-dark': '#161a1e',
      'gray-middle': '#2b3139',
      'gray-middle-light': '#1E2329',
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      variants: {
        scrollbar: ['rounded']
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      fontFamily: {
        sans: ['IntIBMPlexSans', 'sans'],
      }
    },
  },
  plugins: [
    require('tailwind-scrollbar')({ nocompatible: true }),
    // require('@tailwindcss/forms'),
    require("tailwindcss-animate")],
}

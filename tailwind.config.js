/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': '#3a83c1'
      },
      maxWidth: {
        'section': '82rem'
      },
      minHeight: {
        'section': 'calc(100vh - 7rem)'
      },
      scrollMargin: {
        '22': '5.5rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
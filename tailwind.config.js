/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
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
  plugins: [],
}
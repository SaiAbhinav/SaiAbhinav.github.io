/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'brand': '#2F70B7',
        'brand-dark': {
          600: '#242d40',
          800: '#171C28'
        } 
      },
      maxWidth: {
        'section': '82rem'
      },
      minHeight: {
        'section': 'calc(100vh - 7rem)'
      },
      scrollMargin: {
        '22': '5.5rem'
      },
      fontSize: {
        '10xl': '10rem'
      }
    },
  },
  plugins: [
    require('@tailwindcss/line-clamp')
  ],
}
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      flex: {
        '15%': '0 0 15%'
      },
      cursor: {
        grab: 'grab'
      },
      minWidth: {
        '15%': '15%',
        '95%': '95%'
       }
    },
  },
  variants: {
    extend: {
      cursor: ['hover', 'focus'],
    },
  },
  plugins: [],
}

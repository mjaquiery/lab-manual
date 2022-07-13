module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      flex: {
        '1/6': '0 0 16.666667%'
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}

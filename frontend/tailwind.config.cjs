/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      boxShadow: {
        "xl": '0px 0px 10px 1px rgb(182, 129, 184)',
        '2xl': '0px 0px 10px 5px rgb(182, 129, 184)'
      }
    },
  },
  plugins: [],
}

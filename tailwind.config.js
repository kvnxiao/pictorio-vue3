module.exports = {
  purge: ["./public/index.html", "./src/**/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      opacity: ["disabled"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
}
module.exports = {
  purge: ["./public/index.html", "./src/**/*.vue"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    borderWidth: {
      DEFAULT: "1px",
      0: "0",
      2: "2px",
      3: "3px",
      4: "4px",
      8: "8px",
    },
    extend: {
      spacing: {
        tool: "30px",
        "tool-sm": "15px",
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ["active"],
      opacity: ["disabled"],
      ringWidth: ["hover", "active"],
      ringColor: ["hover", "active"],
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

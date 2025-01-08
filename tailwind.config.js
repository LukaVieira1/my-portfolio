const { theme } = require("./src/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "var(--primary-light)",
          DEFAULT: "var(--primary-default)",
          dark: "var(--primary-dark)",
        },
        background: {
          DEFAULT: "var(--background-default)",
          light: "var(--background-light)",
          lighter: "var(--background-lighter)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
        },
      },
    },
  },
  plugins: [],
};

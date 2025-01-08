/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#64ffda",
          DEFAULT: "#64ffda",
          dark: "#64ffda20",
        },
        background: {
          DEFAULT: "#0a192f",
          light: "#112240",
          lighter: "#233554",
        },
        text: {
          primary: "#ccd6f6",
          secondary: "#8892b0",
        },
      },
      maxWidth: {
        container: "1024px",
      },
      height: {
        section: "600px",
      },
    },
  },
  plugins: [],
};

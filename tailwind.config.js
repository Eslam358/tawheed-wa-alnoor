/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          950: "#0A2E22",
          900: "#0F3D2E",
          800: "#155A43",
          700: "#1C7A59",
          600: "#239C70",
          500: "#2FBE89",
          200: "#BEE8D3",
          100: "#E3F5EC",
          50: "#F3FBF7",
        },
        sale: {
          600: "#C81E2B",
          500: "#E63946",
          100: "#FBE1E3",
        },
        sand: {
          50: "#FBF3E4",
          100: "#F5EAD5",
          200: "#EDE0C4",
        },
        ink: "#231C10",
      },
      fontFamily: {
        display: ["var(--font-cairo)", "sans-serif"],
        body: ["var(--font-cairo)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

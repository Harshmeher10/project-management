/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "stroke-dark": "#4A5568", // Add a color for stroke-dark
        "dark-secondary": "#1A202C",
        "dark-tertiary": "#2D3748",
        "dark-bg": "#171923",
      },
    },
  },
  plugins: [],
};

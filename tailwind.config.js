/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "upenn-blue": "#011F5B",
        "upenn-red": "#990000",
      },
    },
  },
  plugins: [],
}


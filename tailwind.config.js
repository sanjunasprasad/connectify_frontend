/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "!./src/components/User/Rightbar/rightbar.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
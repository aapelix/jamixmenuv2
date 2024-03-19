/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.svelte"
  ],
  theme: {
    extend: {},
    screens:
    {
      "sm": "10px",
      "lg": "1024px"
    }
  },
  plugins: [],
}


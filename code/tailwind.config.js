/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.{html,js}", // Ensure that Tailwind scans your HTML/JS files
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('daisyui'), // Adding DaisyUI plugin
    ],
  };
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.{html,js}", // Ensure that Tailwind scans your HTML/JS files
    ],
    daisyui: {
      themes: ["coffee"],
    },
    plugins: [
      require('daisyui'),
    ],
  };
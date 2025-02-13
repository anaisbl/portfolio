/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./public/**/*.{html,js}", // Ensure that Tailwind scans your HTML/JS files
    ],
    daisyui: {
      themes: ["fantasy","coffee"],
    },
    plugins: [
      require('daisyui'),
    ],
  };
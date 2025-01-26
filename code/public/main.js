// navbar.js
const hamburgerBtn = document.getElementById("hamburger-btn");
const mobileMenu = document.getElementById("mobile-menu");
const navbarLinks = document.getElementById("navbar-links");

hamburgerBtn.addEventListener("click", () => {
  mobileMenu.classList.toggle("hidden"); // Show/hide the mobile menu on button click
  navbarLinks.classList.add("hidden");  // Hide the desktop links when hamburger is clicked
});

// hide the mobile menu if clicked outside
window.addEventListener('click', function (event) {
  if (!event.target.closest('#mobile-menu') && !event.target.closest('#hamburger-btn') && !event.target.closest('#navbar-links')) {
    mobileMenu.classList.add('hidden');
  }
});

// transition between pages
document.addEventListener("DOMContentLoaded", function() {
  // Add a class that triggers the fade-in effect
  document.body.classList.add('fade-transition-visible');
});
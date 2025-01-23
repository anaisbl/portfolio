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

// active link styling
document.addEventListener("DOMContentLoaded", function() {
  // Get the current page URL
  const currentUrl = window.location.pathname;

  // Get all the navigation links
  const navLinks = document.querySelectorAll('.navbar a');

  // Loop through each link to check if it matches the current URL
  navLinks.forEach(link => {
    // Reset all links by removing the active class
    link.classList.remove('text-white'); // Remove active text color from all links

    // If the link matches the current URL, add the active class
    if (link.href.includes(currentUrl)) {
      link.classList.add('text-white'); // Add white text color for active link
    }
  });
});

// transition between pages
document.addEventListener("DOMContentLoaded", function() {
  // Add a class that triggers the fade-in effect
  document.body.classList.add('fade-transition-visible');
});
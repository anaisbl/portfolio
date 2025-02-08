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

// project filter
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('[role="tab"]');
  const projects = document.querySelectorAll('.container[data-type], hr[data-type]');

  tabs.forEach(tab => {
    tab.addEventListener('click', function () {
      const type = this.getAttribute('data-type');

      // Remove active class from all tabs
      tabs.forEach(t => t.classList.remove('tab-active'));

      // Add active class to the clicked tab
      this.classList.add('tab-active');

      // Filter projects based on the selected type with a delay for animation
      projects.forEach(project => {
        if (type === 'all' || project.getAttribute('data-type') === type) {
          project.classList.remove('hide');
          project.classList.add('show');
        } else {
          project.classList.add('hide');
          project.classList.remove('show');
        }
      });
    });
  });
});




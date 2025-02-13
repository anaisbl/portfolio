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

// light/dark mode button
// main function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'fantasy' ? 'coffee' : 'fantasy';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);

  // call function that switches items based on theme
  updateTheme(newTheme);
}

// function to switch avatar and icons
function updateTheme(theme) {
  const avatar = document.getElementById('avatar');
  const bubble = document.getElementById('bubble-float');
  const emailIcons = document.querySelectorAll('.social-email');
  const githubIcons = document.querySelectorAll('.social-github');
  const linkedinIcons = document.querySelectorAll('.social-linkedin');

  if (theme === 'coffee') {
    avatar.src = 'img/profile-dark.jpg';
    if (bubble) bubble.src = 'icons/dark/icons8-hamburger-menu-100-floating.png';
    emailIcons.forEach(icon => icon.src = 'icons/dark/icons8-email-100-green.png');
    githubIcons.forEach(icon => icon.src = 'icons/dark/icons8-github-100-green.png');
    linkedinIcons.forEach(icon => icon.src = 'icons/dark/icons8-linkedin-100-green.png');
  } else {
    avatar.src = 'img/profile-light.jpg';
    if (bubble) bubble.src = 'icons/light/icons8-hamburger-menu-100-light.png';
    emailIcons.forEach(icon => icon.src = 'icons/light/icons8-email-100-light.png');
    githubIcons.forEach(icon => icon.src = 'icons/light/icons8-github-100-light.png');
    linkedinIcons.forEach(icon => icon.src = 'icons/light/icons8-linkedin-100-light.png');
  }
}

// apply the stored theme on load
window.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('theme') || 'fantasy';
  document.documentElement.setAttribute('data-theme', storedTheme);
  document.querySelector('.theme-controller').checked = storedTheme === 'coffee';

  // update items based on the stored theme
  updateTheme(storedTheme);
});







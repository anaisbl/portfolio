// transition between pages
document.addEventListener("DOMContentLoaded", function() {
  // Add a class that triggers the fade-in effect
  document.body.classList.add('fade-transition-visible');
});

// project filter
document.addEventListener('DOMContentLoaded', function () {
  const tabs = document.querySelectorAll('[role="tab"]');
  const projects = document.querySelectorAll('.card[data-type]');

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
  const elements = [
    { id: 'avatar', darkSrc: 'img/profile-dark.jpg', lightSrc: 'img/profile-light.jpg' },
    { id: 'construction', darkSrc: 'icons/dark/icons8-under-construction-100-brown.png', lightSrc: 'icons/light/icons8-under-construction-100-light.png'},
    { class: 'bubble-float', darkSrc: 'icons/dark/icons8-hamburger-menu-100-floating.png', lightSrc: 'icons/light/icons8-hamburger-menu-100-light.png' },
    { class: 'social-email', darkSrc: 'icons/dark/icons8-email-100-green.png', lightSrc: 'icons/light/icons8-email-100-light.png' },
    { class: 'social-github', darkSrc: 'icons/dark/icons8-github-100-green.png', lightSrc: 'icons/light/icons8-github-100-light.png' },
    { class: 'social-linkedin', darkSrc: 'icons/dark/icons8-linkedin-100-green.png', lightSrc: 'icons/light/icons8-linkedin-100-light.png' },
  ];

  elements.forEach(element => {
    if (element.id) {
      // Check for ID-based elements
      const el = document.getElementById(element.id);
      if (el) {
        el.src = theme === 'coffee' ? element.darkSrc : element.lightSrc;
      }
    } else if (element.class) {
      // Check for class-based elements
      const els = document.querySelectorAll(`.${element.class}`);
      els.forEach(el => {
        el.src = theme === 'coffee' ? element.darkSrc : element.lightSrc;
      });
    }
  });
}

// apply the stored theme on load
window.addEventListener('DOMContentLoaded', () => {
  const storedTheme = localStorage.getItem('theme') || 'fantasy';
  document.documentElement.setAttribute('data-theme', storedTheme);
  document.querySelector('.theme-controller').checked = storedTheme === 'coffee';

  // update items based on the stored theme
  updateTheme(storedTheme);
});









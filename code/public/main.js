// transition between pages
document.addEventListener("DOMContentLoaded", function() {
  // Add a class that triggers the fade-in effect
  document.body.classList.add('fade-transition-visible');
});

//____________________________________________________________________________
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
          project.style.display = 'flex'; 
        } else {
          project.classList.add('hide');
          project.classList.remove('show');
          project.style.display = 'none'; 
        }
      });
    });
  });
});


//____________________________________________________________________________
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


//____________________________________________________________________________
// about me chatbox
const chatResponses = {
  "What kind of art do you make?": "I do a lot of observational drawing with Pinterest, a little bit of watercolour or gouache but that's still a work in progress. I take commissions every now and then for digital illustrations too!",

  "Why did you study computer science?": "Because I wanted to be a woman in STEM (+1 if you know the reference) and get that bag honestly.",

  "Is there a story behind your favourite color?": "When I was a kid (core memory), I just remember going to Disneyland and being utterly mesmerized by Cinderella's dress: the blue, the sparkles... I loved it! And ever since then, blue is just my precious.",

  "Why don't you like Hell's Paradise?": "The main character is just bad. He has a confusing composition, the way he behaves + his backstory + his actions are contradicting. Everything else is fine, but he's the problem and since he's main character, the anime sucks unfortunately.",

  "Where is the connection between art and computer science?": "Art and computer science may seem worlds apart, but I enjoy how different they are in both content and approach. Art fuels my creativity, while computer science challenges the analytical side of my brain. Both let me get \"in the zone,\" real good.",

  "How old are you?": "Old enough to rule the world and father 16 offsprings.",

  "Pineapple on pizza?": "Hell yeah, throw in some sweetcorn and caramelied onions too!"
};

function sendMessage(question) {
  const chatContainer = document.getElementById("chat-box");

  // User Message
  const userMessage = document.createElement("div");
  userMessage.className = "chat chat-end";
  userMessage.innerHTML = `
      <div class="chat-image avatar">
          <div class="w-10 rounded-full">
              <img alt="Guest-user-profile" src="icons/icons8-user-100.png" />
          </div>
      </div>
      <div class="chat-header">You</div>
      <div class="chat-bubble">${question}</div>
  `;
  chatContainer.appendChild(userMessage);

  // Anaïs Loading Animation
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "chat chat-start";
  loadingMessage.innerHTML = `
      <div class="chat-image avatar">
          <div class="w-10 rounded-full">
              <img id="avatar" alt="Anais-profile-pic" src="img/profile-light.jpg" />
          </div>
      </div>
      <div class="chat-header">Anaïs</div>
      <div class="chat-bubble">
          <span class="loading loading-dots loading-sm"></span>
      </div>
  `;
  chatContainer.appendChild(loadingMessage);

  // Replace Loading Animation with Actual Response
  setTimeout(() => {
      loadingMessage.innerHTML = `
          <div class="chat-image avatar">
              <div class="w-10 rounded-full">
                  <img id="avatar" alt="Anais-profile-pic" src="img/profile-light.jpg" />
              </div>
          </div>
          <div class="chat-header">Anaïs</div>
          <div class="chat-bubble">${chatResponses[question]}</div>
      `;

       // Auto-scroll to the latest response
      loadingMessage.scrollIntoView({ behavior: "smooth" });
  }, 2000); // Adjust delay if needed
}

// clear chat of conversation
function clearChat() {
  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML = ""; // Remove all messages

  // Restore initial message
  const initialMessage = document.createElement("div");
  initialMessage.className = "chat chat-start";
  initialMessage.innerHTML = `
      <div class="chat-image avatar">
          <div class="w-10 rounded-full">
              <img alt="Anais-profile-pic" src="img/profile-light.jpg" />
          </div>
      </div>
      <div class="chat-header">Anaïs</div>
      <div class="chat-bubble">Hey there! Ask me anything</div>
  `;
  chatBox.appendChild(initialMessage);
}







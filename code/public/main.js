// Seamless page loading function
function loadPage(page) {
  const TRANSITION_MS = 200;
  const main = document.getElementById('main-content');
  if (!main) return;

  // Ensure the transition style is present
  if (!main.style.transition) {
    main.style.transition = `opacity ${TRANSITION_MS}ms ease-in-out`;
    // ensure it's visible to start
    main.style.opacity = main.style.opacity || '1';
  }

  // Fade out, then fetch and replace content, then fade in
  let proceeded = false;
  function proceedWithFetch() {
    if (proceeded) return;
    proceeded = true;

    fetch(`${page}.html`)
      .then(response => {
        if (!response.ok) throw new Error(`Page ${page}.html not found`);
        return response.text();
      })
      .then(html => {
        // Replace content
        main.innerHTML = html;
        window.history.pushState(null, '', `#${page}`);
        setActiveLink(page);

        // Notify any page-specific initializers that new content is loaded
        document.dispatchEvent(new CustomEvent('content:loaded', { detail: { page } }));

        // Let the browser register the new DOM, then fade in
        requestAnimationFrame(() => {
          // small delay to ensure reflow
          requestAnimationFrame(() => (main.style.opacity = '1'));
        });
      })
      .catch(error => {
        console.error('Error loading page:', error);
        main.innerHTML = `
          <h1 class="text-3xl font-bold text-red-500 my-6">Page Not Found</h1>
          <p>Sorry, the page "${page}" could not be loaded.</p>
        `;
        // fade back in even on error
        requestAnimationFrame(() => (main.style.opacity = '1'));
      });
  }

  // Start fade-out
  main.style.opacity = '0';

  // Prefer listening for transitionend, but fall back to timeout
  const onEnd = (e) => {
    if (e.propertyName === 'opacity') {
      main.removeEventListener('transitionend', onEnd);
      proceedWithFetch();
    }
  };
  main.addEventListener('transitionend', onEnd);

  // fallback in case transitionend doesn't fire
  setTimeout(() => {
    if (!proceeded) {
      main.removeEventListener('transitionend', onEnd);
      proceedWithFetch();
    }
  }, TRANSITION_MS + 50);
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  const page = location.hash.slice(1) || 'index';
  loadPage(page);
});

// Load initial page on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  const page = location.hash.slice(1) || 'index';
  loadPage(page);
});

// Set active link states for both sidebar and dock
function setActiveLink(page) {
  // Handle sidebar navigation (desktop)
  const sidebarLinks = document.querySelectorAll('aside nav a[onclick]');
  sidebarLinks.forEach(link => {
    const linkPage = link.getAttribute('onclick').match(/loadPage\('(.+?)'\)/)?.[1];
    if (linkPage === page) {
      link.classList.add('active', 'bg-gray-700', 'text-white');
      link.classList.remove('text-gray-300');
    } else {
      link.classList.remove('active', 'bg-gray-700');
      link.classList.add('text-gray-300');
      link.classList.remove('text-white');
    }
  });

  // Handle dock navigation (mobile)
  const dockButtons = document.querySelectorAll('.md\\:hidden button[onclick]');
  dockButtons.forEach(button => {
    const buttonPage = button.getAttribute('onclick').match(/loadPage\('(.+?)'\)/)?.[1];
    if (buttonPage === page) {
      button.classList.add('text-blue-400', 'scale-105');
      button.classList.remove('text-white');
    } else {
      button.classList.remove('text-blue-400', 'scale-105');
      button.classList.add('text-white');
    }
  });
}

// Utility function to get current page
function getCurrentPage() {
  return location.hash.slice(1) || 'index';
}

// Add smooth transitions
function addPageTransitions() {
  const mainContent = document.getElementById('main-content');
  if (mainContent) {
    // Ensure a transition is present and default visible state is set
    mainContent.style.transition = mainContent.style.transition || 'opacity 0.2s ease-in-out';
    if (!mainContent.style.opacity) mainContent.style.opacity = '1';
  }
}

// Initialize transitions on load
document.addEventListener('DOMContentLoaded', addPageTransitions);

//____________________________________________________________________________

// Project filters initializer
function initProjectFilters(root = document) {
  const container = root.querySelector('div.project') || document.querySelector('div.project');
  //if (!container) return  console.log("No project container found"), void 0;
  // it returns that message but still works?

  // Keep a stable list of original cards
  const cards = Array.from(container.querySelectorAll('.project-card'));
  // keep a copy on the container so global reset handler can restore order/visibility
  try { container.__originalCards = cards.slice(); } catch (e) { /* defensive */ }

  const topicInputs = Array.from(root.querySelectorAll('input[name="topic"]'));
  const complexityInputs = Array.from(root.querySelectorAll('input[name="complexity"]'));
  const dateInputs = Array.from(root.querySelectorAll('input[name="date"]'));

  function updateFilters() {
    // Collect checked values (multiple selections allowed per group)
    const selectedTopics = topicInputs.filter(i => i.checked).map(i => i.value);
    const selectedComplexities = complexityInputs.filter(i => i.checked).map(i => i.value);
    const selectedDate = dateInputs.find(i => i.checked)?.value; // if any

    // Filter logic: a card must match any selected value inside each group
    // If a group has no selection, that group does not filter (i.e., matches all)
    let visibleCards = cards.filter(card => {
      if (selectedTopics.length && !selectedTopics.includes(card.dataset.topic)) return false;
      if (selectedComplexities.length && !selectedComplexities.includes(card.dataset.complexity)) return false;
      return true;
    });

    // Sort by date value (YYYY-MM lexicographic sort works)
    if (selectedDate) {
      visibleCards.sort((a, b) => selectedDate === 'newest' ? b.dataset.date.localeCompare(a.dataset.date) : a.dataset.date.localeCompare(b.dataset.date));
    }

    // Render
    container.innerHTML = '';
    visibleCards.forEach(c => container.appendChild(c));
  }

  // Listen for changes on all filter inputs and update
  [...topicInputs, ...complexityInputs, ...dateInputs].forEach(input => {
    input.addEventListener('change', updateFilters);
  });

  // Initial render
  updateFilters();
}

// Initialize on initial DOMContentLoaded and after SPA content swaps
document.addEventListener('DOMContentLoaded', () => initProjectFilters(document));
document.addEventListener('content:loaded', (e) => {
  // the loaded content replaced main-content; run initializer on the new main
  const main = document.getElementById('main-content');
  if (main) initProjectFilters(main);
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

  "Pineapple on pizza?": "Hell yeah, throw in some sweetcorn and caramelised onions too!"
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

//____________________________________________________________________________

// Global reset handler — ensures a single reset button clears all filter radios
function attachGlobalFiltersReset() {
  // Prefer listening to the form reset event (this will fire when an <input type="reset"> is used)
  const filterForm = document.querySelector('form.filter#project-filters') || document.querySelector('form.filter');
  if (filterForm) {
    filterForm.addEventListener('reset', () => {
      // After native reset, dispatch change on all filter inputs so listeners update
      const inputs = filterForm.querySelectorAll('input[name="topic"], input[name="complexity"], input[name="date"]');
      inputs.forEach(i => i.dispatchEvent(new Event('change', { bubbles: true })));

      // Restore original order and ensure all cards are visible if we captured them
      const container = document.querySelector('div.project');
      if (container && Array.isArray(container.__originalCards) && container.__originalCards.length) {
        container.innerHTML = '';
        container.__originalCards.forEach(c => container.appendChild(c));
      }
    });
    return;
  }

  // Fallback: if no form.filter exists, bind to any input[type=reset]
  const resetBtn = document.querySelector('input[type="reset"]');
  if (!resetBtn) return;
  resetBtn.addEventListener('click', () => {
    const inputs = document.querySelectorAll('input[name="topic"], input[name="complexity"], input[name="date"]');
    inputs.forEach(i => {
      i.checked = false;
      // Fire change so any listeners (initProjectFilters) react
      i.dispatchEvent(new Event('change', { bubbles: true }));
    });
    // Restore original order and ensure all cards are visible if we captured them
    const container = document.querySelector('div.project');
    if (container && Array.isArray(container.__originalCards) && container.__originalCards.length) {
      container.innerHTML = '';
      container.__originalCards.forEach(c => container.appendChild(c));
    }
  });
}

// Attach on initial load and after SPA swaps (content:loaded)
document.addEventListener('DOMContentLoaded', () => attachGlobalFiltersReset());
document.addEventListener('content:loaded', () => attachGlobalFiltersReset());







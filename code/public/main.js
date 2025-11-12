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
  const page = location.hash.slice(1) || 'home';
  loadPage(page);
});

// Load initial page on DOM ready
window.addEventListener('DOMContentLoaded', () => {
  const page = location.hash.slice(1) || 'home';
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
  return location.hash.slice(1) || 'home';
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
  const form = (root.getElementById && root.getElementById('project-filters')) || root.querySelector('#project-filters');
  const container = root.querySelector('div.project') || document.querySelector('div.project');
  if (!form || !container) return;

  // Collect cards and remember original order on the container
  const cards = Array.from(container.querySelectorAll('.project-card'));
  container.__originalCards = container.__originalCards || cards.slice();

  // All radio inputs inside the form
  const radios = Array.from(form.querySelectorAll('input[type="radio"]'));
  const resetBtn = form.querySelector('input[type="reset"]');

  // When a radio changes: make groups exclusive across names (clear other groups)
  radios.forEach(r => {
    r.addEventListener('change', () => {
      if (!r.checked) return;
      const thisGroup = r.name;
      radios.forEach(other => {
        if (other === r) return;
        if (other.name !== thisGroup) other.checked = false;
      });
      applyFilters();
    });
  });

  // Use the form's native reset event to restore order & visibility (wait a tick for native reset)
  form.addEventListener('reset', () => {
    // native reset will uncheck radios — wait until after that happens
    setTimeout(() => {
      restoreOriginalOrder();
      applyFilters();
    }, 0);
  });

  // apply filters/sort and render
  function applyFilters() {
    const topic = form.querySelector('input[name="topic"]:checked')?.value || null;
    const complexity = form.querySelector('input[name="complexity"]:checked')?.value || null;
    const dateSort = form.querySelector('input[name="date"]:checked')?.value || null; // 'newest'|'oldest'|null

    // filter
    let visible = cards.filter(card => {
      if (topic && card.dataset.topic !== topic) return false;
      if (complexity && card.dataset.complexity !== complexity) return false;
      return true;
    });

    // show/hide
    cards.forEach(c => c.style.display = visible.includes(c) ? '' : 'none');

    // sort by date if requested; else restore original relative order among visible
    if (dateSort) {
      const sorted = visible.slice().sort((a, b) => {
        const da = a.dataset.date || '';
        const db = b.dataset.date || '';
        // newest => descending
        return dateSort === 'newest' ? db.localeCompare(da) : da.localeCompare(db);
      });
      sorted.forEach(c => container.appendChild(c));
    } else {
      const visibleSet = new Set(visible);
      (container.__originalCards || cards).forEach(c => {
        if (visibleSet.has(c)) container.appendChild(c);
      });
    }
  }

  function restoreOriginalOrder() {
    const original = container.__originalCards || cards;
    container.innerHTML = '';
    original.forEach(c => {
      c.style.display = '';
      container.appendChild(c);
    });
  }

  // initial render
  applyFilters();
}

// initialize once on load and after SPA swaps
document.addEventListener('DOMContentLoaded', () => initProjectFilters(document));
document.addEventListener('content:loaded', (e) => {
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

document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.project');
  if (!container) return;

  const cards = Array.from(container.querySelectorAll('.project-card'));
  const originalOrder = cards.slice();

  const form = document.getElementById('project-filters');
  if (!form) return;

  // all inputs inside the single form (works for radio or checkbox)
  const inputs = Array.from(form.querySelectorAll('input[type="radio"]'));
  const resetBtn = form.querySelector('input[type="reset"]');

  // When an input is checked, clear any inputs from other groups (name)
  inputs.forEach(inp => {
    inp.addEventListener('change', () => {
      if (inp.checked) {
        const group = inp.name;
        inputs.forEach(other => {
          if (other === inp) return;
          if (other.name !== group) other.checked = false;
        });
      }
      applyFilters();
    });
  });

  // Global reset: prevent native partial reset and restore original DOM order
  if (resetBtn) {
    resetBtn.addEventListener('click', (e) => {
      e.preventDefault();
      inputs.forEach(i => i.checked = false);
      restoreOriginalOrder();
      applyFilters();
    });
  }

  function applyFilters() {
    const topic = form.querySelector('input[name="topic"]:checked')?.value || null;
    const complexity = form.querySelector('input[name="complexity"]:checked')?.value || null;
    const dateSort = form.querySelector('input[name="date"]:checked')?.value || null; // 'newest' | 'oldest' | null

    // decide visibility
    const visible = cards.filter(card => {
      if (topic && card.dataset.topic !== topic) return false;
      if (complexity && card.dataset.complexity !== complexity) return false;
      return true;
    });

    // show/hide
    cards.forEach(c => c.style.display = visible.includes(c) ? '' : 'none');

    // if date sort selected, sort visible by data-date; otherwise restore original relative order
    if (dateSort) {
      const multiplier = dateSort === 'newest' ? -1 : 1;
      const sorted = visible.slice().sort((a, b) => {
        const da = a.dataset.date || '';
        const db = b.dataset.date || '';
        if (da < db) return -1 * multiplier;
        if (da > db) return 1 * multiplier;
        return 0;
      });
      sorted.forEach(c => container.appendChild(c));
    } else {
      const set = new Set(visible);
      originalOrder.forEach(c => {
        if (set.has(c)) container.appendChild(c);
      });
    }
  }

  function restoreOriginalOrder() {
    originalOrder.forEach(c => container.appendChild(c));
    cards.forEach(c => c.style.display = '');
  }

  // initialize
  applyFilters();
});

//____________________________________________________________________________

// Collapse toggle text functionality
function initCollapseToggles(root = document) {
  const collapses = root.querySelectorAll('div.collapse');
  
  collapses.forEach(collapse => {
    const checkbox = collapse.querySelector('input[type="checkbox"]');
    const titleDiv = collapse.querySelector('div.collapse-title');
    
    if (checkbox && titleDiv) {
      // Set initial state
      updateCollapseText(checkbox, titleDiv);
      
      // Listen for changes
      checkbox.addEventListener('change', () => {
        updateCollapseText(checkbox, titleDiv);
      });
    }
  });
}

function updateCollapseText(checkbox, titleDiv) {
  if (checkbox.checked) {
    titleDiv.textContent = 'less';
  } else {
    titleDiv.textContent = 'more';
  }
}

// Initialize on DOMContentLoaded and after content:loaded (SPA navigation)
document.addEventListener('DOMContentLoaded', () => initCollapseToggles(document));
document.addEventListener('content:loaded', (e) => {
  const main = document.getElementById('main-content');
  if (main) initCollapseToggles(main);
});







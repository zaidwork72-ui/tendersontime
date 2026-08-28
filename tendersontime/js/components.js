async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return;
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }
    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// Load Footer
loadComponent("footer", "./components/footer.html");


// Nabar
async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return;
  try {
    const response = await fetch(componentPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${componentPath}`);
    }
    const html = await response.text();
    element.innerHTML = html;
  } catch (error) {
    console.error(error);
  }
}

// Load Navbar
// Initialize navbar interactivity (safe, no-op if elements missing)
function initNavbar() {
  const menuToggle = document.querySelector('#navbar .menu-toggle');
  const navigation = document.querySelector('#navbar .navigation');
  if (!menuToggle || !navigation) return;

  menuToggle.addEventListener('click', () => {
    const willBeActive = !navigation.classList.contains('active');
    navigation.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(willBeActive));

    // swap icon text to 'cancel' when active, 'menu' when closed
    const iconSpan = menuToggle.querySelector('.material-symbols-outlined');
    if (iconSpan) iconSpan.textContent = willBeActive ? 'cancel' : 'menu';

    // lock body scroll when nav is active
    if (willBeActive) {
      document.body.classList.add('nav-open');
    } else {
      document.body.classList.remove('nav-open');
      document.querySelectorAll('#navbar .nav-dropdown.open').forEach(item => {
        item.classList.remove('open');
      });
    }
  });

  document.querySelectorAll('#navbar .nav-dropdown > a').forEach(trigger => {
    trigger.addEventListener('click', (event) => {
      if (!navigation.classList.contains('active')) return;
      event.preventDefault();
      const parent = trigger.closest('.nav-dropdown');
      const willOpen = !parent.classList.contains('open');
      document.querySelectorAll('#navbar .nav-dropdown.open').forEach(item => {
        if (item !== parent) item.classList.remove('open');
      });
      parent.classList.toggle('open', willOpen);
    });
  });

  document.querySelectorAll('#navbar .navigation a').forEach(link => {
    link.addEventListener('click', () => {
      const isDropdownTrigger = link.parentElement.classList.contains('nav-dropdown');
      if (isDropdownTrigger) return;

      if (navigation.classList.contains('active')) {
        navigation.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
        const iconSpan = menuToggle.querySelector('.material-symbols-outlined');
        if (iconSpan) iconSpan.textContent = 'menu';
        document.body.classList.remove('nav-open');
        document.querySelectorAll('#navbar .nav-dropdown.open').forEach(item => {
          item.classList.remove('open');
        });
      }
    });
  });
}

loadComponent("navbar", "./components/navbar.html").then(() => {
  try { initNavbar(); } catch (e) { console.error(e); }
});
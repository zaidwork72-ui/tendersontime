function resolveComponentPath(componentPath) {
  if (!componentPath) return componentPath;
  if (/^(?:[a-z]+:)?\/\//i.test(componentPath) || componentPath.startsWith('/')) {
    return componentPath;
  }

  const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));

  if (currentScript && currentScript.src) {
    return new URL(componentPath, currentScript.src).href;
  }

  return new URL(componentPath, window.location.href).href;
}

async function loadComponent(elementId, componentPath) {
  const element = document.getElementById(elementId);
  if (!element) return false;

  const resolvedPath = resolveComponentPath(componentPath);

  try {
    const response = await fetch(resolvedPath);
    if (!response.ok) {
      throw new Error(`Failed to load ${resolvedPath}`);
    }

    const html = await response.text();
    element.innerHTML = html;

    if (elementId === 'navbar') {
      const pricingLink = document.querySelector('#navbar a[href*="pricing"], #navbar a[href*="Pricing"]');
      if (pricingLink) {
        const targetHref = window.location.pathname.includes('/pages/') ? './pricing.html' : 'pages/pricing.html';
        pricingLink.setAttribute('href', targetHref);
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

window.loadComponent = loadComponent;

// Load Footer
loadComponent('footer', '../components/footer.html');

// Load Navbar
function initNavbar() {
  const menuToggle = document.querySelector('#navbar .menu-toggle');
  const navigation = document.querySelector('#navbar .navigation');
  if (!menuToggle || !navigation) return;

  menuToggle.addEventListener('click', () => {
    const willBeActive = !navigation.classList.contains('active');
    navigation.classList.toggle('active');
    menuToggle.setAttribute('aria-expanded', String(willBeActive));

    const iconSpan = menuToggle.querySelector('.material-symbols-outlined');
    if (iconSpan) iconSpan.textContent = willBeActive ? 'cancel' : 'menu';

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

loadComponent('navbar', '../components/navbar.html').then(() => {
  try {
    initNavbar();
  } catch (e) {
    console.error(e);
  }
});
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

function getVisibleTextForLink(el) {
  if (!el) return '';
  const clone = el.cloneNode(true);
  clone.querySelectorAll('.material-symbols-outlined, img').forEach(n => n.remove());
  return (clone.textContent || '').trim().toLowerCase().replace(/\s+/g, ' ');
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
      try {
        const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));
        const base = currentScript && currentScript.src ? currentScript.src : window.location.href;
        if (pricingLink) {
          const resolvedPricing = new URL('../pages/pricing.html', base).href;
          pricingLink.setAttribute('href', resolvedPricing);
        }
      } catch (e) {
        console.error('Pricing link resolution failed', e);
      }

      // Fix logo image src and make it link to home (works from any page depth)
      try {
        const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));
        const base = currentScript && currentScript.src ? currentScript.src : window.location.href;

        const signInLink = document.querySelector('#navbar .signIn');
        if (signInLink) {
          const loginUrl = new URL('../pages/auth/login.html', base).href;
          signInLink.setAttribute('href', loginUrl);
        }

        const logoImg = document.querySelector('#navbar .logo img');
        const logoWrapper = document.querySelector('#navbar .logo');
        if (logoImg && logoWrapper) {
          const logoUrl = new URL('../assets/Logo_DT.png', base).href;
          logoImg.setAttribute('src', logoUrl);

          // wrap image in anchor to home if not already
          const existingLink = logoWrapper.querySelector('a');
          const homeUrl = new URL('../index.html', base).href;
          if (!existingLink) {
            const a = document.createElement('a');
            a.setAttribute('href', homeUrl);
            a.className = 'logo-link';
            logoImg.parentNode.replaceChild(a, logoImg);
            a.appendChild(logoImg);
          } else {
            existingLink.setAttribute('href', homeUrl);
          }
        }
      } catch (e) {
        console.error('Navbar logo/link fix failed', e);
      }

      // Update submenu links to point to actual pages
      try {
        const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));
        const base = currentScript && currentScript.src ? currentScript.src : window.location.href;

        const linkMap = {
          'latest tenders': '../pages/tenders/latest.html',
          'featured opportunities': '../pages/tenders/featured.html',
          'closing soon': '../pages/tenders/closing-soon.html',
          'by region': '../pages/tenders/region.html',
          'by country': '../pages/tenders/country.html',
          'by industries': '../pages/tenders/industry.html',
          'sample tenders': '../pages/resources/sampleTenders.html',
          'how it works': '../pages/resources/howItWorks.html',
          'success stories': '../pages/resources/successStories.html',
          'industry insights / blogs': '../pages/resources/industryInsights.html',
          'company overview': '../pages/about/companyOverview.html',
          'why defence tenders': '../pages/about/whyDefenceTenders.html',
          'global coverage': '../pages/about/globalCoverage.html'
        };

        document.querySelectorAll('#navbar .navigation a').forEach(link => {
          const key = getVisibleTextForLink(link);
          if (linkMap[key]) {
            const resolved = new URL(linkMap[key], base).href;
            link.setAttribute('href', resolved);
          }
        });
      } catch (e) {
        console.error('Navbar links mapping failed', e);
      }
    }

    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}

window.loadComponent = loadComponent;

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

// Also ensure footer logo and links resolve correctly after it's loaded
loadComponent('footer', '../components/footer.html').then(() => {
  try {
    const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));
    const base = currentScript && currentScript.src ? currentScript.src : window.location.href;

    const footerLogoImg = document.querySelector('#footer .footer-logo img, .site-footer .footer-logo img');
    const footerLogoLink = document.querySelector('#footer .footer-logo, .site-footer .footer-logo');
    if (footerLogoImg) {
      const footerLogoUrl = new URL('../assets/footerLogo.png', base).href;
      footerLogoImg.setAttribute('src', footerLogoUrl);
    }
    if (footerLogoLink) {
      const homeUrl = new URL('../index.html', base).href;
      footerLogoLink.setAttribute('href', homeUrl);
    }
    // Map footer links to real pages
    try {
      const footerLinkMap = {
        'latest tenders': '../pages/tenders/latest.html',
        'featured opportunities': '../pages/tenders/featured.html',
        'closing soon': '../pages/tenders/closing-soon.html',
        'by country': '../pages/tenders/country.html',
        'by industries': '../pages/tenders/industry.html',
        'about us': '../pages/about/companyOverview.html',
        'request a demo': '../pages/contact.html',
        'contact us': '../pages/contact.html',
        'sample tenders': '../pages/resources/sampleTenders.html',
        'how it works': '../pages/resources/howItWorks.html',
        'success stories/blogs': '../pages/resources/successStories.html',
        'plans': '../pages/pricing.html',
        'free trials': '../pages/pricing.html'
      };

      document.querySelectorAll('.site-footer a, #footer a').forEach(a => {
        const key = getVisibleTextForLink(a);
        if (footerLinkMap[key]) {
          a.setAttribute('href', new URL(footerLinkMap[key], base).href);
        }
      });
    } catch (e) {
      console.error('Footer links mapping failed', e);
    }
  } catch (e) {
    console.error('Footer logo/link fix failed', e);
  }
});

// Attach search form submit handler (index landing) and tender click delegation
(function() {
  try {
    const currentScript = document.currentScript || Array.from(document.querySelectorAll('script')).find(script => script.src.includes('/js/components.js'));
    const base = currentScript && currentScript.src ? currentScript.src : window.location.href;

    // Search form on index: redirect to pages/tenders/search.html with query params
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
      searchForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const kwEl = document.getElementById('keyword');
        const countryEl = document.getElementById('country');
        const kw = kwEl ? kwEl.value.trim() : '';
        const country = countryEl ? countryEl.value.trim() : '';
        const target = new URL('../pages/tenders/search.html', base).href;
        const params = new URLSearchParams();
        if (kw) params.set('keyword', kw);
        if (country) params.set('country', country);
        window.location.href = params.toString() ? `${target}?${params.toString()}` : target;
      });
    }

    // Delegate clicks on tender cards to tendersdetail page (unless clicking an actual link)
    document.addEventListener('click', (e) => {
      try {
        if (e.defaultPrevented) return;
        const clickedAnchor = e.target.closest('a');
        if (clickedAnchor) return; // let normal links behave

        const card = e.target.closest('.card');
        if (!card) return;

        const detail = new URL('../pages/tenders/tendersdetail.html', base).href;
        window.location.href = detail;
      } catch (err) {
        // swallow per-click errors
      }
    });

  } catch (e) {
    console.error('Search/tender handlers init failed', e);
  }
})();
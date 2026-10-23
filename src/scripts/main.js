// Homepage Main Script - Capital Nut Mart
// Sticky Header, Theme Management & Mobile Drawer Navigation

// DOM Elements
const themeToggleBtn = document.getElementById('themeToggleBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const toastNotice = document.getElementById('toastNotice');

// Initialize Homepage
function init() {
  setupThemeToggle();
  setupMobileDrawer();
  setupStickyHeader();
  setupCertificateModal();
  setupCertificateDropdowns();
}

// Sticky Header Reveal on Scroll (Locks header after 1st section scrolls down)
function setupStickyHeader() {
  const header = document.getElementById('siteHeader');
  if (!header) return;

  const heroSection = document.getElementById('heroSection');
  const heroBtn = document.getElementById('heroBulkQuoteBtn');

  const onScroll = () => {
    // When the user scrolls down past the 1st section (hero quote button scrolls above viewport)
    if (heroBtn) {
      const rect = heroBtn.getBoundingClientRect();
      if (rect.bottom < 80) {
        header.classList.add('is-sticky-visible');
        return;
      } else {
        header.classList.remove('is-sticky-visible');
        return;
      }
    }

    const threshold = heroSection ? (heroSection.offsetTop + heroSection.offsetHeight - 120) : 300;
    if (window.scrollY > threshold) {
      header.classList.add('is-sticky-visible');
    } else {
      header.classList.remove('is-sticky-visible');
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}


// Theme Toggle (Default Light Palette #F7F4EE vs Dark Contrast)
function setupThemeToggle() {
  const toggleButtons = document.querySelectorAll('.theme-toggle-btn');
  if (toggleButtons.length === 0) return;

  const savedTheme = localStorage.getItem('cnm_theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
      if (isDark) {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('cnm_theme', 'light');
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('cnm_theme', 'dark');
      }
    });
  });
}

// Mobile Drawer Navigation
function setupMobileDrawer() {
  const menuToggles = document.querySelectorAll('.mobile-nav-toggle');
  if (menuToggles.length === 0 || !mobileDrawer) return;

  menuToggles.forEach(btn => {
    btn.addEventListener('click', () => {
      mobileDrawer.classList.add('open');
    });
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  });

  mobileDrawer.addEventListener('click', (e) => {
    if (e.target === mobileDrawer) {
      mobileDrawer.classList.remove('open');
    }
  });
}

// Certificate Lightbox Preview Modal
function setupCertificateModal() {
  const modal = document.getElementById('certificateModal');
  if (!modal) return;
  const modalImg = document.getElementById('modalCertImg');
  const modalTitle = document.getElementById('modalCertTitle');
  const modalSubtitle = document.getElementById('modalCertSubtitle');
  const closeBtn = document.getElementById('closeCertModalBtn');

  document.querySelectorAll('.certificate-media').forEach(media => {
    const openModal = () => {
      const card = media.closest('.certificate-card');
      const img = media.querySelector('.certificate-img');
      const title = card ? card.querySelector('.certificate-title') : null;
      const subtitle = card ? card.querySelector('.certificate-subtitle') : null;

      if (img && modalImg) {
        modalImg.src = img.src;
        modalImg.alt = img.alt;
      }
      if (title && modalTitle) {
        modalTitle.textContent = title.textContent;
      }
      if (subtitle && modalSubtitle) {
        modalSubtitle.textContent = subtitle.textContent;
      }

      if (typeof modal.showModal === 'function') {
        modal.showModal();
      } else {
        modal.setAttribute('open', '');
      }
    };

    media.addEventListener('click', openModal);
    media.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal();
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    });
  }

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (typeof modal.close === 'function') {
        modal.close();
      } else {
        modal.removeAttribute('open');
      }
    }
  });
}

// Certificate Details Dropdown (Collapses on mobile < 768px, stays expanded on desktop >= 768px)
function setupCertificateDropdowns() {
  const dropdowns = document.querySelectorAll('.certificate-details-dropdown');
  if (!dropdowns.length) return;

  const mql = window.matchMedia('(min-width: 768px)');

  const syncState = (e) => {
    const isDesktop = e.matches;
    dropdowns.forEach(details => {
      if (isDesktop) {
        details.setAttribute('open', '');
      } else {
        details.removeAttribute('open');
      }
    });
  };

  syncState(mql);

  if (typeof mql.addEventListener === 'function') {
    mql.addEventListener('change', syncState);
  } else if (typeof mql.addListener === 'function') {
    mql.addListener(syncState);
  }
}

// Toast notification trigger
export function showToast(message) {
  if (!toastNotice) return;
  toastNotice.querySelector('.toast-text').textContent = message;
  toastNotice.classList.add('show');
  setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 4000);
}

// Start application
document.addEventListener('DOMContentLoaded', init);

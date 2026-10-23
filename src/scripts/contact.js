// Contact Page Module - Capital Nut Mart Export Desk

// DOM Elements
const contactRfqForm = document.getElementById('contactRfqForm');
const contactSubmitBtn = document.getElementById('contactSubmitBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const mobileDrawerCta = document.getElementById('mobileDrawerCta');
const toastNotice = document.getElementById('toastNotice');

function init() {
  setupThemeToggle();
  setupMobileDrawer();
  setupContactForm();
}

// Theme Toggle (Light Theme Default #F7F4EE vs Dark Mode)
function setupThemeToggle() {
  if (!themeToggleBtn) return;

  const savedTheme = localStorage.getItem('cnm_theme');
  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
  } else {
    document.documentElement.removeAttribute('data-theme');
  }

  themeToggleBtn.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      localStorage.setItem('cnm_theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      localStorage.setItem('cnm_theme', 'dark');
    }
  });
}

// Mobile Drawer Navigation
function setupMobileDrawer() {
  if (!mobileMenuToggle || !mobileDrawer) return;

  mobileMenuToggle.addEventListener('click', () => {
    mobileDrawer.classList.add('open');
  });

  if (closeDrawerBtn) {
    closeDrawerBtn.addEventListener('click', () => {
      mobileDrawer.classList.remove('open');
    });
  }

  if (mobileDrawerCta) {
    mobileDrawerCta.addEventListener('click', () => {
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

// Contact RFQ Form Logic
function setupContactForm() {
  if (!contactRfqForm) return;

  contactRfqForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const fullName = document.getElementById('contactFullName')?.value.trim();
    const email = document.getElementById('contactEmail')?.value.trim();
    const phone = document.getElementById('contactPhone')?.value.trim();
    const commodity = document.getElementById('contactCommodity')?.value;
    const incoterms = document.getElementById('contactIncoterms')?.value;
    const volume = document.getElementById('contactVolume')?.value;
    const requirements = document.getElementById('contactRequirements')?.value.trim();

    if (!fullName || !email || !phone || !commodity || !incoterms || !volume) {
      showToast('Please fill in all required fields marked with *');
      return;
    }

    // Disable button temporarily & show processing state
    const originalBtnHtml = contactSubmitBtn.innerHTML;
    contactSubmitBtn.disabled = true;
    contactSubmitBtn.innerHTML = `<span>Formatting Container RFQ...</span>`;

    // Construct formal commercial inquiry message for Trade Desk
    const inquiryText = 
      `*CAPITAL NUT MART - EXPORT CONTAINER RFQ*\n\n` +
      `*Procurement Contact:* ${fullName}\n` +
      `*Corporate Email:* ${email}\n` +
      `*Direct Phone:* ${phone}\n\n` +
      `*Commodity & Grade:* ${commodity}\n` +
      `*Shipping Terms:* ${incoterms}\n` +
      `*Estimated Volume:* ${volume}\n` +
      (requirements ? `*Specific Port / Batch Specs:* ${requirements}\n\n` : `\n`) +
      `*Target Dispatch:* Cochin Port (COK), India\n` +
      `_Submitted via Capital Nut Mart Official Trade Desk._`;

    setTimeout(() => {
      contactSubmitBtn.disabled = false;
      contactSubmitBtn.innerHTML = originalBtnHtml;

      showToast(`Quotation generated! Opening Trade Desk WhatsApp...`);

      // WhatsApp Desk URL
      const whatsappUrl = `https://wa.me/919495596102?text=${encodeURIComponent(inquiryText)}`;
      window.open(whatsappUrl, '_blank');

      // Optional reset
      contactRfqForm.reset();
    }, 700);
  });
}

// Toast Feedback Notification
function showToast(message) {
  if (!toastNotice) return;
  toastNotice.querySelector('.toast-text').textContent = message;
  toastNotice.classList.add('show');
  setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 4500);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', init);

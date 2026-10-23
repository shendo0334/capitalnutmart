import { exportProducts } from './products-data.js';

// DOM Elements
const productsGrid = document.getElementById('productsGrid');
const filterButtons = document.querySelectorAll('.filter-btn');
const productSearchInput = document.getElementById('productSearchInput');
const productCountBadge = document.getElementById('productCountBadge');
const specDialog = document.getElementById('specDialog');
const dialogCloseBtn = document.getElementById('dialogCloseBtn');
const dialogTitle = document.getElementById('dialogTitle');
const dialogOrigin = document.getElementById('dialogOrigin');
const dialogBody = document.getElementById('dialogBody');
const dialogInquireBtn = document.getElementById('dialogInquireBtn');
const themeToggleBtn = document.getElementById('themeToggleBtn');
const mobileMenuToggle = document.getElementById('mobileMenuToggle');
const mobileDrawer = document.getElementById('mobileDrawer');
const closeDrawerBtn = document.getElementById('closeDrawerBtn');
const toastNotice = document.getElementById('toastNotice');

let currentFilter = 'all';
let currentSearchTerm = '';
let selectedProductForModal = null;

// Initialize Products Page
function init() {
  renderProducts(exportProducts);
  setupFilterListeners();
  setupSearchListener();
  setupModalListeners();
  setupThemeToggle();
  setupMobileDrawer();
  handleUrlHash();
}

// Render Products Grid
function renderProducts(products) {
  if (!productsGrid) return;

  const filtered = products.filter(p => {
    const matchesFilter = currentFilter === 'all' || p.category === currentFilter;
    const matchesSearch = !currentSearchTerm || 
      p.title.toLowerCase().includes(currentSearchTerm) ||
      p.origin.toLowerCase().includes(currentSearchTerm) ||
      p.commercialGrade.toLowerCase().includes(currentSearchTerm) ||
      p.tagline.toLowerCase().includes(currentSearchTerm);
    return matchesFilter && matchesSearch;
  });

  if (productCountBadge) {
    productCountBadge.textContent = `${filtered.length} ${filtered.length === 1 ? 'Commodity' : 'Commodities'} Available`;
  }

  if (filtered.length === 0) {
    productsGrid.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: var(--space-8) var(--space-2); background: var(--color-bg-card); border-radius: var(--radius-lg); border: 1px dashed var(--color-border-subtle);">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent-gold)" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom: var(--space-2);">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          <line x1="11" y1="8" x2="11" y2="8.01"></line>
        </svg>
        <h3 style="font-size: 1.25rem; color: var(--color-text-primary); margin-bottom: var(--space-1);">No commodities found</h3>
        <p class="text-secondary" style="font-size: 0.9375rem; margin-bottom: var(--space-3);">No export-grade harvest matches your selected filter criteria.</p>
        <button type="button" class="btn btn-outline btn-sm" id="resetFiltersBtn">Reset Filters</button>
      </div>
    `;
    const resetBtn = document.getElementById('resetFiltersBtn');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        currentFilter = 'all';
        currentSearchTerm = '';
        if (productSearchInput) productSearchInput.value = '';
        filterButtons.forEach(b => b.classList.toggle('active', b.dataset.filter === 'all'));
        renderProducts(exportProducts);
      });
    }
    return;
  }

  productsGrid.innerHTML = filtered.map(product => `
    <article class="product-card" data-category="${product.category}" id="${product.id}">
      <div class="product-media">
        <img src="${product.image}" alt="${product.title}" loading="lazy" width="600" height="450">
        <span class="product-grade-badge">${product.commercialGrade.split(' ')[0]} GRADE</span>
      </div>
      <div class="product-body">
        <span class="product-origin">${product.origin}</span>
        <h3 class="product-title">${product.title}</h3>
        <p class="product-tagline">${product.tagline}</p>
        
        <div class="product-specs-preview">
          <div class="spec-preview-item">
            <span class="spec-preview-label">Sortex Purity</span>
            <span class="spec-preview-value">99.8% Clean</span>
          </div>
          <div class="spec-preview-item">
            <span class="spec-preview-label">Moisture Content</span>
            <span class="spec-preview-value">${product.specs.moistureContent || '< 5%'}</span>
          </div>
        </div>
      </div>
      <div class="product-footer-actions">
        <button type="button" class="btn btn-outline btn-sm open-spec-btn" data-id="${product.id}" aria-label="View commercial export specifications for ${product.title}">
          Commercial Specs
        </button>
        <button type="button" class="btn btn-primary btn-sm quick-inquire-btn" data-id="${product.id}" aria-label="Inquire about ${product.title}">
          Inquire CIF
        </button>
      </div>
    </article>
  `).join('');

  attachCardActionListeners();
}

// Filter Tabs Handler
function setupFilterListeners() {
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      currentFilter = btn.dataset.filter;
      renderProducts(exportProducts);
    });
  });
}

// Search Handler
function setupSearchListener() {
  if (!productSearchInput) return;
  productSearchInput.addEventListener('input', (e) => {
    currentSearchTerm = e.target.value.trim().toLowerCase();
    renderProducts(exportProducts);
  });
}

// Attach event listeners to card buttons
function attachCardActionListeners() {
  // Spec button
  document.querySelectorAll('.open-spec-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.dataset.id;
      openSpecModal(prodId);
    });
  });

  // Direct Inquire button
  document.querySelectorAll('.quick-inquire-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const prodId = btn.dataset.id;
      inquireProduct(prodId);
    });
  });
}

// Open Export Specs Dialog Modal
function openSpecModal(productId) {
  const product = exportProducts.find(p => p.id === productId);
  if (!product || !specDialog) return;

  selectedProductForModal = product;
  dialogTitle.textContent = product.title;
  dialogOrigin.textContent = `${product.origin} • ${product.commercialGrade}`;

  const specRows = Object.entries(product.specs).map(([key, value]) => {
    const formattedKey = key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return `
      <tr>
        <th scope="row">${formattedKey}</th>
        <td>${value}</td>
      </tr>
    `;
  }).join('');

  dialogBody.innerHTML = `
    <p class="product-modal-desc text-secondary" style="font-size: 0.9375rem; margin-bottom: var(--space-2);">${product.description}</p>
    
    <table class="spec-table" aria-label="Commercial Technical Specifications">
      <tbody>
        ${specRows}
        <tr>
          <th scope="row">Available Incoterms</th>
          <td>${product.incoterms}</td>
        </tr>
        <tr>
          <th scope="row">Minimum Order (MOQ)</th>
          <td>${product.minOrderQuantity}</td>
        </tr>
        <tr>
          <th scope="row">Export Packaging</th>
          <td>${product.packaging.join(' • ')}</td>
        </tr>
        <tr>
          <th scope="row">Certifications</th>
          <td>${product.certifications.join(', ')}</td>
        </tr>
      </tbody>
    </table>
  `;

  specDialog.showModal();
}

// Modal closing and modal action listeners
function setupModalListeners() {
  if (dialogCloseBtn && specDialog) {
    dialogCloseBtn.addEventListener('click', () => {
      specDialog.close();
    });

    specDialog.addEventListener('click', (e) => {
      const rect = specDialog.getBoundingClientRect();
      const isInDialog = (rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width);
      if (!isInDialog) {
        specDialog.close();
      }
    });
  }

  if (dialogInquireBtn && specDialog) {
    dialogInquireBtn.addEventListener('click', () => {
      if (selectedProductForModal) {
        specDialog.close();
        inquireProduct(selectedProductForModal.id);
      }
    });
  }
}

// Direct Inquire via Trade Desk (WhatsApp API)
function inquireProduct(productId) {
  const product = exportProducts.find(p => p.id === productId);
  if (!product) return;

  const textMsg = encodeURIComponent(
    `Hello Capital Nut Mart Export Desk,\n\n` +
    `We are interested in CIF/FOB export pricing for:\n` +
    `• Commodity: ${product.title}\n` +
    `• Grade: ${product.commercialGrade}\n` +
    `• Origin: ${product.origin}\n\n` +
    `Please share current harvest container availability and maritime freight rates.`
  );

  showToast(`Opening Trade Desk inquiry for ${product.title}...`);
  const whatsappUrl = `https://wa.me/919495596102?text=${textMsg}`;
  window.open(whatsappUrl, '_blank');
}

// Toast notification trigger
function showToast(message) {
  if (!toastNotice) return;
  toastNotice.querySelector('.toast-text').textContent = message;
  toastNotice.classList.add('show');
  setTimeout(() => {
    toastNotice.classList.remove('show');
  }, 4000);
}

// Theme Toggle
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

// Handle Direct Hash (e.g., #cashews-w180, #black-pepper, #king-cashews)
function handleUrlHash() {
  let hash = window.location.hash.replace('#', '');
  if (!hash) return;

  // Backward compatibility alias
  if (hash === 'king-cashews') hash = 'cashews-w180';

  const targetProduct = exportProducts.find(p => p.id === hash);
  if (targetProduct && currentFilter !== 'all' && currentFilter !== targetProduct.category) {
    currentFilter = targetProduct.category;
    filterButtons.forEach(b => {
      const isActive = b.dataset.filter === currentFilter;
      b.classList.toggle('active', isActive);
      b.setAttribute('aria-selected', String(isActive));
    });
    renderProducts(exportProducts);
  }

  setTimeout(() => {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
      el.style.borderColor = 'var(--color-accent-gold)';
      el.style.boxShadow = '0 0 20px rgba(196, 139, 63, 0.4)';
      setTimeout(() => {
        el.style.borderColor = '';
        el.style.boxShadow = '';
      }, 3000);
    }
  }, 300);
}

// Start application
document.addEventListener('DOMContentLoaded', init);

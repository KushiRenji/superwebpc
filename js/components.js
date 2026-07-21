// Module xử lý trang Components: render catalog, tìm kiếm, lọc, sắp xếp và mở modal chi tiết.

const componentState = {
  searchTerm: '',
  category: 'all',
  sort: 'featured',
  priceRange: 'all',
  brand: 'all',
  socket: 'all',
  ddr: 'all',
  platform: 'all',
  formFactor: 'all',
  pcie: 'all',
  ramCapacity: 'all',
  ssdCapacity: 'all',
  psuPower: 'all'
};

function getPriceValue(product) {
  return Number(product.price) || 0;
}

function getFilteredProducts() {
  const normalizedSearch = componentState.searchTerm.trim().toLowerCase();

  return componentProducts
    .filter((product) => {
      const matchesCategory = componentState.category === 'all' || product.category === componentState.category;
      const matchesSearch = !normalizedSearch || [product.name, product.brand, product.description, product.category, product.specs?.socket, product.specs?.chipset, product.specs?.series, product.specs?.ddr, product.specs?.pcie, product.specs?.vram, product.specs?.capacity, product.specs?.power]
        .filter(Boolean)
        .join(' ')
        .toLowerCase()
        .includes(normalizedSearch);
      const matchesPrice = componentState.priceRange === 'all' || matchesPriceRange(product.price, componentState.priceRange);
      const matchesBrand = componentState.brand === 'all' || product.brand.toLowerCase() === componentState.brand.toLowerCase();
      const matchesSocket = componentState.socket === 'all' || product.specs?.socket?.toLowerCase().includes(componentState.socket.toLowerCase()) || componentState.socket === 'all';
      const matchesDdr = componentState.ddr === 'all' || product.specs?.ddr?.toLowerCase() === componentState.ddr.toLowerCase();
      const matchesPlatform = componentState.platform === 'all' || (componentState.platform === 'intel' && product.name.toLowerCase().includes('intel')) || (componentState.platform === 'amd' && product.name.toLowerCase().includes('amd')) || (componentState.platform === 'nvidia' && product.brand.toLowerCase() === 'nvidia');
      const matchesFormFactor = componentState.formFactor === 'all' || product.specs?.formFactor?.toLowerCase() === componentState.formFactor.toLowerCase();
      const matchesPcie = componentState.pcie === 'all' || product.specs?.pcie?.toLowerCase().includes(componentState.pcie.toLowerCase());
      const matchesRamCapacity = componentState.ramCapacity === 'all' || (product.category === 'ram' && product.specs?.capacity?.toLowerCase().includes(componentState.ramCapacity.toLowerCase()));
      const matchesSsdCapacity = componentState.ssdCapacity === 'all' || (product.category === 'ssd' && product.specs?.capacity?.toLowerCase().includes(componentState.ssdCapacity.toLowerCase()));
      const matchesPsuPower = componentState.psuPower === 'all' || (product.category === 'psu' && product.specs?.power?.toLowerCase().includes(componentState.psuPower.toLowerCase()));

      return matchesCategory && matchesSearch && matchesPrice && matchesBrand && matchesSocket && matchesDdr && matchesPlatform && matchesFormFactor && matchesPcie && matchesRamCapacity && matchesSsdCapacity && matchesPsuPower;
    })
    .sort((left, right) => {
      switch (componentState.sort) {
        case 'price-asc':
          return getPriceValue(left) - getPriceValue(right);
        case 'price-desc':
          return getPriceValue(right) - getPriceValue(left);
        case 'name-asc':
          return left.name.localeCompare(right.name);
        case 'name-desc':
          return right.name.localeCompare(left.name);
        case 'newest':
          return (right.id?.toString().includes('cpu') ? 0 : 0) - (left.id?.toString().includes('cpu') ? 0 : 0);
        case 'rating':
          return getPriceValue(right) - getPriceValue(left);
        default:
          return right.rating - left.rating;
      }
    });
}

function matchesPriceRange(price, range) {
  switch (range) {
    case 'under-100':
      return price < 100;
    case '100-300':
      return price >= 100 && price <= 300;
    case '300-700':
      return price >= 300 && price <= 700;
    case '700-plus':
      return price > 700;
    default:
      return true;
  }
}

function renderComponentCatalog() {
  const grid = document.querySelector('[data-component-grid]');
  const resultCount = document.querySelector('[data-result-count]');

  if (!grid) return;

  const products = getFilteredProducts();
  grid.innerHTML = '';

  if (products.length === 0) {
    grid.innerHTML = '<div class="empty-state">Không tìm thấy linh kiện phù hợp. Hãy thử thay đổi bộ lọc hoặc từ khóa.</div>';
    if (resultCount) resultCount.textContent = '0 kết quả';
    return;
  }

  if (resultCount) resultCount.textContent = `${products.length} kết quả`;

  products.forEach((product) => {
    const card = document.createElement('article');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.name}" title="${product.name}" loading="lazy" width="600" height="400">
      <div class="product-meta">
        <span class="small">${product.brand}</span>
        <span class="small">★ ${product.rating}</span>
      </div>
      <h3>${product.name}</h3>
      <p class="small">${product.description}</p>
      <div class="product-meta">
        <span class="small">${product.category.toUpperCase()}</span>
        <strong class="price">$${product.price}</strong>
      </div>
      <div class="card-actions">
        <button class="secondary-btn" data-view-details="${product.id}">View Details</button>
        <button class="secondary-btn" data-compare="${product.id}">Compare</button>
        <button class="primary-btn" data-add-build="${product.id}">Add to Build</button>
      </div>
    `;
    grid.appendChild(card);
  });

  attachCardActions();
}

function attachCardActions() {
  document.querySelectorAll('[data-view-details]').forEach((button) => {
    button.addEventListener('click', () => openDetailModal(button.dataset.viewDetails));
  });

  document.querySelectorAll('[data-compare]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.compare;
      const product = componentProducts.find((item) => item.id === id);
      if (product) {
        const compareBox = document.querySelector('[data-compare-box]');
        if (compareBox) {
          compareBox.innerHTML = `<div class="summary-card"><strong>Đang so sánh:</strong><br>${product.name} - $${product.price}</div>`;
        }
      }
    });
  });

  document.querySelectorAll('[data-add-build]').forEach((button) => {
    button.addEventListener('click', () => {
      const id = button.dataset.addBuild;
      const product = componentProducts.find((item) => item.id === id);
      if (product) {
        const buildBox = document.querySelector('[data-build-box]');
        if (buildBox) {
          buildBox.innerHTML = `<div class="summary-card"><strong>Đã thêm vào build:</strong><br>${product.name}</div>`;
        }
      }
    });
  });
}

function openDetailModal(productId) {
  const product = componentProducts.find((item) => item.id === productId);
  if (!product) return;

  const modal = document.querySelector('[data-detail-modal]');
  if (!modal) return;

  const relatedProducts = componentProducts.filter((item) => item.category === product.category && item.id !== product.id).slice(0, 4);
  modal.innerHTML = `
    <div class="modal-content">
      <button class="icon-btn modal-close" data-close-modal aria-label="Close details">✕</button>
      <div class="detail-grid">
        <img src="${product.image}" alt="${product.name}" title="${product.name}" loading="lazy" width="800" height="500">
        <div>
          <p class="small">${product.brand}</p>
          <h2>${product.name}</h2>
          <p>${product.description}</p>
          <div class="product-meta"><span>Đánh giá</span><strong>★ ${product.rating}</strong></div>
          <div class="product-meta"><span>Giá</span><strong class="price">$${product.price}</strong></div>
          <div class="summary-card"><strong>Ưu điểm</strong><ul>${product.highlights.map((item) => `<li>${item}</li>`).join('')}</ul></div>
          <div class="summary-card"><strong>Nhược điểm</strong><ul>${product.drawbacks.map((item) => `<li>${item}</li>`).join('')}</ul></div>
        </div>
      </div>
      <div class="section">
        <h3>Thông số kỹ thuật</h3>
        <div class="card-grid">
          ${Object.entries(product.specs || {}).map(([key, value]) => `<div class="summary-card"><strong>${key}</strong><br>${value}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h3>Recommended Components</h3>
        <div class="card-grid">
          ${product.recommendedComponents.map((componentName) => `<div class="summary-card">${componentName}</div>`).join('')}
        </div>
      </div>
      <div class="section">
        <h3>Phù hợp với</h3>
        <div class="card-grid">
          ${relatedProducts.map((item) => `<div class="summary-card">${item.name}</div>`).join('')}
        </div>
      </div>
    </div>
  `;
  modal.classList.add('open');

  modal.querySelector('[data-close-modal]')?.addEventListener('click', () => {
    modal.classList.remove('open');
    modal.innerHTML = '';
  });
}

function bindComponentControls() {
  const searchInput = document.querySelector('[data-component-search]');
  const sortSelect = document.querySelector('[data-sort]');
  const categorySelect = document.querySelector('[data-category-filter]');
  const priceSelect = document.querySelector('[data-price-filter]');
  const brandSelect = document.querySelector('[data-brand-filter]');
  const socketSelect = document.querySelector('[data-socket-filter]');
  const ddrSelect = document.querySelector('[data-ddr-filter]');
  const platformSelect = document.querySelector('[data-platform-filter]');
  const formFactorSelect = document.querySelector('[data-form-factor-filter]');
  const pcieSelect = document.querySelector('[data-pcie-filter]');
  const ramCapacitySelect = document.querySelector('[data-ram-capacity-filter]');
  const ssdCapacitySelect = document.querySelector('[data-ssd-capacity-filter]');
  const psuPowerSelect = document.querySelector('[data-psu-power-filter]');

  const updateState = (field, value) => {
    componentState[field] = value;
    console.log('Filter', { field, value, state: componentState });
    renderComponentCatalog();
  };

  searchInput?.addEventListener('input', (event) => updateState('searchTerm', event.target.value));
  sortSelect?.addEventListener('change', (event) => updateState('sort', event.target.value));
  categorySelect?.addEventListener('change', (event) => updateState('category', event.target.value));
  priceSelect?.addEventListener('change', (event) => updateState('priceRange', event.target.value));
  brandSelect?.addEventListener('change', (event) => updateState('brand', event.target.value));
  socketSelect?.addEventListener('change', (event) => updateState('socket', event.target.value));
  ddrSelect?.addEventListener('change', (event) => updateState('ddr', event.target.value));
  platformSelect?.addEventListener('change', (event) => updateState('platform', event.target.value));
  formFactorSelect?.addEventListener('change', (event) => updateState('formFactor', event.target.value));
  pcieSelect?.addEventListener('change', (event) => updateState('pcie', event.target.value));
  ramCapacitySelect?.addEventListener('change', (event) => updateState('ramCapacity', event.target.value));
  ssdCapacitySelect?.addEventListener('change', (event) => updateState('ssdCapacity', event.target.value));
  psuPowerSelect?.addEventListener('change', (event) => updateState('psuPower', event.target.value));
}

function initComponentPage() {
  bindComponentControls();
  renderComponentCatalog();
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.querySelector('[data-component-grid]')) {
    initComponentPage();
  }
});

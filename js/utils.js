// Các hàm tiện ích dùng chung để tạo UI và định dạng thông tin sản phẩm.
function formatCurrency(value) {
  return value;
}

function getCategoryLabel(categoryKey) {
  const mapping = {
    cpu: 'CPU',
    gpu: 'GPU',
    ram: 'RAM',
    ssd: 'SSD',
    motherboard: 'Mainboard',
    psu: 'PSU',
    case: 'Case',
    cooling: 'Cooling'
  };
  return mapping[categoryKey] || categoryKey;
}

function createProductCard(product) {
  return `
    <article class="product-card" aria-label="${product.name}">
      <img src="${product.image}" alt="${product.name}" title="${product.name}" loading="lazy" decoding="async" width="600" height="400">
      <div class="product-meta">
        <span class="small">${product.badge}</span>
        <span class="small">★ ${product.rating}</span>
      </div>
      <h3>${product.name}</h3>
      <p class="small">${product.description}</p>
      <div class="product-meta">
        <strong class="price">${product.price}</strong>
        <a class="secondary-btn" href="components.html">View Details</a>
      </div>
    </article>
  `;
}

document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.querySelector('[data-search]');
  const productGrid = document.querySelector('[data-product-grid]');

  if (!searchInput || !productGrid) return;

  const applySearch = () => {
    const query = searchInput.value.trim().toLowerCase();
    const cards = productGrid.querySelectorAll('.product-card');
    cards.forEach((card) => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(query) ? 'flex' : 'none';
    });
  };

  searchInput.addEventListener('input', applySearch);
});

document.addEventListener('DOMContentLoaded', () => {
  const filterSelect = document.querySelector('[data-filter]');
  const productGrid = document.querySelector('[data-product-grid]');

  if (!filterSelect || !productGrid) return;

  const applyFilter = () => {
    const selected = filterSelect.value;
    const cards = productGrid.querySelectorAll('.product-card');
    cards.forEach((card) => {
      const category = card.dataset.category || '';
      card.style.display = selected === 'all' || category === selected ? 'flex' : 'none';
    });
  };

  filterSelect.addEventListener('change', applyFilter);
});

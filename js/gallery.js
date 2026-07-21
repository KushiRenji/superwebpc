document.addEventListener('DOMContentLoaded', () => {
  const gallerySection = document.querySelector('[data-gallery]');
  const previewPanel = document.querySelector('[data-preview-panel]');

  if (!gallerySection) return;

  const images = [
    {
      src: 'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80',
      alt: 'Build PC gaming tối ưu cho 4K',
      caption: 'Cấu hình tối ưu cho gaming và sáng tạo nội dung.'
    },
    {
      src: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd0b3?auto=format&fit=crop&w=1200&q=80',
      alt: 'Build workstation AI và lập trình',
      caption: 'Workstation mạnh cho AI, lập trình và rendering.'
    },
    {
      src: 'https://images.unsplash.com/photo-1623305839690-7e2123d7ecf6?auto=format&fit=crop&w=1200&q=80',
      alt: 'Build office và streaming',
      caption: 'Cấu hình nhỏ gọn, tiết kiệm điện và phù hợp streaming.'
    }
  ];

  gallerySection.innerHTML = images.map((image) => `
    <figure class="product-card gallery-item">
      <img src="${image.src}" alt="${image.alt}" title="${image.alt}" loading="lazy" decoding="async" width="600" height="400">
      <figcaption class="small">${image.caption}</figcaption>
    </figure>
  `).join('');

  const galleryImages = gallerySection.querySelectorAll('img');
  galleryImages.forEach((image) => {
    image.setAttribute('tabindex', '0');
    image.setAttribute('role', 'button');
    image.setAttribute('aria-label', image.alt);

    const handleUpdate = (event) => {
      event.preventDefault();
      update(image);
    };

    image.addEventListener('mouseover', handleUpdate);
    image.addEventListener('focus', handleUpdate);
    image.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        handleUpdate(event);
      }
    });
    image.addEventListener('mouseout', undo);
    image.addEventListener('blur', undo);
  });

  function update(previewPic) {
    console.log('Image hovered');
    console.log(previewPic);
    const previewText = previewPic.alt;
    if (previewPanel) {
      previewPanel.innerHTML = `
        <div class="preview-panel">
          <h3>Preview</h3>
          <p>${previewText}</p>
        </div>
      `;
      previewPanel.style.backgroundImage = `url('${previewPic.src}')`;
    }
  }

  function undo() {
    if (previewPanel) {
      previewPanel.style.backgroundImage = "url('')";
      previewPanel.innerHTML = `
        <div class="preview-panel">
          <h3>Preview</h3>
          <p>Di chuột qua một hình ảnh bên dưới để hiển thị ở đây.</p>
        </div>
      `;
    }
    console.log('Undo');
  }

  undo();
});

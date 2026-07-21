document.addEventListener('DOMContentLoaded', () => {
  const controls = document.querySelector('[data-build-controls]');
  const summaryList = document.querySelector('[data-summary]');
  const totalPrice = document.querySelector('[data-total-price]');
  const compatibilityStatus = document.querySelector('[data-compatibility]');
  const presetsList = document.querySelector('[data-build-presets]');
  const totalPower = document.querySelector('[data-total-power]');
  const performanceLabel = document.querySelector('[data-performance]');

  if (!controls || !summaryList || !totalPrice || !compatibilityStatus || !presetsList || !totalPower || !performanceLabel) {
    return;
  }

  const selectedComponents = {};

  const recommendedBuilds = [
    {
      id: 'gaming',
      title: 'Gaming Build',
      description: 'Cấu hình đỉnh cho 1440p và 4K gaming.',
      components: {
        cpu: 'cpu-01',
        motherboard: 'mb-07',
        ram: 'ram-02',
        gpu: 'gpu-02',
        ssd: 'ssd-03',
        psu: 'psu-02',
        cooler: 'cooler-01',
        case: 'case-02',
        monitor: 'monitor-03'
      },
      highlights: ['GPU mạnh', 'Tản nhiệt cao cấp'],
      drawbacks: ['Giá cao']
    },
    {
      id: 'office',
      title: 'Office Build',
      description: 'Cấu hình ổn định, tiết kiệm điện và phù hợp văn phòng.',
      components: {
        cpu: 'cpu-16',
        motherboard: 'mb-09',
        ram: 'ram-06',
        gpu: 'gpu-07',
        ssd: 'ssd-09',
        psu: 'psu-06',
        cooler: 'cooler-05',
        case: 'case-05',
        monitor: 'monitor-09'
      },
      highlights: ['Giá tốt', 'Tiết kiệm điện'],
      drawbacks: ['Không tối ưu cho AAA']
    },
    {
      id: 'ai',
      title: 'AI Workstation',
      description: 'Hệ thống mạnh cho training, rendering và AI nhẹ.',
      components: {
        cpu: 'cpu-19',
        motherboard: 'mb-08',
        ram: 'ram-08',
        gpu: 'gpu-01',
        ssd: 'ssd-01',
        psu: 'psu-01',
        cooler: 'cooler-11',
        case: 'case-01',
        monitor: 'monitor-02'
      },
      highlights: ['Hiệu năng đỉnh', 'Dung lượng RAM cao'],
      drawbacks: ['Tốn chi phí']
    }
  ];

  function getProductById(productId) {
    return componentProducts.find((product) => product.id === productId) || null;
  }

  function getProductsForCategory(categoryKey) {
    switch (categoryKey) {
      case 'cpu':
        return cpuProducts;
      case 'motherboard':
        return motherboardProducts;
      case 'ram':
        return ramProducts;
      case 'gpu':
        return gpuProducts;
      case 'ssd':
        return ssdProducts;
      case 'hdd':
        return hddProducts;
      case 'psu':
        return psuProducts;
      case 'case':
        return caseProducts;
      case 'cooler':
        return coolerProducts;
      case 'monitor':
        return monitorProducts;
      case 'keyboard':
        return keyboardProducts;
      case 'mouse':
        return mouseProducts;
      case 'headset':
        return headsetProducts;
      default:
        return [];
    }
  }

  function getCompatibleProducts(categoryKey) {
    const products = getProductsForCategory(categoryKey);

    if (categoryKey === 'motherboard') {
      if (selectedComponents.cpu) {
        return products.filter((product) => product.specs.socket === selectedComponents.cpu.specs.socket);
      }
      return products;
    }

    if (categoryKey === 'ram') {
      if (selectedComponents.motherboard) {
        return products.filter((product) => product.specs.ddr === selectedComponents.motherboard.specs.ddr);
      }
      return products;
    }

    if (categoryKey === 'psu') {
      const estimatePower = calculateEstimatedPower();
      return products.filter((product) => Number(product.specs.power.replace(/\D/g, '')) >= estimatePower);
    }

    if (categoryKey === 'cooler') {
      if (!selectedComponents.cpu) {
        return products;
      }
      const cpuSocket = selectedComponents.cpu.specs.socket || '';
      return products.filter((cooler) => {
        if (cpuSocket.includes('LGA')) {
          return (cooler.specs.socketIntel || '').toLowerCase().includes('lga');
        }
        if (cpuSocket.includes('AM')) {
          return (cooler.specs.socketAmd || '').toLowerCase().includes('am');
        }
        return true;
      });
    }

    return products;
  }

  function calculateEstimatedPower() {
    const cpuTdp = Number(selectedComponents.cpu?.specs?.tdp?.replace(/\D/g, '')) || 0;
    const gpuPower = Number(selectedComponents.gpu?.specs?.powerDraw?.replace(/\D/g, '')) || 0;
    const boardPower = selectedComponents.motherboard ? 20 : 0;
    const ssdPower = selectedComponents.ssd ? 5 : 0;
    const hddPower = selectedComponents.hdd ? 7 : 0;
    const fanPower = selectedComponents.cooler ? 10 : 0;
    return cpuTdp + gpuPower + boardPower + ssdPower + hddPower + fanPower;
  }

  function getCompatibilityMessages() {
    const messages = [];

    if (selectedComponents.cpu && selectedComponents.motherboard && selectedComponents.cpu.specs.socket !== selectedComponents.motherboard.specs.socket) {
      messages.push('❌ CPU và Mainboard không cùng socket.');
    }

    if (selectedComponents.motherboard && selectedComponents.ram && selectedComponents.motherboard.specs.ddr !== selectedComponents.ram.specs.ddr) {
      messages.push('❌ Mainboard không hỗ trợ DDR phù hợp.');
    }

    if (selectedComponents.cpu && selectedComponents.cooler) {
      const cpuSocket = selectedComponents.cpu.specs.socket || '';
      const coolerSocketIntel = (selectedComponents.cooler.specs.socketIntel || '').toLowerCase();
      const coolerSocketAmd = (selectedComponents.cooler.specs.socketAmd || '').toLowerCase();
      const coolerTdp = Number(selectedComponents.cooler.specs.tdp?.replace(/\D/g, '')) || 0;
      const cpuTdp = Number(selectedComponents.cpu.specs.tdp?.replace(/\D/g, '')) || 0;

      if (cpuSocket.includes('LGA') && !coolerSocketIntel.includes('lga')) {
        messages.push('❌ Cooler không hỗ trợ socket Intel.');
      }
      if (cpuSocket.includes('AM') && !coolerSocketAmd.includes('am')) {
        messages.push('❌ Cooler không hỗ trợ socket AMD.');
      }
      if (coolerTdp < cpuTdp) {
        messages.push('❌ Cooler không đủ TDP.');
      }
    }

    if (selectedComponents.gpu && selectedComponents.psu) {
      const gpuPower = Number(selectedComponents.gpu.specs.powerDraw?.replace(/\D/g, '')) || 0;
      const psuPower = Number(selectedComponents.psu.specs.power?.replace(/\D/g, '')) || 0;
      const estimatePower = calculateEstimatedPower();
      if (psuPower < estimatePower) {
        messages.push('❌ PSU không đủ công suất.');
      }
      if (gpuPower >= 350 && psuPower < 850) {
        messages.push('❌ PSU không đủ cho GPU cao cấp.');
      }
    }

    if (selectedComponents.case && selectedComponents.motherboard) {
      const formFactor = selectedComponents.motherboard.specs.formFactor?.toLowerCase() || '';
      const caseSpec = selectedComponents.case.specs;
      const supportsFormFactor = formFactor === 'atx'
        ? caseSpec.atx === 'Yes'
        : formFactor === 'matx'
          ? caseSpec.matx === 'Yes'
          : caseSpec.itx === 'Yes';

      if (!supportsFormFactor) {
        messages.push('❌ Case không hỗ trợ form factor mainboard.');
      }
    }

    if (selectedComponents.case && selectedComponents.gpu) {
      const gpuName = selectedComponents.gpu.name.toLowerCase();
      const longGpu = ['4090', '4080', '3090', '3080', '4070 ti'].some((token) => gpuName.includes(token));
      const supportsVga = selectedComponents.case.specs.supportsVga || '';
      if (longGpu && supportsVga.includes('2-slot')) {
        messages.push('❌ Case không hỗ trợ VGA dài.');
      }
    }

    if (selectedComponents.case && selectedComponents.cooler && selectedComponents.cooler.type === 'AIO') {
      const radiatorSupport = selectedComponents.case.specs.supportsRadiator || '';
      if (radiatorSupport.includes('120mm') && !selectedComponents.cooler.name.toLowerCase().includes('240')) {
        messages.push('❌ Case không hỗ trợ radiator của cooler AIO.');
      }
    }

    if (selectedComponents.cooler && selectedComponents.case && selectedComponents.cooler.name.includes('NH-D15') && selectedComponents.case.specs.tower === 'Mini Tower') {
      messages.push('❌ Case không đủ không gian cho cooler lớn.');
    }

    return messages;
  }

  function getPerformanceLabel() {
    if (!selectedComponents.cpu || !selectedComponents.gpu) {
      return 'Chưa đủ dữ liệu';
    }
    const cpuScore = Number(selectedComponents.cpu.specs.cores || 0);
    const gpuScore = Number(selectedComponents.gpu.specs.cuda?.replace(/\D/g, '') || 0);
    if (cpuScore >= 20 && gpuScore >= 10000) {
      return '4K Gaming / Workstation';
    }
    if (cpuScore >= 14 && gpuScore >= 7000) {
      return '1440p Gaming / Streaming';
    }
    return '1080p Gaming / Office';
  }

  function renderBuilderControls() {
    controls.innerHTML = '';

    buildCategories.forEach((category) => {
      const card = document.createElement('article');
      card.className = 'build-selector-card';
      card.innerHTML = `
        <div class="build-selector-header">
          <h3>${category.title}</h3>
          <p class="small">${category.subtitle}</p>
        </div>
        <label class="build-picker">
          <span class="small">Chọn ${category.title}</span>
          <select aria-label="Select ${category.title}" data-category-select="${category.key}"></select>
        </label>
      `;
      const select = card.querySelector('select');
      const products = getCompatibleProducts(category.key);
      select.innerHTML = `<option value="">Chọn ${category.title}</option>${products.map((product) => `<option value="${product.id}" ${selectedComponents[category.key]?.id === product.id ? 'selected' : ''}>${product.name} — $${product.price}</option>`).join('')}`;
      select.addEventListener('change', (event) => {
        const nextValue = event.target.value;
        const product = products.find((item) => item.id === nextValue) || null;
        if (product) {
          selectedComponents[category.key] = product;
        } else {
          delete selectedComponents[category.key];
        }
        console.log('Build', { category: category.key, product, selectedComponents });
        render();
      });
      controls.appendChild(card);
    });
  }

  function renderSummary() {
    summaryList.innerHTML = '';
    const selectedEntries = Object.entries(selectedComponents).filter(([, value]) => value);

    if (selectedEntries.length === 0) {
      summaryList.innerHTML = '<div class="summary-card">Chọn linh kiện để hệ thống bắt đầu hiển thị danh sách và mức giá.</div>';
    } else {
      selectedEntries.forEach(([key, product]) => {
        const row = document.createElement('div');
        row.className = 'summary-card';
        row.innerHTML = `<strong>${getCategoryLabel(key)}:</strong> ${product.name}<br><span class="small">$${product.price}</span>`;
        summaryList.appendChild(row);
      });
    }

    const total = selectedEntries.reduce((acc, [, product]) => acc + Number(product.price || 0), 0);
    totalPrice.textContent = total ? `$${total.toFixed(0)}` : '$0';

    const power = calculateEstimatedPower();
    totalPower.textContent = `${power}W`;
    performanceLabel.textContent = getPerformanceLabel();

    const compatibilityMessages = getCompatibilityMessages();
    if (compatibilityMessages.length === 0) {
      compatibilityStatus.innerHTML = '<span class="compatibility-success">✅ Fully Compatible</span>';
    } else {
      compatibilityStatus.innerHTML = `<ul class="compatibility-list">${compatibilityMessages.map((message) => `<li>${message}</li>`).join('')}</ul>`;
    }

    console.log('Compatibility', { power, compatibilityMessages });
  }

  function renderPresets() {
    presetsList.innerHTML = '';
    recommendedBuilds.forEach((build) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'preset-card';
      card.innerHTML = `
        <strong>${build.title}</strong>
        <p class="small">${build.description}</p>
        <span class="small">Ưu điểm: ${build.highlights.join(', ')}</span>
      `;
      card.addEventListener('click', () => {
        Object.keys(selectedComponents).forEach((key) => delete selectedComponents[key]);
        Object.entries(build.components).forEach(([key, id]) => {
          selectedComponents[key] = getProductById(id);
        });
        console.log('Build preset applied', build.title, selectedComponents);
        render();
      });
      presetsList.appendChild(card);
    });
  }

  function render() {
    renderBuilderControls();
    renderSummary();
    renderPresets();
  }

  render();
});

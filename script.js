document.addEventListener('DOMContentLoaded', function() {

  // ----- DEFAULT PRODUCTS -----
  const defaultProducts = [
    { id: 1, name: 'Дрель ударная', brand: 'Bosch', price: 8900, description: 'Мощность: 800Вт, Регулировка оборотов, Плавный пуск', image: 'https://via.placeholder.com/200/333/ff6b00?text=Bosch', isHit: true },
    { id: 2, name: 'Шуруповерт', brand: 'Makita', price: 7500, description: '18В, 2 скорости, Металлический патрон', image: 'https://via.placeholder.com/200/333/ff6b00?text=Makita', isHit: true },
    { id: 3, name: 'Перфоратор', brand: 'DeWALT', price: 12300, description: '700Вт, SDS+ патрон, 3 режима работы', image: 'https://via.placeholder.com/200/333/ff6b00?text=DeWALT', isHit: true },
    { id: 4, name: 'Угловая шлифмашина', brand: 'Bosch', price: 6700, description: '125мм, 1100Вт, Защитный кожух', image: 'https://via.placeholder.com/200/333/ff6b00?text=Bosch', isHit: false },
    { id: 5, name: 'Лобзик', brand: 'Makita', price: 5400, description: '450Вт, Регулировка скорости, Маятниковый ход', image: 'https://via.placeholder.com/200/333/ff6b00?text=Makita', isHit: false },
    { id: 6, name: 'Рубанок', brand: 'DeWALT', price: 10200, description: '600Вт, Глубина строгания 2мм', image: 'https://via.placeholder.com/200/333/ff6b00?text=DeWALT', isHit: false },
    { id: 7, name: 'Фрезер', brand: 'Bosch', price: 14500, description: '1400Вт, Регулировка оборотов, Цанга 8мм', image: 'https://via.placeholder.com/200/333/ff6b00?text=Bosch', isHit: false },
    { id: 8, name: 'Пила цепная', brand: 'Makita', price: 9800, description: '2000Вт, Шина 40см, Автоматическая смазка', image: 'https://via.placeholder.com/200/333/ff6b00?text=Makita', isHit: false }
  ];

  // ----- LOCAL STORAGE -----
  let products = [];
  function loadProducts() {
    const stored = localStorage.getItem('garage48_products');
    if (stored) {
      try {
        products = JSON.parse(stored);
        products.forEach(p => { 
          if (p.isHit === undefined) p.isHit = false;
          if (!p.description) p.description = '';
        });
      } catch(e) {
        products = JSON.parse(JSON.stringify(defaultProducts));
      }
    } else {
      products = JSON.parse(JSON.stringify(defaultProducts));
    }
    saveProducts();
  }
  function saveProducts() {
    localStorage.setItem('garage48_products', JSON.stringify(products));
  }
  loadProducts();

  // ----- RENDER FUNCTIONS -----
  function renderHits() {
    const hits = products.filter(p => p.isHit === true);
    const grid = document.getElementById('hitsGrid');
    if (hits.length === 0) {
      grid.innerHTML = '<p style="color:#b0b0b0; grid-column:1/-1; text-align:center;">Нет товаров в хитах</p>';
      return;
    }
    grid.innerHTML = hits.map(p => createCardHTML(p)).join('');
  }

  function renderCatalog(filtered) {
    const grid = document.getElementById('catalogGrid');
    const items = filtered || products;
    if (items.length === 0) {
      grid.innerHTML = '<p style="color:#b0b0b0; grid-column:1/-1; text-align:center;">Товары не найдены</p>';
      return;
    }
    grid.innerHTML = items.map(p => createCardHTML(p)).join('');
  }

  function createCardHTML(p) {
    const hitBadge = p.isHit ? '<span class="hit-badge">Хит</span>' : '';
    const desc = p.description ? `<div class="description">${p.description}</div>` : '';
    return `<div class="product-card">
      ${hitBadge}
      <img src="${p.image || 'https://via.placeholder.com/200/444/ff6b00?text=NO+IMG'}" alt="${p.name}">
      <h4>${p.name}</h4>
      <div class="brand">${p.brand}</div>
      ${desc}
      <div class="price">${p.price} ₽</div>
    </div>`;
  }

  // ----- FILTER -----
  function filterProducts() {
    const search = document.getElementById('filterSearch').value.toLowerCase().trim();
    const brand = document.getElementById('filterBrand').value.toLowerCase().trim();
    const priceFrom = parseFloat(document.getElementById('filterPriceFrom').value) || 0;
    const priceTo = parseFloat(document.getElementById('filterPriceTo').value) || Infinity;

    const filtered = products.filter(p => {
      const matchName = p.name.toLowerCase().includes(search);
      const matchBrand = p.brand.toLowerCase().includes(brand);
      const matchPrice = p.price >= priceFrom && p.price <= priceTo;
      return matchName && matchBrand && matchPrice;
    });
    renderCatalog(filtered);
  }

  // attach filter events
  document.getElementById('filterSearch').addEventListener('input', filterProducts);
  document.getElementById('filterBrand').addEventListener('input', filterProducts);
  document.getElementById('filterPriceFrom').addEventListener('input', filterProducts);
  document.getElementById('filterPriceTo').addEventListener('input', filterProducts);

  // ----- NAVIGATION (pages + burger) -----
  const navLinks = document.querySelectorAll('.nav-link');
  const pages = {
    home: document.getElementById('page-home'),
    catalog: document.getElementById('page-catalog'),
    contacts: document.getElementById('page-contacts')
  };
  const burger = document.getElementById('burger');
  const navMenu = document.getElementById('navMenu');

  function setActivePage(pageId) {
    Object.keys(pages).forEach(key => {
      pages[key].classList.toggle('active-page', key === pageId);
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.dataset.page === pageId);
    });
    navMenu.classList.remove('open');
    if (pageId === 'catalog') {
      filterProducts();
    }
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      setActivePage(page);
    });
  });

  document.querySelector('.hero-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    setActivePage('catalog');
  });

  burger.addEventListener('click', () => {
    navMenu.classList.toggle('open');
  });

  // ----- ADMIN MODAL -----
  const adminOverlay = document.getElementById('adminOverlay');
  const adminSecretBtn = document.getElementById('adminSecretBtn');
  const adminClose = document.getElementById('adminClose');
  const adminLoginBtn = document.getElementById('adminLoginBtn');
  const adminLoginForm = document.getElementById('adminLoginForm');
  const adminPanel = document.getElementById('adminPanel');
  const addProductBtn = document.getElementById('addProductBtn');

  let adminLogged = false;

  adminSecretBtn.addEventListener('click', () => {
    adminOverlay.classList.add('active');
    if (adminLogged) {
      adminLoginForm.style.display = 'none';
      adminPanel.style.display = 'block';
      renderAdminProductList();
    } else {
      adminLoginForm.style.display = 'block';
      adminPanel.style.display = 'none';
    }
    document.getElementById('adminMessage').textContent = '';
  });

  adminClose.addEventListener('click', () => {
    adminOverlay.classList.remove('active');
  });
  adminOverlay.addEventListener('click', (e) => {
    if (e.target === adminOverlay) adminOverlay.classList.remove('active');
  });

  adminLoginBtn.addEventListener('click', () => {
    const login = document.getElementById('adminLogin').value.trim();
    const pass = document.getElementById('adminPassword').value.trim();
    if (login === 'admin' && pass === 'admin123') {
      adminLogged = true;
      adminLoginForm.style.display = 'none';
      adminPanel.style.display = 'block';
      renderAdminProductList();
      document.getElementById('adminMessage').textContent = 'Вход выполнен';
      document.getElementById('adminMessage').style.color = '#0a7e0a';
    } else {
      document.getElementById('adminMessage').textContent = 'Неверный логин или пароль';
      document.getElementById('adminMessage').style.color = '#c0392b';
    }
  });

  // ----- TABS -----
  document.querySelectorAll('.admin-tab').forEach(tab => {
    tab.addEventListener('click', function() {
      document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
      this.classList.add('active');
      const tabName = this.dataset.tab;
      document.querySelectorAll('.admin-tab-content').forEach(c => c.classList.remove('active'));
      document.getElementById('adminTab' + tabName.charAt(0).toUpperCase() + tabName.slice(1)).classList.add('active');
      if (tabName === 'manage') {
        renderAdminProductList();
      }
    });
  });

  // ----- ADD PRODUCT -----
  addProductBtn.addEventListener('click', () => {
    const name = document.getElementById('addName').value.trim();
    const brand = document.getElementById('addBrand').value.trim();
    const price = parseFloat(document.getElementById('addPrice').value);
    const description = document.getElementById('addDescription').value.trim();
    const imageUrl = document.getElementById('addImageUrl').value.trim();
    const fileInput = document.getElementById('addImageFile');
    const file = fileInput.files[0];

    if (!name || !brand || isNaN(price) || price <= 0) {
      document.getElementById('adminPanelMessage').textContent = 'Заполните название, бренд и цену';
      document.getElementById('adminPanelMessage').style.color = '#c0392b';
      return;
    }

    let finalImage = imageUrl || 'https://via.placeholder.com/200/444/ff6b00?text=NO+IMG';

    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        finalImage = e.target.result;
        addProductToArray(name, brand, price, description, finalImage);
      };
      reader.readAsDataURL(file);
    } else {
      addProductToArray(name, brand, price, description, finalImage);
    }
  });

  function addProductToArray(name, brand, price, description, image) {
    const newProduct = {
      id: Date.now() + Math.random(),
      name: name,
      brand: brand,
      price: price,
      description: description || '',
      image: image,
      isHit: false
    };
    products.push(newProduct);
    saveProducts();
    renderHits();
    filterProducts();
    renderAdminProductList();
    
    document.getElementById('addName').value = '';
    document.getElementById('addBrand').value = '';
    document.getElementById('addPrice').value = '';
    document.getElementById('addDescription').value = '';
    document.getElementById('addImageUrl').value = '';
    document.getElementById('addImageFile').value = '';
    document.getElementById('adminPanelMessage').textContent = 'Товар добавлен!';
    document.getElementById('adminPanelMessage').style.color = '#0a7e0a';
  }

  // ----- ADMIN PRODUCT LIST -----
  function renderAdminProductList() {
    const list = document.getElementById('adminProductList');
    if (products.length === 0) {
      list.innerHTML = '<p style="color:#666;">Нет товаров</p>';
      return;
    }
    list.innerHTML = products.map(p => `
      <div class="admin-product-item" data-id="${p.id}">
        <div class="info">
          <div class="name">${p.name}</div>
          <div class="brand">${p.brand}</div>
          <div class="price">${p.price} ₽</div>
        </div>
        <div class="admin-item-actions">
          <button class="hit-btn ${p.isHit ? 'active' : ''}" onclick="toggleHit('${p.id}')">
            ${p.isHit ? '⭐ Хит' : '⭐'}
          </button>
          <button class="edit-btn" onclick="openEditModal('${p.id}')">✏️</button>
          <button class="delete-btn" onclick="deleteProduct('${p.id}')">🗑️</button>
        </div>
      </div>
    `).join('');
  }

  // ----- GLOBAL FUNCTIONS for admin (used in onclick) -----
  window.toggleHit = function(id) {
    const product = products.find(p => p.id == id);
    if (product) {
      product.isHit = !product.isHit;
      saveProducts();
      renderHits();
      filterProducts();
      renderAdminProductList();
    }
  };

  window.deleteProduct = function(id) {
    if (confirm('Удалить этот товар?')) {
      products = products.filter(p => p.id != id);
      saveProducts();
      renderHits();
      filterProducts();
      renderAdminProductList();
    }
  };

  // ----- EDIT MODAL -----
  const editOverlay = document.getElementById('editOverlay');
  const editClose = document.getElementById('editClose');
  const saveEditBtn = document.getElementById('saveEditBtn');
  let editingId = null;

  window.openEditModal = function(id) {
    const product = products.find(p => p.id == id);
    if (!product) return;
    editingId = id;
    document.getElementById('editProductId').value = id;
    document.getElementById('editName').value = product.name;
    document.getElementById('editBrand').value = product.brand;
    document.getElementById('editPrice').value = product.price;
    document.getElementById('editDescription').value = product.description || '';
    document.getElementById('editImageUrl').value = product.image || '';
    document.getElementById('editImageFile').value = '';
    document.getElementById('editMessage').textContent = '';
    editOverlay.classList.add('active');
  };

  editClose.addEventListener('click', () => {
    editOverlay.classList.remove('active');
  });
  editOverlay.addEventListener('click', (e) => {
    if (e.target === editOverlay) editOverlay.classList.remove('active');
  });

  saveEditBtn.addEventListener('click', () => {
    const id = document.getElementById('editProductId').value;
    const product = products.find(p => p.id == id);
    if (!product) return;

    const name = document.getElementById('editName').value.trim();
    const brand = document.getElementById('editBrand').value.trim();
    const price = parseFloat(document.getElementById('editPrice').value);
    const description = document.getElementById('editDescription').value.trim();
    const imageUrl = document.getElementById('editImageUrl').value.trim();
    const fileInput = document.getElementById('editImageFile');
    const file = fileInput.files[0];

    if (!name || !brand || isNaN(price) || price <= 0) {
      document.getElementById('editMessage').textContent = 'Заполните название, бренд и цену';
      document.getElementById('editMessage').style.color = '#c0392b';
      return;
    }

    product.name = name;
    product.brand = brand;
    product.price = price;
    product.description = description || '';

    if (file) {
      const reader = new FileReader();
      reader.onload = function(e) {
        product.image = e.target.result;
        saveChangesAndClose();
      };
      reader.readAsDataURL(file);
    } else if (imageUrl) {
      product.image = imageUrl;
      saveChangesAndClose();
    } else {
      saveChangesAndClose();
    }
  });

  function saveChangesAndClose() {
    saveProducts();
    renderHits();
    filterProducts();
    renderAdminProductList();
    editOverlay.classList.remove('active');
    document.getElementById('editMessage').textContent = 'Изменения сохранены!';
    document.getElementById('editMessage').style.color = '#0a7e0a';
  }

  // ----- INIT -----
  renderHits();
  renderCatalog(products);
  setActivePage('home');
});

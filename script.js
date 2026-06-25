document.addEventListener('DOMContentLoaded', () => {
    // ---------- ДЕФОЛТНЫЕ ТОВАРЫ ----------
    const defaultProducts = [
        { name: 'Дрель ударная', brand: 'Bosch', price: 12500, image: 'https://via.placeholder.com/200?text=Bosch', hit: true },
        { name: 'Шуруповерт', brand: 'Makita', price: 9800, image: 'https://via.placeholder.com/200?text=Makita', hit: true },
        { name: 'УШМ (болгарка)', brand: 'DeWALT', price: 11200, image: 'https://via.placeholder.com/200?text=DeWALT', hit: true },
        { name: 'Перфоратор', brand: 'Bosch', price: 18900, image: 'https://via.placeholder.com/200?text=Bosch+2', hit: true },
        { name: 'Лобзик', brand: 'Makita', price: 8400, image: 'https://via.placeholder.com/200?text=Makita+2', hit: false },
        { name: 'Фрезер', brand: 'DeWALT', price: 15600, image: 'https://via.placeholder.com/200?text=DeWALT+2', hit: false },
        { name: 'Шлифмашина', brand: 'Bosch', price: 7200, image: 'https://via.placeholder.com/200?text=Bosch+3', hit: false },
        { name: 'Пила циркулярная', brand: 'Makita', price: 13500, image: 'https://via.placeholder.com/200?text=Makita+3', hit: false }
    ];

    // ---------- ИНИЦИАЛИЗАЦИЯ ДАННЫХ ----------
    let products = JSON.parse(localStorage.getItem('garage48_products'));
    if (!products || products.length === 0) {
        products = defaultProducts;
        localStorage.setItem('garage48_products', JSON.stringify(products));
    }

    // ---------- DOM-ЭЛЕМЕНТЫ ----------
    const hitsGrid = document.getElementById('hitsGrid');
    const catalogGrid = document.getElementById('catalogGrid');
    const filterBrand = document.getElementById('filterBrand');
    const filterSearch = document.getElementById('filterSearch');
    const filterPriceMin = document.getElementById('filterPriceMin');
    const filterPriceMax = document.getElementById('filterPriceMax');
    const adminTrigger = document.getElementById('adminTrigger');
    const adminModal = document.getElementById('adminModal');
    const closeModal = document.getElementById('closeModal');
    const loginForm = document.getElementById('loginForm');
    const adminPanel = document.getElementById('adminPanel');
    const addProductForm = document.getElementById('addProductForm');
    const logoutAdmin = document.getElementById('logoutAdmin');
    const deleteList = document.getElementById('deleteList');
    const burgerBtn = document.getElementById('burgerBtn');
    const navMenu = document.getElementById('navMenu');

    // ---------- НАВИГАЦИЯ (SPA) ----------
    document.querySelectorAll('.nav-link, [data-page]').forEach(link => {
        link.addEventListener('click', (e) => {
            const pageName = link.dataset.page;
            if (pageName) {
                e.preventDefault();
                document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
                document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                document.getElementById(pageName).classList.add('active');
                document.querySelector(`.nav-link[data-page="${pageName}"]`)?.classList.add('active');
                if (pageName === 'catalog') renderCatalog();
                if (pageName === 'home') renderHits();
                navMenu.classList.remove('active');
            }
        });
    });

    // Бургер-меню
    burgerBtn.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });

    // ---------- РЕНДЕР КАРТОЧЕК ----------
    function renderCard(product) {
        const badge = product.hit ? '<div class="card-badge">ХИТ</div>' : '';
        return `
            <div class="card">
                ${badge}
                <img src="${product.image}" alt="${product.name}" loading="lazy">
                <div class="card-body">
                    <div class="card-brand">${product.brand}</div>
                    <div class="card-title">${product.name}</div>
                    <div class="card-price">${product.price.toLocaleString('ru-RU')} ₽</div>
                </div>
            </div>
        `;
    }

    function renderHits() {
        const hits = products.filter(p => p.hit === true);
        if (hits.length === 0) {
            hitsGrid.innerHTML = '<p style="color:#b0b0b0;grid-column:1/-1;text-align:center;padding:40px;">Пока нет хитов продаж</p>';
        } else {
            hitsGrid.innerHTML = hits.slice(0, 4).map(renderCard).join('');
        }
    }

    function renderCatalog() {
        const brand = filterBrand.value.toLowerCase();
        const search = filterSearch.value.toLowerCase();
        const minPrice = parseFloat(filterPriceMin.value) || 0;
        const maxPrice = parseFloat(filterPriceMax.value) || Infinity;

        const filtered = products.filter(p => {
            const matchBrand = !brand || p.brand.toLowerCase().includes(brand);
            const matchSearch = !search || p.name.toLowerCase().includes(search);
            const matchPrice = p.price >= minPrice && p.price <= maxPrice;
            return matchBrand && matchSearch && matchPrice;
        });

        catalogGrid.innerHTML = filtered.map(renderCard).join('');

        const brands = [...new Set(products.map(p => p.brand))];
        filterBrand.innerHTML = '<option value="">Все</option>' + 
            brands.map(b => `<option value="${b}">${b}</option>`).join('');
    }

    // ---------- РЕНДЕР СПИСКА ДЛЯ УДАЛЕНИЯ ----------
    function renderDeleteList() {
        if (products.length === 0) {
            deleteList.innerHTML = '<p style="padding:15px;text-align:center;color:#999;">Нет товаров для удаления</p>';
            return;
        }
        
        deleteList.innerHTML = products.map((p, index) => `
            <div class="delete-item">
                <div class="delete-item-info">
                    <strong>${p.brand} — ${p.name}</strong>
                    <span style="color:#777;">ID: ${index}</span>
                </div>
                <span class="delete-item-price">${p.price.toLocaleString('ru-RU')} ₽</span>
                <button class="btn-danger" onclick="deleteProduct(${index})" style="margin-left:10px;">
                    <i class="fas fa-trash"></i> Удалить
                </button>
            </div>
        `).join('');
    }

    // ---------- ФУНКЦИЯ УДАЛЕНИЯ (глобальная) ----------
    window.deleteProduct = function(index) {
        const product = products[index];
        const confirmed = confirm(`Точно удалить "${product.brand} — ${product.name}"?\nЦена: ${product.price.toLocaleString('ru-RU')} ₽`);
        
        if (confirmed) {
            products.splice(index, 1);
            localStorage.setItem('garage48_products', JSON.stringify(products));
            renderDeleteList();
            renderCatalog();
            renderHits();
        }
    };

    // Фильтры мгновенно
    filterBrand.addEventListener('change', renderCatalog);
    filterSearch.addEventListener('input', renderCatalog);
    filterPriceMin.addEventListener('input', renderCatalog);
    filterPriceMax.addEventListener('input', renderCatalog);

    // ---------- АДМИНКА ----------
    adminTrigger.addEventListener('click', () => {
        adminModal.classList.add('active');
        loginForm.style.display = 'block';
        adminPanel.style.display = 'none';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
    });

    closeModal.addEventListener('click', () => {
        adminModal.classList.remove('active');
    });

    window.addEventListener('click', (e) => {
        if (e.target === adminModal) adminModal.classList.remove('active');
    });

    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const pass = document.getElementById('loginPass').value;
        if (pass === 'admin123') {
            loginForm.style.display = 'none';
            adminPanel.style.display = 'block';
            renderDeleteList();
        } else {
            alert('Неверный пароль!');
        }
    });

    logoutAdmin.addEventListener('click', () => {
        adminModal.classList.remove('active');
        loginForm.style.display = 'block';
        adminPanel.style.display = 'none';
        document.getElementById('loginUser').value = '';
        document.getElementById('loginPass').value = '';
    });

    // Функция конвертации файла в Base64
    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    addProductForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('prodName').value.trim();
        const brand = document.getElementById('prodBrand').value.trim();
        const price = parseFloat(document.getElementById('prodPrice').value);
        let imageUrl = document.getElementById('prodImageUrl').value.trim();
        const fileInput = document.getElementById('prodImageFile');
        const file = fileInput.files[0];
        const isHit = document.getElementById('prodHit').checked;

        if (!name || !brand || isNaN(price)) return;

        if (file) {
            imageUrl = await fileToBase64(file);
        }

        if (!imageUrl) {
            imageUrl = 'https://via.placeholder.com/200?text=' + encodeURIComponent(name);
        }

        const newProduct = { 
            name, 
            brand, 
            price, 
            image: imageUrl,
            hit: isHit
        };
        
        products.push(newProduct);
        localStorage.setItem('garage48_products', JSON.stringify(products));

        addProductForm.reset();
        document.getElementById('prodHit').checked = false;
        renderDeleteList();
        renderCatalog();
        renderHits();
    });

    // Первичный рендер
    renderHits();
    renderCatalog();
    renderDeleteList();
});
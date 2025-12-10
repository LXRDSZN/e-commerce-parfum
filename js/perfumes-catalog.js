// =====================================================
// PERFUMES CATALOG - FUNCIONALIDAD COMPLETA
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 15;

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🛍️ CATALOG: Iniciando catálogo...');
    initializeCatalog();
});

async function initializeCatalog() {
    try {
        console.log('📦 Cargando productos para CATÁLOGO...');
        await loadCatalogProducts();
        console.log('🔧 Inicializando filtros...');
        initializeCatalogFilters();
        console.log('✅ Catálogo inicializado');
    } catch (error) {
        console.error('❌ Error inicializando catálogo:', error);
        showCatalogError();
    }
}

async function loadCatalogProducts() {
    try {
        const response = await fetch('../js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Productos del catálogo cargados:', data.perfumes.length);
        
        // Mapear productos para catálogo
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            price: perfume.price,
            image: perfume.image,
            category: perfume.category ? perfume.category.toLowerCase() : 'unisex',
            ml: perfume.ml,
            stock: perfume.stock || 10,
            concentration: perfume.concentration || 'eau-de-parfum',
            description: perfume.description || 'Fragancia premium de alta calidad.'
        }));

        filteredProducts = [...allProducts];
        renderCatalogProducts();
        updateCatalogCount();
        
    } catch (error) {
        console.error('❌ Error cargando productos:', error);
        throw error;
    }
}

function initializeCatalogFilters() {
    // Filtros de búsqueda
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', applyCatalogFilters);
    }
    
    // Filtros de género
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', applyCatalogFilters);
    });
    
    // Filtros de marca
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyCatalogFilters);
    });
    
    // Filtros de precio
    document.querySelectorAll('input[id^="price"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyCatalogFilters);
    });
    
    // Filtros de concentración
    document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyCatalogFilters);
    });
    
    // Ordenamiento
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', applyCatalogSorting);
    }
    
    console.log('✅ Filtros del catálogo inicializados');
}

function applyCatalogFilters() {
    console.log('🔍 Aplicando filtros del catálogo...');
    
    filteredProducts = allProducts.filter(product => {
        // Filtro de búsqueda
        const searchQuery = document.getElementById('searchFilter')?.value.toLowerCase() || '';
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && 
            !product.brand.toLowerCase().includes(searchQuery)) {
            return false;
        }
        
        // Filtro de género
        const selectedGender = document.querySelector('input[name="genero"]:checked')?.value;
        if (selectedGender && selectedGender !== 'todos') {
            if (product.category !== selectedGender) {
                return false;
            }
        }
        
        // Filtros de marca
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        if (selectedBrands.length > 0) {
            const productBrand = product.brand.toLowerCase();
            const matches = selectedBrands.some(brand => {
                if (brand === 'dolce-gabbana') return productBrand.includes('dolce');
                if (brand === 'jp-gaultier') return productBrand.includes('gaultier');
                if (brand === 'carolina-herrera') return productBrand.includes('herrera');
                return productBrand.includes(brand);
            });
            if (!matches) return false;
        }
        
        // Filtros de precio
        const selectedPrices = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
            .map(cb => cb.value);
        if (selectedPrices.length > 0) {
            const matches = selectedPrices.some(range => {
                if (range === '0-2000') return product.price <= 2000;
                if (range === '2000-5000') return product.price > 2000 && product.price <= 5000;
                if (range === '5000+') return product.price > 5000;
                return false;
            });
            if (!matches) return false;
        }
        
        return true;
    });
    
    currentPage = 1;
    renderCatalogProducts();
    updateCatalogCount();
    generateCatalogPagination();
}

function applyCatalogSorting() {
    const sortBy = document.getElementById('sortBy')?.value || 'default';
    
    switch (sortBy) {
        case 'price-low':
            filteredProducts.sort((a, b) => a.price - b.price);
            break;
        case 'price-high':
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        case 'name':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'brand':
            filteredProducts.sort((a, b) => a.brand.localeCompare(b.brand));
            break;
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    renderCatalogProducts();
}

function renderCatalogProducts() {
    const grid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    const noResults = document.getElementById('noResults');
    
    if (!grid) {
        console.error('❌ Grid productsGrid no encontrado');
        return;
    }
    
    // Ocultar mensaje de carga
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        if (noResults) noResults.classList.remove('d-none');
        return;
    }
    
    if (noResults) noResults.classList.add('d-none');
    
    // Calcular paginación
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    console.log('🎨 CATALOG: Renderizando', paginatedProducts.length, 'productos');
    
    const html = paginatedProducts.map(product => `
        <div class="col-lg-4 col-md-6 col-sm-6" data-aos="fade-up">
            <div class="card product-card h-100 border-0 shadow-sm">
                <div class="position-relative overflow-hidden">
                    <img src="${product.image}" 
                         class="card-img-top" 
                         alt="${product.name}"
                         style="height: 300px; object-fit: cover;"
                         onerror="this.src='../images/perfumes/default.jpg'">
                    <div class="position-absolute top-0 end-0 m-2">
                        <span class="badge bg-primary">${product.ml}ml</span>
                    </div>
                    <div class="overlay">
                        <button class="btn btn-outline-light btn-sm" onclick="quickView(${product.id})">
                            <i class="fas fa-eye"></i> Vista Rápida
                        </button>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <h6 class="card-brand text-muted text-uppercase mb-1">${product.brand}</h6>
                    <h5 class="card-title mb-2">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <span class="h5 text-primary mb-0">$${product.price.toLocaleString()} MXN</span>
                            <div class="rating">
                                ${'<i class="fas fa-star text-warning"></i>'.repeat(5)}
                            </div>
                        </div>
                        <div class="d-grid">
                            <button class="btn btn-primary add-to-cart" data-id="${product.id}">
                                <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    
    // Agregar event listeners a botones
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    generateCatalogPagination();
}

function generateCatalogPagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav><ul class="pagination justify-content-center">';
    
    // Botón anterior
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i> Anterior
            </a>
        </li>
    `;
    
    // Páginas
    for (let i = 1; i <= totalPages; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
            </li>
        `;
    }
    
    // Botón siguiente
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                Siguiente <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul></nav>';
    paginationContainer.innerHTML = paginationHTML;
}

function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderCatalogProducts();
    updateCatalogCount();
    
    // Scroll al inicio de productos
    document.getElementById('productsGrid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

function updateCatalogCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        const total = filteredProducts.length;
        const start = total > 0 ? ((currentPage - 1) * productsPerPage) + 1 : 0;
        const end = Math.min(currentPage * productsPerPage, total);
        resultsCount.textContent = `${start}-${end} de ${total}`;
    }
}

function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Obtener carrito del localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Verificar si el producto ya está en el carrito
    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            image: product.image,
            ml: product.ml,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Actualizar UI del carrito si la función existe
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
    
    // Mostrar mensaje de éxito
    showAddToCartMessage(product.name);
}

function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Crear modal de vista rápida (simplificado)
    console.log('👀 Vista rápida de:', product.name);
    
    // Aquí iría el código del modal si existe
    alert(`Vista rápida: ${product.brand} ${product.name} - $${product.price} MXN`);
}

function showAddToCartMessage(productName) {
    // Mostrar notificación temporal
    const message = document.createElement('div');
    message.className = 'alert alert-success position-fixed';
    message.style.cssText = 'top: 20px; right: 20px; z-index: 9999;';
    message.innerHTML = `<i class="fas fa-check me-2"></i>${productName} agregado al carrito`;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 3000);
}

function showCatalogError() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4 class="text-muted">Error al cargar productos</h4>
                <p class="text-muted">Por favor, recarga la página</p>
                <button class="btn btn-primary" onclick="location.reload()">Recargar</button>
            </div>
        `;
    }
}

// Hacer funciones globales para HTML
window.changePage = changePage;
window.quickView = quickView;
window.addToCart = addToCart;

console.log('🛍️ CATALOG: Script cargado correctamente!');
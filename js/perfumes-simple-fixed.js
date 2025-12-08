// =====================================================
// SIMPLIFIED PERFUMES FUNCTIONALITY - FIXED VERSION
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
let productsPerPage = 12; // 12 productos por página

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM loaded, starting initialization...');
    initializePage();
});

async function initializePage() {
    try {
        console.log('Loading products...');
        await loadProducts();
        console.log('Initializing filters...');
        initializeFilters();
        console.log('Page initialized successfully');
    } catch (error) {
        console.error('Error initializing page:', error);
    }
}

// Load products from JSON file
async function loadProducts() {
    try {
        console.log('Fetching JSON...');
        const response = await fetch('/e-commerce-proyect/js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('JSON loaded:', data.perfumes.length, 'products');
        
        // Simple product mapping with corrected image paths
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            price: perfume.price,
            image: getCorrectImagePath ? getCorrectImagePath(perfume.image) : perfume.image,
            category: perfume.category.toLowerCase(),
            ml: perfume.ml,
            stock: perfume.stock,
            description: perfume.description,
            rating: 4.5,
            reviews: Math.floor(Math.random() * 200) + 50
        }));
        
        filteredProducts = [...allProducts];
        
        // Check URL parameters
        const urlParams = new URLSearchParams(window.location.search);
        const searchParam = urlParams.get('search');
        const productParam = urlParams.get('product');
        
        if (searchParam) {
            const searchInput = document.getElementById('searchFilter');
            if (searchInput) {
                searchInput.value = searchParam;
            }
        }
        
        renderProducts();
        updateResultsCount();
        renderPagination();
        
        // Apply initial filters if there are URL parameters
        if (searchParam || productParam) {
            setTimeout(() => applyFilters(), 100);
        }
        
    } catch (error) {
        console.error('Error loading products:', error);
        showError('Error cargando productos: ' + error.message);
    }
}

// Render products to the grid with pagination
function renderProducts() {
    console.log('Rendering page', currentPage, 'of', Math.ceil(filteredProducts.length / productsPerPage));
    
    const grid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (!grid) {
        console.error('Products grid not found!');
        return;
    }
    
    // Hide loading message
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No se encontraron productos</h4>
                <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
            </div>
        `;
        return;
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    const html = productsToShow.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 product-card">
                <div class="position-relative">
                    <img src="${product.image}" class="card-img-top" alt="${product.name}" 
                         style="height: 300px; object-fit: cover;" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+SW1hZ2VuIE5vIERpc3BvbmlibGU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Yzc1N2QiPkVycm9yIGRlIGNhcmdhPC90ZXh0Pjwvc3ZnPg=='">
                    <div class="position-absolute top-0 end-0 m-2">
                        <button class="btn btn-outline-danger btn-sm" onclick="toggleWishlist(${product.id})" title="Agregar a favoritos">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                </div>
                <div class="card-body d-flex flex-column">
                    <small class="text-muted text-uppercase">${product.brand}</small>
                    <h5 class="card-title">${product.name}</h5>
                    <div class="mb-2">
                        <div class="text-warning mb-1">
                            ${'★'.repeat(Math.floor(product.rating))}${'☆'.repeat(5-Math.floor(product.rating))}
                            <small class="text-muted">(${product.reviews})</small>
                        </div>
                    </div>
                    <p class="card-text text-muted small">${product.description.substring(0, 80)}...</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="text-primary h5 mb-0">$${product.price.toLocaleString()} MXN</strong>
                            <small class="text-muted">${product.ml}ml</small>
                        </div>
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <small class="${product.stock > 0 ? 'text-success' : 'text-danger'}">
                                ${product.stock > 0 ? `Stock: ${product.stock}` : 'Sin stock'}
                            </small>
                        </div>
                        <button class="btn btn-primary w-100 add-to-cart" 
                                data-id="${product.id}" 
                                onclick="agregarAlCarrito(${product.id})"
                                ${product.stock === 0 ? 'disabled' : ''}>
                            <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    console.log('Products rendered successfully');
}

// Initialize filters
function initializeFilters() {
    console.log('Setting up filters...');
    
    // Search filter
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            setTimeout(() => applyFilters(), 300);
        });
    }
    
    // Gender filters
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Brand filters
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Clear filters button
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
}

// Apply filters
function applyFilters() {
    console.log('Applying filters...');
    
    let filtered = [...allProducts];
    
    // Search filter
    const searchValue = document.getElementById('searchFilter')?.value.toLowerCase() || '';
    if (searchValue) {
        filtered = filtered.filter(product => 
            product.name.toLowerCase().includes(searchValue) ||
            product.brand.toLowerCase().includes(searchValue) ||
            product.description.toLowerCase().includes(searchValue)
        );
    }
    
    // Gender filter
    const selectedGender = document.querySelector('input[name="genero"]:checked')?.value;
    if (selectedGender && selectedGender !== 'todos') {
        filtered = filtered.filter(product => product.category === selectedGender);
    }
    
    // Brand filter
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    if (selectedBrands.length > 0) {
        filtered = filtered.filter(product => 
            selectedBrands.some(brand => 
                product.brand.toLowerCase().replace(/\s+/g, '-').includes(brand) ||
                product.brand.toLowerCase().replace(/[^a-z0-9]/g, '-').includes(brand)
            )
        );
    }
    
    filteredProducts = filtered;
    currentPage = 1; // Reset to first page when filtering
    renderProducts();
    updateResultsCount();
    renderPagination();
}

// Update results count
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// Clear all filters
function clearAllFilters() {
    // Clear search
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) searchInput.value = '';
    
    // Clear gender
    const todosRadio = document.getElementById('todos');
    if (todosRadio) todosRadio.checked = true;
    
    // Clear brands
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reapply filters
    applyFilters();
}

// Show error message
function showError(message) {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-danger mb-3"></i>
                <h4 class="text-danger">Error</h4>
                <p class="text-muted">${message}</p>
                <button class="btn btn-primary" onclick="location.reload()">Recargar Página</button>
            </div>
        `;
    }
}

// Global functions for buttons
function agregarAlCarrito(productId) {
    if (typeof cart !== 'undefined') {
        cart.addItem(productId);
    } else {
        alert('Producto agregado al carrito (simulado)');
        console.log('Adding product to cart:', productId);
    }
}

function toggleWishlist(productId) {
    console.log('Toggle wishlist:', productId);
    // Simple wishlist toggle
    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
        btn.classList.remove('btn-danger');
        btn.classList.add('btn-outline-danger');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
        btn.classList.remove('btn-outline-danger');
        btn.classList.add('btn-danger');
    }
}

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    const paginationContainer = document.getElementById('pagination-container');
    
    if (!paginationContainer || totalPages <= 1) {
        if (paginationContainer) paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav aria-label="Navegación de páginas"><ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" aria-label="Anterior">
                <span aria-hidden="true">&laquo;</span>
            </a>
        </li>
    `;
    
    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    if (startPage > 1) {
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(1)">1</a></li>`;
        if (startPage > 2) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
    }
    
    for (let i = startPage; i <= endPage; i++) {
        paginationHTML += `
            <li class="page-item ${i === currentPage ? 'active' : ''}">
                <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
            </li>
        `;
    }
    
    if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
            paginationHTML += `<li class="page-item disabled"><span class="page-link">...</span></li>`;
        }
        paginationHTML += `<li class="page-item"><a class="page-link" href="#" onclick="changePage(${totalPages})">${totalPages}</a></li>`;
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" aria-label="Siguiente">
                <span aria-hidden="true">&raquo;</span>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul></nav>';
    
    // Add page info
    const start = (currentPage - 1) * productsPerPage + 1;
    const end = Math.min(currentPage * productsPerPage, filteredProducts.length);
    paginationHTML += `
        <div class="text-center text-muted mt-2">
            Mostrando ${start}-${end} de ${filteredProducts.length} productos
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page function
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    renderProducts();
    renderPagination();
    
    // Scroll to top of products
    const productsSection = document.getElementById('productsGrid');
    if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Update results count with pagination info
function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        countElement.innerHTML = `
            <strong>${filteredProducts.length}</strong> productos encontrados 
            <small class="text-muted">(Página ${currentPage} de ${totalPages})</small>
        `;
    }
}

// Make changePage global
window.changePage = changePage;

console.log('🌸 Simplified perfumes script with pagination loaded!');
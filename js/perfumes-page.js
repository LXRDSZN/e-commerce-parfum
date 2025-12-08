// =====================================================
// PERFUMES PAGE - COMPLETE FUNCTIONALITY
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 15; // 15 productos por página

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Perfumes page loading...');
    initializePage();
});

async function initializePage() {
    try {
        console.log('📦 Loading products...');
        await loadProducts();
        console.log('🔧 Initializing filters...');
        initializeFilters();
        console.log('✅ Page initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing page:', error);
        showErrorState();
    }
}

// Load products from JSON file
async function loadProducts() {
    try {
        const response = await fetch('../js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Products loaded:', data.perfumes.length);
        
        // Map products with correct image paths
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand.toLowerCase(),
            price: parseFloat(perfume.price),
            image: getCorrectImagePath(perfume.image),
            category: perfume.category ? perfume.category.toLowerCase() : 'unisex',
            ml: perfume.ml,
            stock: perfume.stock || 10,
            concentration: perfume.concentration || 'eau-de-parfum',
            description: perfume.description || 'Fragancia premium de alta calidad.',
            notes: perfume.notes || []
        }));

        filteredProducts = [...allProducts];
        displayProducts();
        updateResultsCount();
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
        throw error;
    }
}

// Get correct image path
function getCorrectImagePath(imagePath) {
    if (!imagePath) return '../images/perfumes/default.jpg';
    
    // If it's already a full path, return as is
    if (imagePath.startsWith('http') || imagePath.startsWith('../')) {
        return imagePath;
    }
    
    // Convert relative path to absolute
    if (imagePath.startsWith('/')) {
        return '..' + imagePath;
    }
    
    return '../' + imagePath;
}

// Initialize all filters
function initializeFilters() {
    console.log('🔧 Setting up filters...');
    
    // Search filter
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Gender filter
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Brand filters
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price filters
    document.querySelectorAll('input[id^="price"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Concentration filters
    document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Sort dropdown
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', applySorting);
    }
    
    // Clear filters button
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
    
    console.log('✅ Filters initialized');
}

// Apply all filters
function applyFilters() {
    console.log('🔍 Applying filters...');
    
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const searchQuery = document.getElementById('searchFilter')?.value.toLowerCase() || '';
        if (searchQuery && !product.name.toLowerCase().includes(searchQuery) && 
            !product.brand.toLowerCase().includes(searchQuery)) {
            return false;
        }
        
        // Gender filter
        const selectedGender = document.querySelector('input[name="genero"]:checked')?.value;
        if (selectedGender && selectedGender !== 'todos') {
            if (product.category !== selectedGender) {
                return false;
            }
        }
        
        // Brand filters
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
            .map(cb => cb.value);
        if (selectedBrands.length > 0) {
            const productBrand = product.brand.toLowerCase().replace(/\s+/g, '-');
            if (!selectedBrands.some(brand => productBrand.includes(brand) || brand.includes(productBrand))) {
                return false;
            }
        }
        
        // Price filters
        const selectedPrices = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
            .map(cb => cb.value);
        if (selectedPrices.length > 0) {
            const price = product.price;
            let priceMatch = false;
            
            selectedPrices.forEach(range => {
                if (range === '0-2000' && price <= 2000) priceMatch = true;
                if (range === '2000-5000' && price > 2000 && price <= 5000) priceMatch = true;
                if (range === '5000-10000' && price > 5000 && price <= 10000) priceMatch = true;
                if (range === '10000+' && price > 10000) priceMatch = true;
            });
            
            if (!priceMatch) return false;
        }
        
        // Concentration filters
        const selectedConcentrations = Array.from(document.querySelectorAll('input[id^="edp"]:checked, input[id^="edt"]:checked, input[id^="parfum"]:checked'))
            .map(cb => cb.value);
        if (selectedConcentrations.length > 0) {
            if (!selectedConcentrations.includes(product.concentration)) {
                return false;
            }
        }
        
        return true;
    });
    
    currentPage = 1; // Reset to first page
    applySorting();
    displayProducts();
    updateResultsCount();
    generatePagination();
}

// Apply sorting
function applySorting() {
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
            // Default order (by ID)
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    displayProducts();
}

// Display products with pagination
function displayProducts() {
    const productsGrid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    const noResults = document.getElementById('noResults');
    
    if (!productsGrid) return;
    
    // Hide loading and no results
    if (loadingMessage) loadingMessage.style.display = 'none';
    if (noResults) noResults.classList.add('d-none');
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);
    
    if (paginatedProducts.length === 0) {
        productsGrid.innerHTML = '';
        if (noResults) noResults.classList.remove('d-none');
        return;
    }
    
    // Generate product cards
    productsGrid.innerHTML = paginatedProducts.map(product => `
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
    
    // Add event listeners to new buttons
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
    
    generatePagination();
}

// Generate pagination
function generatePagination() {
    const paginationContainer = document.getElementById('pagination-container');
    if (!paginationContainer) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        paginationContainer.innerHTML = '';
        return;
    }
    
    let paginationHTML = '<nav aria-label="Navegación de productos"><ul class="pagination justify-content-center">';
    
    // Previous button
    paginationHTML += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1}); return false;">
                <i class="fas fa-chevron-left"></i> Anterior
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            paginationHTML += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i}); return false;">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            paginationHTML += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    paginationHTML += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1}); return false;">
                Siguiente <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    paginationHTML += '</ul></nav>';
    
    // Add page info
    const startItem = ((currentPage - 1) * productsPerPage) + 1;
    const endItem = Math.min(currentPage * productsPerPage, filteredProducts.length);
    
    paginationHTML += `
        <div class="text-center mt-3">
            <small class="text-muted">
                Mostrando ${startItem}-${endItem} de ${filteredProducts.length} productos
                ${filteredProducts.length !== allProducts.length ? `(${allProducts.length} total)` : ''}
            </small>
        </div>
    `;
    
    paginationContainer.innerHTML = paginationHTML;
}

// Change page function
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts();
    
    // Scroll to top of products
    document.getElementById('productsGrid').scrollIntoView({ 
        behavior: 'smooth', 
        block: 'start' 
    });
}

// Update results count
function updateResultsCount() {
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length;
    }
}

// Clear all filters
function clearAllFilters() {
    // Clear search
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) searchInput.value = '';
    
    // Reset gender to "todos"
    const todosRadio = document.getElementById('todos');
    if (todosRadio) todosRadio.checked = true;
    
    // Uncheck all brand filters
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    // Uncheck all price filters
    document.querySelectorAll('input[id^="price"]').forEach(cb => cb.checked = false);
    
    // Uncheck all concentration filters
    document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]').forEach(cb => cb.checked = false);
    
    // Reset sort
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'default';
    
    // Apply filters (which will show all products)
    applyFilters();
}

// Add to cart function
function addToCart(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem('cart') || '[]');
    
    // Check if product already in cart
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
    
    // Update cart UI if function exists
    if (typeof updateCartUI === 'function') {
        updateCartUI();
    }
    
    // Show success message
    showAddToCartMessage(product.name);
}

// Show add to cart message
function showAddToCartMessage(productName) {
    // Create toast or alert
    const toast = document.createElement('div');
    toast.className = 'toast-message';
    toast.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show position-fixed" 
             style="top: 20px; right: 20px; z-index: 9999;">
            <strong>¡Agregado!</strong> ${productName} se agregó al carrito.
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.remove();
    }, 3000);
}

// Quick view function
function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Update modal content
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        const modalBody = modal.querySelector('.modal-body');
        modalBody.innerHTML = `
            <div class="row">
                <div class="col-md-6">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid rounded"
                         onerror="this.src='../images/perfumes/default.jpg'">
                </div>
                <div class="col-md-6">
                    <h4>${product.name}</h4>
                    <h6 class="text-muted mb-3">${product.brand}</h6>
                    <div class="rating mb-3">
                        ${'<i class="fas fa-star text-warning"></i>'.repeat(5)}
                        <span class="ms-2">(Excelente calidad)</span>
                    </div>
                    <p class="h4 text-primary mb-3">$${product.price.toLocaleString()} MXN</p>
                    <p class="mb-3">${product.description}</p>
                    <div class="mb-3">
                        <strong>Detalles:</strong>
                        <ul class="list-unstyled mt-2">
                            <li><strong>Marca:</strong> ${product.brand}</li>
                            <li><strong>Concentración:</strong> ${product.concentration}</li>
                            <li><strong>Contenido:</strong> ${product.ml}ml</li>
                            <li><strong>Género:</strong> ${product.category}</li>
                        </ul>
                    </div>
                    <div class="d-grid gap-2">
                        <button class="btn btn-primary btn-lg" onclick="addToCart(${product.id}); bootstrap.Modal.getInstance(document.getElementById('quickViewModal')).hide();">
                            <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        const modalInstance = new bootstrap.Modal(modal);
        modalInstance.show();
    }
}

// Show error state
function showErrorState() {
    const productsGrid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (loadingMessage) loadingMessage.style.display = 'none';
    
    if (productsGrid) {
        productsGrid.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                <h4 class="text-muted">Error al cargar productos</h4>
                <p class="text-muted">Por favor, recarga la página para intentar nuevamente.</p>
                <button class="btn btn-primary" onclick="location.reload()">
                    <i class="fas fa-redo me-2"></i>Recargar Página
                </button>
            </div>
        `;
    }
}

// Utility function for debouncing
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Make functions global for HTML onclick handlers
window.changePage = changePage;
window.quickView = quickView;
window.addToCart = addToCart;
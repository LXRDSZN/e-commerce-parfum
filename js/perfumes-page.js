// =====================================================
// PERFUMES PAGE FUNCTIONALITY
// Filter, sort, and display products with real-time search
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentFilters = {
    search: '',
    gender: 'todos',
    brands: [],
    priceRange: [],
    concentration: []
};

// Initialize when DOM loads
document.addEventListener('DOMContentLoaded', function() {
    initializePerfumesPage();
});

function initializePerfumesPage() {
    loadProducts();
    initializeFilters();
    initializeSorting();
    initializeViewToggle();
    parseUrlParams();
}

// Load products from JSON file
async function loadProducts() {
    try {
        console.log('Starting to load products...');
        const response = await fetch('/e-commerce-proyect/js/perfumes.json');
        console.log('Fetch response:', response);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Raw JSON data:', data);
        
        // Use the products directly from the updated JSON
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            price: perfume.price,
            originalPrice: perfume.price > 2500 ? Math.round(perfume.price * 1.15) : null,
            image: perfume.image,
            category: perfume.category.toLowerCase(),
            concentration: getConcentrationFromName(perfume.name),
            ml: perfume.ml,
            stock: perfume.stock,
            rating: Math.round((4.0 + Math.random() * 1.0) * 10) / 10,
            reviews: Math.floor(Math.random() * 200) + 50,
            description: perfume.description,
            notes: perfume.description.substring(0, 80) + (perfume.description.length > 80 ? '...' : ''),
            featured: Math.random() > 0.7,
            new: Math.random() > 0.85,
            sale: perfume.price > 2500 && Math.random() > 0.6
        }));
        
        console.log('Products loaded from JSON:', allProducts.length);
        console.log('First product:', allProducts[0]);
        filteredProducts = [...allProducts];
        console.log('About to render products...');
        renderProducts();
        updateResultsCount();
    } catch (error) {
        console.error('Error loading perfumes:', error);
        // Show error to user
        const productsGrid = document.getElementById('productsGrid') || document.getElementById('productos-container');
        if (productsGrid) {
            productsGrid.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
                    <h4 class="text-muted">Error cargando productos</h4>
                    <p class="text-muted">Por favor, recarga la página</p>
                </div>
            `;
        }
        return;
    }
}

// Parse URL parameters for initial filters
function parseUrlParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    // Set gender filter
    const genero = urlParams.get('genero');
    if (genero) {
        const genderRadio = document.querySelector(`input[name="genero"][value="${genero}"]`);
        if (genderRadio) {
            genderRadio.checked = true;
        }
    }
    
    // Set brand filter
    const marca = urlParams.get('marca');
    if (marca) {
        const brandCheckbox = document.getElementById(marca);
        if (brandCheckbox) {
            brandCheckbox.checked = true;
        }
    }
    
    // Set search filter
    const search = urlParams.get('search');
    if (search) {
        const searchInput = document.getElementById('searchFilter');
        if (searchInput) {
            searchInput.value = search;
        }
    }
    
    // Apply initial filters
    setTimeout(applyFilters, 100);
}

// Initialize filter functionality
function initializeFilters() {
    // Search filter
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', debounce(applyFilters, 300));
    }
    
    // Gender filters
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
    document.querySelectorAll('input[id="edp"], input[id="edt"], input[id="parfum"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Clear filters
    const clearButton = document.getElementById('clearFilters');
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
}

// Apply all active filters
function applyFilters() {
    filteredProducts = [...allProducts];
    
    // Search filter
    const searchTerm = document.getElementById('searchFilter')?.value.toLowerCase().trim();
    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => 
            product.name.toLowerCase().includes(searchTerm) ||
            product.brand.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm) ||
            product.notes.toLowerCase().includes(searchTerm)
        );
    }
    
    // Gender filter
    const selectedGender = document.querySelector('input[name="genero"]:checked')?.value;
    if (selectedGender && selectedGender !== 'todos') {
        console.log('Selected gender:', selectedGender);
        filteredProducts = filteredProducts.filter(product => {
            const match = product.category === selectedGender;
            if (!match) {
                console.log(`Product ${product.name} category ${product.category} does not match ${selectedGender}`);
            }
            return match;
        });
        console.log('Filtered products after gender filter:', filteredProducts.length);
    }
    
    // Brand filters
    const selectedBrands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    if (selectedBrands.length > 0) {
        console.log('Selected brands:', selectedBrands);
        filteredProducts = filteredProducts.filter(product => {
            const productBrand = product.brand.toLowerCase();
            return selectedBrands.some(selectedBrand => {
                if (selectedBrand === 'dolce-gabbana') {
                    return productBrand.includes('dolce') && productBrand.includes('gabbana');
                }
                if (selectedBrand === 'jean-paul-gaultier') {
                    return productBrand.includes('jean') && productBrand.includes('paul') && productBrand.includes('gaultier');
                }
                if (selectedBrand === 'carolina-herrera') {
                    return productBrand.includes('carolina') && productBrand.includes('herrera');
                }
                const match = productBrand === selectedBrand || 
                       productBrand.replace(/\s+/g, '-').toLowerCase() === selectedBrand ||
                       productBrand.replace(/\s+/g, '').toLowerCase() === selectedBrand.replace(/-/g, '');
                console.log(`Checking brand: ${productBrand} against ${selectedBrand}, match: ${match}`);
                return match;
            });
        });
        console.log('Filtered products after brand filter:', filteredProducts.length);
    }
    
    // Price filters
    const selectedPrices = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
        .map(cb => cb.value);
    if (selectedPrices.length > 0) {
        filteredProducts = filteredProducts.filter(product => {
            return selectedPrices.some(range => {
                if (range === '0-2000') return product.price <= 2000;
                if (range === '2000-5000') return product.price > 2000 && product.price <= 5000;
                if (range === '5000-10000') return product.price > 5000 && product.price <= 10000;
                if (range === '10000+') return product.price > 10000;
                return false;
            });
        });
    }
    
    // Concentration filters
    const selectedConcentrations = Array.from(document.querySelectorAll('input[id="edp"]:checked, input[id="edt"]:checked, input[id="parfum"]:checked'))
        .map(cb => cb.value);
    if (selectedConcentrations.length > 0) {
        filteredProducts = filteredProducts.filter(product => 
            selectedConcentrations.includes(product.concentration)
        );
    }
    
    renderProducts();
    updateResultsCount();
}

// Clear all filters
function clearAllFilters() {
    // Reset search
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) searchInput.value = '';
    
    // Reset gender to "todos"
    const todosRadio = document.getElementById('todos');
    if (todosRadio) todosRadio.checked = true;
    
    // Reset all checkboxes
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Reset sort
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) sortSelect.value = 'default';
    
    // Apply filters (which will now show all products)
    applyFilters();
}

// Initialize sorting functionality
function initializeSorting() {
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            sortProducts(this.value);
        });
    }
}

// Sort products
function sortProducts(sortBy) {
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
        case 'newest':
            filteredProducts.sort((a, b) => b.new - a.new);
            break;
        case 'rating':
            filteredProducts.sort((a, b) => b.rating - a.rating);
            break;
        default:
            // Default sorting (featured first, then by ID)
            filteredProducts.sort((a, b) => {
                if (a.featured && !b.featured) return -1;
                if (!a.featured && b.featured) return 1;
                return a.id - b.id;
            });
    }
    
    renderProducts();
}

// Initialize view toggle (grid/list)
function initializeViewToggle() {
    document.querySelectorAll('[data-view]').forEach(button => {
        button.addEventListener('click', function() {
            const view = this.getAttribute('data-view');
            
            // Update active button
            document.querySelectorAll('[data-view]').forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Apply view
            const grid = document.getElementById('productsGrid');
            if (view === 'list') {
                grid.classList.add('list-view');
            } else {
                grid.classList.remove('list-view');
            }
        });
    });
}

// Render products
function renderProducts() {
    console.log('renderProducts called with:', filteredProducts.length, 'products');
    const grid = document.getElementById('productsGrid') || document.getElementById('productos-container');
    const noResults = document.getElementById('noResults');
    const loadingMessage = document.getElementById('loadingMessage');
    
    console.log('Grid element found:', !!grid);
    if (!grid) {
        console.error('No grid element found!');
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
        if (noResults) noResults.classList.remove('d-none');
        return;
    }
    
    if (noResults) noResults.classList.add('d-none');
    
    const html = filteredProducts.map((product, index) => `
        <div class="col-lg-4 col-md-6 product-item" data-category="${product.category}" data-brand="${product.brand.toLowerCase().replace(/ /g, '-')}" data-price="${product.price}" data-concentration="${product.concentration}">
            <div class="product-card" data-aos="fade-up" data-aos-delay="${Math.min(index * 100, 500)}">
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" class="img-fluid" onerror="handleImageError(this)" loading="lazy">
                    <div class="product-badges">
                        ${product.featured ? '<span class="badge badge-featured">Destacado</span>' : ''}
                        ${product.new ? '<span class="badge badge-new">Nuevo</span>' : ''}
                        ${product.sale ? '<span class="badge badge-sale">' + calculateDiscount(product.price, product.originalPrice) + '</span>' : ''}
                    </div>
                    <div class="product-actions">
                        <button class="btn btn-wishlist" title="Agregar a favoritos" onclick="toggleWishlist(${product.id})">
                            <i class="fas fa-heart"></i>
                        </button>
                        <button class="btn btn-quickview" title="Vista rápida" onclick="showQuickView(${product.id})" data-bs-toggle="modal" data-bs-target="#quickViewModal">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn btn-compare" title="Comparar">
                            <i class="fas fa-balance-scale"></i>
                        </button>
                    </div>
                </div>
                <div class="product-info">
                    <div class="product-brand">${product.brand}</div>
                    <h5 class="product-name">${product.name}</h5>
                    <div class="product-rating">
                        <div class="stars">
                            ${generateStars(product.rating)}
                        </div>
                        <span class="rating-text">(${product.rating}) ${product.reviews} reseñas</span>
                    </div>
                    <div class="product-details">
                        <small class="text-muted">${formatConcentration(product.concentration)} • ${product.ml}ml</small>
                    </div>
                    <div class="product-price">
                        <span class="price-current">$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>
                        ${product.originalPrice ? `<span class="price-original">$${product.originalPrice.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</span>` : ''}
                        ${product.sale ? `<span class="price-discount">${calculateDiscount(product.price, product.originalPrice)}</span>` : ''}
                    </div>
                    <p class="product-notes">${product.description}</p>
                    <div class="product-actions-bottom">
                        <button class="add-to-cart btn w-100" data-id="${product.id}" onclick="agregarAlCarrito(${product.id})">
                            <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    
    // Re-trigger AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// Helper function for random concentration
function getRandomConcentration() {
    const concentrations = ['eau-de-parfum', 'eau-de-toilette', 'parfum'];
    return concentrations[Math.floor(Math.random() * concentrations.length)];
}

// Helper functions
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let stars = '';
    
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        stars += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star"></i>';
    }
    
    return stars;
}

function formatConcentration(concentration) {
    const concentrations = {
        'eau-de-parfum': 'Eau de Parfum',
        'eau-de-toilette': 'Eau de Toilette',
        'parfum': 'Parfum',
        'eau-de-cologne': 'Eau de Cologne'
    };
    return concentrations[concentration] || concentration;
}

function calculateDiscount(currentPrice, originalPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return '';
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    return `-${discount}%`;
}

function updateResultsCount() {
    const countElement = document.getElementById('resultsCount');
    if (countElement) {
        countElement.textContent = filteredProducts.length;
    }
}

// Función para compatibilidad con products.js
function agregarAlCarrito(productId) {
    // Buscar el producto en allProducts
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Convertir formato para compatibilidad
    const productoCompatible = {
        id: product.id,
        nombre: product.name,
        marca: product.brand,
        precio: product.price,
        imagen: product.image,
        categoria: product.category,
        descripcion: product.description,
        ml: product.ml,
        stock: Math.floor(Math.random() * 50) + 10
    };
    
    // Usar la función de cart.js si está disponible
    if (typeof window.agregarAlCarrito === 'function') {
        window.agregarAlCarrito(productId);
    } else {
        // Implementación básica de carrito
        let carrito = JSON.parse(localStorage.getItem('carrito')) || [];
        const itemExistente = carrito.find(item => item.id === productId);
        
        if (itemExistente) {
            itemExistente.cantidad++;
        } else {
            carrito.push({
                ...productoCompatible,
                cantidad: 1
            });
        }
        
        localStorage.setItem('carrito', JSON.stringify(carrito));
        
        // Mostrar notificación
        mostrarNotificacion(`${product.name} agregado al carrito`);
        
        // Actualizar contador si existe la función
        if (typeof actualizarContadorCarrito === 'function') {
            actualizarContadorCarrito();
        }
    }
}

// Función para mostrar notificaciones
function mostrarNotificacion(mensaje) {
    // Crear elemento de notificación
    const notificacion = document.createElement('div');
    notificacion.className = 'alert alert-success position-fixed';
    notificacion.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
    notificacion.innerHTML = `
        <i class="fas fa-check-circle"></i> ${mensaje}
        <button type="button" class="btn-close float-end" onclick="this.parentElement.remove()"></button>
    `;
    
    document.body.appendChild(notificacion);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        if (notificacion.parentElement) {
            notificacion.remove();
        }
    }, 3000);
}

// Quick view functionality
function showQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Update modal content
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        modal.querySelector('img').src = product.image;
        modal.querySelector('h4').textContent = `${product.brand} ${product.name}`;
        modal.querySelector('.h4.text-primary').textContent = `$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
        modal.querySelector('p').textContent = product.description;
        
        // Update details
        const details = modal.querySelectorAll('li');
        if (details.length >= 4) {
            details[0].innerHTML = `<strong>Marca:</strong> ${product.brand}`;
            details[1].innerHTML = `<strong>Concentración:</strong> ${formatConcentration(product.concentration)}`;
            details[2].innerHTML = `<strong>Contenido:</strong> ${product.ml}ml`;
            details[3].innerHTML = `<strong>Género:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}`;
        }
        
        // Update buttons
        modal.querySelectorAll('[data-id]').forEach(btn => {
            btn.setAttribute('data-id', productId);
        });
    }
}

// Debounce function for search
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

// Export for global access
window.perfumesPage = {
    applyFilters,
    sortProducts,
    showQuickView,
    clearAllFilters
};

// Helper function to get concentration from product name
function getConcentrationFromName(name) {
    if (name.toLowerCase().includes('parfum') || name.toLowerCase().includes('edp')) {
        return 'eau-de-parfum';
    } else if (name.toLowerCase().includes('toilette') || name.toLowerCase().includes('edt')) {
        return 'eau-de-toilette';
    } else if (name.toLowerCase().includes('cologne')) {
        return 'eau-de-cologne';
    } else {
        // Random assignment for products without clear indication
        const concentrations = ['eau-de-parfum', 'eau-de-toilette', 'parfum'];
        return concentrations[Math.floor(Math.random() * concentrations.length)];
    }
}

// Format concentration for display
function formatConcentration(concentration) {
    const concentrationMap = {
        'eau-de-parfum': 'EDP',
        'eau-de-toilette': 'EDT',
        'parfum': 'Parfum',
        'eau-de-cologne': 'EDC'
    };
    return concentrationMap[concentration] || 'EDP';
}

// Generate star rating HTML
function generateStars(rating) {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    let starsHTML = '';
    
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '<i class="fas fa-star"></i>';
    }
    
    if (hasHalfStar) {
        starsHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    
    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '<i class="far fa-star"></i>';
    }
    
    return starsHTML;
}

// Calculate discount percentage
function calculateDiscount(currentPrice, originalPrice) {
    if (!originalPrice || originalPrice <= currentPrice) return '';
    const discount = Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
    return `-${discount}%`;
}

// Wishlist functionality
function toggleWishlist(productId) {
    const wishlist = JSON.parse(localStorage.getItem('perfume_wishlist') || '[]');
    const index = wishlist.indexOf(productId);
    
    if (index > -1) {
        wishlist.splice(index, 1);
        showNotification('Producto eliminado de favoritos', 'info');
    } else {
        wishlist.push(productId);
        showNotification('Producto agregado a favoritos', 'success');
    }
    
    localStorage.setItem('perfume_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

// Update wishlist UI indicators
function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem('perfume_wishlist') || '[]');
    document.querySelectorAll('.btn-wishlist').forEach(btn => {
        const productId = parseInt(btn.getAttribute('onclick').match(/\d+/)[0]);
        if (wishlist.includes(productId)) {
            btn.classList.add('active');
            btn.innerHTML = '<i class="fas fa-heart text-danger"></i>';
        } else {
            btn.classList.remove('active');
            btn.innerHTML = '<i class="fas fa-heart"></i>';
        }
    });
}

// Show quick view modal
function showQuickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        // Update modal content with product data
        modal.querySelector('.modal-title').textContent = product.name;
        modal.querySelector('img').src = product.image;
        modal.querySelector('h4').textContent = product.name;
        modal.querySelector('.h4.text-primary').textContent = `$${product.price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
        modal.querySelector('p').textContent = product.description;
        
        // Update product details
        const detailsList = modal.querySelector('.list-unstyled');
        if (detailsList) {
            detailsList.innerHTML = `
                <li><strong>Marca:</strong> ${product.brand}</li>
                <li><strong>Concentración:</strong> ${formatConcentration(product.concentration)}</li>
                <li><strong>Contenido:</strong> ${product.ml}ml</li>
                <li><strong>Género:</strong> ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</li>
                <li><strong>Stock:</strong> ${product.stock > 0 ? `${product.stock} disponibles` : 'Sin stock'}</li>
            `;
        }
        
        // Update add to cart button
        const addToCartBtn = modal.querySelector('[data-id]');
        if (addToCartBtn) {
            addToCartBtn.setAttribute('data-id', product.id);
            addToCartBtn.onclick = () => quickAddToCart(product.id, addToCartBtn);
        }
    }
}

// Global function to add to cart (compatible with existing cart system)
function agregarAlCarrito(productId) {
    if (typeof cart !== 'undefined') {
        cart.addItem(productId);
    } else {
        console.error('Cart system not loaded');
        showNotification('Error al agregar al carrito', 'error');
    }
}

// Show notification
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existing = document.querySelectorAll('.perfume-notification');
    existing.forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} perfume-notification`;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 9999;
        min-width: 300px;
        animation: slideInRight 0.3s ease-out;
    `;
    
    notification.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <span>${message}</span>
            <button type="button" class="btn-close" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 4 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 4000);
}

// Initialize search functionality with real-time filtering
function initializeSearch() {
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            currentFilters.search = e.target.value.toLowerCase();
            applyFilters();
        });
    }
}

// Apply all active filters
function applyFilters() {
    // Get current filter values
    currentFilters.search = document.getElementById('searchFilter')?.value.toLowerCase() || '';
    currentFilters.gender = document.querySelector('input[name="genero"]:checked')?.value || 'todos';
    
    // Get selected brands
    currentFilters.brands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
        .map(cb => cb.value);
    
    // Get selected price ranges
    currentFilters.priceRange = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
        .map(cb => cb.value);
    
    // Get selected concentrations
    currentFilters.concentration = Array.from(document.querySelectorAll('input[id="edp"]:checked, input[id="edt"]:checked, input[id="parfum"]:checked'))
        .map(cb => cb.value);
    
    // Apply filters
    filteredProducts = allProducts.filter(product => {
        // Search filter
        if (currentFilters.search) {
            const searchMatch = 
                product.name.toLowerCase().includes(currentFilters.search) ||
                product.brand.toLowerCase().includes(currentFilters.search) ||
                product.description.toLowerCase().includes(currentFilters.search);
            if (!searchMatch) return false;
        }
        
        // Gender filter
        if (currentFilters.gender !== 'todos' && product.category !== currentFilters.gender) {
            return false;
        }
        
        // Brand filter
        if (currentFilters.brands.length > 0) {
            const brandMatch = currentFilters.brands.some(brand => 
                product.brand.toLowerCase().replace(/\s+/g, '-') === brand ||
                product.brand.toLowerCase().replace(/[^a-z0-9]/g, '-') === brand
            );
            if (!brandMatch) return false;
        }
        
        // Price filter
        if (currentFilters.priceRange.length > 0) {
            const priceMatch = currentFilters.priceRange.some(range => {
                const [min, max] = range.split('-');
                if (max === undefined) {
                    return product.price >= parseInt(min);
                }
                return product.price >= parseInt(min) && product.price <= parseInt(max);
            });
            if (!priceMatch) return false;
        }
        
        // Concentration filter
        if (currentFilters.concentration.length > 0) {
            if (!currentFilters.concentration.includes(product.concentration)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderProducts();
    updateResultsCount();
}

// Handle image loading errors
function handleImageError(img) {
    console.log('Image failed to load:', img.src);
    img.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+PGkgY2xhc3M9ImZhcyBmYS1zcHJheS1jYW4iIHN0eWxlPSJmb250LXNpemU6IDMwcHgiPjwvaT48L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2NSUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIiBmaWxsPSIjNmM3NTdkIj5JbWFnZW4gTm8gRGlzcG9uaWJsZTwvdGV4dD48L3N2Zz4=';
    img.alt = 'Imagen no disponible';
    img.title = 'La imagen del producto no está disponible';
}

// Add global access to image error handler
window.handleImageError = handleImageError;

console.log('🌸 Perfumes page functionality loaded successfully!');
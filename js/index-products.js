// =====================================================
// INDEX PAGE PRODUCTS LOADER
// Load featured products from our JSON
// =====================================================

document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 Index DOM loaded, starting product loading...');
    setTimeout(() => {
        loadFeaturedProducts();
        setupSearch();
    }, 500); // Small delay to ensure all scripts are loaded
});

async function loadFeaturedProducts() {
    try {
        console.log('🔄 Loading featured products from JSON...');
        console.log('🌐 Current URL:', window.location.href);
        const response = await fetch('/e-commerce-proyect/js/perfumes.json');
        console.log('📡 Response status:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Products loaded for homepage:', data.perfumes.length);
        
        // Take featured products (first 8 products)
        const featuredProducts = data.perfumes.slice(0, 8);
        
        renderFeaturedProducts(featuredProducts);
        
    } catch (error) {
        console.error('Error loading featured products:', error);
        showFeaturedError();
    }
}

function renderFeaturedProducts(products) {
    console.log('🎨 Rendering', products.length, 'featured products...');
    const container = document.getElementById('productos-container');
    const loadingElement = document.getElementById('loading-productos');
    
    console.log('📦 Container found:', !!container);
    console.log('⏳ Loading element found:', !!loadingElement);
    
    if (!container) {
        console.error('❌ Products container not found!');
        return;
    }
    
    // Hide loading
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    const html = products.map(product => `
        <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
            <div class="card h-100 product-card shadow-sm border-0" data-aos="fade-up">
                <div class="position-relative overflow-hidden">
                    <img src="${getCorrectImagePath ? getCorrectImagePath(product.image) : product.image}" 
                         class="card-img-top" 
                         alt="${product.name}" 
                         style="height: 280px; object-fit: cover; transition: transform 0.3s ease;"
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiIHN0cm9rZS13aWR0aD0iMiIvPjx0ZXh0IHg9IjUwJSIgeT0iNDAlIiBmb250LXNpemU9IjE0IiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSIgZmlsbD0iIzZjNzU3ZCI+SW1hZ2VuIE5vIERpc3BvbmlibGU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtc2l6ZT0iMTIiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM2Yzc1N2QiPkVycm9yIGRlIGNhcmdhPC90ZXh0Pjwvc3ZnPg=='">
                    
                    <div class="position-absolute top-0 start-0 m-2">
                        <span class="badge bg-primary">Destacado</span>
                    </div>
                    
                    <div class="position-absolute top-0 end-0 m-2">
                        <button class="btn btn-outline-light btn-sm rounded-circle" onclick="toggleFavorite(${product.id})" title="Agregar a favoritos">
                            <i class="fas fa-heart"></i>
                        </button>
                    </div>
                    
                    <div class="product-overlay position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center" 
                         style="background: rgba(0,0,0,0.7); opacity: 0; transition: opacity 0.3s ease;">
                        <div class="text-center">
                            <button class="btn btn-light btn-sm mb-2" onclick="quickView(${product.id})">
                                <i class="fas fa-eye me-1"></i>Vista Rápida
                            </button>
                            <br>
                            <a href="pages/perfumes.html?product=${product.id}" class="btn btn-primary btn-sm">
                                <i class="fas fa-info-circle me-1"></i>Ver Detalles
                            </a>
                        </div>
                    </div>
                </div>
                
                <div class="card-body d-flex flex-column">
                    <small class="text-muted text-uppercase fw-bold">${product.brand}</small>
                    <h5 class="card-title fw-bold">${product.name}</h5>
                    
                    <!-- Rating -->
                    <div class="mb-2">
                        <div class="text-warning">
                            ${'★'.repeat(4)}${'☆'.repeat(1)}
                            <small class="text-muted ms-1">(4.0)</small>
                        </div>
                    </div>
                    
                    <!-- Description -->
                    <p class="card-text text-muted small flex-grow-1">
                        ${product.description.substring(0, 60)}...
                    </p>
                    
                    <!-- Price and Actions -->
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="h5 text-primary fw-bold mb-0">$${product.price.toLocaleString()}</span>
                                <small class="text-muted d-block">MXN</small>
                            </div>
                            <small class="text-success">${product.ml}ml</small>
                        </div>
                        
                        <div class="d-grid">
                            <button class="btn btn-primary" onclick="addToCartFromHome(${product.id})" ${product.stock === 0 ? 'disabled' : ''}>
                                <i class="fas fa-shopping-bag me-1"></i>
                                ${product.stock > 0 ? 'Agregar al Carrito' : 'Sin Stock'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    container.innerHTML = html;
    
    // Add hover effects
    container.querySelectorAll('.product-card').forEach(card => {
        card.addEventListener('mouseenter', function() {
            const img = this.querySelector('.card-img-top');
            const overlay = this.querySelector('.product-overlay');
            img.style.transform = 'scale(1.05)';
            overlay.style.opacity = '1';
        });
        
        card.addEventListener('mouseleave', function() {
            const img = this.querySelector('.card-img-top');
            const overlay = this.querySelector('.product-overlay');
            img.style.transform = 'scale(1)';
            overlay.style.opacity = '0';
        });
    });
    
    console.log('Featured products rendered successfully');
}

function showFeaturedError() {
    const container = document.getElementById('productos-container');
    const loadingElement = document.getElementById('loading-productos');
    
    if (loadingElement) {
        loadingElement.style.display = 'none';
    }
    
    if (container) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-warning">
                    <i class="fas fa-exclamation-triangle fa-2x mb-3"></i>
                    <h4>Error al cargar productos</h4>
                    <p>No se pudieron cargar los productos destacados. Por favor, intenta recargar la página.</p>
                    <button class="btn btn-primary" onclick="location.reload()">
                        <i class="fas fa-refresh me-1"></i>Recargar
                    </button>
                </div>
            </div>
        `;
    }
}

function setupSearch() {
    const searchInput = document.getElementById('barra-busqueda');
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const query = this.value.trim();
                if (query) {
                    // Redirect to perfumes page with search
                    window.location.href = `pages/perfumes.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = 'pages/perfumes.html';
                }
            }
        });
        
        // Add search button if exists
        const searchButton = document.querySelector('.search-btn');
        if (searchButton) {
            searchButton.addEventListener('click', function() {
                const query = searchInput.value.trim();
                if (query) {
                    window.location.href = `pages/perfumes.html?search=${encodeURIComponent(query)}`;
                } else {
                    window.location.href = 'pages/perfumes.html';
                }
            });
        }
    }
}

// Global functions
function toggleFavorite(productId) {
    console.log('Toggle favorite for product:', productId);
    const btn = event.target.closest('button');
    const icon = btn.querySelector('i');
    
    if (icon.classList.contains('fas')) {
        icon.classList.remove('fas');
        icon.classList.add('far');
    } else {
        icon.classList.remove('far');
        icon.classList.add('fas');
    }
}

function quickView(productId) {
    console.log('Quick view for product:', productId);
    // For now, redirect to perfumes page
    window.location.href = `pages/perfumes.html?product=${productId}`;
}

function addToCartFromHome(productId) {
    console.log('Add to cart from home:', productId);
    
    // If cart system is available, use it
    if (typeof cart !== 'undefined') {
        cart.addItem(productId);
    } else {
        // Otherwise, show success message and redirect to perfumes
        alert('¡Producto agregado al carrito!');
        setTimeout(() => {
            window.location.href = 'pages/perfumes.html';
        }, 1000);
    }
}

console.log('🏠 Index products loader initialized!');
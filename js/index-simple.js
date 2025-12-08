// =====================================================
// SIMPLE INDEX PRODUCTS LOADER - EMERGENCY VERSION
// =====================================================

console.log('🚀 Starting simple index loader...');

// Execute immediately
(function() {
    'use strict';
    
    function waitForContainer() {
        const container = document.getElementById('productos-container');
        if (container) {
            console.log('✅ Container found, loading products...');
            loadProductsNow();
        } else {
            console.log('⏳ Waiting for container...');
            setTimeout(waitForContainer, 100);
        }
    }
    
    async function loadProductsNow() {
        const container = document.getElementById('productos-container');
        const loadingElement = document.getElementById('loading-productos');
        
        try {
            console.log('📡 Fetching JSON...');
            const response = await fetch('/e-commerce-proyect/js/perfumes.json');
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log('📦 Data loaded:', data.perfumes.length, 'products');
            
            // Hide loading
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            // Take first 8 products
            const featured = data.perfumes.slice(0, 8);
            
            // Simple HTML generation
            const html = featured.map(product => {
                const imagePath = product.image.replace('../images/', '/e-commerce-proyect/images/');
                return `
                    <div class="col-lg-3 col-md-4 col-sm-6 mb-4">
                        <div class="card h-100 shadow-sm">
                            <div style="height: 250px; overflow: hidden;">
                                <img src="${imagePath}" 
                                     class="card-img-top w-100 h-100" 
                                     alt="${product.name}"
                                     style="object-fit: cover;"
                                     onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjI1MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjhmOWZhIiBzdHJva2U9IiNkZWUyZTYiLz48dGV4dCB4PSI1MCUiIHk9IjUwJSIgZm9udC1zaXplPSIxNCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZmlsbD0iIzZjNzU3ZCI+SW1hZ2VuIE5vIERpc3BvbmlibGU8L3RleHQ+PC9zdmc+'">
                            </div>
                            <div class="card-body d-flex flex-column">
                                <small class="text-muted text-uppercase fw-bold">${product.brand}</small>
                                <h6 class="card-title">${product.name}</h6>
                                <div class="text-warning mb-2">
                                    ★★★★☆ <small class="text-muted">(4.5)</small>
                                </div>
                                <p class="card-text text-muted small flex-grow-1">
                                    ${product.description.substring(0, 50)}...
                                </p>
                                <div class="mt-auto">
                                    <div class="d-flex justify-content-between align-items-center mb-2">
                                        <strong class="text-primary">$${product.price.toLocaleString()}</strong>
                                        <small class="text-success">${product.ml}ml</small>
                                    </div>
                                    <div class="d-grid">
                                        <a href="pages/perfumes.html?product=${product.id}" class="btn btn-primary btn-sm">
                                            <i class="fas fa-shopping-bag me-1"></i>Ver Producto
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            container.innerHTML = html;
            console.log('✅ Products rendered successfully!');
            
        } catch (error) {
            console.error('❌ Error loading products:', error);
            
            // Show error message
            if (loadingElement) {
                loadingElement.style.display = 'none';
            }
            
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <div class="alert alert-warning">
                        <i class="fas fa-exclamation-triangle fa-2x mb-3 d-block"></i>
                        <h4>No se pudieron cargar los productos</h4>
                        <p class="mb-3">Error: ${error.message}</p>
                        <a href="pages/perfumes.html" class="btn btn-primary">
                            Ver Catálogo Completo
                        </a>
                    </div>
                </div>
            `;
        }
    }
    
    // Start when DOM is ready or immediately if already loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', waitForContainer);
    } else {
        waitForContainer();
    }
    
})();

console.log('📋 Simple index loader initialized!');
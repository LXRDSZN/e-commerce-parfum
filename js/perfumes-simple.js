// Simple perfumes loader
let allProducts = [];
let filteredProducts = [];

document.addEventListener('DOMContentLoaded', function() {
    console.log('🌸 Perfumes page loading...');
    loadProductsSimple();
});

async function loadProductsSimple() {
    try {
        console.log('📦 Starting to fetch perfumes...');
        const response = await fetch('../js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('✅ Perfumes loaded:', data.perfumes.length);
        
        // Transform products
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            name: perfume.name,
            brand: perfume.brand,
            price: perfume.price,
            image: perfume.image,
            category: perfume.category.toLowerCase(),
            ml: perfume.ml,
            description: perfume.description,
            rating: 4.5,
            reviews: 120
        }));
        
        filteredProducts = [...allProducts];
        console.log('🎯 Products processed:', allProducts.length);
        
        // Apply initial filters
        applyFiltersSimple();
        
    } catch (error) {
        console.error('❌ Error loading perfumes:', error);
        showError();
    }
}

function applyFiltersSimple() {
    console.log('🔍 Applying filters...');
    
    filteredProducts = [...allProducts];
    
    // Get URL parameters
    const urlParams = new URLSearchParams(window.location.search);
    const genero = urlParams.get('genero');
    const marca = urlParams.get('marca');
    
    console.log('URL Filters - Genero:', genero, 'Marca:', marca);
    
    // Apply gender filter
    if (genero && genero !== 'todos') {
        filteredProducts = filteredProducts.filter(product => {
            const match = product.category === genero;
            console.log(`Product ${product.name} category ${product.category} vs ${genero}: ${match}`);
            return match;
        });
        console.log('After gender filter:', filteredProducts.length);
    }
    
    // Apply brand filter
    if (marca) {
        filteredProducts = filteredProducts.filter(product => {
            const brandMatch = product.brand.toLowerCase().replace(/\s+/g, '-') === marca ||
                              product.brand.toLowerCase().replace(/\s+/g, '') === marca.replace(/-/g, '') ||
                              product.brand.toLowerCase() === marca.replace(/-/g, ' ');
            console.log(`Brand ${product.brand} vs ${marca}: ${brandMatch}`);
            return brandMatch;
        });
        console.log('After brand filter:', filteredProducts.length);
    }
    
    renderProductsSimple();
}

function renderProductsSimple() {
    console.log('🎨 Rendering products:', filteredProducts.length);
    
    const grid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    const noResults = document.getElementById('noResults');
    
    // Hide loading
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    if (filteredProducts.length === 0) {
        grid.innerHTML = '';
        if (noResults) {
            noResults.classList.remove('d-none');
        }
        return;
    }
    
    if (noResults) {
        noResults.classList.add('d-none');
    }
    
    // Generate HTML
    const html = filteredProducts.map(product => `
        <div class="col-lg-4 col-md-6 mb-4">
            <div class="card h-100 shadow-sm">
                <img src="${product.image}" class="card-img-top" alt="${product.name}" style="height: 300px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/400x300?text=Perfume'">
                <div class="card-body d-flex flex-column">
                    <div class="mb-2">
                        <small class="text-muted">${product.brand}</small>
                    </div>
                    <h5 class="card-title">${product.name}</h5>
                    <p class="card-text text-muted small flex-grow-1">${product.description}</p>
                    <div class="mt-auto">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <strong class="text-primary">$${product.price.toLocaleString('es-MX')} MXN</strong>
                            <small class="text-muted">${product.ml}ml</small>
                        </div>
                        <div class="mb-2">
                            <small class="text-warning">
                                ★★★★☆ (${product.rating}) • ${product.reviews} reseñas
                            </small>
                        </div>
                        <button class="btn btn-primary w-100" onclick="addToCart(${product.id})">
                            <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `).join('');
    
    grid.innerHTML = html;
    
    // Update results count
    const resultsCount = document.getElementById('resultsCount');
    if (resultsCount) {
        resultsCount.textContent = filteredProducts.length;
    }
    
    console.log('✨ Products rendered successfully!');
}

function showError() {
    const grid = document.getElementById('productsGrid');
    const loadingMessage = document.getElementById('loadingMessage');
    
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    grid.innerHTML = `
        <div class="col-12 text-center py-5">
            <i class="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h4 class="text-muted">Error cargando productos</h4>
            <p class="text-muted">Por favor, recarga la página</p>
            <button class="btn btn-outline-primary" onclick="location.reload()">Recargar</button>
        </div>
    `;
}

// Simple add to cart function
function addToCart(productId) {
    console.log('Adding to cart:', productId);
    alert('Producto agregado al carrito (funcionalidad pendiente)');
}

console.log('🌸 Simple perfumes script loaded!');
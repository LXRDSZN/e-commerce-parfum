// =====================================================
// INDEX HOME - PRODUCTOS CON FILTROS
// =====================================================

let allProducts = [];
let currentFilter = 'todos';

// Inicialización cuando carga el DOM
document.addEventListener('DOMContentLoaded', function() {
    console.log('🏠 INDEX HOME: Iniciando...');
    loadHomeProducts();
});

async function loadHomeProducts() {
    const container = document.getElementById('productos-container');
    
    if (!container) {
        console.error('❌ Container productos-container no encontrado');
        return;
    }
    
    try {
        console.log('📡 Cargando productos para INDEX...');
        const response = await fetch('/e-commerce-proyect/js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ Datos cargados:', data.perfumes.length);
        
        // Procesar productos para INDEX
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            nombre: perfume.name,
            marca: perfume.brand,
            categoria: perfume.category.toLowerCase(),
            precio: perfume.price,
            descripcion: perfume.description,
            imagen: perfume.image.replace('../', '/e-commerce-proyect/'),
            stock: perfume.stock,
            ml: perfume.ml
        }));
        
        console.log('📦 Productos procesados:', allProducts.length);
        
        setupHomeFilters();
        setupHomeSearch();
        displayHomeProducts(allProducts.slice(0, 8));
        
    } catch (error) {
        console.error('❌ Error:', error);
        container.innerHTML = `<div class="col-12"><div class="alert alert-danger">Error: ${error.message}</div></div>`;
    }
}

function setupHomeFilters() {
    const buttons = ['filtro-todos', 'filtro-mujer', 'filtro-hombre', 'filtro-unisex'];
    const filters = ['todos', 'mujer', 'hombre', 'unisex'];
    
    buttons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                // Remover clase active de todos
                buttons.forEach(bid => {
                    const btn = document.getElementById(bid);
                    if (btn) btn.classList.remove('active');
                });
                
                // Agregar active al clickeado
                button.classList.add('active');
                
                // Aplicar filtro
                applyHomeFilter(filters[index]);
            });
        }
    });
}

function setupHomeSearch() {
    const searchInput = document.getElementById('barra-busqueda');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            performHomeSearch(query);
        });
    }
}

function applyHomeFilter(filter) {
    currentFilter = filter;
    console.log('🔍 Aplicando filtro:', filter);
    
    let filtered = [];
    
    if (filter === 'todos') {
        filtered = allProducts;
    } else {
        filtered = allProducts.filter(product => product.categoria === filter);
    }
    
    console.log('📋 Resultados filtrados:', filtered.length);
    
    if (filtered.length === 0) {
        showNoHomeResults('No hay productos en esta categoría');
    } else {
        displayHomeProducts(filtered.slice(0, 8));
    }
}

function performHomeSearch(query) {
    if (!query) {
        applyHomeFilter(currentFilter);
        return;
    }
    
    const results = allProducts.filter(product => 
        product.nombre.toLowerCase().includes(query) ||
        product.marca.toLowerCase().includes(query) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(query))
    );
    
    if (results.length === 0) {
        showNoHomeResults('Producto no disponible');
    } else {
        displayHomeProducts(results.slice(0, 8));
    }
}

function displayHomeProducts(products) {
    const container = document.getElementById('productos-container');
    
    if (!container) {
        console.error('❌ Container no encontrado');
        return;
    }
    
    console.log('🎨 Mostrando', products.length, 'productos en HOME');
    
    const html = products.map(product => {
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                <div class="card h-100 shadow-sm product-card border-0">
                    <div class="product-image-container position-relative" style="height: 280px; overflow: hidden; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
                        <img src="${product.imagen}" 
                             class="card-img-top w-100 h-100" 
                             alt="${product.nombre} - ${product.marca}"
                             style="object-fit: cover; transition: transform 0.3s ease;"
                             loading="lazy"
                             onerror="this.src='data:image/svg+xml;base64,${btoa(createHomePlaceholder(product.marca, product.nombre))}'">
                        
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="badge bg-primary">
                                <i class="fas fa-tag me-1"></i>
                                ${product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)}
                            </span>
                        </div>
                        
                        ${product.stock > 0 ? 
                            `<div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-success">Stock: ${product.stock}</span>
                            </div>` : 
                            `<div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-danger">Sin stock</span>
                            </div>`
                        }
                    </div>
                    
                    <div class="card-body d-flex flex-column p-3">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <small class="text-muted text-uppercase fw-bold">${product.marca}</small>
                            <div class="text-warning small">★★★★☆</div>
                        </div>
                        
                        <h6 class="card-title fw-bold mb-2" style="color: #2c3e50;">${product.nombre}</h6>
                        
                        <p class="card-text text-muted small flex-grow-1 mb-3" style="line-height: 1.4;">
                            ${product.descripcion ? product.descripcion.substring(0, 80) : 'Fragancia premium de alta calidad'}${product.descripcion && product.descripcion.length > 80 ? '...' : ''}
                        </p>
                        
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="h5 fw-bold text-primary mb-0">$${product.precio.toLocaleString()}</span>
                                <small class="text-muted d-block">MXN</small>
                            </div>
                            <div class="text-end">
                                <span class="badge bg-info text-dark">${product.ml}ml</span>
                            </div>
                        </div>
                        
                        <div class="d-grid">
                            <a href="pages/perfumes.html?product=${product.id}" 
                               class="btn btn-primary btn-sm ${product.stock <= 0 ? 'disabled' : ''}">
                                <i class="fas fa-eye me-2"></i>Ver Detalles
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    container.innerHTML = html;
    
    // Reiniciar animaciones AOS si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

function createHomePlaceholder(brand, name) {
    return `
        <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="homeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#homeGrad)"/>
            <circle cx="140" cy="100" r="30" fill="white" opacity="0.1"/>
            <text x="50%" y="35%" font-family="Arial,sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">${brand}</text>
            <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.9">${name.length > 18 ? name.substring(0, 18) + '...' : name}</text>
            <text x="50%" y="70%" font-family="Arial,sans-serif" font-size="12" text-anchor="middle" fill="white" opacity="0.7">Élite Perfumería</text>
            <text x="50%" y="80%" font-family="Arial,sans-serif" font-size="10" text-anchor="middle" fill="white" opacity="0.5">Imagen no disponible</text>
        </svg>
    `;
}

function showNoHomeResults(message) {
    const container = document.getElementById('productos-container');
    container.innerHTML = `
        <div class="col-12 text-center py-5">
            <div class="alert alert-info">
                <i class="fas fa-search fa-2x mb-3 d-block text-muted"></i>
                <h4>${message}</h4>
                <p class="text-muted mb-3">Intenta con otros términos de búsqueda</p>
                <a href="pages/perfumes.html" class="btn btn-primary">
                    <i class="fas fa-eye me-2"></i>Ver Catálogo Completo
                </a>
            </div>
        </div>
    `;
}

console.log('🏠 INDEX HOME: Script cargado correctamente!');
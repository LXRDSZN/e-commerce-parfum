// =====================================================
// PERFUME PRODUCTS DISPLAY WITH IMAGE MAPPING
// =====================================================

console.log('🚀 Iniciando visualización de perfumes...');

// Variables globales
let allProducts = [];
let currentFilter = 'todos';

// ====== PRODUCTOS SINCRONIZADOS CON PERFUMES.HTML ======
// Ya no necesitamos mapeo manual - usamos el JSON correcto

// Initialize when DOM is ready  
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 INDEX: DOM loaded, initializing...');
    loadProducts();
});

async function loadProducts() {
    const container = document.getElementById('productos-container');
    
    if (!container) {
        console.error('❌ INDEX: Container productos-container not found');
        return;
    }
    
    try {
        console.log('📡 INDEX: Loading perfumes...');
        const response = await fetch('/e-commerce-proyect/js/perfumes.json');
        
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        
        const data = await response.json();
        console.log('✅ INDEX: Raw data loaded:', data.perfumes.length);
        
        // Usar productos directamente del JSON (igual que perfumes.html)
        allProducts = data.perfumes.map(perfume => ({
            id: perfume.id,
            nombre: perfume.name,
            marca: perfume.brand,
            categoria: perfume.category.toLowerCase(),
            precio: perfume.price,
            descripcion: perfume.description,
            imagen: perfume.image, // Usar imagen directa
            stock: perfume.stock,
            ml: perfume.ml
        }));
        
        console.log('✅ INDEX: Processed', allProducts.length, 'products');
        console.log('📋 INDEX: First product:', allProducts[0]);
        
        setupFilters();
        setupSearch();
        displayProducts(allProducts.slice(0, 8));
        
    } catch (error) {
        console.error('❌ INDEX: Error loading products:', error);
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <div class="alert alert-danger">
                    <h4>Error al cargar productos</h4>
                    <p>${error.message}</p>
                </div>
            </div>
        `;
    }
}

function setupFilters() {
    const buttons = ['filtro-todos', 'filtro-mujer', 'filtro-hombre', 'filtro-unisex'];
    const filters = ['todos', 'mujer', 'hombre', 'unisex'];
    
    buttons.forEach((buttonId, index) => {
        const button = document.getElementById(buttonId);
        if (button) {
            button.addEventListener('click', () => {
                // Remove active class from all buttons
                buttons.forEach(bid => {
                    const btn = document.getElementById(bid);
                    if (btn) btn.classList.remove('active');
                });
                
                // Add active class to clicked button
                button.classList.add('active');
                
                // Apply filter
                applyFilter(filters[index]);
            });
        }
    });
}

function setupSearch() {
    const searchInput = document.getElementById('barra-busqueda');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            performSearch(query);
        });
    }
}

function applyFilter(filter) {
    currentFilter = filter;
    console.log('🔍 Applying filter:', filter);
    
    let filtered = [];
    
    if (filter === 'todos') {
        filtered = allProducts;
    } else {
        filtered = allProducts.filter(product => product.categoria === filter);
    }
    
    console.log('📋 Filtered results:', filtered.length);
    
    if (filtered.length === 0) {
        showNoResults('No hay productos en esta categoría');
    } else {
        displayProducts(filtered.slice(0, 8));
    }
}

function performSearch(query) {
    if (!query) {
        applyFilter(currentFilter);
        return;
    }
    
    const results = allProducts.filter(product => 
        product.nombre.toLowerCase().includes(query) ||
        product.marca.toLowerCase().includes(query) ||
        (product.descripcion && product.descripcion.toLowerCase().includes(query))
    );
    
    if (results.length === 0) {
        showNoResults('Producto no disponible');
    } else {
        displayProducts(results.slice(0, 8));
    }
}

// ====== FUNCIÓN PRINCIPAL DE VISUALIZACIÓN ======
function displayProducts(products) {
    const container = document.getElementById('productos-container');
    
    if (!container) {
        console.error('❌ Container de productos no encontrado');
        return;
    }
    
    console.log(`🎨 Mostrando ${products.length} productos`);
    
    // Generar HTML para cada producto
    const html = products.map(product => {
        const imageData = getProductImage(product);
        
        return `
            <div class="col-lg-3 col-md-4 col-sm-6 mb-4" data-aos="fade-up" data-aos-delay="100">
                <div class="card h-100 shadow-sm product-card border-0">
                    <!-- Imagen del producto -->
                    <div class="product-image-container position-relative" style="height: 280px; overflow: hidden;">
                        <img src="${imageData.url}" 
                             class="card-img-top w-100 h-100" 
                             alt="${product.nombre} - ${product.marca}"
                             style="object-fit: cover; transition: transform 0.3s ease;"
                             loading="lazy"
                             onerror="handleImageError(this, '${product.marca}', '${product.nombre}')">
                        
                        <!-- Badge de categoría -->
                        <div class="position-absolute top-0 start-0 m-2">
                            <span class="badge ${getCategoryBadgeClass(product.categoria)}">
                                <i class="${getCategoryIcon(product.categoria)} me-1"></i>
                                ${product.categoria.charAt(0).toUpperCase() + product.categoria.slice(1)}
                            </span>
                        </div>
                        
                        <!-- Badge de stock -->
                        ${product.stock > 0 ? 
                            `<div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-success">Stock: ${product.stock}</span>
                            </div>` : 
                            `<div class="position-absolute top-0 end-0 m-2">
                                <span class="badge bg-danger">Sin stock</span>
                            </div>`
                        }
                    </div>
                    
                    <!-- Información del producto -->
                    <div class="card-body d-flex flex-column p-3">
                        <!-- Marca -->
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <small class="text-muted text-uppercase fw-bold">${product.marca}</small>
                            <div class="text-warning small">
                                ★★★★☆
                            </div>
                        </div>
                        
                        <!-- Nombre del producto -->
                        <h6 class="card-title fw-bold mb-2" style="color: #2c3e50;">${product.nombre}</h6>
                        
                        <!-- Descripción -->
                        <p class="card-text text-muted small flex-grow-1 mb-3" style="line-height: 1.4;">
                            ${product.descripcion.substring(0, 80)}${product.descripcion.length > 80 ? '...' : ''}
                        </p>
                        
                        <!-- Precio y ML -->
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <span class="h5 fw-bold text-primary mb-0">$${product.precio.toLocaleString()}</span>
                                <small class="text-muted d-block">MXN</small>
                            </div>
                            <div class="text-end">
                                <span class="badge bg-info text-dark">${product.ml}</span>
                            </div>
                        </div>
                        
                        <!-- Botón de acción -->
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
    
    // Insertar HTML en el container
    container.innerHTML = html;
    
    // Reiniciar animaciones AOS si está disponible
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// ====== FUNCIONES AUXILIARES ======

// Obtener imagen del producto
function getProductImage(product) {
    if (product.imagen) {
        // Corregir ruta si es necesario
        let imageUrl = product.imagen;
        if (imageUrl.startsWith('../')) {
            imageUrl = imageUrl.replace('../', '/e-commerce-proyect/');
        }
        console.log(`✅ INDEX: Imagen para ${product.nombre}: ${imageUrl}`);
        return {
            url: imageUrl,
            hasImage: true
        };
    } else {
        console.log(`⚠️ INDEX: Sin imagen para ${product.nombre}, usando placeholder`);
        const placeholder = createPlaceholderSVG(product.marca, product.nombre);
        return {
            url: `data:image/svg+xml;base64,${btoa(placeholder)}`,
            hasImage: false
        };
    }
}

// Crear placeholder SVG elegante
function createPlaceholderSVG(brand, name) {
    const gradientId = `grad_${Math.random().toString(36).substr(2, 9)}`;
    
    return `
        <svg width="280" height="280" xmlns="http://www.w3.org/2000/svg">
            <defs>
                <linearGradient id="${gradientId}" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                    <stop offset="50%" style="stop-color:#764ba2;stop-opacity:1" />
                    <stop offset="100%" style="stop-color:#667eea;stop-opacity:1" />
                </linearGradient>
            </defs>
            <rect width="100%" height="100%" fill="url(#${gradientId})"/>
            <circle cx="140" cy="100" r="30" fill="white" opacity="0.1"/>
            <text x="50%" y="35%" font-family="Arial,sans-serif" font-size="20" font-weight="bold" text-anchor="middle" fill="white">${brand}</text>
            <text x="50%" y="50%" font-family="Arial,sans-serif" font-size="14" text-anchor="middle" fill="white" opacity="0.9">${name.length > 18 ? name.substring(0, 18) + '...' : name}</text>
            <text x="50%" y="70%" font-family="Arial,sans-serif" font-size="12" text-anchor="middle" fill="white" opacity="0.7">Élite Perfumería</text>
            <text x="50%" y="80%" font-family="Arial,sans-serif" font-size="10" text-anchor="middle" fill="white" opacity="0.5">Imagen no disponible</text>
        </svg>
    `;
}

// Obtener clase CSS para badge de categoría
function getCategoryBadgeClass(categoria) {
    const classes = {
        'mujer': 'bg-pink text-white',
        'hombre': 'bg-primary text-white', 
        'unisex': 'bg-warning text-dark'
    };
    return classes[categoria] || 'bg-secondary text-white';
}

// Obtener icono para categoría
function getCategoryIcon(categoria) {
    const icons = {
        'mujer': 'fas fa-venus',
        'hombre': 'fas fa-mars',
        'unisex': 'fas fa-genderless'
    };
    return icons[categoria] || 'fas fa-tag';
}

// Manejo de errores de imagen (función global)
window.handleImageError = function(img, brand, productName) {
    console.log(`❌ Error cargando imagen: ${brand} - ${productName}`);
    const placeholder = createPlaceholderSVG(brand, productName);
    img.src = `data:image/svg+xml;base64,${btoa(placeholder)}`;
    img.classList.add('placeholder-image');
};

function showNoResults(message) {
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

console.log('📋 Final version loaded successfully!');
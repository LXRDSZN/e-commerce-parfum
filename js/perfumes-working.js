// =====================================================
// PERFUMES PAGE - WORKING VERSION 
// =====================================================

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 15;

// Wait for DOM to be ready
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing perfumes page...');
    console.log('🔍 Checking DOM elements...');
    
    const container = document.getElementById('products-container');
    console.log('Container found:', container ? '✅' : '❌', container);
    
    const loadingMessage = document.getElementById('loadingMessage');
    console.log('Loading message found:', loadingMessage ? '✅' : '❌', loadingMessage);
    
    // Try to load products immediately
    loadAndDisplayProducts();
});

// Load and display products
async function loadAndDisplayProducts() {
    try {
        console.log('📦 Loading products from JSON...');
        console.log('📍 Current location:', window.location.href);
        console.log('📂 Attempting to load from: ../js/perfumes.json');
        
        // Load products
        const response = await fetch('../js/perfumes.json');
        console.log('📡 Response status:', response.status);
        console.log('📡 Response ok:', response.ok);
        
        if (!response.ok) {
            throw new Error(`Failed to load: ${response.status} - ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('📊 Raw data received:', data);
        
        allProducts = data.perfumes || [];
        filteredProducts = [...allProducts];
        
        console.log(`✅ Loaded ${allProducts.length} products`);
        console.log('📦 First product sample:', allProducts[0]);
        
        if (allProducts.length === 0) {
            console.warn('⚠️ No products found in JSON! Using fallback...');
            loadFallbackData();
            return;
        }
        
        // Display products
        displayProducts();
        displayPagination();
        initializeFilters();
        
        // Show success message
        showSuccessMessage(`¡${allProducts.length} perfumes cargados exitosamente!`);
        
    } catch (error) {
        console.error('❌ Error loading products:', error);
        console.error('❌ Error stack:', error.stack);
        showErrorMessage('No se pudieron cargar los productos. Usando datos de prueba...');
        // Try alternative method
        setTimeout(loadFallbackData, 1000);
    }
}

// Fallback data if JSON fails
function loadFallbackData() {
    console.log('🔄 Loading fallback data...');
    allProducts = [
        // Chanel
        {
            id: 1,
            name: "Bleu de Chanel EDP",
            brand: "Chanel",
            price: 4200.00,
            image: "../images/perfumes/Chanel/Chanel Bleu De Chanel for Men EDP Spray 1.7 oz.jpg",
            category: "Hombre",
            ml: 50,
            stock: 15,
            description: "Una fragancia aromática amaderada con notas de limón, bergamota y cedro."
        },
        {
            id: 2,
            name: "Chance Eau Fraiche",
            brand: "Chanel", 
            price: 3650.00,
            image: "../images/perfumes/Chanel/Chanel Chance Eau Fraiche Eau De Parfum Spray, 100 ml.jpg",
            category: "Mujer",
            ml: 100,
            stock: 12,
            description: "Una fragancia floral frutal delicada con notas de pomelo y membrillo."
        },
        // Dior
        {
            id: 3,
            name: "J'adore Infinissime",
            brand: "Dior",
            price: 4300.00,
            image: "../images/perfumes/Dior/Christian Dior Jadore Infinissime Women 3.4 oz EDP Spray.jpg",
            category: "Mujer", 
            ml: 100,
            stock: 10,
            description: "Fragancia floral luminosa con notas de ylang-ylang y rosa."
        },
        {
            id: 4,
            name: "Dior Homme",
            brand: "Dior",
            price: 4000.00,
            image: "../images/perfumes/Dior/Dior Homme By Christian Dior For Men. Spray 3.4 Ounces.jpg",
            category: "Hombre",
            ml: 100,
            stock: 8,
            description: "Fragancia masculina sofisticada con iris y lavanda."
        },
        {
            id: 5,
            name: "Dune",
            brand: "Dior",
            price: 3500.00,
            image: "../images/perfumes/Dior/Dune By Christian Dior For Women. Eau De Toilette Spray 3.4 Ounces.jpg",
            category: "Mujer",
            ml: 100,
            stock: 6,
            description: "Fragancia oceánica y refrescante para mujer."
        },
        {
            id: 6,
            name: "Hypnotic Poison",
            brand: "Dior",
            price: 3800.00,
            image: "../images/perfumes/Dior/Hypnotic Poison by Christian Dior Eau De Toilette Spray for Women, 3.4 Ounce.jpg",
            category: "Mujer",
            ml: 100,
            stock: 9,
            description: "Fragancia sensual y misteriosa con vainilla."
        },
        // Creed
        {
            id: 7,
            name: "Aventus",
            brand: "Creed",
            price: 8500.00,
            image: "../images/perfumes/Creed/Aventus by Creed Eau De Parfum Spray 3.3 oz  100 ml.jpg",
            category: "Hombre",
            ml: 100,
            stock: 5,
            description: "La fragancia masculina más icónica con piña y bergamota."
        },
        {
            id: 8,
            name: "Viking",
            brand: "Creed",
            price: 7800.00,
            image: "../images/perfumes/Creed/Creed Agua de Perfume Spray Viking Cologne para Hombre, Natural, 3.3 Oz 100 ml.jpg",
            category: "Hombre",
            ml: 100,
            stock: 4,
            description: "Fragancia masculina intensa con especias nórdicas."
        },
        {
            id: 9,
            name: "Aventus Cologne",
            brand: "Creed",
            price: 7200.00,
            image: "../images/perfumes/Creed/Creed Aventus Cologne Men Eau De Parfum Spray, 3.4 Ounce (New 2019), 3.44 ounces.jpg",
            category: "Hombre",
            ml: 100,
            stock: 6,
            description: "Versión más fresca del icónico Aventus."
        },
        {
            id: 10,
            name: "Silver Mountain Water",
            brand: "Creed",
            price: 6800.00,
            image: "../images/perfumes/Creed/Creed Silver mountain water eau de parfum spray 1.7 oz, 50 ml.jpg",
            category: "Unisex",
            ml: 50,
            stock: 7,
            description: "Fragancia unisex fresca y pura como la montaña."
        }
    ];
    
    filteredProducts = [...allProducts];
    displayProducts();
    displayPagination(); 
    initializeFilters();
    showSuccessMessage(`Cargados ${allProducts.length} perfumes de prueba`);
}

// Display products in grid
function displayProducts() {
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('❌ Products container not found!');
        console.log('Available elements with "container" in id:', Array.from(document.querySelectorAll('[id*="container"]')).map(el => el.id));
        return;
    }
    
    console.log(`📦 Displaying ${filteredProducts.length} total products, page ${currentPage}`);
    
    // Hide loading message
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12">
                <div class="text-center py-5">
                    <i class="fas fa-search fa-3x text-muted mb-3"></i>
                    <h4>No se encontraron productos</h4>
                    <p class="text-muted">Intenta ajustar los filtros de búsqueda</p>
                    <button class="btn btn-primary" onclick="clearAllFilters()">
                        <i class="fas fa-refresh me-2"></i>Limpiar Filtros
                    </button>
                </div>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    console.log(`📝 Generating HTML for ${productsToShow.length} products...`);
    
    productsToShow.forEach((product, index) => {
        console.log(`📦 Processing product ${index + 1}: ${product.name}`);
        
        html += `
            <div class="col-lg-4 col-md-6 mb-4" data-aos="fade-up">
                <div class="card product-card h-100 border-0 shadow-sm">
                    <div class="position-relative overflow-hidden">
                        <img src="${product.image}" 
                             class="card-img-top product-image" 
                             alt="${product.name}"
                             style="height: 250px; object-fit: cover;"
                             onerror="console.log('Image failed for: ${product.name}'); this.src='https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=300&h=250&fit=crop&crop=center';">
                        
                        <div class="product-overlay">
                            <button class="btn btn-outline-light btn-sm me-2" onclick="quickView(${product.id})">
                                <i class="fas fa-eye"></i>
                            </button>
                            <button class="btn btn-outline-light btn-sm" onclick="toggleWishlist(${product.id})">
                                <i class="fas fa-heart"></i>
                            </button>
                        </div>
                        
                        ${product.stock && product.stock < 5 ? '<span class="badge bg-warning position-absolute top-0 end-0 m-2">Pocas unidades</span>' : ''}
                    </div>
                    
                    <div class="card-body d-flex flex-column">
                        <div class="mb-2">
                            <small class="text-primary fw-bold">${product.brand}</small>
                        </div>
                        <h6 class="card-title mb-2">${product.name}</h6>
                        <p class="card-text text-muted small mb-3">${product.description || 'Fragancia premium'}</p>
                        
                        <div class="product-details mb-3">
                            <small class="text-muted">
                                <i class="fas fa-tag me-1"></i>${product.category}
                                <span class="ms-3">
                                    <i class="fas fa-flask me-1"></i>${product.ml}ml
                                </span>
                            </small>
                        </div>
                        
                        <div class="mt-auto">
                            <div class="d-flex justify-content-between align-items-center mb-3">
                                <div class="price">
                                    <span class="h5 text-primary mb-0">$${product.price.toLocaleString()}</span>
                                    <small class="text-muted d-block">MXN</small>
                                </div>
                                <div class="rating">
                                    <i class="fas fa-star text-warning"></i>
                                    <i class="fas fa-star text-warning"></i>
                                    <i class="fas fa-star text-warning"></i>
                                    <i class="fas fa-star text-warning"></i>
                                    <i class="fas fa-star text-muted"></i>
                                </div>
                            </div>
                            
                            <button class="btn btn-primary w-100" onclick="quickAddToCart(${product.id}, this)">
                                <i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });
    
    console.log('📝 HTML generated, length:', html.length);
    container.innerHTML = html;
    console.log('✅ Products displayed successfully!');
    
    // Update results info
    updateResultsInfo();
}

// Display pagination
function displayPagination() {
    const container = document.getElementById('pagination-container');
    if (!container) return;
    
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    
    if (totalPages <= 1) {
        container.innerHTML = '';
        return;
    }
    
    let html = `
        <nav aria-label="Navegación de productos">
            <ul class="pagination justify-content-center">
    `;
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})" aria-label="Anterior">
                <i class="fas fa-chevron-left"></i>
            </a>
        </li>
    `;
    
    // Page numbers
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - 2 && i <= currentPage + 2)) {
            html += `
                <li class="page-item ${i === currentPage ? 'active' : ''}">
                    <a class="page-link" href="#" onclick="changePage(${i})">${i}</a>
                </li>
            `;
        } else if (i === currentPage - 3 || i === currentPage + 3) {
            html += '<li class="page-item disabled"><span class="page-link">...</span></li>';
        }
    }
    
    // Next button
    html += `
        <li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})" aria-label="Siguiente">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    html += '</ul></nav>';
    container.innerHTML = html;
}

// Change page
function changePage(page) {
    const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
    if (page < 1 || page > totalPages) return;
    
    currentPage = page;
    displayProducts();
    displayPagination();
    
    // Scroll to products
    document.getElementById('products-container').scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
    });
}

// Initialize filters
function initializeFilters() {
    console.log('🔧 Setting up filters...');
    
    // Search filter
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            applyFilters();
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
    
    // Price range filters
    document.querySelectorAll('input[id^="price"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Concentration filters
    document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }
    
    console.log('✅ Filters initialized');
}

// Apply all filters
function applyFilters() {
    console.log('🔍 Applying filters...');
    
    filteredProducts = allProducts.filter(product => {
        // Search filter
        const searchTerm = document.getElementById('searchFilter')?.value.toLowerCase() || '';
        if (searchTerm) {
            const searchMatch = product.name.toLowerCase().includes(searchTerm) ||
                              product.brand.toLowerCase().includes(searchTerm) ||
                              (product.description && product.description.toLowerCase().includes(searchTerm));
            if (!searchMatch) return false;
        }
        
        // Gender filter
        const selectedGender = document.querySelector('input[name="genero"]:checked')?.value;
        if (selectedGender && selectedGender !== 'todos') {
            if (product.category.toLowerCase() !== selectedGender.toLowerCase()) return false;
        }
        
        // Brand filters
        const selectedBrands = Array.from(document.querySelectorAll('.brand-filters input[type="checkbox"]:checked'))
                                   .map(cb => cb.value);
        if (selectedBrands.length > 0) {
            const productBrand = product.brand.toLowerCase().replace(/\s+/g, '-').replace(/&/g, '');
            const matchesBrand = selectedBrands.some(selectedBrand => 
                productBrand.includes(selectedBrand) || 
                selectedBrand.includes(productBrand) ||
                product.brand.toLowerCase().includes(selectedBrand.replace('-', ' '))
            );
            if (!matchesBrand) return false;
        }
        
        // Price range filters (checkbox based)
        const selectedPriceRanges = Array.from(document.querySelectorAll('input[id^="price"]:checked'))
                                          .map(cb => cb.value);
        if (selectedPriceRanges.length > 0) {
            const matchesPrice = selectedPriceRanges.some(range => {
                if (range === '0-2000') return product.price >= 0 && product.price <= 2000;
                if (range === '2000-5000') return product.price > 2000 && product.price <= 5000;
                if (range === '5000-10000') return product.price > 5000 && product.price <= 10000;
                if (range === '10000+') return product.price > 10000;
                return false;
            });
            if (!matchesPrice) return false;
        }
        
        // Concentration filter
        const selectedConcentrations = Array.from(document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]'))
                                             .filter(cb => cb.checked)
                                             .map(cb => cb.value);
        if (selectedConcentrations.length > 0) {
            const matchesConcentration = selectedConcentrations.includes(product.concentration);
            if (!matchesConcentration) return false;
        }
        
        return true;
    });
    
    currentPage = 1; // Reset to first page
    displayProducts();
    displayPagination();
    
    console.log(`🔍 Filtered to ${filteredProducts.length} products`);
}

// Update results info
function updateResultsInfo() {
    const totalResults = filteredProducts.length;
    const startItem = ((currentPage - 1) * productsPerPage) + 1;
    const endItem = Math.min(currentPage * productsPerPage, totalResults);
    
    // Update results counter (if exists)
    const counter = document.querySelector('.results-info');
    if (counter) {
        counter.textContent = `Mostrando ${startItem}-${endItem} de ${totalResults} productos`;
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
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Uncheck all price range filters
    document.querySelectorAll('input[id^="price"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Uncheck all concentration filters
    document.querySelectorAll('input[id^="edp"], input[id^="edt"], input[id^="parfum"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Apply filters (will show all products)
    applyFilters();
}

// Quick view function
function quickView(productId) {
    const product = allProducts.find(p => p.id === productId);
    if (!product) return;
    
    // Update modal content
    const modal = document.getElementById('quickViewModal');
    if (modal) {
        const img = modal.querySelector('img');
        const title = modal.querySelector('h4');
        const price = modal.querySelector('.h4.text-primary');
        
        if (img) img.src = product.image;
        if (title) title.textContent = product.name;
        if (price) price.textContent = `$${product.price.toLocaleString()} MXN`;
        
        // Show modal
        new bootstrap.Modal(modal).show();
    }
}

// Wishlist toggle
function toggleWishlist(productId) {
    console.log(`💝 Toggling wishlist for product ${productId}`);
    // Implement wishlist functionality here
}

// Add to cart function (if cart system is available)
function quickAddToCart(productId, buttonElement) {
    console.log(`🛒 Adding product ${productId} to cart`);
    
    if (typeof cart !== 'undefined') {
        cart.addItem(productId).then(() => {
            // Success feedback
            if (buttonElement) {
                const originalText = buttonElement.innerHTML;
                buttonElement.innerHTML = '<i class="fas fa-check me-2"></i>¡Agregado!';
                buttonElement.classList.add('btn-success');
                buttonElement.disabled = true;
                
                setTimeout(() => {
                    buttonElement.innerHTML = originalText;
                    buttonElement.classList.remove('btn-success');
                    buttonElement.disabled = false;
                }, 1500);
            }
        });
    } else {
        // Fallback if cart system not available
        if (buttonElement) {
            buttonElement.innerHTML = '<i class="fas fa-check me-2"></i>¡Agregado!';
            buttonElement.classList.add('btn-success');
            setTimeout(() => {
                buttonElement.innerHTML = '<i class="fas fa-shopping-bag me-2"></i>Agregar al Carrito';
                buttonElement.classList.remove('btn-success');
            }, 1500);
        }
    }
}

// Utility functions
function showSuccessMessage(message) {
    console.log(`✅ ${message}`);
    // You could show a toast notification here
}

function showErrorMessage(message) {
    console.error(`❌ ${message}`);
    // You could show an error toast here
}

// Apply sorting
function applySorting(sortType) {
    console.log(`🔄 Sorting by: ${sortType}`);
    
    switch(sortType) {
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
            filteredProducts.sort((a, b) => b.id - a.id);
            break;
        case 'rating':
            // Since we don't have ratings, we'll sort by price (higher price = better quality assumption)
            filteredProducts.sort((a, b) => b.price - a.price);
            break;
        default:
            // Default: sort by ID
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    currentPage = 1; // Reset to first page
    displayProducts();
    displayPagination();
}
// Perfumes Simple and Direct
console.log('🚀 Starting perfumes simple direct...');

let allProducts = [];
let filteredProducts = [];
let currentPage = 1;
const productsPerPage = 15;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🔄 DOM loaded, initializing...');
    loadProducts();
});

// Load products data
async function loadProducts() {
    try {
        console.log('📦 Loading products...');
        
        // First try to load from JSON
        const response = await fetch('../js/perfumes.json');
        
        if (!response.ok) {
            throw new Error('Failed to load JSON');
        }
        
        const data = await response.json();
        allProducts = data.perfumes || [];
        
        console.log(`✅ Loaded ${allProducts.length} products from JSON`);
        
    } catch (error) {
        console.error('❌ Error loading JSON, using fallback:', error);
        // Use fallback data
        allProducts = getFallbackProducts();
    }
    
    // Set filtered products and display
    filteredProducts = [...allProducts];
    displayProducts();
    displayPagination();
    initializeFilters();
    
    console.log('✅ Products initialized successfully');
}

// Fallback products data
function getFallbackProducts() {
    return [
        {
            id: 1,
            name: "Bleu de Chanel EDP",
            brand: "Chanel",
            category: "Hombre",
            price: 4200.00,
            ml: 50,
            stock: 15,
            description: "Una fragancia aromática amaderada con notas de limón, bergamota y cedro.",
            image: "../images/perfumes/Chanel/Chanel Bleu De Chanel for Men EDP Spray 1.7 oz.jpg",
            concentration: "eau-de-parfum"
        },
        {
            id: 2,
            name: "Chance Eau Fraiche",
            brand: "Chanel",
            category: "Mujer",
            price: 3650.00,
            ml: 100,
            stock: 12,
            description: "Una fragancia floral frutal delicada con notas de pomelo y membrillo.",
            image: "../images/perfumes/Chanel/Chanel Chance Eau Fraiche Eau De Parfum Spray, 100 ml.jpg",
            concentration: "eau-de-parfum"
        },
        {
            id: 3,
            name: "J'adore Infinissime",
            brand: "Dior",
            category: "Mujer",
            price: 4300.00,
            ml: 100,
            stock: 10,
            description: "Fragancia floral luminosa con notas de ylang-ylang y rosa.",
            image: "../images/perfumes/Dior/Christian Dior Jadore Infinissime Women 3.4 oz EDP Spray.jpg",
            concentration: "eau-de-parfum"
        },
        {
            id: 7,
            name: "Aventus",
            brand: "Creed",
            category: "Hombre",
            price: 8500.00,
            ml: 100,
            stock: 5,
            description: "La fragancia masculina más icónica con piña y bergamota.",
            image: "../images/perfumes/Creed/Aventus by Creed Eau De Parfum Spray 3.3 oz  100 ml.jpg",
            concentration: "eau-de-parfum"
        },
        {
            id: 11,
            name: "Chrome EDP",
            brand: "Azzaro",
            category: "Hombre",
            price: 2800.00,
            ml: 100,
            stock: 20,
            description: "Una fragancia acuática fresca con notas cítricas.",
            image: "../images/perfumes/Azzaro/Azzaro Eau de Parfum Chrome 100 ml.jpg",
            concentration: "eau-de-parfum"
        }
    ];
}

// Display products
function displayProducts() {
    console.log('📦 Displaying products...');
    
    const container = document.getElementById('products-container');
    if (!container) {
        console.error('❌ Container not found!');
        return;
    }
    
    // Hide loading message
    const loadingMessage = document.getElementById('loadingMessage');
    if (loadingMessage) {
        loadingMessage.style.display = 'none';
    }
    
    // Calculate pagination
    const startIndex = (currentPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const productsToShow = filteredProducts.slice(startIndex, endIndex);
    
    console.log(`📦 Showing ${productsToShow.length} products (${startIndex}-${endIndex})`);
    
    if (productsToShow.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No se encontraron productos</h4>
                <p class="text-muted">Intenta ajustar los filtros</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Limpiar Filtros</button>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    productsToShow.forEach(product => {
        const randomRating = (3.5 + Math.random() * 1.5).toFixed(1); // Random rating between 3.5-5.0
        
        html += `
            <div class="col-lg-4 col-md-6 col-sm-6 mb-3">
                <div class="card product-card">
                    <!-- Image Container with Fixed Aspect Ratio -->
                    <div class="card-img-container">
                        <img src="${product.image}" 
                             class="card-img-top" 
                             alt="${product.name}"
                             loading="lazy"
                             onerror="this.src='https://images.unsplash.com/photo-1588405748880-12d1d2a59d32?w=400&h=400&fit=crop';">
                        
                        <!-- Badges Overlay -->
                        <div class="badge-overlay">
                            ${product.stock < 5 ? '<span class="badge bg-warning text-dark">Pocas unidades</span>' : ''}
                            ${product.price > 5000 ? '<span class="badge bg-primary">Premium</span>' : ''}
                        </div>
                    </div>
                    
                    <!-- Flexible Card Body -->
                    <div class="card-body">
                        <!-- Brand -->
                        <div class="card-brand">${product.brand}</div>
                        
                        <!-- Product Title -->
                        <h5 class="card-title">${product.name}</h5>
                        
                        <!-- Description -->
                        <p class="card-text">${product.description || 'Fragancia premium de alta calidad con notas sofisticadas y duración excepcional'}</p>
                        
                        <!-- Product Metadata -->
                        <div class="product-meta">
                            <span>
                                <i class="fas fa-tag"></i>${product.category}
                            </span>
                            <span>
                                <i class="fas fa-flask"></i>${product.ml}ml
                            </span>
                            <span>
                                <i class="fas fa-certificate"></i>${getConcentrationName(product.concentration)}
                            </span>
                        </div>
                        
                        <!-- Price and Rating Section -->
                        <div class="price-rating-section">
                            <div class="price-section">
                                <div class="price-main">$${product.price.toLocaleString()}</div>
                                <div class="price-currency">MXN</div>
                            </div>
                            <div class="rating" title="Calificación: ${randomRating}/5">
                                ${generateStars(parseFloat(randomRating))}
                            </div>
                        </div>
                        
                        <!-- Add to Cart Button - Always Visible -->
                        <button class="btn-add-to-cart" 
                                onclick="addToCartHandler(${product.id}, this)"
                                aria-label="Agregar ${product.name} al carrito">
                            <i class="fas fa-shopping-bag"></i>
                            Agregar al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
    updateResultsInfo();
    
    console.log('✅ Products displayed successfully');
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
        <nav aria-label="Navegación">
            <ul class="pagination justify-content-center">
    `;
    
    // Previous button
    html += `
        <li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link" href="#" onclick="changePage(${currentPage - 1})">
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
            <a class="page-link" href="#" onclick="changePage(${currentPage + 1})">
                <i class="fas fa-chevron-right"></i>
            </a>
        </li>
    `;
    
    html += '</ul></nav>';
    container.innerHTML = html;
}

// Change page (global function)
window.changePage = function changePage(page) {
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
        searchInput.addEventListener('input', applyFilters);
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
    
    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }
}

// Apply filters
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
        
        // Price filters
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
        
        return true;
    });
    
    currentPage = 1; // Reset to first page
    displayProducts();
    displayPagination();
}

// Update results info
function updateResultsInfo() {
    const totalResults = filteredProducts.length;
    const startItem = ((currentPage - 1) * productsPerPage) + 1;
    const endItem = Math.min(currentPage * productsPerPage, totalResults);
    
    const counter = document.querySelector('.results-info');
    if (counter) {
        counter.textContent = `Mostrando ${startItem}-${endItem} de ${totalResults} productos`;
    }
}

// Clear all filters (global function)
window.clearAllFilters = function clearAllFilters() {
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
    
    // Uncheck all price filters
    document.querySelectorAll('input[id^="price"]').forEach(cb => {
        cb.checked = false;
    });
    
    // Apply filters
    applyFilters();
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
        default:
            filteredProducts.sort((a, b) => a.id - b.id);
    }
    
    currentPage = 1;
    displayProducts();
    displayPagination();
}

// Add to cart handler (global function)
window.addToCartHandler = function addToCartHandler(productId, buttonElement) {
    console.log(`🛒 Adding product ${productId} to cart`);
    
    if (typeof cart !== 'undefined' && cart.addItem) {
        cart.addItem(productId).then(() => {
            showButtonFeedback(buttonElement, '¡Agregado!');
        });
    } else if (typeof quickAddToCart === 'function') {
        quickAddToCart(productId, buttonElement);
    } else {
        showButtonFeedback(buttonElement, '¡Agregado!');
    }
}

// Show button feedback
function showButtonFeedback(buttonElement, message) {
    if (buttonElement) {
        const originalText = buttonElement.innerHTML;
        const originalClasses = buttonElement.className;
        
        buttonElement.innerHTML = `<i class="fas fa-check"></i>${message}`;
        buttonElement.classList.add('btn-success');
        buttonElement.disabled = true;
        
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.className = originalClasses;
            buttonElement.disabled = false;
        }, 2000);
    }
}

// Helper functions
function getConcentrationName(concentration) {
    const names = {
        'eau-de-parfum': 'EDP',
        'eau-de-toilette': 'EDT', 
        'parfum': 'Parfum'
    };
    return names[concentration] || 'Fragancia';
}

function generateStars(rating) {
    let stars = '';
    const fullStars = Math.floor(rating);
    const hasHalfStar = (rating % 1) >= 0.5;
    const totalStars = 5;
    
    // Full stars
    for (let i = 0; i < fullStars; i++) {
        stars += '<i class="fas fa-star text-warning"></i>';
    }
    
    // Half star
    if (hasHalfStar && fullStars < totalStars) {
        stars += '<i class="fas fa-star-half-alt text-warning"></i>';
    }
    
    // Empty stars
    const emptyStars = totalStars - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
        stars += '<i class="far fa-star text-muted"></i>';
    }
    
    return stars;
}

// Mobile filters functionality
function toggleMobileFilters() {
    const overlay = document.getElementById('mobileFiltersOverlay');
    const filtersContent = document.querySelector('.filters-sidebar .card');
    
    if (overlay) {
        if (overlay.style.display === 'block') {
            // Hide mobile filters
            overlay.classList.remove('show');
            setTimeout(() => {
                overlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }, 300);
        } else {
            // Show mobile filters
            overlay.style.display = 'block';
            document.body.style.overflow = 'hidden';
            
            // Clone filters content if not already done
            const sidebarContent = overlay.querySelector('.sidebar-content');
            if (!sidebarContent.querySelector('.card') && filtersContent) {
                const clonedFilters = filtersContent.cloneNode(true);
                // Update IDs to avoid conflicts
                updateFilterIds(clonedFilters, 'mobile-');
                sidebarContent.appendChild(clonedFilters);
                
                // Reinitialize mobile filters
                initializeMobileFilters();
            }
            
            setTimeout(() => {
                overlay.classList.add('show');
            }, 10);
        }
    }
}

// Update filter IDs for mobile
function updateFilterIds(element, prefix) {
    const inputs = element.querySelectorAll('input, select');
    inputs.forEach(input => {
        if (input.id) {
            const newId = prefix + input.id;
            input.id = newId;
            
            // Update associated label
            const label = element.querySelector(`label[for="${input.id.replace(prefix, '')}"]`);
            if (label) {
                label.setAttribute('for', newId);
            }
        }
    });
}

// Initialize mobile filters
function initializeMobileFilters() {
    const mobileFilters = document.querySelector('#mobileFiltersOverlay .card');
    if (!mobileFilters) return;
    
    // Search filter
    const mobileSearch = mobileFilters.querySelector('#mobile-searchFilter');
    if (mobileSearch) {
        mobileSearch.addEventListener('input', function() {
            const desktopSearch = document.getElementById('searchFilter');
            if (desktopSearch) desktopSearch.value = this.value;
            applyFilters();
        });
    }
    
    // Gender filters
    mobileFilters.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', function() {
            const desktopRadio = document.getElementById(this.id.replace('mobile-', ''));
            if (desktopRadio) desktopRadio.checked = this.checked;
            applyFilters();
        });
    });
    
    // Brand filters
    mobileFilters.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const desktopCheckbox = document.getElementById(this.id.replace('mobile-', ''));
            if (desktopCheckbox) desktopCheckbox.checked = this.checked;
            applyFilters();
        });
    });
    
    // Price and Type filters
    const mobilePriceFilter = mobileFilters.querySelector('#mobile-priceFilter');
    const mobileTypeFilter = mobileFilters.querySelector('#mobile-typeFilter');
    
    if (mobilePriceFilter) {
        mobilePriceFilter.addEventListener('change', function() {
            const desktopPrice = document.getElementById('priceFilter');
            if (desktopPrice) desktopPrice.value = this.value;
            applyFilters();
        });
    }
    
    if (mobileTypeFilter) {
        mobileTypeFilter.addEventListener('change', function() {
            const desktopType = document.getElementById('typeFilter');
            if (desktopType) desktopType.value = this.value;
            applyFilters();
        });
    }
    
    // Clear filters
    const mobileClearBtn = mobileFilters.querySelector('#mobile-clearFilters');
    if (mobileClearBtn) {
        mobileClearBtn.addEventListener('click', clearAllFilters);
    }
}

// Enhanced filter application with price and type filters
function applyFiltersEnhanced() {
    console.log('🔍 Applying enhanced filters...');
    
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
        
        // Price filter
        const priceRange = document.getElementById('priceFilter')?.value;
        if (priceRange) {
            const price = product.price;
            if (priceRange === '0-2000' && (price < 0 || price > 2000)) return false;
            if (priceRange === '2000-5000' && (price <= 2000 || price > 5000)) return false;
            if (priceRange === '5000-10000' && (price <= 5000 || price > 10000)) return false;
            if (priceRange === '10000+' && price <= 10000) return false;
        }
        
        // Concentration filter
        const concentration = document.getElementById('typeFilter')?.value;
        if (concentration && product.concentration !== concentration) return false;
        
        return true;
    });
    
    currentPage = 1; // Reset to first page
    displayProducts();
    displayPagination();
}

// Update the existing applyFilters function
window.applyFilters = applyFiltersEnhanced;

// Enhanced initialization
function initializeFiltersEnhanced() {
    console.log('🔧 Setting up enhanced filters...');
    
    // Search filter
    const searchInput = document.getElementById('searchFilter');
    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
    
    // Gender filters
    document.querySelectorAll('input[name="genero"]').forEach(radio => {
        radio.addEventListener('change', applyFilters);
    });
    
    // Brand filters  
    document.querySelectorAll('.brand-filters input[type="checkbox"]').forEach(checkbox => {
        checkbox.addEventListener('change', applyFilters);
    });
    
    // Price filter
    const priceFilter = document.getElementById('priceFilter');
    if (priceFilter) {
        priceFilter.addEventListener('change', applyFilters);
    }
    
    // Type filter
    const typeFilter = document.getElementById('typeFilter');
    if (typeFilter) {
        typeFilter.addEventListener('change', applyFilters);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortBy');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            applySorting(this.value);
        });
    }
    
    // Clear filters
    const clearBtn = document.getElementById('clearFilters');
    if (clearBtn) {
        clearBtn.addEventListener('click', clearAllFilters);
    }
}

// Update initialization
window.initializeFilters = initializeFiltersEnhanced;

// Emergency initialization - call immediately
console.log('🚀 Emergency initialization starting...');
setTimeout(() => {
    if (typeof allProducts === 'undefined' || allProducts.length === 0) {
        console.log('⚠️ Products not loaded, forcing emergency initialization');
        allProducts = getFallbackProducts();
        filteredProducts = [...allProducts];
        displayProducts();
        displayPagination();
        initializeFilters();
    }
}, 1000);
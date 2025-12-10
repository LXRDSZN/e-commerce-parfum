// =====================================================
// ÉLITE PERFUMERÍA - MAIN JAVASCRIPT
// Core functionality for the perfume e-commerce site
// =====================================================

// Global variables
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// Main initialization function
function initializeApp() {
    initializePreloader();
    initializeNavbar();
    initializeCart();
    initializeWishlist();
    initializeSearch();
    initializeBackToTop();
    initializeAnimations();
    initializeFilters();
    loadFeaturedProducts();
    
    console.log('🌟 Élite Perfumería initialized successfully!');
}

// =====================================================
// PRELOADER
// =====================================================
function initializePreloader() {
    const preloader = document.getElementById('preloader');
    if (preloader) {
        setTimeout(() => {
            preloader.classList.add('fade-out');
            setTimeout(() => {
                preloader.style.display = 'none';
            }, 500);
        }, 1200);
    }
}

// =====================================================
// NAVBAR FUNCTIONALITY
// =====================================================
function initializeNavbar() {
    const navbar = document.querySelector('.navbar');
    
    // Navbar scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.classList.add('navbar-scrolled');
        } else {
            navbar.classList.remove('navbar-scrolled');
        }
    });
    
    // Mobile menu close on link click
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const navbarCollapse = document.querySelector('.navbar-collapse');
    
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
}

// =====================================================
// CART FUNCTIONALITY
// =====================================================
function initializeCart() {
    updateCartCounter();
    updateCartDisplay();
    
    // Add event listeners to add-to-cart buttons
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('add-to-cart') || e.target.closest('.add-to-cart')) {
            const button = e.target.classList.contains('add-to-cart') ? e.target : e.target.closest('.add-to-cart');
            const productId = button.getAttribute('data-id');
            addToCart(productId);
        }
    });
}

function addToCart(productId) {
    // Sample product data - in real app, this would come from API
    const products = {
        '1': { id: 1, name: 'Valentino Born In Roma Yellow Dream', brand: 'Valentino', price: 2312.00, image: 'images/productos/valentino-born-roma-yellow-1.jpg' },
        '11': { id: 11, name: 'Chanel Coco Mademoiselle', brand: 'Chanel', price: 3850.00, image: 'images/productos/chanel-coco-mad-1.jpg' },
        '77': { id: 77, name: 'Dior Sauvage Elixir', brand: 'Dior', price: 4320.00, image: 'images/productos/dior-sauvage-elixir-1.jpg' },
        '18': { id: 18, name: 'Byredo Gypsy Water', brand: 'Byredo', price: 4320.00, image: 'images/productos/byredo-gypsy-water-1.jpg' }
    };
    
    const product = products[productId];
    if (!product) return;
    
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.id === parseInt(productId));
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartCounter();
    updateCartDisplay();
    showNotification('Producto agregado al carrito', 'success');
    
    // Add animation to cart icon
    animateCartIcon();
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== parseInt(productId));
    saveCart();
    updateCartCounter();
    updateCartDisplay();
    showNotification('Producto eliminado del carrito', 'info');
}

function updateCartQuantity(productId, quantity) {
    const item = cart.find(item => item.id === parseInt(productId));
    if (item) {
        item.quantity = parseInt(quantity);
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCounter();
            updateCartDisplay();
        }
    }
}

function updateCartCounter() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCounters = document.querySelectorAll('.cart-count');
    cartCounters.forEach(counter => {
        counter.textContent = totalItems;
        counter.style.display = totalItems > 0 ? 'inline' : 'none';
    });
}

function updateCartDisplay() {
    const cartItems = document.getElementById('cartItems');
    const cartSubtotal = document.getElementById('cartSubtotal');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (!cartItems) return;
    
    if (cart.length === 0) {
        cartItems.innerHTML = '<p class="text-muted text-center py-4">Tu carrito está vacío</p>';
        if (cartSubtotal) cartSubtotal.textContent = '$0.00 MXN';
        if (checkoutBtn) checkoutBtn.disabled = true;
        return;
    }
    
    let total = 0;
    let html = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        html += `
            <div class="cart-item d-flex align-items-center py-3 border-bottom">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">
                <div class="flex-grow-1">
                    <h6 class="mb-1 fw-bold">${item.name}</h6>
                    <small class="text-muted">${item.brand}</small>
                    <div class="d-flex align-items-center mt-2">
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartQuantity(${item.id}, ${item.quantity - 1})">-</button>
                        <span class="mx-2">${item.quantity}</span>
                        <button class="btn btn-sm btn-outline-secondary me-2" onclick="updateCartQuantity(${item.id}, ${item.quantity + 1})">+</button>
                        <button class="btn btn-sm btn-outline-danger ms-auto" onclick="removeFromCart(${item.id})">
                            <i class="fas fa-trash-alt"></i>
                        </button>
                    </div>
                    <div class="mt-2">
                        <strong>$${itemTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    cartItems.innerHTML = html;
    if (cartSubtotal) {
        cartSubtotal.textContent = `$${total.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
    }
    if (checkoutBtn) {
        checkoutBtn.disabled = false;
    }
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function animateCartIcon() {
    const cartIcon = document.querySelector('[data-bs-target="#cartOffcanvas"] i');
    if (cartIcon) {
        cartIcon.classList.add('animate-bounce');
        setTimeout(() => {
            cartIcon.classList.remove('animate-bounce');
        }, 600);
    }
}

// =====================================================
// WISHLIST FUNCTIONALITY
// =====================================================
function initializeWishlist() {
    updateWishlistCounter();
    
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('btn-wishlist') || e.target.closest('.btn-wishlist')) {
            const button = e.target.classList.contains('btn-wishlist') ? e.target : e.target.closest('.btn-wishlist');
            const productCard = button.closest('.product-card');
            const productId = productCard.querySelector('.add-to-cart').getAttribute('data-id');
            toggleWishlist(productId);
        }
    });
}

function toggleWishlist(productId) {
    const isInWishlist = wishlist.includes(parseInt(productId));
    
    if (isInWishlist) {
        wishlist = wishlist.filter(id => id !== parseInt(productId));
        showNotification('Eliminado de favoritos', 'info');
    } else {
        wishlist.push(parseInt(productId));
        showNotification('Agregado a favoritos', 'success');
    }
    
    saveWishlist();
    updateWishlistCounter();
    updateWishlistButtons();
}

function updateWishlistCounter() {
    const wishlistCounters = document.querySelectorAll('.wishlist-count');
    wishlistCounters.forEach(counter => {
        counter.textContent = wishlist.length;
        counter.style.display = wishlist.length > 0 ? 'inline' : 'none';
    });
}

function updateWishlistButtons() {
    document.querySelectorAll('.btn-wishlist').forEach(button => {
        const productCard = button.closest('.product-card');
        const productId = productCard?.querySelector('.add-to-cart')?.getAttribute('data-id');
        
        if (productId && wishlist.includes(parseInt(productId))) {
            button.classList.add('active');
            button.innerHTML = '<i class="fas fa-heart text-danger"></i>';
        } else {
            button.classList.remove('active');
            button.innerHTML = '<i class="far fa-heart"></i>';
        }
    });
}

function saveWishlist() {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
}

// =====================================================
// SEARCH FUNCTIONALITY
// =====================================================
function initializeSearch() {
    const searchForm = document.querySelector('#searchModal form');
    const searchInput = document.querySelector('#searchModal input[type="text"]');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performSearch(query);
            }
        });
    }
    
    // Popular search tags
    document.querySelectorAll('#searchModal .badge').forEach(badge => {
        badge.addEventListener('click', function() {
            const query = this.textContent.trim();
            searchInput.value = query;
            performSearch(query);
        });
    });
}

function performSearch(query) {
    console.log('Searching for:', query);
    // Close search modal
    const searchModal = bootstrap.Modal.getInstance(document.getElementById('searchModal'));
    if (searchModal) searchModal.hide();
    
    // Redirect to products page with search query
    window.location.href = `pages/perfumes.html?search=${encodeURIComponent(query)}`;
}

// =====================================================
// BACK TO TOP
// =====================================================
function initializeBackToTop() {
    const backToTopBtn = document.getElementById('backToTop');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });
        
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// =====================================================
// ANIMATIONS
// =====================================================
function initializeAnimations() {
    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, observerOptions);
    
    // Observe elements with animation classes
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in').forEach(el => {
        observer.observe(el);
    });
    
    // Counter animation
    animateCounters();
}

function animateCounters() {
    const counters = document.querySelectorAll('.hero-content .h3');
    
    const animateCounter = (counter) => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                counter.textContent = counter.textContent.replace(/\d+/, target);
                clearInterval(timer);
            } else {
                const value = Math.floor(current);
                counter.textContent = counter.textContent.replace(/\d+/, value);
            }
        }, 16);
    };
    
    // Start animation when counters are visible
    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(() => animateCounter(entry.target), 500);
                counterObserver.unobserve(entry.target);
            }
        });
    });
    
    counters.forEach(counter => counterObserver.observe(counter));
}

// =====================================================
// PRODUCT FILTERS
// =====================================================
function initializeFilters() {
    const filterTabs = document.querySelectorAll('.perfume-filter-tabs .nav-link');
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Get filter value
            const filter = this.getAttribute('data-filter');
            filterProducts(filter);
        });
    });
}

function filterProducts(filter) {
    const products = document.querySelectorAll('[data-category]');
    
    products.forEach(product => {
        const productCategory = product.getAttribute('data-category');
        const shouldShow = filter === 'all' || productCategory === filter;
        
        if (shouldShow) {
            product.style.display = 'block';
            product.classList.add('fade-in');
        } else {
            product.style.display = 'none';
            product.classList.remove('fade-in');
        }
    });
    
    // Re-trigger AOS animations
    if (typeof AOS !== 'undefined') {
        AOS.refresh();
    }
}

// =====================================================
// FEATURED PRODUCTS
// =====================================================
function loadFeaturedProducts() {
    // Load products if products.js is available
    if (typeof obtenerProductos === 'function') {
        const productos = obtenerProductos();
        if (productos && productos.length > 0) {
            renderizarProductos(productos);
        }
    }
    updateWishlistButtons();
}

// =====================================================
// NOTIFICATIONS
// =====================================================
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} notification-toast position-fixed top-0 end-0 m-3`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-${getNotificationIcon(type)} me-2"></i>
            <span>${message}</span>
            <button type="button" class="btn-close ms-auto" onclick="this.parentElement.parentElement.remove()"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        if (notification.parentElement) {
            notification.remove();
        }
    }, 3000);
    
    // Add entrance animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
}

function getNotificationIcon(type) {
    const icons = {
        success: 'check-circle',
        error: 'exclamation-circle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// =====================================================
// NEWSLETTER
// =====================================================
function initializeNewsletter() {
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = this.querySelector('input[type="email"]').value;
            
            // Simulate API call
            setTimeout(() => {
                showNotification('¡Gracias por suscribirte! Recibirás nuestras mejores ofertas.', 'success');
                this.reset();
            }, 1000);
        });
    }
}

// =====================================================
// UTILITY FUNCTIONS
// =====================================================
function formatPrice(price) {
    return `$${price.toLocaleString('es-MX', { minimumFractionDigits: 2 })} MXN`;
}

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

// =====================================================
// ERROR HANDLING
// =====================================================
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send errors to a logging service
});

// =====================================================
// PERFORMANCE OPTIMIZATION
// =====================================================
// Lazy load images
function initializeLazyLoading() {
    if ('IntersectionObserver' in window) {
        const lazyImageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.classList.remove('lazy');
                    lazyImageObserver.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyImageObserver.observe(img);
        });
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', initializeLazyLoading);

// =====================================================
// CHECKOUT FUNCTIONALITY
// =====================================================
function proceedToCheckout() {
    if (cart.length === 0) {
        showNotification('Tu carrito está vacío', 'warning');
        return;
    }
    
    // Check if user is logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    if (!currentUser.email) {
        showNotification('Debes iniciar sesión para continuar con la compra', 'warning');
        // Show login modal or redirect to login
        setTimeout(() => {
            showLoginModal();
        }, 500);
        return;
    }
    
    // Close cart offcanvas
    const cartOffcanvas = bootstrap.Offcanvas.getInstance(document.getElementById('cartOffcanvas'));
    if (cartOffcanvas) cartOffcanvas.hide();
    
    // Redirect to checkout
    window.location.href = 'pages/checkout.html';
}

// =====================================================
// USER AUTHENTICATION
// =====================================================
function showLoginModal() {
    // Create login modal dynamically if it doesn't exist
    let loginModal = document.getElementById('loginModal');
    if (!loginModal) {
        const modalHtml = `
            <div class="modal fade" id="loginModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Iniciar Sesión</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="loginForm">
                                <div class="mb-3">
                                    <label for="loginEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="loginEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="loginPassword" class="form-label">Contraseña</label>
                                    <input type="password" class="form-control" id="loginPassword" required>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Iniciar Sesión</button>
                                </div>
                            </form>
                            <hr>
                            <p class="text-center mb-0">¿No tienes cuenta? <a href="#" onclick="showRegisterModal()">Regístrate aquí</a></p>
                            <div class="text-center mt-3">
                                <small class="text-muted">Demo: admin@test.com / admin123 (Admin)</small><br>
                                <small class="text-muted">usuario@test.com / user123 (Usuario)</small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add login form event listener
        document.getElementById('loginForm').addEventListener('submit', handleLogin);
    }
    
    const modal = new bootstrap.Modal(document.getElementById('loginModal'));
    modal.show();
}

function showRegisterModal() {
    // Close login modal if open
    const loginModal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
    if (loginModal) loginModal.hide();
    
    // Create register modal dynamically if it doesn't exist
    let registerModal = document.getElementById('registerModal');
    if (!registerModal) {
        const modalHtml = `
            <div class="modal fade" id="registerModal" tabindex="-1">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Crear Cuenta</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div class="modal-body">
                            <form id="registerForm">
                                <div class="row">
                                    <div class="col-md-6 mb-3">
                                        <label for="registerFirstName" class="form-label">Nombre</label>
                                        <input type="text" class="form-control" id="registerFirstName" required>
                                    </div>
                                    <div class="col-md-6 mb-3">
                                        <label for="registerLastName" class="form-label">Apellido</label>
                                        <input type="text" class="form-control" id="registerLastName" required>
                                    </div>
                                </div>
                                <div class="mb-3">
                                    <label for="registerEmail" class="form-label">Email</label>
                                    <input type="email" class="form-control" id="registerEmail" required>
                                </div>
                                <div class="mb-3">
                                    <label for="registerPassword" class="form-label">Contraseña</label>
                                    <input type="password" class="form-control" id="registerPassword" minlength="6" required>
                                </div>
                                <div class="mb-3">
                                    <label for="registerConfirmPassword" class="form-label">Confirmar Contraseña</label>
                                    <input type="password" class="form-control" id="registerConfirmPassword" required>
                                </div>
                                <div class="d-grid">
                                    <button type="submit" class="btn btn-primary">Crear Cuenta</button>
                                </div>
                            </form>
                            <hr>
                            <p class="text-center mb-0">¿Ya tienes cuenta? <a href="#" onclick="showLoginModal()">Inicia sesión aquí</a></p>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', modalHtml);
        
        // Add register form event listener
        document.getElementById('registerForm').addEventListener('submit', handleRegister);
    }
    
    const modal = new bootstrap.Modal(document.getElementById('registerModal'));
    modal.show();
}

function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    // Demo users
    const users = [
        { email: 'admin@test.com', password: 'admin123', role: 'admin', firstName: 'Admin', lastName: 'User' },
        { email: 'usuario@test.com', password: 'user123', role: 'user', firstName: 'Usuario', lastName: 'Demo' }
    ];
    
    // Check stored users
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const allUsers = [...users, ...storedUsers];
    
    const user = allUsers.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Store current user
        localStorage.setItem('currentUser', JSON.stringify(user));
        
        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('loginModal'));
        modal.hide();
        
        showNotification(`¡Bienvenido ${user.firstName}!`, 'success');
        
        // Update UI - now handled by authSystem
        // updateUserUI();
        
        // If user is admin, show admin options
        if (user.role === 'admin') {
            setTimeout(() => {
                if (confirm('¿Deseas ir al panel de administración?')) {
                    window.location.href = 'admin/dashboard.html';
                }
            }, 1000);
        }
    } else {
        showNotification('Credenciales incorrectas', 'error');
    }
}

function handleRegister(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('registerFirstName').value;
    const lastName = document.getElementById('registerLastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('registerConfirmPassword').value;
    
    if (password !== confirmPassword) {
        showNotification('Las contraseñas no coinciden', 'error');
        return;
    }
    
    // Check if user already exists
    const storedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (storedUsers.find(u => u.email === email)) {
        showNotification('El email ya está registrado', 'error');
        return;
    }
    
    // Create new user
    const newUser = {
        email,
        password,
        firstName,
        lastName,
        role: 'user',
        registeredAt: new Date().toISOString()
    };
    
    // Save user
    storedUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(storedUsers));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    
    // Close modal
    const modal = bootstrap.Modal.getInstance(document.getElementById('registerModal'));
    modal.hide();
    
    showNotification(`¡Cuenta creada exitosamente! Bienvenido ${firstName}`, 'success');
    // updateUserUI(); // now handled by authSystem
}

// OLD updateUserUI function - DISABLED - Now using authSystem.updateUserUI()
/*
function updateUserUI() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    
    // Update navigation if user menu exists
    const userMenu = document.querySelector('.user-menu');
    if (userMenu) {
        if (currentUser.email) {
            userMenu.innerHTML = `
                <div class="dropdown">
                    <a class="nav-link dropdown-toggle" href="#" role="button" data-bs-toggle="dropdown">
                        <i class="fas fa-user me-1"></i>${currentUser.firstName}
                    </a>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="#"><i class="fas fa-user me-2"></i>Mi Perfil</a></li>
                        <li><a class="dropdown-item" href="#"><i class="fas fa-box me-2"></i>Mis Pedidos</a></li>
                        ${currentUser.role === 'admin' ? '<li><a class="dropdown-item" href="admin/dashboard.html"><i class="fas fa-cog me-2"></i>Admin Panel</a></li>' : ''}
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="logout()"><i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión</a></li>
                    </ul>
                </div>
            `;
        } else {
            userMenu.innerHTML = `
                <a class="nav-link" href="#" onclick="showLoginModal()">
                    <i class="fas fa-user me-1"></i>Iniciar Sesión
                </a>
            `;
        }
    }
}
*/

function logout() {
    // Use new auth system if available
    if (typeof authSystem !== 'undefined') {
        authSystem.logout();
    } else {
        // Fallback to old method
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
    }
    
    showNotification('Sesión cerrada correctamente', 'info');
    // updateUserUI(); // now handled by authSystem
    
    // Redirect if on admin page
    if (window.location.pathname.includes('admin')) {
        window.location.href = '../index.html';
    }
}

// =====================================================
// EXPORT FUNCTIONS FOR GLOBAL USE
// =====================================================
window.ElitePerfumeria = {
    addToCart,
    removeFromCart,
    updateCartQuantity,
    toggleWishlist,
    showNotification,
    formatPrice,
    performSearch,
    proceedToCheckout,
    showLoginModal,
    showRegisterModal,
    logout
};

// Make functions globally available
window.proceedToCheckout = proceedToCheckout;
window.showLoginModal = showLoginModal;
window.showRegisterModal = showRegisterModal;
window.logout = logout;

console.log('🚀 Élite Perfumería JavaScript loaded successfully!');
// Authentication and User Management System
class AuthSystem {
    constructor() {
        this.currentUser = null;
        this.init();
    }

    init() {
        this.loadCurrentUser();
        this.updateUserUI();
    }

    // Load current user from storage
    loadCurrentUser() {
        const userData = localStorage.getItem('currentUser') || sessionStorage.getItem('currentUser');
        if (userData) {
            try {
                this.currentUser = JSON.parse(userData);
                console.log('Loaded user from storage:', this.currentUser);
                
                // Validate user data
                if (!this.currentUser.nombre || !this.currentUser.email) {
                    console.warn('Invalid user data found, cleaning up');
                    this.logout();
                }
            } catch (error) {
                console.error('Error parsing user data:', error);
                this.logout();
            }
        }
    }

    // Check if user is logged in
    isLoggedIn() {
        return this.currentUser !== null && this.currentUser.email;
    }

    // Check if user is admin
    isAdmin() {
        return this.isLoggedIn() && this.currentUser.role === 'admin';
    }

    // Get current user
    getCurrentUser() {
        return this.currentUser;
    }

    // Get correct path based on current location
    getCorrectPath(relativePath) {
        const currentPath = window.location.pathname;
        
        // If we're in admin folder, need to go up one level
        if (currentPath.includes('/admin/')) {
            return '../' + relativePath;
        }
        
        // If we're in pages folder, need to go up one level  
        if (currentPath.includes('/pages/')) {
            return '../' + relativePath;
        }
        
        // If we're in root, use relative path as is
        return relativePath;
    }

    // Login user
    login(userData, rememberMe = false) {
        // Add login time and ensure complete user data
        this.currentUser = {
            ...userData,
            loginTime: new Date().toISOString(),
            // Ensure these fields exist
            nombre: userData.nombre || 'Usuario',
            apellido: userData.apellido || ''
        };
        
        const storage = rememberMe ? localStorage : sessionStorage;
        storage.setItem('currentUser', JSON.stringify(this.currentUser));
        
        this.updateUserUI();
        
        // Dispatch login event
        window.dispatchEvent(new CustomEvent('userLoggedIn', {
            detail: { user: this.currentUser }
        }));
        
        return true;
    }

    // Logout user
    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        
        this.updateUserUI();
        
        // Dispatch logout event
        window.dispatchEvent(new CustomEvent('userLoggedOut'));
        
        return true;
    }

    // Register new user
    async register(userData) {
        try {
            // Validate user data
            if (!this.validateUserData(userData)) {
                throw new Error('Datos de usuario inválidos');
            }

            // Check if user already exists
            const existingUsers = this.getStoredUsers();
            if (existingUsers.find(user => user.email === userData.email)) {
                throw new Error('El email ya está registrado');
            }

            // Create user object
            const newUser = {
                id: Date.now(),
                nombre: userData.nombre,
                apellido: userData.apellido,
                email: userData.email,
                password: userData.password, // In production, this should be hashed
                telefono: userData.telefono || '',
                direccion: userData.direccion || '',
                ciudad: userData.ciudad || '',
                codigo_postal: userData.codigo_postal || '',
                pais: userData.pais || 'México',
                fecha_registro: new Date().toISOString(),
                activo: true,
                role: 'customer' // Default role
            };

            // Save user
            existingUsers.push(newUser);
            localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));

            return { success: true, user: newUser };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }

    // Validate user data
    validateUserData(userData) {
        const required = ['nombre', 'apellido', 'email', 'password'];
        
        for (let field of required) {
            if (!userData[field] || userData[field].trim() === '') {
                return false;
            }
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userData.email)) {
            return false;
        }

        // Validate password length
        if (userData.password.length < 6) {
            return false;
        }

        return true;
    }

    // Get stored users
    getStoredUsers() {
        const users = localStorage.getItem('registeredUsers');
        return users ? JSON.parse(users) : [];
    }

    // Authenticate user
    authenticate(email, password) {
        // Check default admin account
        if (email === 'admin@eliteperfumeria.com' && password === 'admin123') {
            return {
                success: true,
                user: {
                    id: 1,
                    nombre: 'Administrador',
                    apellido: 'Sistema',
                    email: email,
                    role: 'admin',
                    fecha_registro: new Date().toISOString()
                }
            };
        }

        // Check default customer account
        if (email === 'cliente@email.com' && password === 'cliente123') {
            return {
                success: true,
                user: {
                    id: 2,
                    nombre: 'Cliente',
                    apellido: 'Prueba',
                    email: email,
                    role: 'customer',
                    fecha_registro: new Date().toISOString()
                }
            };
        }

        // Check registered users
        const users = this.getStoredUsers();
        const user = users.find(u => u.email === email && u.password === password && u.activo);

        if (user) {
            return {
                success: true,
                user: user
            };
        }

        return {
            success: false,
            error: 'Credenciales incorrectas'
        };
    }

    // Update user interface
    updateUserUI() {
        const userMenus = document.querySelectorAll('.user-menu');
        const userNameElements = document.querySelectorAll('[data-user-name]');
        const adminElements = document.querySelectorAll('[data-admin-only]');
        
        if (this.isLoggedIn()) {
            // Debug: console.log('Current user data:', this.currentUser);
            const nombre = this.currentUser.nombre || 'Usuario';
            const apellido = this.currentUser.apellido || '';
            const fullName = `${nombre} ${apellido}`.trim();
            
            // Update user menus
            userMenus.forEach(menu => {
                menu.innerHTML = `
                    <div class="dropdown">
                        <a class="nav-link dropdown-toggle d-flex align-items-center" href="#" 
                           data-bs-toggle="dropdown" aria-expanded="false">
                            <i class="fas fa-user-circle me-2"></i>
                            <span class="d-none d-md-inline">${fullName}</span>
                        </a>
                        <ul class="dropdown-menu dropdown-menu-end">
                            <li><h6 class="dropdown-header">${fullName}</h6></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item" href="${this.getCorrectPath('pages/profile.html')}">
                                <i class="fas fa-user me-2"></i>Mi Perfil
                            </a></li>
                            <li><a class="dropdown-item" href="${this.getCorrectPath('pages/orders.html')}">
                                <i class="fas fa-shopping-bag me-2"></i>Mis Pedidos
                            </a></li>
                            ${this.isAdmin() ? `
                                <li><hr class="dropdown-divider"></li>
                                <li><a class="dropdown-item" href="${this.getCorrectPath('admin/dashboard.html')}">
                                    <i class="fas fa-cogs me-2"></i>Panel Admin
                                </a></li>
                            ` : ''}
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#" onclick="authSystem.logout(); window.location.reload();">
                                <i class="fas fa-sign-out-alt me-2"></i>Cerrar Sesión
                            </a></li>
                        </ul>
                    </div>
                `;
            });

            // Update user name elements
            userNameElements.forEach(element => {
                element.textContent = fullName;
            });

            // Show/hide admin elements
            adminElements.forEach(element => {
                element.style.display = this.isAdmin() ? 'block' : 'none';
            });

        } else {
            // User not logged in
            userMenus.forEach(menu => {
                menu.innerHTML = `
                    <a class="nav-link" href="${this.getCorrectPath('pages/login.html')}">
                        <i class="fas fa-user me-1"></i>Iniciar Sesión
                    </a>
                `;
            });

            // Hide admin elements
            adminElements.forEach(element => {
                element.style.display = 'none';
            });
        }
    }

    // Require authentication
    requireAuth(redirectUrl = '../pages/login.html') {
        if (!this.isLoggedIn()) {
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Require admin access
    requireAdmin(redirectUrl = '../pages/login.html') {
        if (!this.isAdmin()) {
            alert('Acceso denegado. Se requieren permisos de administrador.');
            window.location.href = redirectUrl;
            return false;
        }
        return true;
    }

    // Get user cart
    getUserCart() {
        if (!this.isLoggedIn()) return [];
        
        const cartKey = `cart_${this.currentUser.id}`;
        const cart = localStorage.getItem(cartKey);
        return cart ? JSON.parse(cart) : [];
    }

    // Save user cart
    saveUserCart(cartItems) {
        if (!this.isLoggedIn()) return;
        
        const cartKey = `cart_${this.currentUser.id}`;
        localStorage.setItem(cartKey, JSON.stringify(cartItems));
    }

    // Update user profile
    async updateProfile(profileData) {
        if (!this.isLoggedIn()) {
            throw new Error('Usuario no autenticado');
        }

        try {
            // Update current user
            Object.assign(this.currentUser, profileData);

            // Update in storage
            const storage = localStorage.getItem('currentUser') ? localStorage : sessionStorage;
            storage.setItem('currentUser', JSON.stringify(this.currentUser));

            // Update in registered users if not admin
            if (!this.isAdmin()) {
                const users = this.getStoredUsers();
                const userIndex = users.findIndex(u => u.id === this.currentUser.id);
                if (userIndex !== -1) {
                    users[userIndex] = { ...users[userIndex], ...profileData };
                    localStorage.setItem('registeredUsers', JSON.stringify(users));
                }
            }

            this.updateUserUI();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
}

// Create global auth system instance
const authSystem = new AuthSystem();

// Global functions for backward compatibility
function getCurrentUser() {
    return authSystem.getCurrentUser();
}

function isUserLoggedIn() {
    return authSystem.isLoggedIn();
}

function isUserAdmin() {
    return authSystem.isAdmin();
}

function logoutUser() {
    return authSystem.logout();
}

function updateUserUI() {
    return authSystem.updateUserUI();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    console.log('AuthSystem initializing...', authSystem);
    
    // Give a small delay to ensure DOM is fully ready
    setTimeout(() => {
        authSystem.updateUserUI();
        
        // Debug: Check if user is already logged in
        if (authSystem.isLoggedIn()) {
            console.log('User already logged in:', authSystem.getCurrentUser());
        } else {
            console.log('No user logged in');
        }
    }, 100);
});

// Also update UI when the window loads (backup)
window.addEventListener('load', function() {
    if (typeof authSystem !== 'undefined') {
        console.log('Window loaded - updating UI');
        authSystem.updateUserUI();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthSystem, authSystem };
}
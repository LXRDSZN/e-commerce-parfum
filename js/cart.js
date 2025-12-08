// =====================================================
// SHOPPING CART FUNCTIONALITY
// Complete cart management with payment and checkout
// =====================================================

class ShoppingCart {
    constructor() {
        this.items = this.loadFromStorage();
        this.discountCode = null;
        this.discountAmount = 0;
        this.shipping = 0;
        this.tax = 0.16; // 16% IVA
        this.init();
    }

    init() {
        this.updateCartUI();
        this.bindEvents();
    }

    // Load cart from localStorage
    loadFromStorage() {
        const saved = localStorage.getItem('perfume_cart');
        return saved ? JSON.parse(saved) : [];
    }

    // Save cart to localStorage
    saveToStorage() {
        localStorage.setItem('perfume_cart', JSON.stringify(this.items));
    }

    // Add item to cart
    addItem(productId, quantity = 1) {
        return fetch('js/perfumes.json')
            .then(response => response.json())
            .then(data => {
                const product = data.perfumes.find(p => p.id === productId);
                if (!product) {
                    throw new Error('Producto no encontrado');
                }

                const existingItem = this.items.find(item => item.id === productId);
                
                if (existingItem) {
                    existingItem.quantity += quantity;
                } else {
                    this.items.push({
                        id: product.id,
                        name: product.name,
                        brand: product.brand,
                        price: product.price,
                        ml: product.ml,
                        image: product.image,
                        quantity: quantity
                    });
                }
                
                this.saveToStorage();
                this.updateCartUI();
                this.showNotification(`${product.name} agregado al carrito`, 'success');
                return true;
            })
            .catch(error => {
                console.error('Error adding to cart:', error);
                this.showNotification('Error al agregar producto al carrito', 'error');
                return false;
            });
    }

    // Remove item from cart
    removeItem(productId) {
        const itemIndex = this.items.findIndex(item => item.id === productId);
        if (itemIndex > -1) {
            const item = this.items[itemIndex];
            this.items.splice(itemIndex, 1);
            this.saveToStorage();
            this.updateCartUI();
            this.showNotification(`${item.name} eliminado del carrito`, 'info');
        }
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            if (quantity <= 0) {
                this.removeItem(productId);
            } else {
                item.quantity = quantity;
                this.saveToStorage();
                this.updateCartUI();
            }
        }
    }

    // Clear entire cart
    clearCart() {
        this.items = [];
        this.discountCode = null;
        this.discountAmount = 0;
        this.saveToStorage();
        this.updateCartUI();
        this.showNotification('Carrito vaciado', 'info');
    }

    // Calculate totals
    calculateTotals() {
        const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        const discount = this.discountAmount;
        const subtotalAfterDiscount = subtotal - discount;
        const taxes = subtotalAfterDiscount * this.tax;
        const total = subtotalAfterDiscount + taxes + this.shipping;

        return {
            subtotal: subtotal,
            discount: discount,
            subtotalAfterDiscount: subtotalAfterDiscount,
            taxes: taxes,
            shipping: this.shipping,
            total: total,
            itemCount: this.items.reduce((sum, item) => sum + item.quantity, 0)
        };
    }

    // Apply discount code
    applyDiscount(code) {
        const discountCodes = {
            'PERFUME10': 0.10,
            'DESCUENTO15': 0.15,
            'NEWCLIENT': 0.20,
            'CHANEL25': 0.25,
            'DIOR20': 0.20
        };

        if (discountCodes[code.toUpperCase()]) {
            this.discountCode = code.toUpperCase();
            const subtotal = this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            this.discountAmount = subtotal * discountCodes[code.toUpperCase()];
            this.updateCartUI();
            this.showNotification(`Cupón aplicado: ${Math.round(discountCodes[code.toUpperCase()] * 100)}% de descuento`, 'success');
            return true;
        } else {
            this.showNotification('Código de descuento inválido', 'error');
            return false;
        }
    }

    // Remove discount
    removeDiscount() {
        this.discountCode = null;
        this.discountAmount = 0;
        this.updateCartUI();
        this.showNotification('Descuento removido', 'info');
    }

    // Update cart UI
    updateCartUI() {
        const totals = this.calculateTotals();

        // Update cart badge
        const cartBadges = document.querySelectorAll('.cart-count, .cart-badge');
        cartBadges.forEach(badge => {
            badge.textContent = totals.itemCount;
            badge.style.display = totals.itemCount > 0 ? 'inline' : 'none';
        });

        // Update cart dropdown/sidebar
        this.updateCartDropdown();

        // Update cart page if exists
        this.updateCartPage();

        // Update checkout page if exists
        this.updateCheckoutPage();
    }

    // Update cart dropdown/sidebar
    updateCartDropdown() {
        const cartItems = document.getElementById('cart-items');
        const cartTotal = document.getElementById('cart-total');

        if (cartItems) {
            if (this.items.length === 0) {
                cartItems.innerHTML = '<p class="text-center text-muted">Tu carrito está vacío</p>';
            } else {
                cartItems.innerHTML = this.items.map(item => `
                    <div class="cart-item d-flex align-items-center mb-3">
                        <img src="${item.image}" alt="${item.name}" class="cart-item-image me-3" style="width: 50px; height: 50px; object-fit: cover;">
                        <div class="flex-grow-1">
                            <h6 class="mb-0">${item.name}</h6>
                            <small class="text-muted">${item.brand} - ${item.ml}ml</small>
                            <div class="d-flex justify-content-between align-items-center mt-1">
                                <div class="quantity-controls">
                                    <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                    <span class="mx-2">${item.quantity}</span>
                                    <button class="btn btn-sm btn-outline-secondary" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                </div>
                                <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                            </div>
                        </div>
                        <button class="btn btn-sm btn-danger" onclick="cart.removeItem(${item.id})">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                `).join('');
            }
        }

        if (cartTotal) {
            const totals = this.calculateTotals();
            cartTotal.innerHTML = `$${totals.total.toFixed(2)}`;
        }
    }

    // Update cart page
    updateCartPage() {
        const cartContainer = document.getElementById('cart-container');
        if (!cartContainer) return;

        const totals = this.calculateTotals();

        if (this.items.length === 0) {
            cartContainer.innerHTML = `
                <div class="text-center py-5">
                    <i class="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                    <h4>Tu carrito está vacío</h4>
                    <p class="text-muted">Agrega algunos perfumes para comenzar tu compra</p>
                    <a href="pages/perfumes.html" class="btn btn-primary">Explorar Perfumes</a>
                </div>
            `;
            return;
        }

        cartContainer.innerHTML = `
            <div class="row">
                <div class="col-lg-8">
                    <div class="cart-items">
                        ${this.items.map(item => `
                            <div class="cart-item-row border-bottom py-3">
                                <div class="row align-items-center">
                                    <div class="col-md-2">
                                        <img src="${item.image}" alt="${item.name}" class="img-fluid rounded">
                                    </div>
                                    <div class="col-md-4">
                                        <h6 class="mb-1">${item.name}</h6>
                                        <p class="text-muted mb-0">${item.brand} - ${item.ml}ml</p>
                                    </div>
                                    <div class="col-md-2">
                                        <div class="input-group">
                                            <button class="btn btn-outline-secondary btn-sm" onclick="cart.updateQuantity(${item.id}, ${item.quantity - 1})">-</button>
                                            <input type="number" class="form-control text-center" value="${item.quantity}" min="1" onchange="cart.updateQuantity(${item.id}, this.value)">
                                            <button class="btn btn-outline-secondary btn-sm" onclick="cart.updateQuantity(${item.id}, ${item.quantity + 1})">+</button>
                                        </div>
                                    </div>
                                    <div class="col-md-2 text-center">
                                        <strong>$${item.price.toFixed(2)}</strong>
                                    </div>
                                    <div class="col-md-2 text-center">
                                        <strong>$${(item.price * item.quantity).toFixed(2)}</strong>
                                        <br>
                                        <button class="btn btn-sm btn-outline-danger mt-1" onclick="cart.removeItem(${item.id})">
                                            <i class="fas fa-trash"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
                <div class="col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <h5 class="card-title">Resumen del Pedido</h5>
                            
                            <!-- Discount Code -->
                            <div class="mb-3">
                                <label for="discountCode" class="form-label">Código de Descuento</label>
                                <div class="input-group">
                                    <input type="text" class="form-control" id="discountCode" placeholder="Ingresa tu código">
                                    <button class="btn btn-outline-secondary" onclick="cart.applyDiscountFromInput()">Aplicar</button>
                                </div>
                                ${this.discountCode ? `<small class="text-success">Código aplicado: ${this.discountCode}</small>` : ''}
                            </div>
                            
                            <hr>
                            
                            <!-- Totals -->
                            <div class="d-flex justify-content-between mb-2">
                                <span>Subtotal:</span>
                                <span>$${totals.subtotal.toFixed(2)}</span>
                            </div>
                            ${totals.discount > 0 ? `
                            <div class="d-flex justify-content-between mb-2 text-success">
                                <span>Descuento:</span>
                                <span>-$${totals.discount.toFixed(2)}</span>
                            </div>
                            ` : ''}
                            <div class="d-flex justify-content-between mb-2">
                                <span>IVA (16%):</span>
                                <span>$${totals.taxes.toFixed(2)}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2">
                                <span>Envío:</span>
                                <span>${totals.shipping === 0 ? 'Gratis' : '$' + totals.shipping.toFixed(2)}</span>
                            </div>
                            <hr>
                            <div class="d-flex justify-content-between h5">
                                <span>Total:</span>
                                <span>$${totals.total.toFixed(2)}</span>
                            </div>
                            
                            <button class="btn btn-primary w-100 mb-2" onclick="cart.proceedToCheckout()">
                                Proceder al Checkout
                            </button>
                            <button class="btn btn-outline-danger w-100" onclick="cart.clearCart()">
                                Vaciar Carrito
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // Update checkout page
    updateCheckoutPage() {
        const orderSummary = document.getElementById('order-summary');
        if (!orderSummary) return;

        const totals = this.calculateTotals();

        orderSummary.innerHTML = `
            <h5>Resumen del Pedido</h5>
            <hr>
            ${this.items.map(item => `
                <div class="d-flex justify-content-between mb-2">
                    <span>${item.name} x${item.quantity}</span>
                    <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
            `).join('')}
            <hr>
            <div class="d-flex justify-content-between mb-2">
                <span>Subtotal:</span>
                <span>$${totals.subtotal.toFixed(2)}</span>
            </div>
            ${totals.discount > 0 ? `
            <div class="d-flex justify-content-between mb-2 text-success">
                <span>Descuento:</span>
                <span>-$${totals.discount.toFixed(2)}</span>
            </div>
            ` : ''}
            <div class="d-flex justify-content-between mb-2">
                <span>IVA (16%):</span>
                <span>$${totals.taxes.toFixed(2)}</span>
            </div>
            <div class="d-flex justify-content-between mb-2">
                <span>Envío:</span>
                <span>${totals.shipping === 0 ? 'Gratis' : '$' + totals.shipping.toFixed(2)}</span>
            </div>
            <hr>
            <div class="d-flex justify-content-between h5">
                <span><strong>Total:</strong></span>
                <span><strong>$${totals.total.toFixed(2)}</strong></span>
            </div>
        `;
    }

    // Apply discount from input
    applyDiscountFromInput() {
        const input = document.getElementById('discountCode');
        if (input && input.value.trim()) {
            this.applyDiscount(input.value.trim());
            if (this.discountCode) {
                input.value = '';
            }
        }
    }

    // Proceed to checkout
    proceedToCheckout() {
        if (this.items.length === 0) {
            this.showNotification('Tu carrito está vacío', 'error');
            return;
        }
        window.location.href = 'pages/checkout.html';
    }

    // Process payment
    processPayment(paymentData) {
        return new Promise((resolve, reject) => {
            // Simulate payment processing
            setTimeout(() => {
                if (Math.random() > 0.1) { // 90% success rate
                    const orderId = 'ORD' + Date.now();
                    const order = {
                        id: orderId,
                        items: [...this.items],
                        totals: this.calculateTotals(),
                        paymentMethod: paymentData.method,
                        date: new Date(),
                        status: 'confirmed'
                    };
                    
                    // Save order
                    this.saveOrder(order);
                    
                    // Clear cart
                    this.clearCart();
                    
                    resolve(order);
                } else {
                    reject(new Error('Error en el procesamiento del pago. Intenta nuevamente.'));
                }
            }, 2000);
        });
    }

    // Save order
    saveOrder(order) {
        const orders = JSON.parse(localStorage.getItem('orders') || '[]');
        orders.push(order);
        localStorage.setItem('orders', JSON.stringify(orders));
    }

    // Generate receipt
    generateReceipt(order) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Recibo - ${order.id}</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; margin-bottom: 30px; }
                .order-info { margin-bottom: 20px; }
                .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
                .items-table th, .items-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                .items-table th { background-color: #f2f2f2; }
                .totals { margin-left: auto; width: 300px; }
                .footer { text-align: center; margin-top: 30px; color: #666; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>🌸 Perfumería Elegante</h1>
                <h2>Recibo de Compra</h2>
            </div>
            
            <div class="order-info">
                <p><strong>Número de Orden:</strong> ${order.id}</p>
                <p><strong>Fecha:</strong> ${order.date.toLocaleDateString('es-MX')}</p>
                <p><strong>Método de Pago:</strong> ${order.paymentMethod}</p>
                <p><strong>Estado:</strong> ${order.status}</p>
            </div>
            
            <table class="items-table">
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Marca</th>
                        <th>Cantidad</th>
                        <th>Precio Unit.</th>
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${order.items.map(item => `
                        <tr>
                            <td>${item.name}</td>
                            <td>${item.brand}</td>
                            <td>${item.quantity}</td>
                            <td>$${item.price.toFixed(2)}</td>
                            <td>$${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            
            <div class="totals">
                <p><strong>Subtotal:</strong> $${order.totals.subtotal.toFixed(2)}</p>
                ${order.totals.discount > 0 ? `<p><strong>Descuento:</strong> -$${order.totals.discount.toFixed(2)}</p>` : ''}
                <p><strong>IVA (16%):</strong> $${order.totals.taxes.toFixed(2)}</p>
                <p><strong>Envío:</strong> ${order.totals.shipping === 0 ? 'Gratis' : '$' + order.totals.shipping.toFixed(2)}</p>
                <hr>
                <p><strong>Total:</strong> $${order.totals.total.toFixed(2)}</p>
            </div>
            
            <div class="footer">
                <p>¡Gracias por tu compra!</p>
                <p>Para cualquier consulta, contacta nuestro servicio al cliente</p>
            </div>
        </body>
        </html>
        `;
    }

    // Download receipt as PDF (simulation)
    downloadReceipt(order) {
        const receiptHTML = this.generateReceipt(order);
        const blob = new Blob([receiptHTML], { type: 'text/html' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `recibo-${order.id}.html`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }

    // Bind events
    bindEvents() {
        // Listen for storage changes (for multiple tabs)
        window.addEventListener('storage', (e) => {
            if (e.key === 'perfume_cart') {
                this.items = this.loadFromStorage();
                this.updateCartUI();
            }
        });
    }

    // Show notification
    showNotification(message, type = 'info') {
        // Remove existing notifications
        const existing = document.querySelectorAll('.cart-notification');
        existing.forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `alert alert-${type === 'error' ? 'danger' : type === 'success' ? 'success' : 'info'} cart-notification`;
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
}

// Initialize cart
const cart = new ShoppingCart();

// Global function to add to cart (for product buttons)
function addToCart(productId, quantity = 1) {
    cart.addItem(productId, quantity);
}

// Global function for quick add to cart with animation
function quickAddToCart(productId, buttonElement) {
    const originalText = buttonElement.innerHTML;
    buttonElement.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Agregando...';
    buttonElement.disabled = true;
    
    cart.addItem(productId).then(success => {
        if (success) {
            buttonElement.innerHTML = '<i class="fas fa-check"></i> ¡Agregado!';
            buttonElement.classList.add('btn-success');
        } else {
            buttonElement.innerHTML = originalText;
        }
        
        setTimeout(() => {
            buttonElement.innerHTML = originalText;
            buttonElement.classList.remove('btn-success');
            buttonElement.disabled = false;
        }, 2000);
    });
}

console.log('🛒 Shopping cart functionality loaded successfully!');
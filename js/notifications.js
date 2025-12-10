// =====================================================
// NOTIFICATION SYSTEM
// Toast notifications and alerts for user feedback
// =====================================================

class NotificationSystem {
    constructor() {
        this.init();
    }

    init() {
        // Create notification container if it doesn't exist
        if (!document.getElementById('notification-container')) {
            const container = document.createElement('div');
            container.id = 'notification-container';
            container.className = 'notification-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                max-width: 350px;
            `;
            document.body.appendChild(container);
        }
    }

    // Show toast notification
    show(message, type = 'info', duration = 5000, options = {}) {
        const notification = this.createNotification(message, type, options);
        const container = document.getElementById('notification-container');
        container.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.add('show');
        }, 100);

        // Auto remove if duration is set
        if (duration > 0) {
            setTimeout(() => {
                this.remove(notification);
            }, duration);
        }

        return notification;
    }

    // Create notification element
    createNotification(message, type, options = {}) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade notification-item`;
        notification.setAttribute('role', 'alert');
        
        const icon = this.getIcon(type);
        const title = options.title ? `<strong>${options.title}</strong><br>` : '';
        
        notification.innerHTML = `
            <div class="d-flex align-items-start">
                <i class="${icon} me-2 mt-1"></i>
                <div class="flex-grow-1">
                    ${title}${message}
                </div>
                ${!options.persistent ? '<button type="button" class="btn-close" aria-label="Close"></button>' : ''}
            </div>
        `;

        // Add close event listener
        const closeBtn = notification.querySelector('.btn-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.remove(notification);
            });
        }

        // Add custom styles
        notification.style.cssText = `
            margin-bottom: 10px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: none;
            border-left: 4px solid ${this.getBorderColor(type)};
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;

        return notification;
    }

    // Get icon for notification type
    getIcon(type) {
        const icons = {
            'success': 'fas fa-check-circle',
            'danger': 'fas fa-exclamation-circle',
            'warning': 'fas fa-exclamation-triangle',
            'info': 'fas fa-info-circle',
            'primary': 'fas fa-bell'
        };
        return icons[type] || icons['info'];
    }

    // Get border color for notification type
    getBorderColor(type) {
        const colors = {
            'success': '#28a745',
            'danger': '#dc3545',
            'warning': '#ffc107',
            'info': '#17a2b8',
            'primary': '#007bff'
        };
        return colors[type] || colors['info'];
    }

    // Remove notification
    remove(notification) {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100%)';
        
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    // Success notification
    success(message, options = {}) {
        return this.show(message, 'success', 5000, options);
    }

    // Error notification
    error(message, options = {}) {
        return this.show(message, 'danger', 7000, options);
    }

    // Warning notification
    warning(message, options = {}) {
        return this.show(message, 'warning', 6000, options);
    }

    // Info notification
    info(message, options = {}) {
        return this.show(message, 'info', 5000, options);
    }

    // Cart notification (special style for cart actions)
    cart(action, productName, options = {}) {
        const messages = {
            'added': `<strong>${productName}</strong> agregado al carrito`,
            'removed': `<strong>${productName}</strong> eliminado del carrito`,
            'updated': `Cantidad actualizada para <strong>${productName}</strong>`,
            'cleared': 'Carrito vaciado'
        };
        
        return this.success(messages[action] || action, {
            title: '🛒 Carrito',
            ...options
        });
    }

    // User action notification
    user(action, options = {}) {
        const messages = {
            'login': '¡Bienvenido de vuelta!',
            'logout': 'Sesión cerrada exitosamente',
            'register': '¡Cuenta creada exitosamente!',
            'profile_updated': 'Perfil actualizado correctamente',
            'password_changed': 'Contraseña cambiada exitosamente'
        };

        return this.success(messages[action] || action, {
            title: '👤 Usuario',
            ...options
        });
    }

    // Order notification
    order(action, orderNumber = '', options = {}) {
        const messages = {
            'placed': `Pedido ${orderNumber} realizado exitosamente`,
            'confirmed': `Pedido ${orderNumber} confirmado`,
            'shipped': `Pedido ${orderNumber} enviado`,
            'delivered': `Pedido ${orderNumber} entregado`,
            'cancelled': `Pedido ${orderNumber} cancelado`
        };

        const type = action === 'cancelled' ? 'warning' : 'success';
        
        return this.show(messages[action] || action, type, 7000, {
            title: '📦 Pedido',
            ...options
        });
    }

    // System notification
    system(message, type = 'info', options = {}) {
        return this.show(message, type, 0, {
            title: '⚙️ Sistema',
            persistent: true,
            ...options
        });
    }

    // Loading notification
    loading(message = 'Cargando...') {
        const notification = this.show(message, 'info', 0, {
            title: '⏳ Procesando',
            persistent: true
        });
        
        // Add spinner
        const icon = notification.querySelector('i');
        if (icon) {
            icon.className = 'fas fa-spinner fa-spin me-2 mt-1';
        }

        return notification;
    }

    // Clear all notifications
    clearAll() {
        const container = document.getElementById('notification-container');
        const notifications = container.querySelectorAll('.notification-item');
        
        notifications.forEach(notification => {
            this.remove(notification);
        });
    }

    // Show confirmation dialog
    async confirm(message, title = 'Confirmar', options = {}) {
        return new Promise((resolve) => {
            // Create modal backdrop
            const backdrop = document.createElement('div');
            backdrop.className = 'modal-backdrop fade show';
            backdrop.style.zIndex = '10000';
            document.body.appendChild(backdrop);

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'modal fade show';
            modal.style.display = 'block';
            modal.style.zIndex = '10001';
            modal.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">${title}</h5>
                        </div>
                        <div class="modal-body">
                            <p>${message}</p>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-action="cancel">
                                ${options.cancelText || 'Cancelar'}
                            </button>
                            <button type="button" class="btn btn-${options.confirmType || 'primary'}" data-action="confirm">
                                ${options.confirmText || 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);

            // Handle button clicks
            modal.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                if (action) {
                    const result = action === 'confirm';
                    
                    // Remove modal
                    document.body.removeChild(modal);
                    document.body.removeChild(backdrop);
                    
                    resolve(result);
                }
            });

            // Handle escape key
            const handleEscape = (e) => {
                if (e.key === 'Escape') {
                    document.body.removeChild(modal);
                    document.body.removeChild(backdrop);
                    document.removeEventListener('keydown', handleEscape);
                    resolve(false);
                }
            };
            
            document.addEventListener('keydown', handleEscape);
        });
    }
}

// Create global notification system instance
const notifications = new NotificationSystem();

// Global helper functions for backward compatibility
function showNotification(message, type = 'info', duration = 5000) {
    return notifications.show(message, type, duration);
}

function showSuccess(message) {
    return notifications.success(message);
}

function showError(message) {
    return notifications.error(message);
}

function showWarning(message) {
    return notifications.warning(message);
}

function showInfo(message) {
    return notifications.info(message);
}

// Initialize on DOM ready
document.addEventListener('DOMContentLoaded', function() {
    // Auto-initialize if not already done
    if (!document.getElementById('notification-container')) {
        new NotificationSystem();
    }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { NotificationSystem, notifications };
}
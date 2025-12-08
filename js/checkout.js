// =====================================================
// CHECKOUT FUNCTIONALITY
// Complete checkout and payment processing
// =====================================================

class CheckoutManager {
    constructor() {
        this.paymentModal = null;
        this.init();
    }

    init() {
        this.bindEvents();
        this.formatCardInputs();
        this.updateOrderSummary();
        this.paymentModal = new bootstrap.Modal(document.getElementById('paymentModal'));
    }

    bindEvents() {
        // Payment method selection
        document.querySelectorAll('input[name="paymentMethod"]').forEach(input => {
            input.addEventListener('change', this.handlePaymentMethodChange.bind(this));
        });

        // Form submission
        document.getElementById('checkoutForm').addEventListener('submit', this.handleSubmit.bind(this));

        // Card formatting
        this.setupCardFormatting();
    }

    handlePaymentMethodChange(e) {
        const cardDetails = document.getElementById('cardDetails');
        const cashDetails = document.getElementById('cashDetails');
        
        if (e.target.value === 'card') {
            cardDetails.classList.remove('d-none');
            cashDetails.classList.add('d-none');
            this.setCardFieldsRequired(true);
        } else {
            cardDetails.classList.add('d-none');
            cashDetails.classList.remove('d-none');
            this.setCardFieldsRequired(false);
        }
    }

    setCardFieldsRequired(required) {
        const cardFields = ['cardNumber', 'cardExpiry', 'cardCVV', 'cardName'];
        cardFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) {
                if (required) {
                    field.setAttribute('required', '');
                } else {
                    field.removeAttribute('required');
                }
            }
        });
    }

    setupCardFormatting() {
        const cardNumber = document.getElementById('cardNumber');
        const cardExpiry = document.getElementById('cardExpiry');
        const cardCVV = document.getElementById('cardCVV');

        if (cardNumber) {
            cardNumber.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
                let formattedValue = value.match(/.{1,4}/g)?.join(' ') || '';
                if (formattedValue.length > 19) formattedValue = formattedValue.substr(0, 19);
                e.target.value = formattedValue;
            });
        }

        if (cardExpiry) {
            cardExpiry.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value.length >= 2) {
                    value = value.substring(0, 2) + '/' + value.substring(2, 4);
                }
                e.target.value = value;
            });
        }

        if (cardCVV) {
            cardCVV.addEventListener('input', (e) => {
                e.target.value = e.target.value.replace(/\D/g, '');
            });
        }
    }

    formatCardInputs() {
        // Already handled in setupCardFormatting
    }

    updateOrderSummary() {
        cart.updateCartUI();
        
        // If cart is empty, redirect to catalog
        if (cart.items.length === 0) {
            setTimeout(() => {
                window.location.href = 'perfumes.html';
            }, 1000);
        }
    }

    validateForm(formData) {
        const errors = [];

        // Basic validation
        if (!formData.firstName.trim()) errors.push('El nombre es requerido');
        if (!formData.lastName.trim()) errors.push('Los apellidos son requeridos');
        if (!formData.email.trim() || !this.isValidEmail(formData.email)) {
            errors.push('Email válido es requerido');
        }
        if (!formData.phone.trim()) errors.push('El teléfono es requerido');
        if (!formData.address.trim()) errors.push('La dirección es requerida');
        if (!formData.city.trim()) errors.push('La ciudad es requerida');
        if (!formData.state) errors.push('El estado es requerido');
        if (!formData.zipCode.trim()) errors.push('El código postal es requerido');

        // Card validation if card payment selected
        if (formData.paymentMethod === 'card') {
            if (!formData.cardNumber || formData.cardNumber.replace(/\s/g, '').length < 13) {
                errors.push('Número de tarjeta válido es requerido');
            }
            if (!formData.cardExpiry || !/^\d{2}\/\d{2}$/.test(formData.cardExpiry)) {
                errors.push('Fecha de vencimiento válida es requerida (MM/AA)');
            }
            if (!formData.cardCVV || formData.cardCVV.length < 3) {
                errors.push('CVV válido es requerido');
            }
            if (!formData.cardName.trim()) {
                errors.push('Nombre en la tarjeta es requerido');
            }
        }

        return errors;
    }

    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    collectFormData() {
        return {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            city: document.getElementById('city').value,
            state: document.getElementById('state').value,
            zipCode: document.getElementById('zipCode').value,
            paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value,
            cardNumber: document.getElementById('cardNumber')?.value || '',
            cardExpiry: document.getElementById('cardExpiry')?.value || '',
            cardCVV: document.getElementById('cardCVV')?.value || '',
            cardName: document.getElementById('cardName')?.value || ''
        };
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const formData = this.collectFormData();
        const errors = this.validateForm(formData);
        
        if (errors.length > 0) {
            this.showErrors(errors);
            return;
        }

        // Show processing modal
        this.showPaymentProcessing();
        
        try {
            const order = await cart.processPayment({
                method: formData.paymentMethod === 'card' ? 'Tarjeta de Crédito' : 'Efectivo (Ficticio)',
                customerInfo: {
                    name: `${formData.firstName} ${formData.lastName}`,
                    email: formData.email,
                    phone: formData.phone,
                    address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.zipCode}`
                }
            });
            
            currentOrder = order;
            this.showPaymentSuccess();
            
        } catch (error) {
            this.showPaymentError(error.message);
        }
    }

    showErrors(errors) {
        // Remove existing error alerts
        const existingAlerts = document.querySelectorAll('.checkout-error');
        existingAlerts.forEach(alert => alert.remove());
        
        const errorAlert = document.createElement('div');
        errorAlert.className = 'alert alert-danger checkout-error';
        errorAlert.innerHTML = `
            <h6><i class="fas fa-exclamation-triangle me-2"></i>Por favor, corrige los siguientes errores:</h6>
            <ul class="mb-0">
                ${errors.map(error => `<li>${error}</li>`).join('')}
            </ul>
        `;
        
        document.getElementById('checkoutForm').prepend(errorAlert);
        errorAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    showPaymentProcessing() {
        document.getElementById('paymentProcessing').classList.remove('d-none');
        document.getElementById('paymentSuccess').classList.add('d-none');
        document.getElementById('paymentError').classList.add('d-none');
        this.paymentModal.show();
    }

    showPaymentSuccess() {
        document.getElementById('paymentProcessing').classList.add('d-none');
        document.getElementById('paymentSuccess').classList.remove('d-none');
        document.getElementById('paymentError').classList.add('d-none');
    }

    showPaymentError(message) {
        document.getElementById('paymentProcessing').classList.add('d-none');
        document.getElementById('paymentSuccess').classList.add('d-none');
        document.getElementById('paymentError').classList.remove('d-none');
        document.getElementById('errorMessage').textContent = message;
    }

    // Test data functions for development
    fillTestData() {
        document.getElementById('firstName').value = 'Juan';
        document.getElementById('lastName').value = 'Pérez García';
        document.getElementById('email').value = 'juan.perez@example.com';
        document.getElementById('phone').value = '55-1234-5678';
        document.getElementById('address').value = 'Av. Insurgentes Sur 123';
        document.getElementById('city').value = 'Ciudad de México';
        document.getElementById('state').value = 'CDMX';
        document.getElementById('zipCode').value = '03100';
        
        // Fill card data if card payment is selected
        if (document.getElementById('cardPayment').checked) {
            document.getElementById('cardNumber').value = '4111 1111 1111 1111';
            document.getElementById('cardExpiry').value = '12/25';
            document.getElementById('cardCVV').value = '123';
            document.getElementById('cardName').value = 'JUAN PEREZ';
        }
    }
}

// Initialize checkout when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    window.checkoutManager = new CheckoutManager();
    
    // Add test data button for development (remove in production)
    if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
        const testButton = document.createElement('button');
        testButton.type = 'button';
        testButton.className = 'btn btn-outline-secondary btn-sm';
        testButton.innerHTML = '<i class="fas fa-fill-drip me-1"></i>Llenar Datos de Prueba';
        testButton.onclick = () => checkoutManager.fillTestData();
        
        const form = document.getElementById('checkoutForm');
        if (form) {
            form.insertBefore(testButton, form.firstChild);
            const hr = document.createElement('hr');
            form.insertBefore(hr, testButton.nextSibling);
        }
    }
});

console.log('💳 Checkout functionality loaded successfully!');
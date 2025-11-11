// Form Validation Module

const FormValidator = {
    // Validate form inputs
    validate: function(formData, validationRules) {
        const errors = {};

        for (const field in validationRules) {
            const rules = validationRules[field];
            const value = formData[field];

            // Required validation
            if (rules.required && (!value || value.trim() === '')) {
                errors[field] = `${rules.label || field} wajib diisi`;
                continue;
            }

            // Email validation
            if (rules.type === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    errors[field] = `${rules.label || field} harus berupa email yang valid`;
                    continue;
                }
            }

            // NISN validation (10 digits)
            if (rules.type === 'nisn' && value) {
                if (!/^\d{10}$/.test(value)) {
                    errors[field] = `${rules.label || field} harus 10 digit`;
                    continue;
                }
            }

            // NIP validation (18 digits)
            if (rules.type === 'nip' && value) {
                if (!/^\d{18}$/.test(value)) {
                    errors[field] = `${rules.label || field} harus 18 digit`;
                    continue;
                }
            }

            // Phone validation
            if (rules.type === 'phone' && value) {
                if (!/^(\+62|0)[0-9]{9,12}$/.test(value.replace(/\s/g, ''))) {
                    errors[field] = `${rules.label || field} harus berupa nomor telepon yang valid`;
                    continue;
                }
            }

            // Min length validation
            if (rules.minLength && value && value.length < rules.minLength) {
                errors[field] = `${rules.label || field} minimal ${rules.minLength} karakter`;
                continue;
            }

            // Max length validation
            if (rules.maxLength && value && value.length > rules.maxLength) {
                errors[field] = `${rules.label || field} maksimal ${rules.maxLength} karakter`;
                continue;
            }

            // Min value validation
            if (rules.min !== undefined && value) {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue < rules.min) {
                    errors[field] = `${rules.label || field} minimal ${rules.min}`;
                    continue;
                }
            }

            // Max value validation
            if (rules.max !== undefined && value) {
                const numValue = parseFloat(value);
                if (isNaN(numValue) || numValue > rules.max) {
                    errors[field] = `${rules.label || field} maksimal ${rules.max}`;
                    continue;
                }
            }

            // Pattern validation (regex)
            if (rules.pattern && value) {
                if (!rules.pattern.test(value)) {
                    errors[field] = rules.patternMessage || `${rules.label || field} format tidak valid`;
                    continue;
                }
            }

            // Custom validation
            if (rules.custom && !rules.custom(value)) {
                errors[field] = rules.customMessage || `${rules.label || field} tidak valid`;
                continue;
            }
        }

        return {
            isValid: Object.keys(errors).length === 0,
            errors: errors
        };
    },

    // Display validation errors
    displayErrors: function(errors) {
        // Remove previous error messages
        document.querySelectorAll('.error-message').forEach(el => el.remove());

        // Add new error messages
        for (const field in errors) {
            const element = document.querySelector(`[name="${field}"]`);
            if (element) {
                element.classList.add('is-invalid');

                const errorMessage = document.createElement('div');
                errorMessage.className = 'error-message';
                errorMessage.textContent = errors[field];
                element.parentNode.insertBefore(errorMessage, element.nextSibling);
            }
        }
    },

    // Clear validation errors
    clearErrors: function() {
        document.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });
        document.querySelectorAll('.error-message').forEach(el => el.remove());
    },

    // Get form data as object
    getFormData: function(formElement) {
        const formData = new FormData(formElement);
        const data = {};

        for (const [key, value] of formData) {
            data[key] = value;
        }

        return data;
    },

    // Validate and submit form
    validateAndSubmit: function(formElement, validationRules, callback) {
        const formData = this.getFormData(formElement);
        const validation = this.validate(formData, validationRules);

        if (validation.isValid) {
            this.clearErrors();
            if (callback) callback(formData);
            return true;
        } else {
            this.displayErrors(validation.errors);
            Utils.showNotification('Mohon periksa kembali data yang Anda masukkan', 'error');
            return false;
        }
    }
};

// Add CSS for validation errors
const validationStyles = document.createElement('style');
validationStyles.textContent = `
    .is-invalid {
        border-color: var(--danger-color) !important;
        background-color: rgba(231, 74, 59, 0.05);
    }

    .error-message {
        display: block;
        color: var(--danger-color);
        font-size: 0.85rem;
        margin-top: 0.25rem;
        margin-bottom: 0.5rem;
    }

    .form-group {
        margin-bottom: 1rem;
    }

    .form-group label {
        display: block;
        margin-bottom: 0.5rem;
        font-weight: 600;
        color: var(--dark-color);
    }

    .form-group.has-error .form-control {
        border-color: var(--danger-color);
        box-shadow: 0 0 0 0.2rem rgba(231, 74, 59, 0.25);
    }
`;
document.head.appendChild(validationStyles);

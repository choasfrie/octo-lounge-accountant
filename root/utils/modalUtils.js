export class ModalUtils {
    static showModal(modalId, config = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        // Hide all forms first if forms exist
        if (config.forms) {
            config.forms.forEach(formId => {
                const form = document.getElementById(formId);
                if (form) form.style.display = 'none';
            });
        }

        // Show specific form if provided
        if (config.showForm) {
            const form = document.getElementById(config.showForm);
            if (form) form.style.display = 'block';
        }

        modal.style.display = 'block';
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (!modal) return;
        
        modal.style.display = 'none';

        // Reset forms if they exist
        const forms = modal.querySelectorAll('form');
        forms.forEach(form => form.reset());
    }

    static initializeModal(modalId, config = {}) {
        const modal = document.getElementById(modalId);
        if (!modal) return;

        const closeBtn = modal.querySelector('.close-modal');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeModal(modalId));
        }

        // Initialize form submissions if provided
        if (config.formHandlers) {
            Object.entries(config.formHandlers).forEach(([formId, handler]) => {
                const form = document.getElementById(formId);
                if (form) {
                    form.addEventListener('submit', async (e) => {
                        e.preventDefault();
                        await handler(e);
                        this.closeModal(modalId);
                    });
                }
            });
        }
    }
}

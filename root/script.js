document.addEventListener('DOMContentLoaded', async function() {
    let parsedDoc;
    try {
        // Load and inject shared components
        const componentsResponse = await fetch('components.html');
        const componentsHtml = await componentsResponse.text();
        const parser = new DOMParser();
        parsedDoc = parser.parseFromString(componentsHtml, 'text/html');

        // Insert navigation, social links, and modals into document
        const sidePanel = document.querySelector('.side-panel');
        if (sidePanel) {
            // Add navigation and social links to side panel
            sidePanel.innerHTML = parsedDoc.querySelector('nav').outerHTML + parsedDoc.querySelector('.social-links').outerHTML;
            
            // Add modals to body if they don't exist
            ['donation-modal', 'thank-you-modal'].forEach(modalId => {
                if (!document.querySelector(`#${modalId}`)) {
                    const modal = parsedDoc.querySelector(`#${modalId}`);
                    if (modal) {
                        document.body.appendChild(modal.cloneNode(true));
                    }
                }
            });
            
            // Initialize donation functionality after modals are added
            if (typeof initializeDonation === 'function') {
                initializeDonation();
            }
            
            // Dispatch event when components are loaded
            document.dispatchEvent(new Event('componentsLoaded'));
        }

        // Insert footer
        const footerContainer = document.querySelector('footer');
        if (footerContainer && parsedDoc.querySelector('footer p')) {
            footerContainer.innerHTML = parsedDoc.querySelector('footer p').outerHTML;
        }
    } catch (error) {
        console.error('Error loading components:', error);
    }

    // Handle smooth scrolling
    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({ behavior: 'smooth' });
                }
            }
        });
    });
});

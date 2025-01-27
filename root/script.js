document.addEventListener('DOMContentLoaded', async function() {
    let parsedDoc;
    try {
        // Load and inject shared components
        const componentsResponse = await fetch('components.html');
        const componentsHtml = await componentsResponse.text();
        const parser = new DOMParser();
        parsedDoc = parser.parseFromString(componentsHtml, 'text/html');

        // Initialize user menu functionality
        initializeUserMenu();

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

        // Re-initialize user menu after components are loaded
        initializeUserMenu();

        // Show/hide and initialize AI assistant button
        const aiAssistantMenuItem = document.getElementById('ai-assistant-menu-item');
        const toggleAiButton = document.getElementById('toggle-ai-sidebar');
        if (aiAssistantMenuItem && toggleAiButton) {
            const isBookkeepingPage = window.location.pathname.endsWith('bookkeeping.html');
            const isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
            aiAssistantMenuItem.style.display = (isBookkeepingPage && isAuthenticated) ? 'block' : 'none';
            
            // Initialize toggle button
            toggleAiButton.addEventListener('click', (e) => {
                e.preventDefault();
                const aiSidebar = document.getElementById('ai-sidebar');
                if (aiSidebar) {
                    aiSidebar.classList.toggle('collapsed');
                }
            });
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

// Function to initialize user menu functionality
function initializeUserMenu() {
    const userMenuTrigger = document.querySelector('.user-menu-trigger');
    const userMenu = document.querySelector('.user-menu');
    
    // Remove existing event listeners
    const newTrigger = userMenuTrigger.cloneNode(true);
    userMenuTrigger.parentNode.replaceChild(newTrigger, userMenuTrigger);
    
    if (newTrigger && userMenu) {
        newTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenu.classList.toggle('show');
        });

        // Close menu when clicking outside
        const handleClickOutside = (e) => {
            if (!newTrigger.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.remove('show');
            }
        };
        
        document.removeEventListener('click', handleClickOutside);
        document.addEventListener('click', handleClickOutside);
    }
}

document.addEventListener('DOMContentLoaded', async function() {
    // Load and inject shared components
    const componentsResponse = await fetch('components.html');
    const componentsHtml = await componentsResponse.text();
    const parser = new DOMParser();
    const doc = parser.parseFromString(componentsHtml, 'text/html');

    // Insert navigation and social links into side panel
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.innerHTML = doc.querySelector('nav').outerHTML + doc.querySelector('.social-links').outerHTML;
    }

    // Insert footer
    const footerContainer = document.querySelector('footer');
    if (footerContainer) {
        footerContainer.innerHTML = doc.querySelector('footer p').outerHTML;
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

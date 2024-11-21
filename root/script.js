document.addEventListener('DOMContentLoaded', async function() {
    // Load components
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
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    const data = new vis.DataSet([
        { x: '2024-01-01', y: 10 },
        { x: '2024-01-15', y: 15 },
        { x: '2024-02-01', y: 25 },
        { x: '2024-02-15', y: 20 },
    ]);

    const options = {
        start: '2024-01-01',
        end: '2024-04-15',
        drawPoints: true,
        dataAxis: {
            left: { title: { text: 'Values (Y Axis)' } },
        },
        timeAxis: { title: { text: 'Dates (X Axis)' } },
        width: '100%',
        height: '100%',
    };

    const container = document.getElementById('visualization');
    new vis.Graph2d(container, data, options);

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;
        container.style.width = `${width}px`;
        container.style.height = `${height}px`;
    });
});

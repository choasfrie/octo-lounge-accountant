document.addEventListener('DOMContentLoaded', function() {
    const wrapper = document.querySelector('.wrapper');
    const toggleButton = document.createElement('button');
    toggleButton.textContent = 'Toggle Layout';
    toggleButton.style.position = 'fixed';
    toggleButton.style.top = '10px';
    toggleButton.style.right = '10px';
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener('click', function() {
        wrapper.classList.toggle('compact');
        if (wrapper.classList.contains('compact')) {
            wrapper.style.gridTemplateColumns = '1fr';
        } else {
            wrapper.style.gridTemplateColumns = '250px 1fr';
        }
    });

    const links = document.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            if (this.getAttribute('href').startsWith('#')) {
                e.preventDefault();
                const targetId = this.getAttribute('href').slice(1);
                const targetElement = document.getElementById(targetId);
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

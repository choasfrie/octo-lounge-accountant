document.addEventListener('DOMContentLoaded', function() {
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-theme');
    });

    const showContactFormButton = document.getElementById('show-contact-form');
    const contactForm = document.getElementById('contact-form');

    showContactFormButton.addEventListener('click', function() {
        contactForm.style.display = contactForm.style.display === 'none' ? 'block' : 'none';
    });
});

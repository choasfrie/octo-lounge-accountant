document.addEventListener('DOMContentLoaded', function() {
    const ctaButton = document.getElementById('cta-button');
    ctaButton.addEventListener('click', function() {
        alert('Thank you for your interest! We will contact you soon.');
    });

    const teamMembers = [
        { name: 'John Doe', role: 'Senior Accountant' },
        { name: 'Jane Smith', role: 'Financial Analyst' },
        { name: 'Mike Johnson', role: 'Tax Specialist' }
    ];

    const teamMembersContainer = document.getElementById('team-members');
    teamMembers.forEach(member => {
        const memberDiv = document.createElement('div');
        memberDiv.innerHTML = `<h3>${member.name}</h3><p>${member.role}</p>`;
        teamMembersContainer.appendChild(memberDiv);
    });

    const contactForm = document.getElementById('contact-form');
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('Thank you for your message. We will get back to you soon!');
        contactForm.reset();
    });
});

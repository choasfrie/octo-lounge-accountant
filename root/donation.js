// Initialize donation functionality
const initializeDonation = () => {
    // Wait for a short delay to ensure DOM is updated
    setTimeout(() => {
        const donateButton = document.getElementById('donate-button');
        const donationModal = document.getElementById('donation-modal');
        const closeDonationBtn = document.getElementById('close-donation');
        const completeDonationBtn = document.getElementById('complete-donation');
        const thankYouModal = document.getElementById('thank-you-modal');

        // If elements aren't ready yet, wait for components to load
        if (!donateButton || !donationModal || !closeDonationBtn || !completeDonationBtn || !thankYouModal) {
            console.warn('Donation elements not found, will retry on componentsLoaded event...');
            document.addEventListener('componentsLoaded', initializeDonation);
            return;
        }

        let selectedAmount = 0;

        // Show modal
        donateButton.addEventListener('click', () => {
            donationModal.style.display = 'block';
            thankYouModal.style.display = 'none';
        });

        // Close modal
        closeDonationBtn.addEventListener('click', () => {
            donationModal.style.display = 'none';
        });

        // Handle preset amounts
        document.querySelectorAll('.donation-amount').forEach(button => {
            button.addEventListener('click', () => {
                document.querySelectorAll('.donation-amount').forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
                selectedAmount = parseInt(button.dataset.amount);
                document.getElementById('custom-donation').value = '';
            });
        });

        // Handle custom amount
        document.getElementById('custom-donation').addEventListener('input', (e) => {
            document.querySelectorAll('.donation-amount').forEach(btn => btn.classList.remove('selected'));
            selectedAmount = parseInt(e.target.value) || 0;
        });

        // Complete donation
        completeDonationBtn.addEventListener('click', () => {
            if (selectedAmount <= 0) {
                alert('Please select or enter a valid amount');
                return;
            }

            // Hide donation modal and show thank you modal
            donationModal.style.display = 'none';
            thankYouModal.style.display = 'block';
            
            // Create confetti effect
            createConfetti();
            
            // Reset form
            selectedAmount = 0;
            document.querySelectorAll('.donation-amount').forEach(btn => btn.classList.remove('selected'));
            document.getElementById('custom-donation').value = '';
            
            // Auto-hide thank you modal after delay
            setTimeout(() => {
                thankYouModal.style.display = 'none';
            }, 3000);
        });
    }, 100);
};

// Confetti animation function
function createConfetti() {
    const colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff', '#ffa500'];
    const shapes = ['circle', 'square', 'triangle'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        
        // Random color and shape
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = shapes[Math.floor(Math.random() * shapes.length)] === 'circle' ? '50%' : '0';
        
        // Random position and animation
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
        confetti.style.animationDelay = Math.random() * 2 + 's';
        confetti.style.opacity = Math.random() * 0.7 + 0.3;
        confetti.style.transform = `rotate(${Math.random() * 360}deg)`;
        
        document.body.appendChild(confetti);

        // Remove confetti after animation
        setTimeout(() => confetti.remove(), 5000);
    }
}

// Try to initialize when DOM loads
document.addEventListener('DOMContentLoaded', initializeDonation);

// Also try to initialize when components load
document.addEventListener('componentsLoaded', initializeDonation);

// Handles user authentication
class AuthManager {
    constructor() {
        this.currentUser = null; // Current user session
        this.init();
    }

    // Initialize user session
    async init() {
        try {
            const response = await fetch('/api/user-info');
            if (response.ok) {
                this.currentUser = await response.json(); // Store user data
                this.updateUserDisplay(); // Update UI
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
        }
    }

    async login(credentials) {
        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });
            
            if (response.ok) {
                this.currentUser = await response.json();
                this.updateUserDisplay();
                this.closeAuthModal();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Login error:', error);
            return false;
        }
    }

    async register(userData) {
        try {
            // User profile
            const userResponse = await fetch('https://localhost:7162/api/Profiles/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Username: userData.username,
                    Email: userData.email,
                    PasswordHash: userData.password
                })
            });
            
            if (!userResponse.ok) {
                return false;
            }

            const user = await userResponse.json();
            
            // Add the package
            const packageResponse = await fetch('https://localhost:7162/api/AccountTypes/createAccountType', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    Name: userData.accountPackage
                })
            });

            if (packageResponse.ok) {
                this.currentUser = user;
                this.updateUserDisplay();
                this.closeAuthModal();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    updateUserDisplay() {
        const welcomeText = document.querySelector('.user-welcome');
        if (welcomeText) {
            welcomeText.textContent = this.currentUser ? 
                `Welcome, ${this.currentUser.username}` : 
                'Welcome, Guest';
        }
    }

    showAuthModal(type) {
        const modal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        modal.style.display = 'block';
        if (type === 'login') {
            loginForm.style.display = 'block';
            registerForm.style.display = 'none';
        } else {
            loginForm.style.display = 'none';
            registerForm.style.display = 'block';
        }
    }

    closeAuthModal() {
        const modal = document.getElementById('auth-modal');
        modal.style.display = 'none';
    }
}

const authManager = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
    // Package selection handling
    const packageButtons = document.querySelectorAll('.package-button');
    const selectedPackageInput = document.getElementById('selected-package');

    packageButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove selected class from all buttons
            packageButtons.forEach(btn => btn.classList.remove('selected'));
            // Add selected class to clicked button
            button.classList.add('selected');
            // Update hidden input value
            selectedPackageInput.value = button.dataset.package;
        });
    });
    const userIcon = document.querySelector('.user-menu-trigger');
    const userMenu = document.querySelector('.user-menu');
    
    userIcon.addEventListener('click', () => {
        userMenu.classList.toggle('show');
    });

    document.getElementById('login-button').addEventListener('click', () => {
        authManager.showAuthModal('login');
    });

    document.getElementById('register-button').addEventListener('click', () => {
        authManager.showAuthModal('register');
    });

    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await authManager.login({
            username: formData.get('username'),
            password: formData.get('password')
        });
        if (!success) {
            const errorDiv = document.querySelector('#login-error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Login failed. Please check your credentials.';
        }
    });

    document.getElementById('register-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const success = await authManager.register({
            username: formData.get('username'),
            accountPackage: formData.get('accountPackage'),
            email: formData.get('email'),
            password: formData.get('password')
        });
        if (!success) {
            const errorDiv = document.querySelector('#register-error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = 'Registration failed. Please try again.';
        }
    });
});

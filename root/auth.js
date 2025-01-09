import { accountService } from './services/accountService.js';

// Handles user authentication
class AuthManager {
    constructor() {
        this.currentUser = null; // Current user session
        this.init();
    }

    // Initialize user session
    async init() {
        try {
            const response = await fetch('/api/Profiles/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: localStorage.getItem('username'),
                    password: localStorage.getItem('password')
                })
            });
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
            const response = await fetch('/api/Profiles/login', {
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
            const userResponse = await fetch('/api/Profiles/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: userData.username,
                    email: userData.email,
                    passwordHash: userData.password
                })
            });
            
            if (!userResponse.ok) {
                return false;
            }

            const user = await userResponse.json();
            
            // Add the package
            // Map package types to company types
            const packageTypeMap = {
                'none': 'S',  // Sole proprietorship
                'llc': 'L',   // Limited company
                'plc': 'G',   // GmbH
                'sp': 'S'     // Sole proprietorship
            };

            await accountService.createStandardPackage(
                user.id,
                packageTypeMap[userData.accountPackage] || 'S'
            );

            // If we get here, package creation was successful
            this.currentUser = user;
            this.updateUserDisplay();
            this.closeAuthModal();
            return true;

        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    updateUserDisplay() {
        const welcomeText = document.querySelector('.user-welcome');
        const userMenu = document.querySelector('.user-menu');
        if (welcomeText) {
            welcomeText.textContent = this.currentUser ? 
                `Welcome, ${this.currentUser.username}` : 
                'Welcome, Guest';
            
            // Update menu buttons based on auth state
            if (this.currentUser) {
                userMenu.innerHTML = `
                    <div class="user-welcome">Welcome, ${this.currentUser.username}</div>
                    <button class="auth-button" id="logout-button">Logout</button>
                `;
                document.getElementById('logout-button').addEventListener('click', () => this.logout());
            } else {
                userMenu.innerHTML = `
                    <div class="user-welcome">Welcome, Guest</div>
                    <button class="auth-button" id="login-button">Login</button>
                    <button class="auth-button" id="register-button">Register</button>
                `;
                document.getElementById('login-button').addEventListener('click', () => this.showAuthModal('login'));
                document.getElementById('register-button').addEventListener('click', () => this.showAuthModal('register'));
            }
        }
    }

    showAuthModal(type) {
        const modal = document.getElementById('auth-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        
        // Reset forms
        loginForm.reset();
        registerForm.reset();
        
        // Hide error messages
        document.getElementById('login-error').style.display = 'none';
        document.getElementById('register-error').style.display = 'none';
        
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
        if (modal) {
            modal.style.display = 'none';
            // Reset forms
            const loginForm = document.getElementById('login-form');
            const registerForm = document.getElementById('register-form');
            if (loginForm) loginForm.reset();
            if (registerForm) registerForm.reset();
        }
    }

    async logout() {
        this.currentUser = null;
        this.updateUserDisplay();
        // Clear stored credentials
        localStorage.removeItem('username');
        localStorage.removeItem('password');
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

    // Store credentials on successful login
    document.getElementById('login-form').addEventListener('submit', (e) => {
        if (e.target.checkValidity()) {
            const formData = new FormData(e.target);
            localStorage.setItem('username', formData.get('username'));
            localStorage.setItem('password', formData.get('password'));
        }
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

    // Add close modal event listener
    const closeAuthModalBtn = document.getElementById('close-auth-modal');
    if (closeAuthModalBtn) {
        closeAuthModalBtn.addEventListener('click', () => authManager.closeAuthModal());
    }
});

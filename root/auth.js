// Handles user authentication
class AuthManager {
    constructor() {
        this.currentUser = null; // Current user session
        this.init();
    }

    // Initialize user session
    async init() {
        const storedUsername = localStorage.getItem('username');
        if (storedUsername) {
            this.currentUser = { username: storedUsername };
            this.updateUserDisplay();
            this.toggleAuthButtons();
        } else {
            try {
                const response = await fetch('/api/user-info');
                if (response.ok) {
                    const userData = await response.json(); // Store user data
                    this.currentUser = { username: userData.username || 'Guest' };
                    localStorage.setItem('username', this.currentUser.username); // Save username in local storage
                    this.updateUserDisplay();
                    this.toggleAuthButtons();
                }
            } catch (error) {
                console.error('Error fetching user info:', error);
            }
        }
    }

    async login(credentials) {
        try {
            const response = await fetch('https://localhost:7162/api/Profiles/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(credentials)
            });

            if (response.ok) {
                const userData = await response.json();
                this.currentUser = { username: userData.username || 'Guest' };
                localStorage.setItem('username', this.currentUser.username); // Save username
                this.updateUserDisplay();
                this.toggleAuthButtons();
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

            if (!userResponse.ok) return false;

            const user = await userResponse.json();

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
                this.currentUser = { username: user.username || 'Guest' };
                localStorage.setItem('username', this.currentUser.username); // Save username
                this.updateUserDisplay();
                this.toggleAuthButtons();
                this.closeAuthModal();
                return true;
            }
            return false;
        } catch (error) {
            console.error('Registration error:', error);
            return false;
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('username'); // Clear user data from local storage
        this.updateUserDisplay();
        this.toggleAuthButtons();
    }

    updateUserDisplay() {
        const welcomeText = document.querySelector('.user-welcome');
        if (welcomeText) {
            welcomeText.textContent = this.currentUser ?
                `Welcome, ${this.currentUser.username}` :
                'Welcome, Guest';
        }
    }

    toggleAuthButtons() {
        const loginButton = document.getElementById('login-button');
        const registerButton = document.getElementById('register-button');
        const logoutButton = document.getElementById('logout-button');

        if (this.currentUser) {
            loginButton.style.display = 'none';
            registerButton.style.display = 'none';
            logoutButton.style.display = 'block';
        } else {
            loginButton.style.display = 'block';
            registerButton.style.display = 'block';
            logoutButton.style.display = 'none';
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

// Initialize AuthManager
const authManager = new AuthManager();

document.addEventListener('DOMContentLoaded', () => {
    // Event listener for logout
    document.getElementById('logout-button').addEventListener('click', () => {
        authManager.logout();
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

    // Event listener for user menu trigger
    const userMenuTrigger = document.querySelector('.user-menu-trigger');
    const userMenu = document.querySelector('.user-menu');

    userMenuTrigger.addEventListener('click', () => {
        userMenu.classList.toggle('show');
    });

    // Event listeners for showing auth modal
    document.getElementById('login-button').addEventListener('click', () => {
        authManager.showAuthModal('login');
    });

    document.getElementById('register-button').addEventListener('click', () => {
        authManager.showAuthModal('register');
    });
});
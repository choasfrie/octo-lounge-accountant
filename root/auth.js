import { accountService } from './services/accountService.js';
import { validateAuthData } from './utils/validationUtils.js';

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.protectedPages = ['bookkeeping.html', 'financialanalysis.html'];
        this.init();
    }

    updateServiceIcons(isLoggedIn) {
        const bookkeepingLink = document.getElementById('bookkeeping-link');
        const analysisLink = document.getElementById('analysis-link');
        const finalBalanceLink = document.getElementById('finalbalance-link');
        
        if (bookkeepingLink) {
            const bookIcon = bookkeepingLink.querySelector('i');
            bookIcon.className = isLoggedIn ? 'fas fa-book-open' : 'fas fa-lock';
        }
        
        if (analysisLink) {
            const chartIcon = analysisLink.querySelector('i');
            chartIcon.className = isLoggedIn ? 'fas fa-chart-line' : 'fas fa-lock';
        }

        if (finalBalanceLink) {
            const balanceIcon = finalBalanceLink.querySelector('i');
            balanceIcon.className = isLoggedIn ? 'fa-solid fa-coins' : 'fas fa-lock';
        }
    }

    checkProtectedPages() {
        const currentPage = window.location.pathname.split('/').pop();
        if (this.protectedPages.includes(currentPage) && !this.currentUser) {
            window.location.href = 'index.html';
        }
    }

    async init() {
        const isAuthenticated = sessionStorage.getItem('isAuthenticated');
        const storedUsername = sessionStorage.getItem('username');
        const storedUserId = sessionStorage.getItem('userId');
        const storedEmail = sessionStorage.getItem('userEmail');
        
        if (isAuthenticated && storedUsername && storedUserId && storedEmail) {
            this.currentUser = {
                username: storedUsername,
                id: parseInt(storedUserId),
                email: storedEmail
            };
            this.updateUserDisplay();
            this.toggleAuthButtons();
            this.updateServiceIcons(true);
        } else {
            this.updateServiceIcons(false);
            const currentPage = window.location.pathname.split('/').pop();
            if (currentPage === 'bookkeeping.html') {
                window.location.href = 'index.html';
            }
        }
    }

    async login(credentials) {
        try {
            const errors = validateAuthData(credentials, 'login');
            if (errors.length > 0) {
                console.log('Validation errors:', errors);
                const errorDiv = document.querySelector('#login-error');
                errorDiv.style.display = 'block';
                errorDiv.textContent = errors.join('\n');
                return false;
            }
            const response = await fetch('http://localhost:5116/api/Profiles/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: credentials.username,
                    password: credentials.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: 'Login failed' }));
                console.error('Login failed:', {
                    status: response.status,
                    message: errorData.message
                });
                throw new Error(errorData.message || 'Login failed');
            }
            const data = await response.json();
            
            // Create session
            this.currentUser = { 
                username: data.username,
                id: data.id,
                email: data.email
            };
            
            // Store session data
            sessionStorage.setItem('isAuthenticated', 'true');
            sessionStorage.setItem('username', data.username);
            sessionStorage.setItem('userId', data.id.toString());
            sessionStorage.setItem('userEmail', data.email);
            this.updateUserDisplay();
            this.toggleAuthButtons();
            this.updateServiceIcons(true);
            this.closeAuthModal();
            return true;
        } catch (error) {
            const errorDiv = document.querySelector('#login-error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = error.message;
            return false;
        }
    }

    async register(userData) {
        try {
            // First register the user
            const userResponse = await fetch('http://localhost:5116/api/Profiles/register', {
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
                const errorData = await userResponse.json();
                throw new Error(errorData.message || 'Registration failed');
            }

            const user = await userResponse.json();

            // Only proceed if registration was successful
            if (userResponse.status === 200) {
                // Create account package if selected and not "none"
                if (userData.accountPackage && userData.accountPackage !== '' && userData.accountPackage !== 'none') {
                    try {
                        const response = await fetch('http://localhost:5116/api/Accounts/createStandardPackage', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                profileId: user.id,
                                companyType: userData.accountPackage
                            })
                        });

                        if (!response.ok) {
                            console.warn('Failed to create account package, but continuing with registration');
                        }
                    } catch (error) {
                        console.warn('Failed to setup account package, but user was created:', error);
                    }
                }
            }

            // Update UI state
            this.currentUser = { 
                username: user.username,
                id: user.id,
                email: user.email
            };
            localStorage.setItem('username', this.currentUser.username);
            this.updateUserDisplay();
            this.toggleAuthButtons();
            this.updateServiceIcons(true);
            this.closeAuthModal();
            return true;

        } catch (error) {
            const errorDiv = document.querySelector('#register-error');
            errorDiv.style.display = 'block';
            errorDiv.textContent = error.message || 'Registration failed. Please try again.';
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
        
        // Reinitialize user menu functionality
        if (typeof initializeUserMenu === 'function') {
            initializeUserMenu();
        }
    }

    toggleAuthButtons() {
        // Wait for components to be loaded
        const tryToggle = () => {
            const loginButton = document.getElementById('login-button');
            const registerButton = document.getElementById('register-button');
            const logoutButton = document.getElementById('logout-button');

            if (!loginButton || !registerButton || !logoutButton) {
                // If elements aren't ready, wait for components
                document.addEventListener('componentsLoaded', this.toggleAuthButtons.bind(this));
                return;
            }

            if (this.currentUser) {
                loginButton.style.display = 'none';
                registerButton.style.display = 'none';
                logoutButton.style.display = 'block';
            } else {
                loginButton.style.display = 'block';
                registerButton.style.display = 'block';
                logoutButton.style.display = 'none';
            }
        };

        tryToggle();
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
        // Clear session
        sessionStorage.clear();
        // Redirect to home page if on protected page
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'bookkeeping.html') {
            window.location.href = 'index.html';
        }
        this.updateServiceIcons(false);
    }
}

// Initialize AuthManager
export const authManager = new AuthManager();

// Initialize package buttons
const initializePackageButtons = () => {
    const packageButtons = document.querySelectorAll('.package-button');
    packageButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            packageButtons.forEach(btn => btn.classList.remove('selected'));
            button.classList.add('selected');
            document.getElementById('selected-package').value = button.dataset.package;
        });
    });
};

// Initialize event listeners after components are loaded
const initializeEventListeners = () => {
    // Initialize package buttons
    initializePackageButtons();

    // Function to setup auth buttons
    const setupAuthButtons = () => {
        const logoutButton = document.getElementById('logout-button');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const loginButton = document.getElementById('login-button');
        const registerButton = document.getElementById('register-button');
        const userMenuTrigger = document.querySelector('.user-menu-trigger');
        const userMenu = document.querySelector('.user-menu');

        if (!logoutButton || !loginForm || !registerForm || !loginButton || 
            !registerButton || !userMenuTrigger || !userMenu) {
            return false;
        }

        // Remove existing event listeners
        const newLoginButton = loginButton.cloneNode(true);
        const newRegisterButton = registerButton.cloneNode(true);
        const newLogoutButton = logoutButton.cloneNode(true);
        
        loginButton.parentNode.replaceChild(newLoginButton, loginButton);
        registerButton.parentNode.replaceChild(newRegisterButton, registerButton);
        logoutButton.parentNode.replaceChild(newLogoutButton, logoutButton);

        newLogoutButton.addEventListener('click', () => {
            authManager.logout();
        });

        loginForm.addEventListener('submit', async (e) => {
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

        registerForm.addEventListener('submit', async (e) => {
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

        userMenuTrigger.addEventListener('click', () => {
            userMenu.classList.toggle('show');
        });

        newLoginButton.addEventListener('click', () => {
            authManager.showAuthModal('login');
        });

        newRegisterButton.addEventListener('click', () => {
            authManager.showAuthModal('register');
            // Re-initialize package buttons when register form is shown
            setTimeout(initializePackageButtons, 100);
        });

        return true;
    };

    // Try to setup auth buttons, if not successful, wait for components
    if (!setupAuthButtons()) {
        document.addEventListener('componentsLoaded', setupAuthButtons);
    }
};

// Start initialization when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeEventListeners();
});

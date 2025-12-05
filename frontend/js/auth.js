import { authAPI } from './api.js';

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    // Hide/show admin login link
    const adminLoginLink = document.getElementById('admin-login-link');
    if (adminLoginLink) {
        if (token && userRole === 'admin') {
            adminLoginLink.style.display = 'none';
        } else {
            adminLoginLink.style.display = 'inline';
        }
    }
    
    if (token) {
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        
        if (userRole === 'admin') {
            // Replace admin login link with dashboard link
            if (adminLoginLink) {
                adminLoginLink.href = 'admin-dashboard.html';
                adminLoginLink.textContent = 'Admin Dashboard';
            } else {
                const nav = document.querySelector('.nav');
                const adminLink = document.createElement('a');
                adminLink.href = 'admin-dashboard.html';
                adminLink.textContent = 'Admin Dashboard';
                nav.appendChild(adminLink);
            }
        }
    } else {
        const loginLink = document.getElementById('login-link');
        const logoutLink = document.getElementById('logout-link');
        if (loginLink) loginLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
    }
}

// Logout function
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userId');
    window.location.href = 'index.html';
}

// Initialize auth check on page load
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
});

// Login form handler
if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const isAdmin = window.location.pathname.includes('admin-login');

        try {
            let response;
            if (isAdmin) {
                response = await authAPI.adminLogin(email, password);
                localStorage.setItem('userRole', 'admin');
            } else {
                response = await authAPI.login(email, password);
                localStorage.setItem('userRole', 'user');
            }

            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId || response.adminId);
            
            if (isAdmin) {
                window.location.href = 'admin-dashboard.html';
            } else {
                window.location.href = 'index.html';
            }
        } catch (error) {
            alert('Login failed: ' + error.message);
        }
    });
}

// Signup form handler
if (document.getElementById('signup-form')) {
    document.getElementById('signup-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        const userData = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            password: document.getElementById('password').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value
        };

        try {
            const response = await authAPI.signup(userData);
            localStorage.setItem('token', response.token);
            localStorage.setItem('userId', response.userId);
            localStorage.setItem('userRole', 'user');
            window.location.href = 'index.html';
        } catch (error) {
            alert('Signup failed: ' + error.message);
        }
    });
}

export { checkAuth, logout };


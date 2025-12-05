import { authAPI } from './api.js';

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    
    if (token) {
        document.getElementById('login-link').style.display = 'none';
        document.getElementById('logout-link').style.display = 'inline';
        
        if (userRole === 'admin') {
            const nav = document.querySelector('.nav');
            const adminLink = document.createElement('a');
            adminLink.href = 'admin-dashboard.html';
            adminLink.textContent = 'Admin';
            nav.appendChild(adminLink);
        }
    } else {
        document.getElementById('login-link').style.display = 'inline';
        document.getElementById('logout-link').style.display = 'none';
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


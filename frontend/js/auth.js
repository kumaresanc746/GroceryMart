import { authAPI } from './api.js';

// Check authentication status
function checkAuth() {
    const token = localStorage.getItem('token');
    const userRole = localStorage.getItem('userRole');
    const nav = document.querySelector('.nav');
    
    if (!nav) return;
    
    // Get the existing admin link from HTML (if it exists)
    let adminLink = document.getElementById('admin-login-link');
    
    // Remove any duplicate admin links (by different IDs or multiple instances)
    const allAdminLinks = nav.querySelectorAll('#admin-login-link, #admin-nav-link, a[href="admin-dashboard.html"]');
    if (allAdminLinks.length > 1) {
        // Keep the first one, remove others
        for (let i = 1; i < allAdminLinks.length; i++) {
            if (allAdminLinks[i].parentNode === nav) {
                allAdminLinks[i].remove();
            }
        }
        // Re-get the first one
        adminLink = document.getElementById('admin-login-link') || nav.querySelector('a[href="admin-dashboard.html"]');
    }
    
    // If no admin link exists, create one
    if (!adminLink) {
        adminLink = document.createElement('a');
        adminLink.id = 'admin-login-link';
        const loginLink = document.getElementById('login-link');
        if (loginLink && loginLink.parentNode) {
            loginLink.parentNode.insertBefore(adminLink, loginLink);
        } else {
            nav.appendChild(adminLink);
        }
    }
    
    // Get login and logout links
    const loginLink = document.getElementById('login-link');
    const logoutLink = document.getElementById('logout-link');
    
    if (token) {
        // User is logged in
        if (loginLink) loginLink.style.display = 'none';
        if (logoutLink) logoutLink.style.display = 'inline';
        
        if (userRole === 'admin' && adminLink) {
            // Show admin dashboard link for admin
            adminLink.href = 'admin-dashboard.html';
            adminLink.textContent = 'Admin Dashboard';
            adminLink.style.display = 'inline';
        } else if (adminLink) {
            // Hide admin link for regular users
            adminLink.style.display = 'none';
        }
    } else {
        // User is not logged in
        if (loginLink) loginLink.style.display = 'inline';
        if (logoutLink) logoutLink.style.display = 'none';
        
        // Show admin login link
        if (adminLink) {
            adminLink.href = 'admin-login.html';
            adminLink.textContent = 'Admin';
            adminLink.style.display = 'inline';
        }
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


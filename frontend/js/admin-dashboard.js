import { adminAPI } from './api.js';
import { checkAuth, logout } from './auth.js';

let editingProductId = null;
let allOrders = [];
let allUsers = [];

// Check admin auth
document.addEventListener('DOMContentLoaded', () => {
    const userRole = localStorage.getItem('userRole');
    if (userRole !== 'admin') {
        window.location.href = 'admin-login.html';
        return;
    }
    
    checkAuth();
    loadDashboard();
    
    const logoutLink = document.getElementById('logout-link');
    if (logoutLink) {
        logoutLink.addEventListener('click', (e) => {
            e.preventDefault();
            logout();
        });
    }
    
    // Make functions globally accessible
    window.showAddProductModal = showAddProductModal;
    window.hideProductModal = hideProductModal;
    window.editProduct = editProduct;
    window.deleteProduct = deleteProduct;
    window.switchTab = switchTab;
    window.updateOrderStatus = updateOrderStatus;
    
    console.log('Admin dashboard initialized');
});

// Tab switching
function switchTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(tab => {
        tab.classList.remove('active');
    });
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });
    
    // Show selected tab
    document.getElementById(`${tabName}-tab`).classList.add('active');
    event.target.classList.add('active');
    
    // Load data for the tab
    if (tabName === 'users') {
        loadUsers();
    } else if (tabName === 'orders') {
        loadOrders();
    } else if (tabName === 'deliveries') {
        loadDeliveries();
    }
}

// Load dashboard data
async function loadDashboard() {
    try {
        console.log('Loading dashboard data...');
        const stats = await adminAPI.getStats();
        console.log('Stats loaded:', stats);
        updateStats(stats);
        
        const products = await adminAPI.getProducts();
        console.log('Products loaded:', products.length);
        displayProducts(products);
    } catch (error) {
        console.error('Error loading dashboard:', error);
        const tbody = document.getElementById('products-table');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="6" class="error">Error loading products: ${error.message}</td></tr>`;
        }
        alert('Failed to load dashboard: ' + error.message);
    }
}

// Update stats
function updateStats(stats) {
    document.getElementById('total-products').textContent = stats.totalProducts || 0;
    document.getElementById('low-stock').textContent = stats.lowStockCount || 0;
    document.getElementById('total-customers').textContent = stats.totalCustomers || 0;
    document.getElementById('pending-orders').textContent = stats.pendingOrders || 0;
    document.getElementById('deliveries-today').textContent = stats.deliveriesToday || 0;
}

// Display products table
function displayProducts(products) {
    const tbody = document.getElementById('products-table');
    
    if (!tbody) {
        console.error('Products table tbody not found!');
        return;
    }
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No products found</td></tr>';
        return;
    }

    try {
        tbody.innerHTML = products.map(product => `
            <tr>
                <td><img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover;" onerror="this.src='https://via.placeholder.com/50'"></td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>₹${product.price}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn-edit" onclick="window.editProduct('${product._id}')">Edit</button>
                    <button class="btn-delete" onclick="window.deleteProduct('${product._id}')">Delete</button>
                </td>
            </tr>
        `).join('');
        console.log('Products table updated with', products.length, 'products');
    } catch (error) {
        console.error('Error displaying products:', error);
        tbody.innerHTML = '<tr><td colspan="6" class="error">Error displaying products</td></tr>';
    }
}

// Load users
async function loadUsers() {
    try {
        const users = await adminAPI.getUsers();
        allUsers = users;
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
        document.getElementById('users-table').innerHTML = 
            `<tr><td colspan="5" class="error">Error loading users: ${error.message}</td></tr>`;
    }
}

// Display users
function displayUsers(users) {
    const tbody = document.getElementById('users-table');
    if (!users || users.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="loading">No users found</td></tr>';
        return;
    }

    tbody.innerHTML = users.map(user => `
        <tr>
            <td>${user.name}</td>
            <td>${user.email}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>${user.address || 'N/A'}</td>
            <td>${new Date(user.createdAt).toLocaleDateString()}</td>
        </tr>
    `).join('');
}

// Load orders
async function loadOrders() {
    try {
        const orders = await adminAPI.getOrders();
        allOrders = orders;
        displayOrders(orders);
    } catch (error) {
        console.error('Error loading orders:', error);
        document.getElementById('orders-table').innerHTML = 
            `<tr><td colspan="7" class="error">Error loading orders: ${error.message}</td></tr>`;
    }
}

// Display orders
function displayOrders(orders) {
    const tbody = document.getElementById('orders-table');
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No orders found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order._id.toString().slice(-8)}</td>
            <td>${order.user ? order.user.name : 'N/A'}<br><small>${order.user ? order.user.email : ''}</small></td>
            <td>${order.items.length} items</td>
            <td>₹${order.totalAmount}</td>
            <td><span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>
                <div class="order-actions">
                    ${order.status === 'pending' ? `<button class="btn-status confirm" onclick="window.updateOrderStatus('${order._id}', 'confirmed')">Confirm</button>` : ''}
                    ${order.status === 'confirmed' ? `<button class="btn-status ship" onclick="window.updateOrderStatus('${order._id}', 'processing')">Process</button>` : ''}
                    ${order.status === 'processing' ? `<button class="btn-status ship" onclick="window.updateOrderStatus('${order._id}', 'shipped')">Ship</button>` : ''}
                    ${order.status === 'shipped' ? `<button class="btn-status deliver" onclick="window.updateOrderStatus('${order._id}', 'delivered')">Deliver</button>` : ''}
                </div>
            </td>
        </tr>
    `).join('');
}

// Load deliveries
async function loadDeliveries() {
    try {
        const orders = await adminAPI.getOrders();
        displayDeliveries(orders);
    } catch (error) {
        console.error('Error loading deliveries:', error);
        document.getElementById('deliveries-table').innerHTML = 
            `<tr><td colspan="7" class="error">Error loading deliveries: ${error.message}</td></tr>`;
    }
}

// Display deliveries
function displayDeliveries(orders) {
    const tbody = document.getElementById('deliveries-table');
    if (!orders || orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="loading">No deliveries found</td></tr>';
        return;
    }

    tbody.innerHTML = orders.map(order => `
        <tr>
            <td>#${order._id.toString().slice(-8)}</td>
            <td>${order.user ? order.user.name : 'N/A'}<br><small>${order.user ? order.user.phone : ''}</small></td>
            <td>${order.deliveryAddress || 'N/A'}</td>
            <td><span class="status-badge status-${order.status}">${order.status.toUpperCase()}</span></td>
            <td>${new Date(order.createdAt).toLocaleDateString()}</td>
            <td>${order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Not delivered'}</td>
            <td>
                <select onchange="window.updateOrderStatus('${order._id}', this.value)" style="padding: 0.4rem;">
                    <option value="pending" ${order.status === 'pending' ? 'selected' : ''}>Pending</option>
                    <option value="confirmed" ${order.status === 'confirmed' ? 'selected' : ''}>Confirmed</option>
                    <option value="processing" ${order.status === 'processing' ? 'selected' : ''}>Processing</option>
                    <option value="shipped" ${order.status === 'shipped' ? 'selected' : ''}>Shipped</option>
                    <option value="delivered" ${order.status === 'delivered' ? 'selected' : ''}>Delivered</option>
                    <option value="cancelled" ${order.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                </select>
            </td>
        </tr>
    `).join('');
}

// Update order status
async function updateOrderStatus(orderId, status) {
    try {
        const deliveryDate = status === 'delivered' ? new Date().toISOString() : null;
        await adminAPI.updateOrderStatus(orderId, status, deliveryDate);
        alert('Order status updated successfully');
        
        // Reload data
        loadDashboard();
        if (document.getElementById('orders-tab').classList.contains('active')) {
            loadOrders();
        }
        if (document.getElementById('deliveries-tab').classList.contains('active')) {
            loadDeliveries();
        }
    } catch (error) {
        alert('Failed to update order status: ' + error.message);
    }
}

// Show add product modal
function showAddProductModal() {
    try {
        editingProductId = null;
        const modal = document.getElementById('product-modal');
        const title = document.getElementById('modal-title');
        const form = document.getElementById('product-form');
        
        if (!modal || !title || !form) {
            alert('Modal elements not found. Please refresh the page.');
            return;
        }
        
        title.textContent = 'Add Product';
        form.reset();
        modal.style.display = 'block';
        console.log('Add product modal opened');
    } catch (error) {
        console.error('Error opening modal:', error);
        alert('Failed to open modal: ' + error.message);
    }
}

// Hide product modal
function hideProductModal() {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.style.display = 'none';
        editingProductId = null;
        console.log('Product modal closed');
    }
}

// Close modal when clicking outside
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.getElementById('product-modal');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                hideProductModal();
            }
        });
    }
});

// Edit product
async function editProduct(productId) {
    try {
        const products = await adminAPI.getProducts();
        const product = products.find(p => p._id === productId);
        
        if (!product) {
            alert('Product not found');
            return;
        }

        editingProductId = productId;
        document.getElementById('modal-title').textContent = 'Edit Product';
        document.getElementById('product-name').value = product.name;
        document.getElementById('product-category').value = product.category;
        document.getElementById('product-price').value = product.price;
        document.getElementById('product-stock').value = product.stock;
        document.getElementById('product-image').value = product.image || '';
        document.getElementById('product-description').value = product.description || '';
        document.getElementById('product-modal').style.display = 'block';
    } catch (error) {
        alert('Failed to load product: ' + error.message);
    }
}

// Delete product
async function deleteProduct(productId) {
    if (!confirm('Are you sure you want to delete this product?')) {
        return;
    }

    try {
        console.log('Deleting product:', productId);
        await adminAPI.deleteProduct(productId);
        alert('Product deleted successfully');
        
        // Reload products specifically
        console.log('Reloading products after delete...');
        const products = await adminAPI.getProducts();
        console.log('Products after delete:', products.length);
        displayProducts(products);
        
        // Also reload stats
        const stats = await adminAPI.getStats();
        updateStats(stats);
    } catch (error) {
        console.error('Delete product error:', error);
        alert('Failed to delete product: ' + error.message);
    }
}

// Handle product form submission
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('product-form');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const productData = {
                name: document.getElementById('product-name').value,
                category: document.getElementById('product-category').value,
                price: parseFloat(document.getElementById('product-price').value),
                stock: parseInt(document.getElementById('product-stock').value),
                image: document.getElementById('product-image').value,
                description: document.getElementById('product-description').value
            };

            try {
                console.log('Saving product:', editingProductId ? 'Update' : 'Add', productData);
                
                if (editingProductId) {
                    await adminAPI.updateProduct(editingProductId, productData);
                    alert('Product updated successfully');
                } else {
                    const result = await adminAPI.addProduct(productData);
                    console.log('Product added:', result);
                    alert('Product added successfully');
                }
                
                hideProductModal();
                
                // Reload products specifically to ensure all products are shown
                console.log('Reloading products after save...');
                const products = await adminAPI.getProducts();
                console.log('Products after reload:', products.length);
                displayProducts(products);
                
                // Also reload stats
                const stats = await adminAPI.getStats();
                updateStats(stats);
            } catch (error) {
                console.error('Product save error:', error);
                alert('Failed to save product: ' + error.message);
            }
        });
    }
});

import { adminAPI } from './api.js';
import { checkAuth, logout } from './auth.js';

let editingProductId = null;

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
    
    console.log('Admin dashboard initialized');
});

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
        await adminAPI.deleteProduct(productId);
        alert('Product deleted successfully');
        loadDashboard();
    } catch (error) {
        alert('Failed to delete product: ' + error.message);
    }
}

// Handle product form submission
document.getElementById('product-form').addEventListener('submit', async (e) => {
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
        if (editingProductId) {
            await adminAPI.updateProduct(editingProductId, productData);
            alert('Product updated successfully');
        } else {
            await adminAPI.addProduct(productData);
            alert('Product added successfully');
        }
        
        hideProductModal();
        loadDashboard();
    } catch (error) {
        alert('Failed to save product: ' + error.message);
    }
});

// Functions are already set to window in DOMContentLoaded


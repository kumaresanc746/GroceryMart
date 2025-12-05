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
    
    document.getElementById('logout-link').addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
});

// Load dashboard data
async function loadDashboard() {
    try {
        const stats = await adminAPI.getStats();
        updateStats(stats);
        
        const products = await adminAPI.getProducts();
        displayProducts(products);
    } catch (error) {
        console.error('Error loading dashboard:', error);
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
    
    if (!products || products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="loading">No products found</td></tr>';
        return;
    }

    tbody.innerHTML = products.map(product => `
        <tr>
            <td><img src="${product.image || 'https://via.placeholder.com/50'}" alt="${product.name}" onerror="this.src='https://via.placeholder.com/50'"></td>
            <td>${product.name}</td>
            <td>${product.category}</td>
            <td>₹${product.price}</td>
            <td>${product.stock}</td>
            <td>
                <button class="btn-edit" onclick="editProduct('${product._id}')">Edit</button>
                <button class="btn-delete" onclick="deleteProduct('${product._id}')">Delete</button>
            </td>
        </tr>
    `).join('');
}

// Show add product modal
function showAddProductModal() {
    editingProductId = null;
    document.getElementById('modal-title').textContent = 'Add Product';
    document.getElementById('product-form').reset();
    document.getElementById('product-modal').style.display = 'block';
}

// Hide product modal
function hideProductModal() {
    document.getElementById('product-modal').style.display = 'none';
    editingProductId = null;
}

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

window.showAddProductModal = showAddProductModal;
window.hideProductModal = hideProductModal;
window.editProduct = editProduct;
window.deleteProduct = deleteProduct;


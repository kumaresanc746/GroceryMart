import { productAPI, cartAPI } from './api.js';
import { checkAuth } from './auth.js';

let allProducts = [];

// Load all products
async function loadProducts() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');
        
        if (category) {
            document.getElementById('category-filter').value = category;
            allProducts = await productAPI.getByCategory(category);
        } else {
            allProducts = await productAPI.getAll();
        }
        
        displayProducts(allProducts);
        updateCartCount();
    } catch (error) {
        document.getElementById('products-grid').innerHTML = 
            `<div class="error">Error loading products: ${error.message}</div>`;
    }
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('products-grid');
    if (products.length === 0) {
        container.innerHTML = '<div class="loading">No products found</div>';
        return;
    }

    container.innerHTML = products.map(product => `
        <div class="product-card" onclick="window.location.href='product-details.html?id=${product._id}'">
            <img src="${product.image || 'https://via.placeholder.com/200'}" alt="${product.name}" class="product-image" onerror="this.src='https://via.placeholder.com/200'">
            <div class="product-info">
                <div class="product-name">${product.name}</div>
                <div class="product-category">${product.category}</div>
                <div class="product-price">₹${product.price}</div>
                <div class="product-stock">Stock: ${product.stock}</div>
                <button class="btn-add-cart" onclick="event.stopPropagation(); addToCart('${product._id}')" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `).join('');
}

// Add to cart
async function addToCart(productId) {
    const token = localStorage.getItem('token');
    if (!token) {
        if (confirm('Please login to add items to cart. Do you want to login now?')) {
            window.location.href = 'login.html';
        }
        return;
    }

    try {
        await cartAPI.add(productId, 1);
        updateCartCount();
        alert('Product added to cart!');
    } catch (error) {
        if (error.message.includes('401') || error.message.includes('token')) {
            if (confirm('Session expired. Please login again. Do you want to login now?')) {
                window.location.href = 'login.html';
            }
        } else {
            alert('Failed to add to cart: ' + error.message);
        }
    }
}

// Update cart count
async function updateCartCount() {
    const token = localStorage.getItem('token');
    if (!token) {
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = '0';
        }
        return;
    }

    try {
        const cart = await cartAPI.get();
        const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = count;
        }
    } catch (error) {
        // Silently fail for cart count
        const cartCountEl = document.getElementById('cart-count');
        if (cartCountEl) {
            cartCountEl.textContent = '0';
        }
    }
}

// Category filter
document.getElementById('category-filter').addEventListener('change', (e) => {
    const category = e.target.value;
    if (category) {
        window.location.href = `products.html?category=${category}`;
    } else {
        window.location.href = 'products.html';
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProducts();
});

window.addToCart = addToCart;


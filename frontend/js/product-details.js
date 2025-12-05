import { productAPI, cartAPI } from './api.js';
import { checkAuth } from './auth.js';

let product = null;
let quantity = 1;

// Load product details
async function loadProductDetails() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const productId = urlParams.get('id');
        
        if (!productId) {
            throw new Error('Product ID not found');
        }

        product = await productAPI.getById(productId);
        displayProductDetails();
        updateCartCount();
    } catch (error) {
        document.getElementById('product-details').innerHTML = 
            `<div class="error">Error loading product: ${error.message}</div>`;
    }
}

// Display product details
function displayProductDetails() {
    const container = document.getElementById('product-details');
    container.innerHTML = `
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
                <img src="${product.image || 'https://via.placeholder.com/400'}" 
                     alt="${product.name}" 
                     style="width: 100%; border-radius: 10px;"
                     onerror="this.src='https://via.placeholder.com/400'">
            </div>
            <div>
                <h1 style="margin-bottom: 1rem;">${product.name}</h1>
                <div style="color: #666; margin-bottom: 1rem;">Category: ${product.category}</div>
                <div style="font-size: 2rem; color: var(--primary-color); font-weight: bold; margin-bottom: 1rem;">
                    ₹${product.price}
                </div>
                <div style="margin-bottom: 1rem;">
                    <strong>Stock:</strong> ${product.stock} units available
                </div>
                ${product.description ? `<div style="margin-bottom: 1rem;">${product.description}</div>` : ''}
                <div style="margin-bottom: 1rem;">
                    <label>Quantity:</label>
                    <div style="display: flex; align-items: center; gap: 1rem; margin-top: 0.5rem;">
                        <button class="quantity-btn" onclick="changeQuantity(-1)">-</button>
                        <span id="quantity-display" style="font-size: 1.2rem; min-width: 30px; text-align: center;">${quantity}</span>
                        <button class="quantity-btn" onclick="changeQuantity(1)">+</button>
                    </div>
                </div>
                <button class="btn-primary" onclick="addToCart()" style="width: 100%; padding: 1rem; font-size: 1.1rem;" ${product.stock === 0 ? 'disabled' : ''}>
                    ${product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
        </div>
    `;
}

// Change quantity
function changeQuantity(delta) {
    quantity = Math.max(1, Math.min(quantity + delta, product.stock));
    document.getElementById('quantity-display').textContent = quantity;
}

// Add to cart
async function addToCart() {
    try {
        await cartAPI.add(product._id, quantity);
        updateCartCount();
        alert('Product added to cart!');
    } catch (error) {
        alert('Failed to add to cart: ' + error.message);
    }
}

// Update cart count
async function updateCartCount() {
    try {
        const cart = await cartAPI.get();
        const count = cart.items ? cart.items.reduce((sum, item) => sum + item.quantity, 0) : 0;
        document.getElementById('cart-count').textContent = count;
    } catch (error) {
        console.error('Error updating cart count:', error);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadProductDetails();
});

window.changeQuantity = changeQuantity;
window.addToCart = addToCart;


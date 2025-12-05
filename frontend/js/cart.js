import { cartAPI, orderAPI } from './api.js';
import { checkAuth } from './auth.js';

let cart = null;

// Load cart
async function loadCart() {
    try {
        cart = await cartAPI.get();
        displayCart();
        updateCartCount();
    } catch (error) {
        document.getElementById('cart-items').innerHTML = 
            `<div class="error">Error loading cart: ${error.message}</div>`;
    }
}

// Display cart items
function displayCart() {
    const container = document.getElementById('cart-items');
    
    if (!cart.items || cart.items.length === 0) {
        container.innerHTML = '<div class="loading">Your cart is empty</div>';
        document.getElementById('checkout-btn').disabled = true;
        document.getElementById('cart-total').textContent = '0';
        return;
    }

    container.innerHTML = cart.items.map(item => `
        <div class="cart-item">
            <img src="${item.product.image || 'https://via.placeholder.com/80'}" 
                 alt="${item.product.name}" 
                 class="cart-item-image"
                 onerror="this.src='https://via.placeholder.com/80'">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.product.name}</div>
                <div class="cart-item-price">₹${item.product.price} each</div>
            </div>
            <div class="cart-item-quantity">
                <button class="quantity-btn" onclick="updateQuantity('${item.product._id}', ${item.quantity - 1})">-</button>
                <span>${item.quantity}</span>
                <button class="quantity-btn" onclick="updateQuantity('${item.product._id}', ${item.quantity + 1})">+</button>
            </div>
            <div style="font-weight: bold; margin-left: 1rem;">
                ₹${item.product.price * item.quantity}
            </div>
            <button class="btn-delete" onclick="removeItem('${item.product._id}')" style="margin-left: 1rem;">Remove</button>
        </div>
    `).join('');

    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    document.getElementById('cart-total').textContent = total;
    document.getElementById('checkout-btn').disabled = false;
}

// Update quantity
async function updateQuantity(productId, newQuantity) {
    if (newQuantity < 1) {
        await removeItem(productId);
        return;
    }
    
    try {
        await cartAPI.update(productId, newQuantity);
        await loadCart();
    } catch (error) {
        alert('Failed to update quantity: ' + error.message);
    }
}

// Remove item
async function removeItem(productId) {
    try {
        await cartAPI.remove(productId);
        await loadCart();
    } catch (error) {
        alert('Failed to remove item: ' + error.message);
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

// Checkout
async function checkout() {
    try {
        const orderData = {
            items: cart.items.map(item => ({
                productId: item.product._id,
                quantity: item.quantity,
                price: item.product.price
            })),
            totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
        };

        const order = await orderAPI.create(orderData);
        alert('Order placed successfully!');
        window.location.href = 'profile.html';
    } catch (error) {
        alert('Checkout failed: ' + error.message);
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCart();
});

window.updateQuantity = updateQuantity;
window.removeItem = removeItem;
window.checkout = checkout;


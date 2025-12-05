import { cartAPI, orderAPI } from './api.js';
import { checkAuth } from './auth.js';

let cart = null;

// Load checkout data
async function loadCheckout() {
    try {
        cart = await cartAPI.get();
        displayCheckoutSummary();
    } catch (error) {
        alert('Failed to load cart: ' + error.message);
        window.location.href = 'cart.html';
    }
}

// Display checkout summary
function displayCheckoutSummary() {
    const container = document.getElementById('checkout-summary');
    const total = cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
    
    container.innerHTML = `
        <div style="background: #f5f5f5; padding: 1rem; border-radius: 5px;">
            <h3 style="margin-bottom: 1rem;">Order Summary</h3>
            ${cart.items.map(item => `
                <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                    <span>${item.product.name} x ${item.quantity}</span>
                    <span>₹${item.product.price * item.quantity}</span>
                </div>
            `).join('')}
            <div style="border-top: 2px solid #ddd; margin-top: 1rem; padding-top: 1rem; display: flex; justify-content: space-between; font-weight: bold; font-size: 1.2rem;">
                <span>Total:</span>
                <span>₹${total}</span>
            </div>
        </div>
    `;
}

// Handle checkout form
document.getElementById('checkout-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const orderData = {
        items: cart.items.map(item => ({
            productId: item.product._id,
            quantity: item.quantity,
            price: item.product.price
        })),
        totalAmount: cart.items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
        deliveryAddress: document.getElementById('delivery-address').value,
        paymentMethod: document.getElementById('payment-method').value
    };

    try {
        const order = await orderAPI.create(orderData);
        alert('Order placed successfully! Order ID: ' + order._id.slice(-8));
        window.location.href = 'profile.html';
    } catch (error) {
        alert('Checkout failed: ' + error.message);
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadCheckout();
});


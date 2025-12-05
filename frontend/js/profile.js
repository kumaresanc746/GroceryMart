import { orderAPI } from './api.js';
import { checkAuth } from './auth.js';

// Load order history
async function loadOrders() {
    try {
        const orders = await orderAPI.getHistory();
        displayOrders(orders);
    } catch (error) {
        document.getElementById('orders-list').innerHTML = 
            `<div class="error">Error loading orders: ${error.message}</div>`;
    }
}

// Display orders
function displayOrders(orders) {
    const container = document.getElementById('orders-list');
    
    if (!orders || orders.length === 0) {
        container.innerHTML = '<div class="loading">No orders yet</div>';
        return;
    }

    container.innerHTML = orders.map(order => `
        <div class="order-item">
            <div style="display: flex; justify-content: space-between; align-items: start;">
                <div>
                    <div style="font-weight: bold; margin-bottom: 0.5rem;">Order #${order._id.slice(-8)}</div>
                    <div style="color: #666; margin-bottom: 0.5rem;">Date: ${new Date(order.createdAt).toLocaleDateString()}</div>
                    <div style="margin-bottom: 0.5rem;">
                        Items: ${order.items.length} | Total: ₹${order.totalAmount}
                    </div>
                    <div style="color: ${order.status === 'delivered' ? 'green' : order.status === 'pending' ? 'orange' : 'blue'};">
                        Status: ${order.status.toUpperCase()}
                    </div>
                </div>
            </div>
        </div>
    `).join('');
}

// Update address
async function updateAddress() {
    const address = document.getElementById('address-input').value;
    if (!address) {
        alert('Please enter an address');
        return;
    }
    
    // This would require an API endpoint to update user address
    alert('Address update feature coming soon!');
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    loadOrders();
});


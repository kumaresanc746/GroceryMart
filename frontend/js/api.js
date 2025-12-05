// API Base URL - Update this for production
const API_BASE_URL = window.location.hostname === 'localhost' 
    ? 'http://localhost:3000/api' 
    : '/api';

// Helper function to get auth token
function getAuthToken() {
    return localStorage.getItem('token');
}

// Helper function to make API calls
async function apiCall(endpoint, options = {}) {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, {
            ...options,
            headers
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'An error occurred');
        }

        return data;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}

// Auth APIs
export const authAPI = {
    login: async (email, password) => {
        return apiCall('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    },

    signup: async (userData) => {
        return apiCall('/auth/signup', {
            method: 'POST',
            body: JSON.stringify(userData)
        });
    },

    adminLogin: async (email, password) => {
        return apiCall('/admin/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });
    }
};

// Product APIs
export const productAPI = {
    getAll: async () => {
        return apiCall('/products');
    },

    getById: async (id) => {
        return apiCall(`/products/${id}`);
    },

    getByCategory: async (category) => {
        return apiCall(`/products?category=${category}`);
    }
};

// Cart APIs
export const cartAPI = {
    get: async () => {
        return apiCall('/cart');
    },

    add: async (productId, quantity = 1) => {
        return apiCall('/cart/add', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    },

    remove: async (productId) => {
        return apiCall('/cart/remove', {
            method: 'POST',
            body: JSON.stringify({ productId })
        });
    },

    update: async (productId, quantity) => {
        return apiCall('/cart/update', {
            method: 'POST',
            body: JSON.stringify({ productId, quantity })
        });
    }
};

// Order APIs
export const orderAPI = {
    create: async (orderData) => {
        return apiCall('/orders/create', {
            method: 'POST',
            body: JSON.stringify(orderData)
        });
    },

    getHistory: async () => {
        return apiCall('/orders/history');
    }
};

// Admin APIs
export const adminAPI = {
    getStats: async () => {
        return apiCall('/admin/stats');
    },

    getProducts: async () => {
        return apiCall('/admin/products');
    },

    addProduct: async (productData) => {
        const formData = new FormData();
        Object.keys(productData).forEach(key => {
            formData.append(key, productData[key]);
        });
        
        const token = getAuthToken();
        const response = await fetch(`${API_BASE_URL}/admin/products/add`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData
        });
        return response.json();
    },

    updateProduct: async (id, productData) => {
        return apiCall(`/admin/products/update/${id}`, {
            method: 'PUT',
            body: JSON.stringify(productData)
        });
    },

    deleteProduct: async (id) => {
        return apiCall(`/admin/products/delete/${id}`, {
            method: 'DELETE'
        });
    },

    getUsers: async () => {
        return apiCall('/admin/users');
    },

    getOrders: async () => {
        return apiCall('/admin/orders');
    }
};


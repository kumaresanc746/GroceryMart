const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');
const { authenticate, isAdmin, generateToken } = require('../middleware/auth');

// Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const admin = await User.findOne({ email, role: 'admin' });
        if (!admin) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const isMatch = await admin.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid admin credentials' });
        }

        const token = generateToken(admin._id);

        res.json({
            message: 'Admin login successful',
            token,
            adminId: admin._id
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Dashboard Stats
router.get('/stats', authenticate, isAdmin, async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const lowStockCount = await Product.countDocuments({ stock: { $lt: 10 } });
        const totalCustomers = await User.countDocuments({ role: 'user' });
        const pendingOrders = await Order.countDocuments({ status: 'pending' });
        
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const deliveriesToday = await Order.countDocuments({
            status: 'delivered',
            deliveryDate: { $gte: today }
        });

        res.json({
            totalProducts,
            lowStockCount,
            totalCustomers,
            pendingOrders,
            deliveriesToday
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Products (Admin)
router.get('/products', authenticate, isAdmin, async (req, res) => {
    try {
        const products = await Product.find().sort({ createdAt: -1 });
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add Product
router.post('/products/add', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, category, price, stock, image, description } = req.body;

        const product = new Product({
            name,
            category,
            price: parseFloat(price),
            stock: parseInt(stock),
            image: image || '',
            description: description || ''
        });

        await product.save();
        res.status(201).json({ message: 'Product added successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Product
router.put('/products/update/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const { name, category, price, stock, image, description } = req.body;

        const product = await Product.findByIdAndUpdate(
            req.params.id,
            {
                name,
                category,
                price: parseFloat(price),
                stock: parseInt(stock),
                image: image || '',
                description: description || ''
            },
            { new: true }
        );

        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product updated successfully', product });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete Product
router.delete('/products/delete/:id', authenticate, isAdmin, async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Users
router.get('/users', authenticate, isAdmin, async (req, res) => {
    try {
        const users = await User.find({ role: 'user' }).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get All Orders
router.get('/orders', authenticate, isAdmin, async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('user', 'name email phone')
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


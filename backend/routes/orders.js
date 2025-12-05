const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// Create Order
router.post('/create', authenticate, async (req, res) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

        // Validate items and update stock
        for (const item of items) {
            const product = await Product.findById(item.productId);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.productId} not found` });
            }
            if (product.stock < item.quantity) {
                return res.status(400).json({ message: `Insufficient stock for ${product.name}` });
            }
            
            // Update stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Create order
        const order = new Order({
            user: req.user._id,
            items: items.map(item => ({
                product: item.productId,
                quantity: item.quantity,
                price: item.price
            })),
            totalAmount,
            deliveryAddress: deliveryAddress || req.user.address,
            paymentMethod: paymentMethod || 'cod',
            status: 'pending'
        });

        await order.save();
        await order.populate('items.product', 'name image');

        // Clear cart
        await Cart.findOneAndUpdate(
            { user: req.user._id },
            { items: [] }
        );

        res.status(201).json({ message: 'Order created successfully', order });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get Order History
router.get('/history', authenticate, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.product', 'name image price')
            .sort({ createdAt: -1 });
        
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


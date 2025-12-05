const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');
const Product = require('../models/Product');
const { authenticate } = require('../middleware/auth');

// Get Cart
router.get('/', authenticate, async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Add to Cart
router.post('/add', authenticate, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        const existingItem = cart.items.find(item => item.product.toString() === productId);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.items.push({ product: productId, quantity });
        }

        await cart.save();
        await cart.populate('items.product');

        res.json({ message: 'Item added to cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Remove from Cart
router.post('/remove', authenticate, async (req, res) => {
    try {
        const { productId } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        cart.items = cart.items.filter(item => item.product.toString() !== productId);
        await cart.save();
        await cart.populate('items.product');

        res.json({ message: 'Item removed from cart', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update Cart Item Quantity
router.post('/update', authenticate, async (req, res) => {
    try {
        const { productId, quantity } = req.body;

        const cart = await Cart.findOne({ user: req.user._id });
        
        if (!cart) {
            return res.status(404).json({ message: 'Cart not found' });
        }

        const item = cart.items.find(item => item.product.toString() === productId);
        
        if (!item) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        const product = await Product.findById(productId);
        if (product.stock < quantity) {
            return res.status(400).json({ message: 'Insufficient stock' });
        }

        item.quantity = quantity;
        await cart.save();
        await cart.populate('items.product');

        res.json({ message: 'Cart updated', cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;


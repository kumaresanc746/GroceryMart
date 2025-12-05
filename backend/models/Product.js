const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        index: true
    },
    category: {
        type: String,
        required: true,
        enum: ['Fruits', 'Vegetables', 'Dairy', 'Snacks', 'Beverages', 'Household', 'Staples', 'Personal Care'],
        index: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    image: {
        type: String,
        default: ''
    },
    description: {
        type: String,
        default: ''
    }
}, {
    timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Product', productSchema);


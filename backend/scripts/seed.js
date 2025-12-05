const mongoose = require('mongoose');
const Product = require('../models/Product');
const User = require('../models/User');
require('dotenv').config();

const products = [
    // Fruits
    { name: 'Apple', category: 'Fruits', price: 120, stock: 50, image: 'https://images.unsplash.com/photo-1560806887-1e4cd0b27c91?w=400', description: 'Fresh red apples' },
    { name: 'Banana', category: 'Fruits', price: 60, stock: 100, image: 'https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400', description: 'Ripe yellow bananas' },
    { name: 'Orange', category: 'Fruits', price: 80, stock: 75, image: 'https://images.unsplash.com/photo-1580052614034-c55d20bfee3b?w=400', description: 'Sweet oranges' },
    { name: 'Mango', category: 'Fruits', price: 150, stock: 40, image: 'https://images.unsplash.com/photo-1605027990121-cbae0c0b0c0b?w=400', description: 'Seasonal mangoes' },
    { name: 'Grapes', category: 'Fruits', price: 200, stock: 30, image: 'https://images.unsplash.com/photo-1599599810769-3c0a58b42e77?w=400', description: 'Fresh green grapes' },
    
    // Vegetables
    { name: 'Tomato', category: 'Vegetables', price: 40, stock: 80, image: 'https://images.unsplash.com/photo-1546093352-8b9534b1c1f3?w=400', description: 'Fresh red tomatoes' },
    { name: 'Onion', category: 'Vegetables', price: 35, stock: 90, image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400', description: 'White onions' },
    { name: 'Potato', category: 'Vegetables', price: 30, stock: 100, image: 'https://images.unsplash.com/photo-1518977822534-7049a61ee0c2?w=400', description: 'Fresh potatoes' },
    { name: 'Carrot', category: 'Vegetables', price: 50, stock: 60, image: 'https://images.unsplash.com/photo-1445282768818-728615cc910a?w=400', description: 'Organic carrots' },
    { name: 'Spinach', category: 'Vegetables', price: 25, stock: 45, image: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=400', description: 'Fresh spinach leaves' },
    
    // Dairy
    { name: 'Milk', category: 'Dairy', price: 60, stock: 50, image: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400', description: 'Fresh cow milk 1L' },
    { name: 'Butter', category: 'Dairy', price: 120, stock: 40, image: 'https://images.unsplash.com/photo-1589985270826-4b7fe135a9c4?w=400', description: 'Pure butter 500g' },
    { name: 'Cheese', category: 'Dairy', price: 200, stock: 30, image: 'https://images.unsplash.com/photo-1618164436241-4473940d1f5c?w=400', description: 'Processed cheese 200g' },
    { name: 'Yogurt', category: 'Dairy', price: 45, stock: 55, image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400', description: 'Fresh yogurt 500g' },
    
    // Snacks
    { name: 'Potato Chips', category: 'Snacks', price: 30, stock: 80, image: 'https://images.unsplash.com/photo-1612929633736-8d22b6b0e4c0?w=400', description: 'Crispy potato chips' },
    { name: 'Biscuits', category: 'Snacks', price: 50, stock: 70, image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400', description: 'Sweet biscuits pack' },
    { name: 'Chocolate', category: 'Snacks', price: 100, stock: 60, image: 'https://images.unsplash.com/photo-1606312619070-d48b4e001c59?w=400', description: 'Dark chocolate bar' },
    
    // Beverages
    { name: 'Coca Cola', category: 'Beverages', price: 40, stock: 100, image: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400', description: 'Cold drink 750ml' },
    { name: 'Orange Juice', category: 'Beverages', price: 80, stock: 50, image: 'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400', description: 'Fresh orange juice 1L' },
    { name: 'Tea', category: 'Beverages', price: 150, stock: 40, image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400', description: 'Premium tea leaves 250g' },
    { name: 'Coffee', category: 'Beverages', price: 300, stock: 35, image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400', description: 'Ground coffee 200g' },
    
    // Household
    { name: 'Detergent', category: 'Household', price: 150, stock: 45, image: 'https://images.unsplash.com/photo-1610557892470-55d9e80c0bce?w=400', description: 'Laundry detergent 1kg' },
    { name: 'Soap', category: 'Household', price: 30, stock: 90, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', description: 'Bathing soap bar' },
    { name: 'Toilet Paper', category: 'Household', price: 200, stock: 50, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400', description: 'Toilet paper roll pack' },
    
    // Staples
    { name: 'Rice', category: 'Staples', price: 80, stock: 60, image: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400', description: 'Basmati rice 1kg' },
    { name: 'Wheat Flour', category: 'Staples', price: 50, stock: 70, image: 'https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400', description: 'Whole wheat flour 1kg' },
    { name: 'Sugar', category: 'Staples', price: 45, stock: 80, image: 'https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400', description: 'White sugar 1kg' },
    
    // Personal Care
    { name: 'Shampoo', category: 'Personal Care', price: 180, stock: 40, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', description: 'Hair shampoo 400ml' },
    { name: 'Toothpaste', category: 'Personal Care', price: 90, stock: 65, image: 'https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400', description: 'Toothpaste 100g' },
    { name: 'Face Cream', category: 'Personal Care', price: 250, stock: 35, image: 'https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400', description: 'Moisturizing face cream' }
];

async function seedDatabase() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/grocerymart', {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert products
        await Product.insertMany(products);
        console.log(`Seeded ${products.length} products`);

        // Create admin user
        const adminExists = await User.findOne({ email: 'admin@grocerymart.com' });
        if (!adminExists) {
            const admin = new User({
                name: 'Admin User',
                email: 'admin@grocerymart.com',
                password: 'admin123',
                phone: '1234567890',
                role: 'admin'
            });
            await admin.save();
            console.log('Admin user created: admin@grocerymart.com / admin123');
        }

        console.log('Database seeding completed!');
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
}

seedDatabase();


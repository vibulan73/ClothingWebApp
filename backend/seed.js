const mongoose = require('mongoose');
const Product = require('./models/Product');
const User = require('./models/User');
const Order = require('./models/Order');

require('dotenv').config();

// Sample clothing products
const sampleProducts = [
  // Men's Clothing
  {
    name: "Classic White T-Shirt",
    description: "Comfortable cotton t-shirt perfect for everyday wear. Soft fabric with a relaxed fit.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 50
  },
  {
    name: "Denim Jacket",
    description: "Classic blue denim jacket with vintage wash. Perfect for layering over any outfit.",
    price: 79.99,
    imageUrl: "https://images.unsplash.com/photo-1544022613-e87ca75a784a?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 30
  },
  {
    name: "Slim Fit Jeans",
    description: "Dark wash slim fit jeans made from premium denim. Comfortable and stylish.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 40
  },
  {
    name: "Cotton Hoodie",
    description: "Soft cotton hoodie with kangaroo pocket. Perfect for casual wear and lounging.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 35
  },
  {
    name: "Polo Shirt",
    description: "Classic polo shirt in navy blue. Made from breathable cotton blend.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 45
  },
  {
    name: "Chino Pants",
    description: "Versatile chino pants in khaki color. Perfect for both casual and semi-formal occasions.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 25
  },
  {
    name: "Leather Jacket",
    description: "Genuine leather jacket with classic biker style. A timeless wardrobe essential.",
    price: 199.99,
    imageUrl: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 15
  },
  {
    name: "Cargo Shorts",
    description: "Comfortable cargo shorts with multiple pockets. Perfect for outdoor activities.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
    category: "Men",
    sizes: ["S", "M", "L", "XL"],
    stock: 30
  },

  // Women's Clothing
  {
    name: "Floral Summer Dress",
    description: "Beautiful floral print dress perfect for summer. Light and airy fabric.",
    price: 39.99,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 40
  },
  {
    name: "High-Waisted Jeans",
    description: "Trendy high-waisted jeans with a flattering fit. Made from stretch denim.",
    price: 54.99,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 35
  },
  {
    name: "Blouse with Ruffles",
    description: "Elegant white blouse with delicate ruffles. Perfect for office or special occasions.",
    price: 44.99,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 30
  },
  {
    name: "Knit Sweater",
    description: "Cozy knit sweater in soft pink. Perfect for layering during cooler months.",
    price: 49.99,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 25
  },
  {
    name: "Midi Skirt",
    description: "Elegant midi skirt in navy blue. Versatile piece that works for many occasions.",
    price: 34.99,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 20
  },
  {
    name: "Crop Top",
    description: "Trendy crop top in black. Perfect for pairing with high-waisted bottoms.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 35
  },
  {
    name: "Maxi Dress",
    description: "Flowing maxi dress in floral print. Perfect for summer events and vacations.",
    price: 59.99,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 28
  },
  {
    name: "Denim Skirt",
    description: "Classic denim skirt with A-line silhouette. A wardrobe staple.",
    price: 29.99,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    category: "Women",
    sizes: ["S", "M", "L", "XL"],
    stock: 32
  },

  // Kids' Clothing
  {
    name: "Kids' Graphic T-Shirt",
    description: "Fun graphic t-shirt for kids with colorful designs. Made from soft cotton.",
    price: 14.99,
    imageUrl: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 50
  },
  {
    name: "Kids' Hoodie",
    description: "Comfortable hoodie for kids with fun colors. Perfect for playtime and school.",
    price: 24.99,
    imageUrl: "https://images.unsplash.com/photo-1556821840-3a63f95609a4?w=400",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 40
  },
  {
    name: "Kids' Jeans",
    description: "Durable jeans for kids with reinforced knees. Comfortable for all-day wear.",
    price: 19.99,
    imageUrl: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=400",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 45
  },
  {
    name: "Kids' Dress",
    description: "Adorable dress for little ones with cute patterns. Perfect for special occasions.",
    price: 22.99,
    imageUrl: "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 35
  },
  {
    name: "Kids' Shorts",
    description: "Comfortable shorts for kids in various colors. Great for summer activities.",
    price: 12.99,
    imageUrl: "https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400",
    category: "Kids",
    sizes: ["S", "M", "L", "XL"],
    stock: 60
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI) ; 
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    await Order.deleteMany({});

    console.log('Cleared existing data');

    // Create admin user
    const adminUser = new User({
      name: 'Admin User',
      email: 'admin@alphaclothing.com',
      password: 'admin123',
      role: 'admin'
    });
    await adminUser.save();
    console.log('Created admin user (email: admin@alphaclothing.com, password: admin123)');

    // Insert sample products
    await Product.insertMany(sampleProducts);
    console.log('Inserted sample products');

    console.log('Database seeded successfully!');
    console.log('Admin credentials:');
    console.log('Email: admin@alphaclothing.com');
    console.log('Password: admin123');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

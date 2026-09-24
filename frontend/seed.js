const axios = require('axios');

const seedProducts = async () => {
  const products = [
    {
      name: "Mechanical Keyboard",
      description: "RGB mechanical keyboard with blue switches.",
      price: 2999,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=500&auto=format&fit=crop&q=60",
      stock: 10
    },
    {
      name: "Noise Cancelling Headphones",
      description: "Wireless over-ear headphones with active noise cancellation.",
      price: 4999,
      category: "Electronics",
      image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500&auto=format&fit=crop&q=60",
      stock: 25
    },
    {
      name: "Cotton T-Shirt",
      description: "100% pure cotton casual t-shirt. Breathable and comfortable.",
      price: 699,
      category: "Fashion",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60",
      stock: 50
    },
    {
      name: "Atomic Habits",
      description: "An Easy & Proven Way to Build Good Habits & Break Bad Ones.",
      price: 450,
      category: "Books",
      image: "https://images.unsplash.com/photo-1589829085413-56de8ae18c73?w=500&auto=format&fit=crop&q=60",
      stock: 100
    },
    {
      name: "Ceramic Coffee Mug",
      description: "Handcrafted ceramic mug, perfect for your morning brew.",
      price: 350,
      category: "Home",
      image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=500&auto=format&fit=crop&q=60",
      stock: 15
    }
  ];

  for (let p of products) {
    try {
      await axios.post('http://localhost:5000/products', p);
      console.log('Added:', p.name);
    } catch (err) {
      console.error('Failed to add:', p.name, err.response?.data || err.message);
    }
  }
};

seedProducts();

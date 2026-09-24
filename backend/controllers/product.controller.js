const mongoose = require('mongoose');
const Product = require('../models/product.model');

// @desc    Create a product
// @route   POST /products
// @access  Public
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category, image, stock } = req.body;

    // Validation
    if (!name || !description || price === undefined || !category || !image || stock === undefined) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (price <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid price, must be greater than 0' });
    }

    if (stock < 0) {
      return res.status(400).json({ success: false, message: 'Invalid stock, cannot be negative' });
    }

    const product = new Product({
      name,
      description,
      price,
      category,
      image,
      stock
    });

    await product.save();

    res.status(201).json(product);

  } catch (error) {
    console.error('Error creating product: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get all products (with search, category filter, and sorting)
// @route   GET /products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const { search, category, sort } = req.query;
    
    // Build query object
    let query = {};

    // 1. Search by name (case-insensitive)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // 2. Filter by category
    if (category && category !== 'All Categories') {
      query.category = category;
    }

    // Initialize Mongoose query
    let mongooseQuery = Product.find(query);

    // 3. Sorting (Bonus Challenge)
    if (sort) {
      if (sort === 'price_asc') {
        mongooseQuery = mongooseQuery.sort({ price: 1 });
      } else if (sort === 'price_desc') {
        mongooseQuery = mongooseQuery.sort({ price: -1 });
      }
    }

    // Execute query
    const products = await mongooseQuery;

    res.status(200).json({
      success: true,
      count: products.length,
      products
    });

  } catch (error) {
    console.error('Error fetching products: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get a single product by ID
// @route   GET /products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ success: false, message: 'Invalid product ID format' });
    }

    const product = await Product.findById(id);

    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    res.status(200).json(product);

  } catch (error) {
    console.error('Error fetching product: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById
};

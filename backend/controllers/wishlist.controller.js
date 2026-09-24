const Customer = require('../models/customer.model');
const Product = require('../models/product.model');

// @desc    Add product to wishlist
// @route   POST /wishlist/:productId
// @access  Private
const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    const customer = await Customer.findById(userId);

    // Check if already in wishlist
    if (customer.wishlist.includes(productId)) {
      return res.status(409).json({ success: false, message: 'Product already in wishlist' });
    }

    customer.wishlist.push(productId);
    await customer.save();

    res.status(200).json({ success: true, message: 'Product added to wishlist' });
  } catch (error) {
    console.error('Error adding to wishlist: ', error.message);
    // If productId is invalid format
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get current user's wishlist
// @route   GET /wishlist
// @access  Private
const getWishlist = async (req, res) => {
  try {
    const userId = req.user._id;

    const customer = await Customer.findById(userId).populate({
      path: 'wishlist',
      select: 'name description price category image stock'
    });

    res.status(200).json({
      success: true,
      count: customer.wishlist.length,
      wishlist: customer.wishlist
    });
  } catch (error) {
    console.error('Error fetching wishlist: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /wishlist/:productId
// @access  Private
const removeFromWishlist = async (req, res) => {
  try {
    const { productId } = req.params;
    const userId = req.user._id;

    const customer = await Customer.findById(userId);

    if (!customer.wishlist.includes(productId)) {
      return res.status(404).json({ success: false, message: 'Product not in wishlist' });
    }

    customer.wishlist = customer.wishlist.filter(id => id.toString() !== productId.toString());
    await customer.save();

    res.status(200).json({ success: true, message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing from wishlist: ', error.message);
    if (error.kind === 'ObjectId') {
      return res.status(400).json({ success: false, message: 'Invalid product ID' });
    }
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  addToWishlist,
  getWishlist,
  removeFromWishlist
};

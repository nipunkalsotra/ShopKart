const Customer = require('../models/customer.model');
const bcrypt = require('bcrypt');
const generateTokenAndSetCookie = require('../utils/generateToken');

// @desc    Register a new customer
// @route   POST /customers/register
// @access  Public
const registerCustomer = async (req, res) => {
  try {
    const { fullName, email, password, phone } = req.body;

    // Validation
    if (!fullName || !email || !password || !phone) {
      return res.status(400).json({ success: false, message: 'All fields are mandatory' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must contain at least 6 characters' });
    }

    // Check if email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(409).json({ success: false, message: 'Email already exists' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create customer
    const customer = new Customer({
      fullName,
      email,
      password: hashedPassword,
      phone
    });

    await customer.save();

    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      customer: {
        _id: customer._id,
        fullName: customer.fullName,
        email: customer.email,
        phone: customer.phone
      }
    });

  } catch (error) {
    console.error('Error in registerCustomer: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Authenticate customer
// @route   POST /customers/login
// @access  Public
const loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const customer = await Customer.findOne({ email });
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, customer.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    generateTokenAndSetCookie(customer._id, res);

    res.status(200).json({
      success: true,
      message: 'Login successful'
    });

  } catch (error) {
    console.error('Error in loginCustomer: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Get customer profile
// @route   GET /customers/me
// @access  Private
const getMyProfile = async (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.error('Error in getMyProfile: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Logout customer
// @route   POST /customers/logout
// @access  Private
const logoutCustomer = async (req, res) => {
  try {
    res.cookie('jwt', '', { maxAge: 0 });
    res.status(200).json({
      success: true,
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('Error in logoutCustomer: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

// @desc    Change Password (Bonus)
// @route   PATCH /customers/change-password
// @access  Private
const changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const customer = await Customer.findById(req.user._id);

    const isPasswordCorrect = await bcrypt.compare(oldPassword, customer.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ success: false, message: 'Invalid old password' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must contain at least 6 characters' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    customer.password = hashedPassword;
    await customer.save();

    res.status(200).json({
      success: true,
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Error in changePassword: ', error.message);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

module.exports = {
  registerCustomer,
  loginCustomer,
  getMyProfile,
  logoutCustomer,
  changePassword
};

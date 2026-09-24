const jwt = require('jsonwebtoken');
const Customer = require('../models/customer.model');

const protect = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;

    if (!token) {
      return res.status(401).json({ success: false, message: 'Unauthorized - No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded) {
      return res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
    }

    const customer = await Customer.findById(decoded.userId).select('-password');
    if (!customer) {
      return res.status(401).json({ success: false, message: 'Unauthorized - User not found' });
    }

    req.user = customer;
    next();
  } catch (error) {
    console.error('Error in auth middleware: ', error.message);
    res.status(401).json({ success: false, message: 'Unauthorized - Invalid token' });
  }
};

module.exports = { protect };

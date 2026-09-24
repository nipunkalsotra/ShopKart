require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const customerRoutes = require('./routes/customer.routes');
const productRoutes = require('./routes/product.routes');
const wishlistRoutes = require('./routes/wishlist.routes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Routes
app.use('/customers', customerRoutes);
app.use('/products', productRoutes);
app.use('/wishlist', wishlistRoutes);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
  });

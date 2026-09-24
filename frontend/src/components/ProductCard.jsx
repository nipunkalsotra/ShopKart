import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addToWishlist } from '../services/api';

const ProductCard = ({ product }) => {
  const [wishlistStatus, setWishlistStatus] = useState('default'); // 'default', 'loading', 'success', 'error'

  const handleAddToWishlist = async () => {
    if (wishlistStatus === 'loading' || wishlistStatus === 'success') return;
    
    try {
      setWishlistStatus('loading');
      await addToWishlist(product._id);
      setWishlistStatus('success');
    } catch (error) {
      if (error.response?.status === 409) {
        setWishlistStatus('success'); // Already in wishlist, treat as success for UI
      } else {
        setWishlistStatus('error');
        // Reset back to default after showing error briefly
        setTimeout(() => setWishlistStatus('default'), 3000);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-full">
      <div className="relative">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-48 object-cover"
        />
        <button
          onClick={handleAddToWishlist}
          disabled={wishlistStatus === 'loading' || wishlistStatus === 'success'}
          className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-sm font-semibold hover:bg-gray-100 transition"
        >
          {wishlistStatus === 'default' && '♡ Add to Wishlist'}
          {wishlistStatus === 'loading' && '⏳ Saving...'}
          {wishlistStatus === 'success' && '♥ Added to Wishlist'}
          {wishlistStatus === 'error' && '❌ Failed'}
        </button>
      </div>

      <div className="p-4 flex flex-col flex-grow">
        <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
          {product.category}
        </span>
        <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 truncate">
          {product.name}
        </h3>
        
        <div className="flex justify-between items-center mb-4 mt-auto">
          <span className="text-xl font-bold text-gray-900">
            ₹{product.price.toLocaleString('en-IN')}
          </span>
          <span className={`text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {product.stock > 0 ? `${product.stock} units left` : 'Out of stock'}
          </span>
        </div>
        
        <Link 
          to={`/products/${product._id}`}
          className="block w-full text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;

import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getWishlist, removeFromWishlist } from '../services/api';
import Navbar from '../components/Navbar';

const Wishlist = () => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getWishlist();
      setWishlist(response.data.wishlist);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Unable to load wishlist.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [navigate]);

  const handleRemove = async (productId) => {
    try {
      await removeFromWishlist(productId);
      // Remove from UI immediately
      setWishlist(wishlist.filter(item => item._id !== productId));
    } catch (err) {
      console.error('Failed to remove from wishlist:', err);
      alert('Unable to remove product from wishlist. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />

      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">My Wishlist</h1>
        
        {loading ? (
          <div className="flex-grow flex items-center justify-center">
            <p className="text-xl text-gray-600">Loading your wishlist...</p>
          </div>
        ) : error ? (
          <div className="flex-grow flex flex-col items-center justify-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={fetchWishlist}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Try Again
            </button>
          </div>
        ) : wishlist.length === 0 ? (
          <div className="flex-grow flex flex-col items-center justify-center text-center">
            <span className="text-6xl mb-4">❤️</span>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto">
              Save products you love and find them here later.
            </p>
            <Link 
              to="/products"
              className="px-6 py-3 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <>
            <p className="text-gray-600 mb-8">{wishlist.length} {wishlist.length === 1 ? 'product' : 'products'} saved</p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {wishlist.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <span className="text-xs font-semibold text-blue-600 uppercase tracking-wider">
                      {product.category}
                    </span>
                    <h3 className="text-lg font-bold text-gray-800 mt-1 mb-2 truncate">
                      {product.name}
                    </h3>
                    
                    <div className="flex justify-between items-center mb-4 mt-auto">
                      <span className="text-xl font-bold text-gray-900">
                        ₹{product.price?.toLocaleString('en-IN') || 0}
                      </span>
                    </div>
                    
                    <div className="flex gap-2 mt-auto">
                      <Link 
                        to={`/products/${product._id}`}
                        className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
                      >
                        View
                      </Link>
                      <button 
                        onClick={() => handleRemove(product._id)}
                        className="flex-1 text-center bg-red-50 text-red-600 py-2 rounded hover:bg-red-100 transition"
                      >
                        Remove ♥
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Wishlist;

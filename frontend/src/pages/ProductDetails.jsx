import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../services/api';
import Navbar from '../components/Navbar';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await getProductById(id);
        setProduct(response.data);
      } catch (err) {
        setError('Product not found or something went wrong.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center text-xl text-gray-600">Loading product details...</div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center">
          <p className="text-xl text-red-600 mb-4">{error}</p>
          <button 
            onClick={() => navigate('/products')}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <button 
          onClick={() => navigate('/products')}
          className="mb-6 text-blue-600 hover:underline flex items-center"
        >
          &larr; Back to Products
        </button>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          <div className="md:w-1/2 h-64 md:h-auto">
            <img 
              src={product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          </div>
          
          <div className="md:w-1/2 p-8 flex flex-col justify-center">
            <span className="text-sm font-semibold text-blue-600 uppercase tracking-wider mb-2">
              {product.category}
            </span>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {product.name}
            </h1>
            
            <p className="text-gray-600 mb-6 leading-relaxed">
              {product.description}
            </p>
            
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
            </div>
            
            <div className="flex items-center gap-4 mb-8">
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${product.stock > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                {product.stock > 0 ? `In Stock (${product.stock})` : 'Out of Stock'}
              </span>
            </div>
            
            <button 
              className={`w-full py-3 rounded text-lg font-bold transition ${
                product.stock > 0 
                ? 'bg-blue-600 text-white hover:bg-blue-700' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={product.stock === 0}
            >
              {product.stock > 0 ? 'Add to Cart' : 'Out of Stock'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;

import { useState, useEffect } from 'react';
import { getProducts } from '../services/api';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';

const CATEGORIES = ['All Categories', 'Electronics', 'Fashion', 'Books', 'Home'];

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All Categories');
  const [sort, setSort] = useState('');

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {};
      if (search) params.search = search;
      if (category !== 'All Categories') params.category = category;
      if (sort) params.sort = sort;

      const response = await getProducts(params);
      setProducts(response.data.products);
    } catch (err) {
      setError('Something went wrong while loading products.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch when filters change
  useEffect(() => {
    // Basic debounce for search typing could be added, but calling directly for now
    const delayDebounceFn = setTimeout(() => {
      fetchProducts();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [search, category, sort]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Discover Products</h1>
        
        {/* Filters Section */}
        <div className="bg-white p-4 rounded-lg shadow mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full md:w-1/3 px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={category} 
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <select 
              value={sort} 
              onChange={(e) => setSort(e.target.value)}
              className="px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="">Sort by Default</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Content Section */}
        {loading ? (
          <div className="text-center py-20 text-gray-600 text-xl">Loading products...</div>
        ) : error ? (
          <div className="text-center py-20 text-red-600 text-xl">{error}</div>
        ) : products.length === 0 ? (
          <div className="text-center py-20 text-gray-600 text-xl">No products found.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;

import { Link, useNavigate } from 'react-router-dom';
import { logoutCustomer } from '../services/api';

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logoutCustomer();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="bg-white shadow-md p-4 mb-8">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/home" className="text-xl font-bold text-blue-600">
          ShopKart
        </Link>
        <div className="flex items-center gap-6">
          <Link to="/products" className="text-gray-700 hover:text-blue-600 font-medium">
            Products
          </Link>
          <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 font-medium">
            Wishlist
          </Link>
          <button 
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded shadow"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

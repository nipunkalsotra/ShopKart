import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMyProfile } from '../services/api';
import Navbar from '../components/Navbar';

const Home = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getMyProfile();
        setUser(response.data);
      } catch (error) {
        // Redirect to login if not authenticated
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow p-6 max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome back, {user?.fullName}!</h1>
          
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-700 border-b pb-2">Your Profile Information</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg text-gray-900">{user?.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Email Address</p>
                <p className="text-lg text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Phone Number</p>
                <p className="text-lg text-gray-900">{user?.phone}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Account Created</p>
                <p className="text-lg text-gray-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

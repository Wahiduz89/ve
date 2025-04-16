import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

const Bookings = () => {
  const { userId } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all'); // all, active, completed, cancelled
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/bookings/user');
        setBookings(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching bookings:', err);
        setError('Failed to load bookings');
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchBookings();
    }
  }, [userId]);
  
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) {
      return;
    }
    
    try {
      const response = await axios.put(`/api/bookings/${bookingId}/status`, {
        status: 'cancelled',
        cancellationReason: 'Customer requested cancellation',
      });
      
      // Update booking in state
      setBookings(prevBookings =>
        prevBookings.map(booking =>
          booking._id === bookingId ? { ...booking, status: 'cancelled' } : booking
        )
      );
      
      toast.success('Booking cancelled successfully');
    } catch (err) {
      console.error('Error cancelling booking:', err);
      toast.error(err.response?.data?.error || 'Failed to cancel booking');
    }
  };
  
  const filteredBookings = bookings.filter(booking => {
    if (activeTab === 'all') return true;
    if (activeTab === 'active') return booking.status === 'confirmed' || booking.status === 'pending';
    if (activeTab === 'completed') return booking.status === 'completed';
    if (activeTab === 'cancelled') return booking.status === 'cancelled';
    return true;
  });
  
  if (loading) {
    return (
      <div className="container py-12">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container py-12">
        <div className="text-center text-red-500">
          <p className="text-xl">{error}</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="container py-12">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Bookings</h1>
      
      {/* Tabs */}
      <div className="flex border-b border-gray-200 mb-8">
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'all' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('all')}
        >
          All Bookings
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'active' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('active')}
        >
          Active
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'completed' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed
        </button>
        <button
          className={`py-2 px-4 font-medium text-sm ${activeTab === 'cancelled' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-gray-500 hover:text-gray-700'}`}
          onClick={() => setActiveTab('cancelled')}
        >
          Cancelled
        </button>
      </div>
      
      {filteredBookings.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600 mb-4">
            {activeTab === 'all'
              ? "You don't have any bookings yet."
              : activeTab === 'active'
              ? "You don't have any active bookings."
              : activeTab === 'completed'
              ? "You don't have any completed bookings."
              : "You don't have any cancelled bookings."}
          </p>
          {activeTab === 'all' && (
            <Link to="/cars" className="btn btn-primary">
              Browse Cars
            </Link>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Car
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Details
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Dates
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr key={booking._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img 
                            className="h-10 w-10 rounded-full object-cover" 
                            src={booking.car.images[0]} 
                            alt={`${booking.car.make} ${booking.car.model}`} 
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {booking.car.make} {booking.car.model}
                          </div>
                          <div className="text-sm text-gray-500">
                            {booking.car.year}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        Booking ID: {booking._id.substring(0, 8)}...
                      </div>
                      <div className="text-sm text-gray-500">
                        Created: {format(new Date(booking.createdAt), 'MMM dd, yyyy')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {format(new Date(booking.startDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        to {format(new Date(booking.endDate), 'MMM dd, yyyy')}
                      </div>
                      <div className="text-sm text-gray-500">
                        ({booking.totalDays} days)
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${booking.status === 'confirmed' ? 'bg-green-100 text-green-800' : booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : booking.status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      ${booking.totalPrice.toFixed(2)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex flex-col space-y-2">
                        <Link 
                          to={`/my-bookings/${booking._id}`} 
                          className="text-primary-600 hover:text-primary-900"
                        >
                          View Details
                        </Link>
                        {(booking.status === 'confirmed' || booking.status === 'pending') && (
                          <button
                            onClick={() => handleCancelBooking(booking._id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
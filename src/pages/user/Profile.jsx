import { useState, useEffect } from 'react';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { UserIcon, PhoneIcon, EnvelopeIcon, HomeIcon } from '@heroicons/react/24/outline';

const Profile = () => {
  const { userId } = useAuthContext();
  
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: '',
    },
    driverLicense: {
      number: '',
      expiryDate: '',
      state: '',
    },
  });
  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/users/profile');
        setUser(response.data);
        
        // Populate form data
        setFormData({
          firstName: response.data.firstName || '',
          lastName: response.data.lastName || '',
          email: response.data.email || '',
          phone: response.data.phone || '',
          address: {
            street: response.data.address?.street || '',
            city: response.data.address?.city || '',
            state: response.data.address?.state || '',
            zipCode: response.data.address?.zipCode || '',
            country: response.data.address?.country || '',
          },
          driverLicense: {
            number: response.data.driverLicense?.number || '',
            expiryDate: response.data.driverLicense?.expiryDate ? response.data.driverLicense.expiryDate.substring(0, 10) : '',
            state: response.data.driverLicense?.state || '',
          },
        });
        
        setLoading(false);
      } catch (err) {
        console.error('Error fetching user profile:', err);
        setError('Failed to load user profile');
        setLoading(false);
      }
    };
    
    if (userId) {
      fetchUserProfile();
    }
  }, [userId]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (address, driverLicense)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setSaving(true);
      const response = await axios.put('/api/users/profile', formData);
      setUser(response.data);
      toast.success('Profile updated successfully');
      setSaving(false);
    } catch (err) {
      console.error('Error updating profile:', err);
      toast.error(err.response?.data?.error || 'Failed to update profile');
      setSaving(false);
    }
  };
  
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
      <h1 className="text-3xl font-bold text-gray-900 mb-8">My Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="h-24 w-24 bg-primary-100 rounded-full flex items-center justify-center mb-4">
                <UserIcon className="h-12 w-12 text-primary-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900">
                {user?.firstName} {user?.lastName}
              </h2>
              <p className="text-gray-600">{user?.email}</p>
              
              {user?.loyaltyPoints > 0 && (
                <div className="mt-4 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium">
                  {user.loyaltyPoints} Loyalty Points
                </div>
              )}
            </div>
            
            <div className="border-t border-gray-200 pt-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user?.phone || 'No phone number'}</span>
                </div>
                <div className="flex items-center">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{user?.email}</span>
                </div>
                <div className="flex items-start">
                  <HomeIcon className="h-5 w-5 text-gray-400 mr-2 mt-0.5" />
                  <div>
                    {user?.address?.street ? (
                      <>
                        <p className="text-gray-600">{user.address.street}</p>
                        <p className="text-gray-600">
                          {user.address.city}, {user.address.state} {user.address.zipCode}
                        </p>
                        <p className="text-gray-600">{user.address.country}</p>
                      </>
                    ) : (
                      <span className="text-gray-600">No address provided</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="border-t border-gray-200 pt-6 mt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Member Since</span>
                  <span className="text-gray-900">
                    {new Date(user?.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Bookings</span>
                  <span className="text-gray-900">{user?.bookingHistory?.length || 0}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Edit Profile Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Edit Profile</h2>
            
            <form onSubmit={handleSubmit}>
              {/* Personal Information */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      disabled
                    />
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              
              {/* Address */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Address</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
                    <input
                      type="text"
                      id="street"
                      name="address.street"
                      value={formData.address.street}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <input
                      type="text"
                      id="city"
                      name="address.city"
                      value={formData.address.city}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State / Province</label>
                    <input
                      type="text"
                      id="state"
                      name="address.state"
                      value={formData.address.state}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">ZIP / Postal Code</label>
                    <input
                      type="text"
                      id="zipCode"
                      name="address.zipCode"
                      value={formData.address.zipCode}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                    <input
                      type="text"
                      id="country"
                      name="address.country"
                      value={formData.address.country}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              
              {/* Driver's License */}
              <div className="mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Driver's License Information</h3>
                <p className="text-sm text-gray-600 mb-4">
                  This information is required for car rentals and will be verified during pickup.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="licenseNumber" className="block text-sm font-medium text-gray-700 mb-1">License Number</label>
                    <input
                      type="text"
                      id="licenseNumber"
                      name="driverLicense.number"
                      value={formData.driverLicense.number}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="licenseState" className="block text-sm font-medium text-gray-700 mb-1">Issuing State</label>
                    <input
                      type="text"
                      id="licenseState"
                      name="driverLicense.state"
                      value={formData.driverLicense.state}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                  <div>
                    <label htmlFor="licenseExpiry" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date</label>
                    <input
                      type="date"
                      id="licenseExpiry"
                      name="driverLicense.expiryDate"
                      value={formData.driverLicense.expiryDate}
                      onChange={handleChange}
                      className="input"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
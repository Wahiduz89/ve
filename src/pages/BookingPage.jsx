import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';
import { CalendarIcon, CreditCardIcon, TruckIcon, UserIcon } from '@heroicons/react/24/outline';

const BookingPage = () => {
  const { carId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useAuthContext();
  
  // Get car and dates from location state or fetch them
  const [car, setCar] = useState(location.state?.car || null);
  const [startDate, setStartDate] = useState(
    location.state?.startDate ? new Date(location.state.startDate) : new Date()
  );
  const [endDate, setEndDate] = useState(
    location.state?.endDate ? new Date(location.state.endDate) : new Date(new Date().setDate(new Date().getDate() + 3))
  );
  
  const [loading, setLoading] = useState(!car);
  const [error, setError] = useState(null);
  const [bookingStep, setBookingStep] = useState(1); // 1: Details, 2: Payment, 3: Confirmation
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    pickupLocation: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    dropoffLocation: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    sameDropoff: true,
    paymentMethod: 'credit_card',
    additionalServices: [],
    specialRequests: '',
    billingAddress: {
      address: '',
      city: '',
      state: '',
      zipCode: '',
    },
    sameAsBilling: true,
  });
  
  // Available additional services
  const additionalServices = [
    { id: 'insurance', name: 'Full Insurance Coverage', price: 25 },
    { id: 'childSeat', name: 'Child Seat', price: 10 },
    { id: 'gps', name: 'GPS Navigation', price: 5 },
    { id: 'additionalDriver', name: 'Additional Driver', price: 15 },
  ];
  
  useEffect(() => {
    // If car is not provided in location state, fetch it
    if (!car) {
      const fetchCarDetails = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`/api/cars/${carId}`);
          setCar(response.data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load car details');
          setLoading(false);
          console.error('Error fetching car details:', err);
        }
      };
      
      fetchCarDetails();
    }
    
    // Fetch user details if logged in
    const fetchUserDetails = async () => {
      try {
        if (userId) {
          const response = await axios.get('/api/users/profile');
          const userData = response.data;
          
          setFormData(prev => ({
            ...prev,
            firstName: userData.firstName || '',
            lastName: userData.lastName || '',
            email: userData.email || '',
            phone: userData.phone || '',
          }));
        }
      } catch (err) {
        console.error('Error fetching user details:', err);
      }
    };
    
    fetchUserDetails();
  }, [carId, car, userId]);
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      // Handle nested objects (pickup/dropoff location)
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else if (type === 'checkbox') {
      if (name === 'sameDropoff') {
        setFormData(prev => ({
          ...prev,
          sameDropoff: checked,
          // If checked, copy pickup location to dropoff
          dropoffLocation: checked ? { ...prev.pickupLocation } : prev.dropoffLocation,
        }));
      } else if (name === 'sameAsBilling') {
        setFormData(prev => ({
          ...prev,
          sameAsBilling: checked,
          // If checked, copy pickup location to billing address
          billingAddress: checked ? { ...prev.pickupLocation } : prev.billingAddress,
        }));
      } else if (name.startsWith('service-')) {
        const serviceId = name.replace('service-', '');
        const service = additionalServices.find(s => s.id === serviceId);
        
        if (checked) {
          // Add service
          setFormData(prev => ({
            ...prev,
            additionalServices: [...prev.additionalServices, { name: service.name, price: service.price }],
          }));
        } else {
          // Remove service
          setFormData(prev => ({
            ...prev,
            additionalServices: prev.additionalServices.filter(s => s.name !== service.name),
          }));
        }
      }
    } else {
      // Handle regular inputs
      setFormData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const calculateTotalDays = () => {
    const diffTime = Math.abs(endDate - startDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };
  
  const calculateTotalPrice = () => {
    if (!car) return 0;
    
    const totalDays = calculateTotalDays();
    let totalPrice = car.pricePerDay * totalDays;
    
    // Add additional services
    formData.additionalServices.forEach(service => {
      totalPrice += service.price * totalDays;
    });
    
    // Apply discount if any
    if (car.discount > 0) {
      totalPrice = totalPrice * (1 - car.discount / 100);
    }
    
    return totalPrice.toFixed(2);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (bookingStep === 1) {
      // Validate form
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
        toast.error('Please fill in all required fields');
        return;
      }
      if (!formData.pickupLocation.address || !formData.pickupLocation.city) {
        toast.error('Please provide pickup location details');
        return;
      }
      if (!formData.sameDropoff && (!formData.dropoffLocation.address || !formData.dropoffLocation.city)) {
        toast.error('Please provide dropoff location details');
        return;
      }
      
      // Move to payment step
      setBookingStep(2);
      window.scrollTo(0, 0);
    } else if (bookingStep === 2) {
      // In a real app, process payment here
      try {
        setLoading(true);
        
        // Create booking
        const bookingData = {
          car: car._id,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          pickupLocation: formData.pickupLocation,
          dropoffLocation: formData.sameDropoff ? formData.pickupLocation : formData.dropoffLocation,
          paymentMethod: formData.paymentMethod,
          additionalServices: formData.additionalServices,
          specialRequests: formData.specialRequests,
        };
        
        const response = await axios.post('/api/bookings', bookingData);
        
        // Move to confirmation step
        setBookingStep(3);
        setLoading(false);
        window.scrollTo(0, 0);
      } catch (err) {
        setLoading(false);
        toast.error(err.response?.data?.error || 'Failed to create booking');
        console.error('Error creating booking:', err);
      }
    } else if (bookingStep === 3) {
      // Redirect to my bookings page
      navigate('/my-bookings');
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

  if (error || !car) {
    return (
      <div className="container py-12">
        <div className="text-center text-red-500">
          <p className="text-xl">{error || 'Car not found'}</p>
          <Link to="/cars" className="btn btn-primary mt-4">
            Back to Cars
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-12">
      {/* Breadcrumbs */}
      <nav className="flex mb-8" aria-label="Breadcrumb">
        <ol className="inline-flex items-center space-x-1 md:space-x-3">
          <li className="inline-flex items-center">
            <Link to="/" className="text-gray-500 hover:text-gray-700">
              Home
            </Link>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to="/cars" className="text-gray-500 hover:text-gray-700">
                Cars
              </Link>
            </div>
          </li>
          <li>
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <Link to={`/cars/${car._id}`} className="text-gray-500 hover:text-gray-700">
                {car.make} {car.model}
              </Link>
            </div>
          </li>
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Booking</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Booking Steps */}
      <div className="mb-8">
        <div className="flex items-center justify-center">
          <div className={`flex items-center ${bookingStep >= 1 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep >= 1 ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-400'}`}>
              1
            </div>
            <span className="ml-2 text-sm font-medium">Details</span>
          </div>
          <div className={`w-12 h-1 mx-2 ${bookingStep >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${bookingStep >= 2 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep >= 2 ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-400'}`}>
              2
            </div>
            <span className="ml-2 text-sm font-medium">Payment</span>
          </div>
          <div className={`w-12 h-1 mx-2 ${bookingStep >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center ${bookingStep >= 3 ? 'text-primary-600' : 'text-gray-400'}`}>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${bookingStep >= 3 ? 'bg-primary-100 text-primary-600' : 'bg-gray-200 text-gray-400'}`}>
              3
            </div>
            <span className="ml-2 text-sm font-medium">Confirmation</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Booking Form */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6">
            {bookingStep === 1 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Booking Details</h2>
                
                {/* Personal Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                {/* Pickup Location */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Pickup Location</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label htmlFor="pickupAddress" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        id="pickupAddress"
                        name="pickupLocation.address"
                        value={formData.pickupLocation.address}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pickupCity" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        id="pickupCity"
                        name="pickupLocation.city"
                        value={formData.pickupLocation.city}
                        onChange={handleChange}
                        className="input"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="pickupState" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                      <input
                        type="text"
                        id="pickupState"
                        name="pickupLocation.state"
                        value={formData.pickupLocation.state}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                    <div>
                      <label htmlFor="pickupZipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                      <input
                        type="text"
                        id="pickupZipCode"
                        name="pickupLocation.zipCode"
                        value={formData.pickupLocation.zipCode}
                        onChange={handleChange}
                        className="input"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Dropoff Location */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Dropoff Location</h3>
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="sameDropoff"
                        name="sameDropoff"
                        checked={formData.sameDropoff}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                      />
                      <label htmlFor="sameDropoff" className="ml-2 text-sm text-gray-700">
                        Same as pickup location
                      </label>
                    </div>
                  </div>
                  
                  {!formData.sameDropoff && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="md:col-span-2">
                        <label htmlFor="dropoffAddress" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                        <input
                          type="text"
                          id="dropoffAddress"
                          name="dropoffLocation.address"
                          value={formData.dropoffLocation.address}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoffCity" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                        <input
                          type="text"
                          id="dropoffCity"
                          name="dropoffLocation.city"
                          value={formData.dropoffLocation.city}
                          onChange={handleChange}
                          className="input"
                          required
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoffState" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                        <input
                          type="text"
                          id="dropoffState"
                          name="dropoffLocation.state"
                          value={formData.dropoffLocation.state}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                      <div>
                        <label htmlFor="dropoffZipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code</label>
                        <input
                          type="text"
                          id="dropoffZipCode"
                          name="dropoffLocation.zipCode"
                          value={formData.dropoffLocation.zipCode}
                          onChange={handleChange}
                          className="input"
                        />
                      </div>
                    </div>
                  )}
                </div>
                
                {/* Additional Services */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Additional Services</h3>
                  <div className="space-y-3">
                    {additionalServices.map((service) => (
                      <div key={service.id} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`service-${service.id}`}
                          name={`service-${service.id}`}
                          checked={formData.additionalServices.some(s => s.name === service.name)}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor={`service-${service.id}`} className="ml-2 text-sm text-gray-700">
                          {service.name} - ${service.price}/day
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Special Requests */}
                <div className="mb-6">
                  <label htmlFor="specialRequests" className="block text-sm font-medium text-gray-700 mb-1">Special Requests</label>
                  <textarea
                    id="specialRequests"
                    name="specialRequests"
                    value={formData.specialRequests}
                    onChange={handleChange}
                    rows="3"
                    className="input"
                    placeholder="Any special requests or notes for your booking"
                  ></textarea>
                </div>
                
                <div className="flex justify-end">
                  <Link to={`/cars/${car._id}`} className="btn btn-outline mr-3">
                    Back
                  </Link>
                  <button type="submit" className="btn btn-primary">
                    Continue to Payment
                  </button>
                </div>
              </form>
            )}
            
            {bookingStep === 2 && (
              <form onSubmit={handleSubmit}>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                
                {/* Payment Method */}
                <div className="mb-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h3>
                  <div className="space-y-3">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="credit_card"
                        name="paymentMethod"
                        value="credit_card"
                        checked={formData.paymentMethod === 'credit_card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="credit_card" className="ml-2 text-sm text-gray-700">
                        Credit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="debit_card"
                        name="paymentMethod"
                        value="debit_card"
                        checked={formData.paymentMethod === 'debit_card'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="debit_card" className="ml-2 text-sm text-gray-700">
                        Debit Card
                      </label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="paypal"
                        name="paymentMethod"
                        value="paypal"
                        checked={formData.paymentMethod === 'paypal'}
                        onChange={handleChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      />
                      <label htmlFor="paypal" className="ml-2 text-sm text-gray-700">
                        PayPal
                      </label>
                    </div>
                  </div>
                </div>
                
                {/* Credit Card Information (simplified for demo) */}
                {formData.paymentMethod === 'credit_card' || formData.paymentMethod === 'debit_card' ? (
                  <>
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Card Details</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">Card Number *</label>
                          <input
                            type="text"
                            id="cardNumber"
                            className="input"
                            placeholder="**** **** **** ****"
                            required
                            maxLength="19"
                            pattern="[0-9\s]{13,19}"
                          />
                          <p className="text-xs text-gray-500 mt-1">Enter a valid 13-19 digit card number</p>
                        </div>
                        <div>
                          <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700 mb-1">Expiry Date *</label>
                          <input
                            type="text"
                            id="expiryDate"
                            className="input"
                            placeholder="MM/YY"
                            required
                            maxLength="5"
                            pattern="(0[1-9]|1[0-2])\/[0-9]{2}"
                          />
                          <p className="text-xs text-gray-500 mt-1">Format: MM/YY</p>
                        </div>
                        <div>
                          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">CVV *</label>
                          <input
                            type="text"
                            id="cvv"
                            className="input"
                            placeholder="***"
                            required
                            maxLength="4"
                            pattern="[0-9]{3,4}"
                          />
                          <p className="text-xs text-gray-500 mt-1">3-4 digits on back of card</p>
                        </div>
                        <div className="md:col-span-2">
                          <label htmlFor="nameOnCard" className="block text-sm font-medium text-gray-700 mb-1">Name on Card *</label>
                          <input
                            type="text"
                            id="nameOnCard"
                            className="input"
                            required
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mb-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Billing Address</h3>
                      <div className="flex items-center mb-4">
                        <input
                          type="checkbox"
                          id="sameAsBilling"
                          name="sameAsBilling"
                          checked={formData.sameAsBilling}
                          onChange={handleChange}
                          className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                        />
                        <label htmlFor="sameAsBilling" className="ml-2 text-sm text-gray-700">
                          Same as pickup location
                        </label>
                      </div>
                      {!formData.sameAsBilling && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <label htmlFor="billingAddress" className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                            <input
                              type="text"
                              id="billingAddress"
                              name="billingAddress.address"
                              value={formData.billingAddress.address}
                              onChange={handleChange}
                              className="input"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="billingCity" className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                            <input
                              type="text"
                              id="billingCity"
                              name="billingAddress.city"
                              value={formData.billingAddress.city}
                              onChange={handleChange}
                              className="input"
                              required
                            />
                          </div>
                          <div>
                            <label htmlFor="billingState" className="block text-sm font-medium text-gray-700 mb-1">State</label>
                            <input
                              type="text"
                              id="billingState"
                              name="billingAddress.state"
                              value={formData.billingAddress.state}
                              onChange={handleChange}
                              className="input"
                            />
                          </div>
                          <div>
                            <label htmlFor="billingZipCode" className="block text-sm font-medium text-gray-700 mb-1">Zip Code *</label>
                            <input
                              type="text"
                              id="billingZipCode"
                              name="billingAddress.zipCode"
                              value={formData.billingAddress.zipCode}
                              onChange={handleChange}
                              className="input"
                              required
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : formData.paymentMethod === 'paypal' ? (
                  <div className="mb-6 text-center p-4 bg-gray-50 rounded-md">
                    <p className="text-gray-700">You will be redirected to PayPal to complete your payment after confirming your booking.</p>
                  </div>
                ) : null}
                
                <div className="flex justify-between">
                  <button 
                    type="button" 
                    onClick={() => setBookingStep(1)}
                    className="btn btn-outline"
                  >
                    Back to Details
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Confirm Booking
                  </button>
                </div>
              </form>
            )}
            
            {bookingStep === 3 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center justify-center p-4 bg-green-100 rounded-full mb-6">
                  <svg className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-6">
                  Your booking has been successfully confirmed. We've sent a confirmation email with all the details.
                </p>
                <div className="bg-gray-50 p-4 rounded-md mb-6 text-left">
                  <h3 className="font-medium text-gray-900 mb-2">Booking Summary</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Car:</div>
                    <div className="text-gray-900">{car.make} {car.model} ({car.year})</div>
                    
                    <div className="text-gray-600">Pickup Date:</div>
                    <div className="text-gray-900">{format(startDate, 'MMM dd, yyyy')}</div>
                    
                    <div className="text-gray-600">Return Date:</div>
                    <div className="text-gray-900">{format(endDate, 'MMM dd, yyyy')}</div>
                    
                    <div className="text-gray-600">Duration:</div>
                    <div className="text-gray-900">{calculateTotalDays()} days</div>
                    
                    <div className="text-gray-600">Total Price:</div>
                    <div className="text-gray-900">${calculateTotalPrice()}</div>
                  </div>
                </div>
                <div className="flex justify-center space-x-4">
                  <Link to="/" className="btn btn-outline mr-2">
                    Return Home
                  </Link>
                  <Link to="/my-bookings" className="btn btn-primary">
                    View My Bookings
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Booking Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Booking Summary</h2>
            
            {car && (
              <div className="mb-4">
                <div className="flex items-center mb-2">
                  <div className="h-16 w-16 rounded-md overflow-hidden mr-3">
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{car.make} {car.model}</h3>
                    <p className="text-sm text-gray-500">{car.year} • {car.transmission}</p>
                  </div>
                </div>
              </div>
            )}
            
            <div className="border-t border-b border-gray-200 py-4 mb-4">
              <div className="flex items-center mb-2">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Pickup Date</p>
                  <p className="text-sm text-gray-500">{format(startDate, 'MMM dd, yyyy')}</p>
                </div>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-400 mr-2" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Return Date</p>
                  <p className="text-sm text-gray-500">{format(endDate, 'MMM dd, yyyy')}</p>
                </div>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Base Rate</span>
                <span className="text-gray-900">${car ? car.pricePerDay : 0} × {calculateTotalDays()} days</span>
              </div>
              
              {formData.additionalServices.length > 0 && (
                <div className="mb-2">
                  <p className="text-gray-600 mb-1">Additional Services:</p>
                  {formData.additionalServices.map((service, index) => (
                    <div key={index} className="flex justify-between pl-4 text-sm">
                      <span className="text-gray-600">{service.name}</span>
                      <span className="text-gray-900">${service.price} × {calculateTotalDays()} days</span>
                    </div>
                  ))}
                </div>
              )}
              
              {car && car.discount > 0 && (
                <div className="flex justify-between mb-2 text-red-600">
                  <span>Discount</span>
                  <span>-{car.discount}%</span>
                </div>
              )}
            </div>
            
            <div className="flex justify-between items-center border-t border-gray-200 pt-4 mb-4">
              <span className="text-lg font-bold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">${calculateTotalPrice()}</span>
            </div>
            
            {bookingStep === 1 && (
              <button
                type="button"
                onClick={() => document.querySelector('form').requestSubmit()}
                className="btn btn-primary w-full"
              >
                Continue to Payment
              </button>
            )}
            
            {bookingStep === 2 && (
              <button
                type="button"
                onClick={() => document.querySelector('form').requestSubmit()}
                className="btn btn-primary w-full"
              >
                Confirm Booking
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingPage;
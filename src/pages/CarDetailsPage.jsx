import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import axios from 'axios';
import { format } from 'date-fns';
import { StarIcon } from '@heroicons/react/20/solid';
import { CalendarIcon, MapPinIcon, UserIcon, KeyIcon, GaugeIcon, SwatchIcon } from '@heroicons/react/24/outline';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import { toast } from 'react-hot-toast';

const CarDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSignedIn } = useAuth();
  
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [similarCars, setSimilarCars] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [activeImage, setActiveImage] = useState(0);
  
  // Booking state
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(new Date().setDate(new Date().getDate() + 3)));
  const [isAvailable, setIsAvailable] = useState(null);
  const [checkingAvailability, setCheckingAvailability] = useState(false);
  
  useEffect(() => {
    const fetchCarDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`/api/cars/${id}`);
        setCar(response.data);
        setActiveImage(0); // Reset active image when car changes
        setLoading(false);
      } catch (err) {
        setError('Failed to load car details');
        setLoading(false);
        console.error('Error fetching car details:', err);
      }
    };

    const fetchSimilarCars = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}/similar`);
        setSimilarCars(response.data);
      } catch (err) {
        console.error('Error fetching similar cars:', err);
      }
    };

    const fetchReviews = async () => {
      try {
        const response = await axios.get(`/api/cars/${id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };

    fetchCarDetails();
    fetchSimilarCars();
    fetchReviews();
  }, [id]);

  const checkAvailability = async () => {
    if (!startDate || !endDate) {
      toast.error('Please select both start and end dates');
      return;
    }

    if (endDate <= startDate) {
      toast.error('End date must be after start date');
      return;
    }

    try {
      setCheckingAvailability(true);
      const response = await axios.get(`/api/cars/${id}/availability`, {
        params: {
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
        },
      });
      
      setIsAvailable(response.data.available);
      if (response.data.available) {
        toast.success('Car is available for the selected dates!');
      } else {
        toast.error('Car is not available for the selected dates');
      }
      setCheckingAvailability(false);
    } catch (err) {
      toast.error('Error checking availability');
      setCheckingAvailability(false);
      console.error('Error checking availability:', err);
    }
  };

  const handleBooking = () => {
    if (!isAvailable) {
      toast.error('Please check availability first');
      return;
    }
    
    navigate(`/booking/${id}`, {
      state: {
        startDate,
        endDate,
        car,
      },
    });
  };

  const calculateTotalPrice = () => {
    if (!car) return 0;
    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return car.pricePerDay * diffDays;
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
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">
                {car.make} {car.model}
              </span>
            </div>
          </li>
        </ol>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Car Images and Details */}
        <div className="lg:col-span-2">
          {/* Main Image */}
          <div className="relative h-96 rounded-lg overflow-hidden mb-4">
            <img
              src={car.images[activeImage]}
              alt={`${car.make} ${car.model}`}
              className="w-full h-full object-cover"
            />
            {car.discount > 0 && (
              <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                {car.discount}% OFF
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          <div className="grid grid-cols-5 gap-2 mb-8">
            {car.images.map((image, index) => (
              <div
                key={index}
                className={`h-20 rounded-md overflow-hidden cursor-pointer ${index === activeImage ? 'ring-2 ring-primary-500' : ''}`}
                onClick={() => setActiveImage(index)}
              >
                <img
                  src={image}
                  alt={`${car.make} ${car.model} thumbnail ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>

          {/* Car Details */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {car.make} {car.model} ({car.year})
            </h1>
            
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <StarIcon
                    key={i}
                    className={`h-5 w-5 ${i < car.ratings.average ? 'text-yellow-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-500 ml-2">({car.ratings.count} reviews)</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-sm text-gray-500">
                <MapPinIcon className="h-4 w-4 inline mr-1" />
                {car.location.city}
              </span>
            </div>

            <p className="text-gray-700 mb-6">{car.description}</p>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
              <div className="flex items-center">
                <UserIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{car.seats} Seats</span>
              </div>
              <div className="flex items-center">
                <KeyIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{car.transmission}</span>
              </div>
              <div className="flex items-center">
                <GaugeIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{car.fuelType}</span>
              </div>
              <div className="flex items-center">
                <SwatchIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{car.color}</span>
              </div>
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 text-gray-500 mr-2" />
                <span className="text-gray-700">{car.year}</span>
              </div>
            </div>

            <h3 className="text-xl font-semibold text-gray-900 mb-3">Features</h3>
            <ul className="grid grid-cols-2 gap-2 mb-6">
              {car.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <svg className="h-5 w-5 text-primary-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700">{feature}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Reviews Section */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">Customer Reviews</h3>
            
            {reviews.length > 0 ? (
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review._id} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="ml-2 text-sm font-medium text-gray-700">{review.user.firstName} {review.user.lastName}</span>
                      <span className="ml-2 text-xs text-gray-500">{format(new Date(review.createdAt), 'MMM dd, yyyy')}</span>
                    </div>
                    <p className="text-gray-700">{review.comment}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No reviews yet for this car.</p>
            )}
          </div>
        </div>

        {/* Booking Card */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-2xl font-bold text-gray-900">${car.pricePerDay}</span>
                <span className="text-gray-500"> / day</span>
              </div>
              <div className="flex items-center">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${i < car.ratings.average ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-500 ml-1">({car.ratings.count})</span>
              </div>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date</label>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                selectsStart
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                className="input w-full"
                dateFormat="MMM dd, yyyy"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Return Date</label>
              <DatePicker
                selected={endDate}
                onChange={(date) => setEndDate(date)}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                className="input w-full"
                dateFormat="MMM dd, yyyy"
              />
            </div>

            <div className="border-t border-gray-200 pt-4 mb-4">
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Rental Period:</span>
                <span className="text-gray-900">
                  {Math.ceil(Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24))} days
                </span>
              </div>
              <div className="flex justify-between mb-2">
                <span className="text-gray-600">Daily Rate:</span>
                <span className="text-gray-900">${car.pricePerDay}/day</span>
              </div>
              {car.discount > 0 && (
                <div className="flex justify-between mb-2 text-red-500">
                  <span>Discount:</span>
                  <span>-{car.discount}%</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-lg mt-2">
                <span>Total:</span>
                <span>${calculateTotalPrice()}</span>
              </div>
            </div>

            <button
              onClick={checkAvailability}
              disabled={checkingAvailability}
              className="btn btn-secondary w-full mb-3"
            >
              {checkingAvailability ? 'Checking...' : 'Check Availability'}
            </button>

            <SignedIn>
              <button
                onClick={handleBooking}
                disabled={!isAvailable}
                className="btn btn-primary w-full"
              >
                Book Now
              </button>
            </SignedIn>
            <SignedOut>
              <Link to="/sign-in" className="btn btn-primary w-full block text-center">
                Sign in to Book
              </Link>
            </SignedOut>

            {isAvailable === false && (
              <p className="text-red-500 text-sm mt-2 text-center">
                This car is not available for the selected dates.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Similar Cars Section */}
      {similarCars.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Cars You Might Like</h2>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {similarCars.map((similarCar) => (
              <div key={similarCar._id} className="card overflow-hidden transition-transform hover:scale-105">
                <div className="relative h-48">
                  <img
                    src={similarCar.images[0]}
                    alt={`${similarCar.make} ${similarCar.model}`}
                    className="w-full h-full object-cover"
                  />
                  {similarCar.discount > 0 && (
                    <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {similarCar.discount}% OFF
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-gray-900">
                    {similarCar.make} {similarCar.model} ({similarCar.year})
                  </h3>
                  <div className="flex items-center mt-1">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <StarIcon
                          key={i}
                          className={`h-4 w-4 ${i < similarCar.ratings.average ? 'text-yellow-400' : 'text-gray-300'}`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">({similarCar.ratings.count} reviews)</span>
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    <span className="block">{similarCar.type} • {similarCar.transmission} • {similarCar.fuelType}</span>
                    <span className="block">{similarCar.seats} seats • {similarCar.location.city}</span>
                  </div>
                  <div className="mt-4 flex items-center justify-between">
                    <div>
                      <span className="text-lg font-bold text-gray-900">${similarCar.pricePerDay}</span>
                      <span className="text-sm text-gray-500"> / day</span>
                    </div>
                    <Link
                      to={`/cars/${similarCar._id}`}
                      className="btn btn-primary py-1 px-3"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CarDetailsPage;
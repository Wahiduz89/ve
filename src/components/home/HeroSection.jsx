import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    type: '',
    location: '',
    date: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const queryParams = new URLSearchParams();
    if (searchParams.type) queryParams.append('type', searchParams.type);
    if (searchParams.location) queryParams.append('location', searchParams.location);
    if (searchParams.date) queryParams.append('date', searchParams.date);
    
    navigate(`/cars?${queryParams.toString()}`);
  };

  return (
    <div className="relative bg-gray-900">
      {/* Hero background image */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1740&q=80"
          alt="Luxury car on road"
          className="object-cover w-full h-full"
        />
        <div className="absolute inset-0 bg-black opacity-60"></div>
      </div>

      {/* Hero content */}
      <div className="relative px-4 py-24 mx-auto max-w-7xl sm:px-6 lg:px-8 lg:py-32">
        <div className="max-w-2xl text-center lg:mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Find Your Perfect Ride
          </h1>
          <p className="mt-6 text-xl text-gray-300">
            Premium cars at competitive prices. Easy booking, flexible pickup and return options.  
          </p>
        </div>

        {/* Search form */}
        <div className="max-w-xl p-6 mx-auto mt-10 bg-white rounded-lg shadow-md">
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <div>
                <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                  Car Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={searchParams.type}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Any Type</option>
                  <option value="sedan">Sedan</option>
                  <option value="suv">SUV</option>
                  <option value="luxury">Luxury</option>
                  <option value="convertible">Convertible</option>
                  <option value="hatchback">Hatchback</option>
                </select>
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                  Location
                </label>
                <select
                  id="location"
                  name="location"
                  value={searchParams.location}
                  onChange={handleChange}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                  <option value="">Any Location</option>
                  <option value="new-york">New York</option>
                  <option value="los-angeles">Los Angeles</option>
                  <option value="chicago">Chicago</option>
                  <option value="miami">Miami</option>
                  <option value="las-vegas">Las Vegas</option>
                </select>
              </div>

              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700">
                  Pickup Date
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  value={searchParams.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-4">
              <button
                type="submit"
                className="w-full px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Search Cars
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { StarIcon } from '@heroicons/react/20/solid';
import { AdjustmentsHorizontalIcon, FunnelIcon } from '@heroicons/react/24/outline';

const CarsPage = () => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  
  // Filter states
  const [filters, setFilters] = useState({
    type: [],
    make: [],
    transmission: [],
    minPrice: '',
    maxPrice: '',
    minYear: '',
    maxYear: '',
  });
  
  // Sort state
  const [sortBy, setSortBy] = useState('recommended');
  
  // Available filter options
  const carTypes = ['Sedan', 'SUV', 'Hatchback', 'Convertible', 'Luxury', 'Van'];
  const carMakes = ['Toyota', 'Honda', 'Ford', 'BMW', 'Mercedes', 'Audi', 'Nissan', 'Chevrolet'];
  const transmissionTypes = ['Automatic', 'Manual'];
  
  useEffect(() => {
    const fetchCars = async () => {
      try {
        setLoading(true);
        
        // Build query parameters based on filters
        const params = new URLSearchParams();
        
        if (filters.type.length > 0) {
          params.append('type', filters.type.join(','));
        }
        
        if (filters.make.length > 0) {
          params.append('make', filters.make.join(','));
        }
        
        if (filters.transmission.length > 0) {
          params.append('transmission', filters.transmission.join(','));
        }
        
        if (filters.minPrice) {
          params.append('minPrice', filters.minPrice);
        }
        
        if (filters.maxPrice) {
          params.append('maxPrice', filters.maxPrice);
        }
        
        if (filters.minYear) {
          params.append('minYear', filters.minYear);
        }
        
        if (filters.maxYear) {
          params.append('maxYear', filters.maxYear);
        }
        
        // Add sorting parameter
        if (sortBy) {
          params.append('sortBy', sortBy);
        }
        
        const response = await axios.get(`/api/cars?${params.toString()}`);
        setCars(response.data.cars);
        setLoading(false);
      } catch (err) {
        setError('Failed to load cars');
        setLoading(false);
        console.error('Error fetching cars:', err);
      }
    };
    
    fetchCars();
  }, [filters, sortBy]);
  
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      // Handle array-based filters (checkboxes)
      setFilters(prev => {
        if (checked) {
          // Add value to array
          return {
            ...prev,
            [name]: [...prev[name], value],
          };
        } else {
          // Remove value from array
          return {
            ...prev,
            [name]: prev[name].filter(item => item !== value),
          };
        }
      });
    } else {
      // Handle single value filters
      setFilters(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const clearFilters = () => {
    setFilters({
      type: [],
      make: [],
      transmission: [],
      minPrice: '',
      maxPrice: '',
      minYear: '',
      maxYear: '',
    });
  };
  
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
          <li aria-current="page">
            <div className="flex items-center">
              <span className="mx-2 text-gray-400">/</span>
              <span className="text-gray-700">Cars</span>
            </div>
          </li>
        </ol>
      </nav>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters - Mobile Toggle */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-center space-x-2 bg-white p-3 rounded-md shadow-sm border border-gray-200"
          >
            <FunnelIcon className="h-5 w-5 text-gray-500" />
            <span>{showFilters ? 'Hide Filters' : 'Show Filters'}</span>
          </button>
        </div>
        
        {/* Filters - Sidebar */}
        <div className={`lg:w-1/4 ${showFilters ? 'block' : 'hidden lg:block'}`}>
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Filters</h2>
              <button
                onClick={clearFilters}
                className="text-sm text-primary-600 hover:text-primary-800"
              >
                Clear All
              </button>
            </div>
            
            {/* Car Type Filter */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Car Type</h3>
              <div className="space-y-2">
                {carTypes.map(type => (
                  <div key={type} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`type-${type}`}
                      name="type"
                      value={type}
                      checked={filters.type.includes(type)}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`type-${type}`} className="ml-2 text-sm text-gray-700">
                      {type}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Car Make Filter */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Car Make</h3>
              <div className="space-y-2">
                {carMakes.map(make => (
                  <div key={make} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`make-${make}`}
                      name="make"
                      value={make}
                      checked={filters.make.includes(make)}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`make-${make}`} className="ml-2 text-sm text-gray-700">
                      {make}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Transmission Filter */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Transmission</h3>
              <div className="space-y-2">
                {transmissionTypes.map(transmission => (
                  <div key={transmission} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`transmission-${transmission}`}
                      name="transmission"
                      value={transmission}
                      checked={filters.transmission.includes(transmission)}
                      onChange={handleFilterChange}
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                    />
                    <label htmlFor={`transmission-${transmission}`} className="ml-2 text-sm text-gray-700">
                      {transmission}
                    </label>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Price Range (per day)</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="minPrice" className="block text-sm text-gray-700 mb-1">Min ($)</label>
                  <input
                    type="number"
                    id="minPrice"
                    name="minPrice"
                    value={filters.minPrice}
                    onChange={handleFilterChange}
                    className="input py-1 px-2 text-sm w-full"
                    min="0"
                  />
                </div>
                <div>
                  <label htmlFor="maxPrice" className="block text-sm text-gray-700 mb-1">Max ($)</label>
                  <input
                    type="number"
                    id="maxPrice"
                    name="maxPrice"
                    value={filters.maxPrice}
                    onChange={handleFilterChange}
                    className="input py-1 px-2 text-sm w-full"
                    min="0"
                  />
                </div>
              </div>
            </div>
            
            {/* Year Range Filter */}
            <div className="mb-6">
              <h3 className="text-md font-medium text-gray-900 mb-3">Year</h3>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="minYear" className="block text-sm text-gray-700 mb-1">From</label>
                  <input
                    type="number"
                    id="minYear"
                    name="minYear"
                    value={filters.minYear}
                    onChange={handleFilterChange}
                    className="input py-1 px-2 text-sm w-full"
                    min="2000"
                    max="2023"
                  />
                </div>
                <div>
                  <label htmlFor="maxYear" className="block text-sm text-gray-700 mb-1">To</label>
                  <input
                    type="number"
                    id="maxYear"
                    name="maxYear"
                    value={filters.maxYear}
                    onChange={handleFilterChange}
                    className="input py-1 px-2 text-sm w-full"
                    min="2000"
                    max="2023"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Cars List */}
        <div className="lg:w-3/4">
          {/* Sort and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 bg-white p-4 rounded-lg shadow-sm">
            <p className="text-gray-600 mb-2 sm:mb-0">
              {loading ? 'Loading...' : `${cars.length} cars found`}
            </p>
            
            <div className="flex items-center">
              <label htmlFor="sortBy" className="text-sm text-gray-700 mr-2">Sort by:</label>
              <select
                id="sortBy"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input py-1 px-2 text-sm"
              >
                <option value="recommended">Recommended</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
                <option value="ratingDesc">Highest Rated</option>
                <option value="yearDesc">Newest Models</option>
              </select>
            </div>
          </div>
          
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500 py-8">{error}</div>
          ) : cars.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-600 mb-4">No cars found matching your criteria.</p>
              <button
                onClick={clearFilters}
                className="btn btn-primary"
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {cars.map((car) => (
                <div key={car._id} className="card overflow-hidden transition-transform hover:scale-105">
                  <div className="relative h-48">
                    <img
                      src={car.images[0]}
                      alt={`${car.make} ${car.model}`}
                      className="w-full h-full object-cover"
                    />
                    {car.discount > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {car.discount}% OFF
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-bold text-gray-900">
                      {car.make} {car.model} ({car.year})
                    </h3>
                    <div className="flex items-center mt-1">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <StarIcon
                            key={i}
                            className={`h-4 w-4 ${i < car.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                          />
                        ))}
                      </div>
                      <span className="text-xs text-gray-500 ml-1">({car.reviewCount} reviews)</span>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                      <span className="block">{car.type} • {car.transmission} • {car.fuelType}</span>
                      <span className="block">{car.seats} seats • {car.location}</span>
                    </div>
                    <div className="mt-4 flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold text-gray-900">${car.pricePerDay}</span>
                        <span className="text-sm text-gray-500"> / day</span>
                      </div>
                      <Link
                        to={`/cars/${car._id}`}
                        className="btn btn-primary py-1 px-3"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarsPage;
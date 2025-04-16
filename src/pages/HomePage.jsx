import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import HeroSection from '../components/home/HeroSection';
import { StarIcon } from '@heroicons/react/20/solid';
import { ShieldCheckIcon, TruckIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

const HomePage = () => {
  const [featuredCars, setFeaturedCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeaturedCars = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/cars?featured=true&limit=4');
        setFeaturedCars(response.data.cars);
        setLoading(false);
      } catch (err) {
        setError('Failed to load featured cars');
        setLoading(false);
        console.error('Error fetching featured cars:', err);
      }
    };

    fetchFeaturedCars();
  }, []);

  const benefits = [
    {
      title: 'Quality Assurance',
      description: 'All our vehicles undergo rigorous quality checks and regular maintenance.',
      icon: ShieldCheckIcon,
    },
    {
      title: 'Free Delivery',
      description: 'We offer free delivery to your location within city limits.',
      icon: TruckIcon,
    },
    {
      title: 'Best Price Guarantee',
      description: 'We match any competitor price and offer transparent pricing with no hidden fees.',
      icon: CurrencyDollarIcon,
    },
    {
      title: '24/7 Support',
      description: 'Our customer support team is available around the clock to assist you.',
      icon: ClockIcon,
    },
  ];

  const testimonials = [
    {
      id: 1,
      content: 'The booking process was incredibly smooth, and the car was in perfect condition. Will definitely use CarRental again!',
      author: 'Sarah Johnson',
      role: 'Business Traveler',
      rating: 5,
    },
    {
      id: 2,
      content: 'Great selection of vehicles and competitive prices. The staff was very helpful and accommodating.',
      author: 'Michael Chen',
      role: 'Tourist',
      rating: 4,
    },
    {
      id: 3,
      content: 'I rented a luxury car for my wedding day and it was absolutely perfect. The service was exceptional from start to finish.',
      author: 'Emily Rodriguez',
      role: 'Wedding Client',
      rating: 5,
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <HeroSection />

      {/* Featured Cars Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Featured Cars</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Explore our selection of premium vehicles available for rent
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
            </div>
          ) : error ? (
            <div className="text-center text-red-500">{error}</div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
              {featuredCars.map((car) => (
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

          <div className="mt-12 text-center">
            <Link to="/cars" className="btn btn-outline">
              View All Cars
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Why Choose Us</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              We offer the best car rental experience with premium services and benefits
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
                <div className="inline-flex items-center justify-center p-3 bg-primary-100 rounded-md">
                  <benefit.icon className="h-6 w-6 text-primary-600" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">{benefit.title}</h3>
                <p className="mt-2 text-sm text-gray-500">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">What Our Customers Say</h2>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Don't just take our word for it, hear from our satisfied customers
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-gray-50 p-6 rounded-lg shadow-sm">
                <div className="flex items-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-5 w-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <p className="text-gray-600 italic">{testimonial.content}</p>
                <div className="mt-4">
                  <p className="font-medium text-gray-900">{testimonial.author}</p>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-700">
        <div className="container">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl">Ready to Book Your Perfect Car?</h2>
            <p className="mt-4 text-lg text-primary-100 max-w-2xl mx-auto">
              Browse our extensive collection of vehicles and find the perfect match for your needs
            </p>
            <div className="mt-8">
              <Link
                to="/cars"
                className="btn bg-white text-primary-700 hover:bg-gray-100 px-6 py-3"
              >
                Explore Cars
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
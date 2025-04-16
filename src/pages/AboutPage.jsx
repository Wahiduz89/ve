import { Link } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const AboutPage = () => {
  // Company information
  const companyInfo = {
    founded: 2010,
    locations: 25,
    fleetSize: 500,
    countries: 5,
  };

  // Team members
  const teamMembers = [
    {
      name: 'John Smith',
      role: 'CEO & Founder',
      image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'John founded the company with a vision to revolutionize the car rental industry with technology and exceptional service.',
    },
    {
      name: 'Sarah Johnson',
      role: 'Chief Operations Officer',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'With over 15 years in the automotive industry, Sarah ensures our operations run smoothly across all locations.',
    },
    {
      name: 'Michael Chen',
      role: 'Chief Technology Officer',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'Michael leads our technology initiatives, ensuring we provide the most innovative and user-friendly rental experience.',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Customer Experience Director',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=256&h=256&q=80',
      bio: 'Emily is dedicated to creating exceptional customer experiences and building lasting relationships with our clients.',
    },
  ];

  // Core values
  const coreValues = [
    {
      title: 'Customer First',
      description: 'We prioritize our customers\'s needs and strive to exceed their expectations in every interaction.',
    },
    {
      title: 'Quality & Reliability',
      description: 'We maintain the highest standards for our vehicles and services to ensure a safe and reliable experience.',
    },
    {
      title: 'Innovation',
      description: 'We continuously seek new ways to improve our services and embrace technological advancements.',
    },
    {
      title: 'Sustainability',
      description: 'We are committed to reducing our environmental impact and promoting sustainable transportation options.',
    },
    {
      title: 'Integrity',
      description: 'We conduct our business with honesty, transparency, and ethical practices.',
    },
    {
      title: 'Community',
      description: 'We actively contribute to the communities we serve and support local initiatives.',
    },
  ];

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
              <span className="text-gray-700">About Us</span>
            </div>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-12">
        <div className="relative h-96">
          <img
            src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1470&q=80"
            alt="Car rental company headquarters"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="text-center text-white px-4">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">About Our Company</h1>
              <p className="text-xl max-w-3xl">Providing premium car rental services since {companyInfo.founded}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Our Story Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Story</h2>
          <div className="mt-6 max-w-3xl mx-auto text-lg text-gray-600">
            <p className="mb-4">
              Founded in {companyInfo.founded}, our company began with a small fleet of just 10 vehicles and a vision to transform the car rental experience. What started as a local operation has now grown into a leading car rental service with {companyInfo.locations} locations across {companyInfo.countries} countries.
            </p>
            <p className="mb-4">
              Our mission has always been to provide exceptional service, premium vehicles, and innovative solutions that make renting a car simple, convenient, and enjoyable. We believe that mobility should be accessible to everyone, and we strive to offer flexible options that cater to diverse needs and preferences.
            </p>
            <p>
              Today, we manage a fleet of over {companyInfo.fleetSize} vehicles ranging from economy cars to luxury models, and we continue to expand our offerings to meet the evolving demands of our customers.
            </p>
          </div>
        </div>

        {/* Company Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-primary-600 mb-2">{companyInfo.founded}</div>
            <div className="text-sm text-gray-600">Year Founded</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-primary-600 mb-2">{companyInfo.locations}+</div>
            <div className="text-sm text-gray-600">Locations</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-primary-600 mb-2">{companyInfo.fleetSize}+</div>
            <div className="text-sm text-gray-600">Vehicles</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="text-3xl font-bold text-primary-600 mb-2">{companyInfo.countries}</div>
            <div className="text-sm text-gray-600">Countries</div>
          </div>
        </div>
      </section>

      {/* Core Values Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Core Values</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            These principles guide our decisions and shape our company culture
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {coreValues.map((value, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-sm">
              <div className="flex items-start">
                <CheckCircleIcon className="h-6 w-6 text-primary-600 mt-1 mr-3" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">{value.title}</h3>
                  <p className="text-gray-600">{value.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl">Our Leadership Team</h2>
          <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
            Meet the people who drive our company forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm overflow-hidden">
              <img
                src={member.image}
                alt={member.name}
                className="w-full h-64 object-cover object-center"
              />
              <div className="p-6">
                <h3 className="text-lg font-medium text-gray-900">{member.name}</h3>
                <p className="text-sm text-primary-600 mb-3">{member.role}</p>
                <p className="text-gray-600">{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-12 md:py-16 md:px-12 text-center text-white">
          <h2 className="text-3xl font-bold mb-4">Ready to Experience Our Service?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Browse our selection of premium vehicles and book your next rental today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/cars" className="btn bg-white text-primary-600 hover:bg-gray-100">
              View Our Fleet
            </Link>
            <Link to="/contact" className="btn bg-transparent border border-white hover:bg-white hover:text-primary-600">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
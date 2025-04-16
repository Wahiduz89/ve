import { Link } from 'react-router-dom';

const NotFoundPage = () => {
  return (
    <div className="container py-16">
      <div className="max-w-md mx-auto text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-bold text-gray-900 mt-4">Page Not Found</h2>
        <p className="text-lg text-gray-600 mt-4">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <div className="mt-8">
          <Link to="/" className="btn btn-primary">
            Back to Home
          </Link>
        </div>
        <div className="mt-8">
          <p className="text-gray-600">Looking for something specific?</p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
            <Link to="/cars" className="btn btn-outline">
              Browse Cars
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
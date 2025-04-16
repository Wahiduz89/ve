import { Routes, Route } from 'react-router-dom';

// Layout components
import Layout from './components/layout/Layout';
import AdminLayout from './components/layout/AdminLayout';

// Public pages
import HomePage from './pages/HomePage';
import CarsPage from './pages/CarsPage';
import CarDetailsPage from './pages/CarDetailsPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Protected user pages
import BookingPage from './pages/BookingPage';
import UserDashboard from './pages/user/Dashboard';
import UserBookings from './pages/user/Bookings';
import UserProfile from './pages/user/Profile';

// Protected admin pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminCars from './pages/admin/Cars';
import AdminBookings from './pages/admin/Bookings';
import AdminUsers from './pages/admin/Users';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="cars" element={<CarsPage />} />
        <Route path="cars/:id" element={<CarDetailsPage />} />
        <Route path="about" element={<AboutPage />} />
        <Route path="contact" element={<ContactPage />} />
        
        {/* Auth routes - removed */}
        
        {/* Protected user routes */}
        <Route path="booking/:carId" element={<BookingPage />} />
        
        <Route path="dashboard" element={<UserDashboard />} />
        
        <Route path="my-bookings" element={<UserBookings />} />
        
        <Route path="profile" element={<UserProfile />} />
      </Route>
      
      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="cars" element={<AdminCars />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
      
      {/* 404 route */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default App;
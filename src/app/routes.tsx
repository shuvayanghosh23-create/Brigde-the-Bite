import { createBrowserRouter } from 'react-router';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import SignUp from './pages/SignUp';

// Restaurant Pages
import RestaurantDashboard from './pages/restaurant/Dashboard';
import DonatePage from './pages/restaurant/Donate';
import RestaurantMap from './pages/restaurant/Map';
import RestaurantTracking from './pages/restaurant/Tracking';
import RestaurantHistory from './pages/restaurant/History';
import RestaurantChat from './pages/restaurant/Chat';
import RestaurantProfile from './pages/restaurant/Profile';
import RestaurantRatings from './pages/restaurant/Ratings';
import RestaurantSupport from './pages/restaurant/Support';
import RestaurantSettings from './pages/restaurant/Settings';

// NGO Pages
import NGODashboard from './pages/ngo/Dashboard';
import NGOBrowse from './pages/ngo/Browse';
import NGOMap from './pages/ngo/Map';
import NGORequests from './pages/ngo/Requests';
import NGOChat from './pages/ngo/Chat';
import NGOProfile from './pages/ngo/Profile';
import NGOHistory from './pages/ngo/History';
import NGOReviews from './pages/ngo/Reviews';
import NGOSupport from './pages/ngo/Support';
import NGOSettings from './pages/ngo/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminDonations from './pages/admin/Donations';
import AdminAnalytics from './pages/admin/Analytics';
import AdminSupport from './pages/admin/Support';
import AdminSettings from './pages/admin/Settings';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Landing,
  },
  {
    path: '/login',
    Component: Login,
  },
  {
    path: '/signup',
    Component: SignUp,
  },
  // ── Restaurant Routes ────────────────────────────────
  {
    path: '/restaurant/dashboard',
    Component: RestaurantDashboard,
  },
  {
    path: '/restaurant/donate',
    Component: DonatePage,
  },
  {
    path: '/restaurant/map',
    Component: RestaurantMap,
  },
  {
    path: '/restaurant/tracking',
    Component: RestaurantTracking,
  },
  {
    path: '/restaurant/history',
    Component: RestaurantHistory,
  },
  {
    path: '/restaurant/chat',
    Component: RestaurantChat,
  },
  {
    path: '/restaurant/profile',
    Component: RestaurantProfile,
  },
  {
    path: '/restaurant/ratings',
    Component: RestaurantRatings,
  },
  {
    path: '/restaurant/support',
    Component: RestaurantSupport,
  },
  {
    path: '/restaurant/settings',
    Component: RestaurantSettings,
  },
  // ── NGO Routes ───────────────────────────────────────
  {
    path: '/ngo/dashboard',
    Component: NGODashboard,
  },
  {
    path: '/ngo/browse',
    Component: NGOBrowse,
  },
  {
    path: '/ngo/map',
    Component: NGOMap,
  },
  {
    path: '/ngo/requests',
    Component: NGORequests,
  },
  {
    path: '/ngo/chat',
    Component: NGOChat,
  },
  {
    path: '/ngo/profile',
    Component: NGOProfile,
  },
  {
    path: '/ngo/history',
    Component: NGOHistory,
  },
  {
    path: '/ngo/reviews',
    Component: NGOReviews,
  },
  {
    path: '/ngo/support',
    Component: NGOSupport,
  },
  {
    path: '/ngo/settings',
    Component: NGOSettings,
  },
  // ── Admin Routes ─────────────────────────────────────
  {
    path: '/admin/dashboard',
    Component: AdminDashboard,
  },
  {
    path: '/admin/users',
    Component: AdminUsers,
  },
  {
    path: '/admin/donations',
    Component: AdminDonations,
  },
  {
    path: '/admin/analytics',
    Component: AdminAnalytics,
  },
  {
    path: '/admin/support',
    Component: AdminSupport,
  },
  {
    path: '/admin/settings',
    Component: AdminSettings,
  },
  // ── 404 ─────────────────────────────────────────────
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-white">
        <div className="text-center">
          <h1 className="text-6xl text-green-600 mb-4">404</h1>
          <p className="text-slate-600 text-xl mb-6">Page not found</p>
          <a href="/" className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    ),
  },
]);

import React, { useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import { useNotifications } from '../contexts/NotificationContext';
import {
  LayoutDashboard,
  Plus,
  List,
  History,
  Map,
  MessageSquare,
  Star,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
  Menu,
  X,
  Search,
  Package,
  CheckCheck,
  Clock,
  Heart,
  AlertCircle,
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import Logo from './Logo';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role: 'restaurant' | 'ngo' | 'admin';
}

export default function DashboardLayout({ children, role }: DashboardLayoutProps) {
  const { user, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useNotifications();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [notifOpen, setNotifOpen] = React.useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close notification dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const menuItems = {
    restaurant: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/restaurant/dashboard' },
      { icon: Plus, label: 'Donate Food', path: '/restaurant/donate' },
      { icon: List, label: 'Track Requests', path: '/restaurant/tracking' },
      { icon: History, label: 'Past Donations', path: '/restaurant/history' },
      { icon: Map, label: 'Map View', path: '/restaurant/map' },
      { icon: MessageSquare, label: 'Chat', path: '/restaurant/chat' },
      { icon: Star, label: 'Ratings', path: '/restaurant/ratings' },
      { icon: User, label: 'Profile', path: '/restaurant/profile' },
      { icon: HelpCircle, label: 'Support', path: '/restaurant/support' },
      { icon: Settings, label: 'Settings', path: '/restaurant/settings' },
    ],
    ngo: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/ngo/dashboard' },
      { icon: Search, label: 'Browse Food', path: '/ngo/browse' },
      { icon: List, label: 'My Requests', path: '/ngo/requests' },
      { icon: History, label: 'Past Activity', path: '/ngo/history' },
      { icon: Map, label: 'Map View', path: '/ngo/map' },
      { icon: MessageSquare, label: 'Chat', path: '/ngo/chat' },
      { icon: Star, label: 'Reviews', path: '/ngo/reviews' },
      { icon: User, label: 'Profile', path: '/ngo/profile' },
      { icon: HelpCircle, label: 'Support', path: '/ngo/support' },
      { icon: Settings, label: 'Settings', path: '/ngo/settings' },
    ],
    admin: [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
      { icon: User, label: 'Manage Users', path: '/admin/users' },
      { icon: Package, label: 'Donations', path: '/admin/donations' },
      { icon: Star, label: 'Analytics', path: '/admin/analytics' },
      { icon: MessageSquare, label: 'Support Tickets', path: '/admin/support' },
      { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ],
  };

  const items = menuItems[role];

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'donation': return <Package size={14} className="text-green-600" />;
      case 'chat': return <MessageSquare size={14} className="text-blue-600" />;
      case 'support': return <AlertCircle size={14} className="text-red-600" />;
      case 'request': return <Heart size={14} className="text-orange-600" />;
      default: return <Bell size={14} className="text-slate-600" />;
    }
  };

  const formatTime = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transform transition-transform lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        initial={false}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-slate-200">
            <Link to="/" className="flex items-center gap-2">
              <Logo size="md" />
            </Link>
          </div>

          <nav className="flex-1 overflow-y-auto p-4">
            <ul className="space-y-1">
              {items.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                return (
                  <li key={item.path}>
                    <Link
                      to={item.path}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-green-50 text-green-700'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <Icon size={20} />
                      <span>{item.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="p-4 border-t border-slate-200">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600 hover:bg-red-50"
              onClick={handleLogout}
            >
              <LogOut size={20} className="mr-3" />
              Logout
            </Button>
          </div>
        </div>
      </motion.aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 lg:ml-64">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-slate-200">
          <div className="flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
            <div className="flex items-center gap-4">
              <button
                className="lg:hidden"
                onClick={() => setSidebarOpen(!sidebarOpen)}
              >
                {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
              <h1 className="text-xl text-slate-900">
                Welcome back, {user?.name}!
              </h1>
            </div>

            <div className="flex items-center gap-4">
              {/* Notification Bell with Dropdown */}
              <div className="relative" ref={notifRef}>
                <button
                  className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors"
                  onClick={() => setNotifOpen(!notifOpen)}
                >
                  <Bell size={24} className="text-slate-700" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                      {unreadCount}
                    </Badge>
                  )}
                </button>

                <AnimatePresence>
                  {notifOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50"
                    >
                      <div className="flex items-center justify-between p-4 border-b border-slate-100">
                        <h3 className="text-slate-900 font-semibold">Notifications</h3>
                        {unreadCount > 0 && (
                          <button
                            onClick={() => markAllAsRead()}
                            className="text-sm text-green-600 hover:text-green-700 flex items-center gap-1"
                          >
                            <CheckCheck size={14} />
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="p-8 text-center text-slate-500">
                            <Bell size={32} className="mx-auto mb-2 opacity-30" />
                            <p>No notifications yet</p>
                          </div>
                        ) : (
                          notifications.map((notif) => (
                            <div
                              key={notif.id}
                              className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer ${
                                !notif.read ? 'bg-green-50/40' : ''
                              }`}
                              onClick={() => {
                                markAsRead(notif.id);
                                if (notif.link) {
                                  navigate(notif.link);
                                  setNotifOpen(false);
                                }
                              }}
                            >
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 p-1.5 rounded-full ${
                                  !notif.read ? 'bg-green-100' : 'bg-slate-100'
                                }`}>
                                  {getNotifIcon(notif.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center justify-between gap-2">
                                    <p className={`text-sm truncate ${!notif.read ? 'text-slate-900 font-semibold' : 'text-slate-700'}`}>
                                      {notif.title}
                                    </p>
                                    {!notif.read && (
                                      <span className="w-2 h-2 rounded-full bg-green-500 flex-shrink-0" />
                                    )}
                                  </div>
                                  <p className="text-xs text-slate-500 mt-0.5 line-clamp-2">{notif.message}</p>
                                  <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                                    <Clock size={10} />
                                    {formatTime(notif.timestamp)}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <Link
                to={`/${role}/profile`}
                className="flex items-center gap-3 hover:bg-slate-100 rounded-lg p-2 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-orange-500 flex items-center justify-center text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              </Link>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}

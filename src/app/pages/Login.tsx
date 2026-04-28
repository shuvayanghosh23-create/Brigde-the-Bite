import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Store, Users, Shield, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';

export default function Login() {
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'restaurant';
  const navigate = useNavigate();
  const { login, user } = useAuth();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      const redirectPath =
        user.role === 'restaurant'
          ? '/restaurant/dashboard'
          : user.role === 'ngo'
          ? '/ngo/dashboard'
          : '/admin/dashboard';
      navigate(redirectPath);
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const success = login(email, password);
    if (!success) {
      setError('Invalid credentials. Please try again.');
    }
  };

  const roleConfig = {
    restaurant: {
      icon: Store,
      color: 'green',
      title: 'Restaurant Login',
      description: 'Donate surplus food and track your impact',
      demoCredentials: 'Food1 / Food123',
    },
    ngo: {
      icon: Users,
      color: 'orange',
      title: 'NGO Login',
      description: 'Request food and help those in need',
      demoCredentials: 'NGO1 / NGO123',
    },
    admin: {
      icon: Shield,
      color: 'blue',
      title: 'Admin Login',
      description: 'Manage platform and monitor activities',
      demoCredentials: 'admin / admin123',
    },
  };

  const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.restaurant;
  const Icon = config.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="flex justify-center">
            <Logo size="lg" />
          </Link>
        </div>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className={`bg-${config.color}-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
              <Icon className={`text-${config.color}-600`} size={32} />
            </div>
            <CardTitle className="text-2xl">{config.title}</CardTitle>
            <CardDescription>{config.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">Email / Username</Label>
                <Input
                  id="email"
                  type="text"
                  placeholder="Enter your email or username"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className={`w-full bg-${config.color}-600 hover:bg-${config.color}-700`}>
                Login
              </Button>

              <div className="text-center">
                <a href="#" className="text-sm text-slate-600 hover:text-slate-900">
                  Forgot Password?
                </a>
              </div>

              <div className="border-t pt-4">
                <p className="text-sm text-slate-600 text-center mb-2">
                  Demo Credentials:
                </p>
                <p className="text-center font-mono text-sm bg-slate-100 p-2 rounded">
                  {config.demoCredentials}
                </p>
              </div>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Don't have an account?{' '}
                  <Link
                    to={`/signup?role=${role}`}
                    className={`text-${config.color}-600 hover:underline`}
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </CardContent>
        </Card>

        <div className="text-center mt-6">
          <Link to="/" className="text-slate-600 hover:text-slate-900">
            ← Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
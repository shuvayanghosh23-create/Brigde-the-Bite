import React, { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router';
import { motion } from 'motion/react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { useAuth } from '../contexts/AuthContext';
import { Store, Users, Eye, EyeOff } from 'lucide-react';
import Logo from '../components/Logo';

export default function SignUp() {
  const [searchParams] = useSearchParams();
  const role = (searchParams.get('role') || 'restaurant') as 'restaurant' | 'ngo';
  const navigate = useNavigate();
  const { signup } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    fssaiNumber: '',
    darpanId: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    const success = signup({
      email: formData.email,
      password: formData.password,
      role,
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
      ...(role === 'restaurant' && { fssaiNumber: formData.fssaiNumber }),
      ...(role === 'ngo' && { darpanId: formData.darpanId }),
      location: { lat: 12.9716, lng: 77.5946 }, // Default location
    });

    if (success) {
      const redirectPath = role === 'restaurant' ? '/restaurant/dashboard' : '/ngo/dashboard';
      navigate(redirectPath);
    }
  };

  const roleConfig = {
    restaurant: {
      icon: Store,
      color: 'green',
      title: 'Restaurant Sign Up',
      description: 'Join us in fighting food waste',
    },
    ngo: {
      icon: Users,
      color: 'orange',
      title: 'NGO Sign Up',
      description: 'Help us feed those in need',
    },
  };

  const config = roleConfig[role];
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
                <Label htmlFor="name">{role === 'restaurant' ? 'Restaurant Name' : 'NGO Name'}</Label>
                <Input
                  id="name"
                  placeholder={role === 'restaurant' ? 'Enter restaurant name' : 'Enter NGO name'}
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>

              {role === 'restaurant' && (
                <div>
                  <Label htmlFor="fssai">FSSAI Number</Label>
                  <Input
                    id="fssai"
                    placeholder="Enter FSSAI registration number"
                    value={formData.fssaiNumber}
                    onChange={(e) => setFormData({ ...formData, fssaiNumber: e.target.value })}
                    required
                  />
                </div>
              )}

              {role === 'ngo' && (
                <div>
                  <Label htmlFor="darpan">Unique Darpan ID</Label>
                  <Input
                    id="darpan"
                    placeholder="Enter Darpan registration ID"
                    value={formData.darpanId}
                    onChange={(e) => setFormData({ ...formData, darpanId: e.target.value })}
                    required
                  />
                </div>
              )}

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  placeholder="Enter complete address"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="phone">Contact Number</Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+91 XXXXX XXXXX"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter email address"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

              <div>
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-3 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" className={`w-full bg-${config.color}-600 hover:bg-${config.color}-700`}>
                Sign Up
              </Button>

              <div className="text-center">
                <p className="text-sm text-slate-600">
                  Already have an account?{' '}
                  <Link
                    to={`/login?role=${role}`}
                    className={`text-${config.color}-600 hover:underline`}
                  >
                    Login
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
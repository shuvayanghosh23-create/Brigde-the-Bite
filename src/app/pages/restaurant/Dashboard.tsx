import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import {
  Package,
  CheckCircle,
  Clock,
  TrendingUp,
  Plus,
  Users,
  Heart,
} from 'lucide-react';

export default function RestaurantDashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalMeals: 0,
  });

  useEffect(() => {
    const allDonations = getDonations();
    const myDonations = allDonations.filter((d) => d.restaurantId === user?.id);
    setDonations(myDonations);

    setStats({
      total: myDonations.length,
      pending: myDonations.filter((d) => d.status === 'pending').length,
      completed: myDonations.filter((d) => d.status === 'completed').length,
      totalMeals: myDonations.filter((d) => d.status === 'completed').length * 50, // Estimate
    });
  }, [user]);

  const statCards = [
    {
      title: 'Total Donations',
      value: stats.total,
      icon: Package,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Pending Requests',
      value: stats.pending,
      icon: Clock,
      color: 'orange',
      change: stats.pending > 0 ? 'Active' : 'None',
    },
    {
      title: 'Completed',
      value: stats.completed,
      icon: CheckCircle,
      color: 'green',
      change: '+8%',
    },
    {
      title: 'Meals Served',
      value: stats.totalMeals,
      icon: Heart,
      color: 'red',
      change: '+15%',
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { variant: any; label: string }> = {
      pending: { variant: 'secondary', label: 'Pending' },
      accepted: { variant: 'default', label: 'Accepted' },
      completed: { variant: 'default', label: 'Completed' },
    };
    return variants[status] || variants.pending;
  };

  return (
    <DashboardLayout role="restaurant">
      <div className="space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl text-slate-900">Dashboard Overview</h2>
            <p className="text-slate-600 mt-1">Track your donations and social impact</p>
          </div>
          <Link to="/restaurant/donate">
            <Button className="bg-green-600 hover:bg-green-700">
              <Plus size={20} className="mr-2" />
              New Donation
            </Button>
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {statCards.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="hover:shadow-lg transition-shadow">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">{stat.title}</p>
                        <p className="text-3xl text-slate-900">{stat.value}</p>
                        <p className={`text-sm mt-2 text-${stat.color}-600`}>
                          <TrendingUp size={14} className="inline mr-1" />
                          {stat.change}
                        </p>
                      </div>
                      <div className={`bg-${stat.color}-100 p-3 rounded-lg`}>
                        <Icon className={`text-${stat.color}-600`} size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* Recent Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600 mb-4">No donations yet</p>
                <Link to="/restaurant/donate">
                  <Button className="bg-green-600 hover:bg-green-700">
                    Create Your First Donation
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {donations.slice(0, 5).map((donation) => (
                  <div
                    key={donation.id}
                    className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="text-slate-900">{donation.foodName}</h4>
                      <p className="text-sm text-slate-600">
                        {donation.quantity} • Created{' '}
                        {new Date(donation.createdAt).toLocaleDateString()}
                      </p>
                      {donation.ngoName && (
                        <p className="text-sm text-green-600 mt-1">
                          <Users size={14} className="inline mr-1" />
                          Accepted by {donation.ngoName}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className={getStatusBadge(donation.status).variant === 'default' ? 'bg-green-100 text-green-800' : ''}>
                        {getStatusBadge(donation.status).label}
                      </Badge>
                      <Link to={`/restaurant/tracking`}>
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Plus className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">Generate Donation</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Create a new food donation request
                </p>
                <Link to="/restaurant/donate">
                  <Button variant="outline" className="w-full">
                    Get Started
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-orange-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">View NGOs</h3>
                <p className="text-slate-600 text-sm mb-4">
                  See nearby NGOs on the map
                </p>
                <Link to="/restaurant/map">
                  <Button variant="outline" className="w-full">
                    Open Map
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">Impact Report</h3>
                <p className="text-slate-600 text-sm mb-4">
                  View your social impact metrics
                </p>
                <Link to="/restaurant/history">
                  <Button variant="outline" className="w-full">
                    View Report
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../utils/storage';
import { Package, CheckCircle, Clock, Heart, Search, MapPin } from 'lucide-react';

export default function NGODashboard() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [myRequests, setMyRequests] = useState<any[]>([]);

  useEffect(() => {
    const allDonations = getDonations();
    const pending = allDonations.filter((d) => d.status === 'pending');
    const accepted = allDonations.filter((d) => d.ngoId === user?.id);
    
    setDonations(pending);
    setMyRequests(accepted);
  }, [user]);

  const stats = [
    {
      title: 'Available Donations',
      value: donations.length,
      icon: Package,
      color: 'blue',
    },
    {
      title: 'Active Requests',
      value: myRequests.filter((r) => r.status === 'accepted').length,
      icon: Clock,
      color: 'orange',
    },
    {
      title: 'Completed',
      value: myRequests.filter((r) => r.status === 'completed').length,
      icon: CheckCircle,
      color: 'green',
    },
    {
      title: 'Total Impact',
      value: myRequests.length * 45,
      icon: Heart,
      color: 'red',
      suffix: ' meals',
    },
  ];

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl text-slate-900">Dashboard Overview</h2>
            <p className="text-slate-600 mt-1">Find and accept food donations</p>
          </div>
          <Link to="/ngo/browse">
            <Button className="bg-orange-600 hover:bg-orange-700">
              <Search size={20} className="mr-2" />
              Browse Food
            </Button>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm text-slate-600 mb-2">{stat.title}</p>
                        <p className="text-3xl text-slate-900">
                          {stat.value}
                          {stat.suffix}
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

        {/* Available Donations */}
        <Card>
          <CardHeader>
            <CardTitle>Available Nearby Donations</CardTitle>
          </CardHeader>
          <CardContent>
            {donations.length === 0 ? (
              <div className="text-center py-12">
                <Package size={48} className="mx-auto text-slate-400 mb-4" />
                <p className="text-slate-600">No donations available right now</p>
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
                        {donation.quantity} • {donation.restaurantName}
                      </p>
                      <p className="text-sm text-slate-500 mt-1">
                        <MapPin className="inline" size={12} />{' '}
                        {donation.pickupLocation}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <Badge className="bg-green-100 text-green-800">
                        <Clock className="inline mr-1" size={12} />
                        Available
                      </Badge>
                      <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Accept
                      </Button>
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
                <div className="bg-orange-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-orange-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">Browse Donations</h3>
                <p className="text-slate-600 text-sm mb-4">
                  Find available food nearby
                </p>
                <Link to="/ngo/browse">
                  <Button variant="outline" className="w-full">
                    Browse Now
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer">
            <CardContent className="pt-6">
              <div className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="text-blue-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">Map View</h3>
                <p className="text-slate-600 text-sm mb-4">
                  See donations on map
                </p>
                <Link to="/ngo/map">
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
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="text-green-600" size={32} />
                </div>
                <h3 className="text-lg text-slate-900 mb-2">My Impact</h3>
                <p className="text-slate-600 text-sm mb-4">
                  View your contribution
                </p>
                <Link to="/ngo/history">
                  <Button variant="outline" className="w-full">
                    View Impact
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

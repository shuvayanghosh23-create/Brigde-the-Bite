import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { CheckCircle, Package, MapPin, Calendar, Camera, TrendingUp, Heart, Users } from 'lucide-react';

export default function NGOHistory() {
  const { user } = useAuth();
  const [history, setHistory] = useState<Donation[]>([]);
  const [filter, setFilter] = useState<'all' | 'completed' | 'cancelled'>('all');

  useEffect(() => {
    if (!user) return;
    const allDonations = getDonations();
    const myHistory = allDonations
      .filter((d) => d.ngoId === user.id && (d.status === 'completed' || d.status === 'cancelled'))
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setHistory(myHistory);
  }, [user]);

  const filtered = filter === 'all' ? history : history.filter((d) => d.status === filter);

  const totalCompleted = history.filter((d) => d.status === 'completed').length;
  const totalKg = history
    .filter((d) => d.status === 'completed')
    .reduce((sum, d) => {
      const match = d.quantity.match(/(\d+)/);
      return sum + (match ? parseInt(match[1]) : 0);
    }, 0);
  const estimatedMeals = Math.round(totalKg * 4.5);

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl text-slate-900">Past Activity</h2>
          <p className="text-slate-600 mt-1">Your complete donation history and impact</p>
        </div>

        {/* Impact Summary */}
        <div className="grid md:grid-cols-3 gap-4">
          <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-xl">
                  <CheckCircle size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl text-green-600">{totalCompleted}</p>
                  <p className="text-sm text-slate-600">Donations Received</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-xl">
                  <Package size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl text-orange-600">{totalKg} kg</p>
                  <p className="text-sm text-slate-600">Total Food Received</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-200">
            <CardContent className="pt-4 pb-4">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-xl">
                  <Heart size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl text-blue-600">{estimatedMeals.toLocaleString()}</p>
                  <p className="text-sm text-slate-600">Estimated Meals Served</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2">
          {(['all', 'completed', 'cancelled'] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                filter === f
                  ? 'bg-green-600 text-white'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
              }`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f === 'all' && ` (${history.length})`}
              {f === 'completed' && ` (${history.filter((d) => d.status === 'completed').length})`}
              {f === 'cancelled' && ` (${history.filter((d) => d.status === 'cancelled').length})`}
            </button>
          ))}
        </div>

        {/* History List */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <TrendingUp size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No past activity found.</p>
              <p className="text-sm text-slate-500 mt-1">Accept donations to build your history.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((donation, index) => (
              <motion.div
                key={donation.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Card className="hover:shadow-md transition-shadow">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-slate-900">{donation.foodName}</h4>
                          <Badge
                            className={
                              donation.status === 'completed'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }
                          >
                            {donation.status === 'completed' ? (
                              <><CheckCircle size={12} className="mr-1 inline" />Completed</>
                            ) : (
                              'Cancelled'
                            )}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          <Package size={14} className="inline mr-1" />
                          {donation.restaurantName} · {donation.quantity}
                        </p>
                        <p className="text-sm text-slate-600">
                          <MapPin size={14} className="inline mr-1" />
                          {donation.pickupLocation}
                        </p>
                        <div className="flex flex-wrap gap-4 text-xs text-slate-400">
                          <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            Requested: {new Date(donation.createdAt).toLocaleDateString()}
                          </span>
                          {donation.completedAt && (
                            <span className="flex items-center gap-1">
                              <CheckCircle size={12} />
                              Completed: {new Date(donation.completedAt).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>

                      {donation.completionPhotoUrl && (
                        <div className="flex-shrink-0">
                          <img
                            src={donation.completionPhotoUrl}
                            alt="Completion photo"
                            className="w-20 h-16 object-cover rounded-lg border border-slate-200"
                          />
                          <p className="text-xs text-center text-slate-400 mt-1 flex items-center gap-1 justify-center">
                            <Camera size={10} />Proof
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { platformStats, mockUsers, mockDonations } from '../../data/mockData';
import { Users, Store, Package, TrendingUp, Activity, AlertCircle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      title: 'Total Users',
      value: mockUsers.length,
      icon: Users,
      color: 'blue',
      change: '+12%',
    },
    {
      title: 'Active Restaurants',
      value: mockUsers.filter((u) => u.role === 'restaurant').length,
      icon: Store,
      color: 'green',
      change: '+8%',
    },
    {
      title: 'Active NGOs',
      value: mockUsers.filter((u) => u.role === 'ngo').length,
      icon: Users,
      color: 'orange',
      change: '+15%',
    },
    {
      title: 'Total Donations',
      value: platformStats.totalMeals,
      icon: Package,
      color: 'purple',
      change: '+24%',
    },
  ];

  const recentActivity = [
    {
      type: 'success',
      message: 'New restaurant registered: Taj Kitchen',
      time: '5 minutes ago',
    },
    {
      type: 'info',
      message: 'Donation completed: Biryani & Raita (20 kg)',
      time: '15 minutes ago',
    },
    {
      type: 'warning',
      message: 'Pending verification: Food Garden Restaurant',
      time: '1 hour ago',
    },
    {
      type: 'success',
      message: 'New NGO registered: Hope Foundation',
      time: '2 hours ago',
    },
  ];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl text-slate-900">Admin Dashboard</h2>
          <p className="text-slate-600 mt-1">Monitor and manage the entire platform</p>
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

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Recent Activity */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity size={20} />
                Recent Activity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === 'success'
                          ? 'bg-green-500'
                          : activity.type === 'warning'
                          ? 'bg-yellow-500'
                          : 'bg-blue-500'
                      }`}
                    />
                    <div className="flex-1">
                      <p className="text-slate-900">{activity.message}</p>
                      <p className="text-sm text-slate-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Platform Health */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle size={20} />
                Platform Health
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Server Status</span>
                    <span className="text-sm text-green-600">Online</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[95%] h-full bg-green-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Active Users</span>
                    <span className="text-sm text-blue-600">87%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[87%] h-full bg-blue-500" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-sm text-slate-600">Donation Success Rate</span>
                    <span className="text-sm text-green-600">92%</span>
                  </div>
                  <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div className="w-[92%] h-full bg-green-500" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

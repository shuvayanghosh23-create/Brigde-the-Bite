import React from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { platformStats } from '../../data/mockData';

export default function AdminAnalytics() {
  const monthlyData = [
    { month: 'Jan', donations: 850, meals: 42500 },
    { month: 'Feb', donations: 920, meals: 46000 },
    { month: 'Mar', donations: 1100, meals: 55000 },
    { month: 'Apr', donations: 980, meals: 49000 },
    { month: 'May', donations: 1250, meals: 62500 },
    { month: 'Jun', donations: 1400, meals: 70000 },
  ];

  const categoryData = [
    { name: 'Completed', value: 45 },
    { name: 'Active', value: 30 },
    { name: 'Pending', value: 25 },
  ];

  const COLORS = ['#22c55e', '#3b82f6', '#f59e0b'];

  return (
    <DashboardLayout role="admin">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl text-slate-900">Platform Analytics</h2>
          <p className="text-slate-600 mt-1">Comprehensive platform insights and metrics</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Donation Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Line type="monotone" dataKey="donations" stroke="#22c55e" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Donation Status Distribution</CardTitle>
            </CardHeader>
            <CardContent className="flex justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Meals Served Per Month</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="meals" fill="#f97316" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Key Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Total Meals Donated</span>
                  <span className="text-2xl text-slate-900">{platformStats.totalMeals.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Active NGOs</span>
                  <span className="text-2xl text-slate-900">{platformStats.activeNGOs}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">Restaurants</span>
                  <span className="text-2xl text-slate-900">{platformStats.restaurantsJoined}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-600">This Month</span>
                  <span className="text-2xl text-green-600">{platformStats.mealsThisMonth.toLocaleString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}

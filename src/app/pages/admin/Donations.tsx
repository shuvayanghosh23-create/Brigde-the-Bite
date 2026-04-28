import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { getDonations } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import {
  Package, CheckCircle, Clock, TrendingUp, Search, RefreshCw,
  AlertCircle, Camera, X
} from 'lucide-react';

export default function AdminDonations() {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'accepted' | 'completed' | 'cancelled'>('all');
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(null);

  const loadDonations = () => {
    const all = getDonations();
    setDonations(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    setLastRefresh(new Date());
  };

  useEffect(() => {
    loadDonations();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadDonations, 10000);
    return () => clearInterval(interval);
  }, []);

  const filtered = donations
    .filter((d) => filterStatus === 'all' || d.status === filterStatus)
    .filter((d) =>
      d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.restaurantName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (d.ngoName || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

  const counts = {
    total: donations.length,
    pending: donations.filter((d) => d.status === 'pending').length,
    accepted: donations.filter((d) => d.status === 'accepted').length,
    completed: donations.filter((d) => d.status === 'completed').length,
    cancelled: donations.filter((d) => d.status === 'cancelled').length,
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1 inline" />Pending</Badge>;
      case 'accepted':
        return <Badge className="bg-blue-100 text-blue-800"><Package size={12} className="mr-1 inline" />Accepted</Badge>;
      case 'completed':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1 inline" />Completed</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800">Cancelled</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const timeSince = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-slate-900">Donation Monitoring</h2>
            <p className="text-slate-600 mt-1">Real-time tracking of all platform donations</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </span>
            <Button variant="outline" size="sm" onClick={loadDonations}>
              <RefreshCw size={14} className="mr-1" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: 'Total', value: counts.total, color: 'text-slate-700', bg: 'bg-slate-50', border: 'border-slate-200' },
            { label: 'Pending', value: counts.pending, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { label: 'Active', value: counts.accepted, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
            { label: 'Completed', value: counts.completed, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
            { label: 'Cancelled', value: counts.cancelled, color: 'text-red-700', bg: 'bg-red-50', border: 'border-red-200' },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.bg} ${stat.border}`}>
              <CardContent className="pt-3 pb-3 text-center">
                <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Active Donations Live Feed */}
        {counts.accepted > 0 && (
          <Card className="border-blue-200 bg-blue-50/30">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse inline-block" />
                Live Active Donations ({counts.accepted})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-3">
                {donations
                  .filter((d) => d.status === 'accepted')
                  .map((donation) => (
                    <div key={donation.id} className="bg-white rounded-xl p-4 border border-blue-100 shadow-sm">
                      <div className="flex items-start justify-between mb-2">
                        <p className="text-slate-900">{donation.foodName}</p>
                        <span className="text-xs text-blue-600">{timeSince(donation.createdAt)}</span>
                      </div>
                      <p className="text-sm text-green-600">{donation.restaurantName}</p>
                      <p className="text-sm text-orange-600">→ {donation.ngoName}</p>
                      <p className="text-xs text-slate-500 mt-1">{donation.quantity}</p>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search donations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'accepted', 'completed', 'cancelled'] as const).map((s) => (
              <Button
                key={s}
                variant={filterStatus === s ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(s)}
                className={filterStatus === s ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Restaurant</TableHead>
                  <TableHead>NGO</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Posted</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Proof</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No donations found
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((donation) => (
                    <TableRow key={donation.id} className="hover:bg-slate-50">
                      <TableCell className="font-medium text-slate-900">{donation.foodName}</TableCell>
                      <TableCell className="text-green-700">{donation.restaurantName}</TableCell>
                      <TableCell className="text-orange-700">{donation.ngoName || <span className="text-slate-400">Awaiting</span>}</TableCell>
                      <TableCell className="text-slate-600">{donation.quantity}</TableCell>
                      <TableCell className="text-xs text-slate-500">
                        {timeSince(donation.createdAt)}
                        <br />
                        <span className="text-slate-400">{new Date(donation.createdAt).toLocaleDateString()}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(donation.status)}</TableCell>
                      <TableCell>
                        {donation.completionPhotoUrl ? (
                          <button
                            onClick={() => setSelectedPhoto(donation.completionPhotoUrl!)}
                            className="flex items-center gap-1 text-xs text-blue-600 hover:underline"
                          >
                            <Camera size={12} />
                            View
                          </button>
                        ) : (
                          <span className="text-xs text-slate-300">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* Photo Modal */}
      {selectedPhoto && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="relative max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedPhoto(null)} className="absolute -top-10 right-0 text-white">
              <X size={24} />
            </button>
            <img src={selectedPhoto} alt="Completion proof" className="w-full rounded-2xl shadow-2xl" />
          </div>
        </motion.div>
      )}
    </DashboardLayout>
  );
}

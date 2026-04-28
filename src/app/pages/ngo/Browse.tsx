import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { getDonations, updateDonation } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Search, MapPin, Clock, Package, Filter } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function NGOBrowse() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadDonations();
  }, []);

  const loadDonations = () => {
    const allDonations = getDonations();
    const pending = allDonations.filter((d) => d.status === 'pending');
    setDonations(pending);
  };

  const handleAccept = (donation: Donation) => {
    updateDonation(donation.id, {
      status: 'accepted',
      ngoId: user!.id,
      ngoName: user!.name,
      acceptedAt: new Date().toISOString(),
    });

    addNotification({
      userId: user!.id,
      type: 'request',
      title: 'Donation Accepted',
      message: `You have accepted ${donation.foodName} from ${donation.restaurantName}`,
    });

    loadDonations();
  };

  const getTimeRemaining = (expiryTime: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    const diff = expiry - now;

    if (diff < 0) return { text: 'Expired', color: 'text-red-600' };

    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 2) {
      return { text: `${hours}h remaining`, color: 'text-red-600' };
    } else if (hours < 5) {
      return { text: `${hours}h remaining`, color: 'text-orange-600' };
    } else {
      return { text: `${hours}h remaining`, color: 'text-green-600' };
    }
  };

  const filteredDonations = donations.filter((d) =>
    d.foodName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.restaurantName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl text-slate-900">Browse Food Donations</h2>
          <p className="text-slate-600 mt-1">
            Discover available food donations from nearby restaurants
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search by food name or restaurant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline">
            <Filter size={20} className="mr-2" />
            Filter
          </Button>
        </div>

        {/* Donations Grid */}
        {filteredDonations.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <Package size={48} className="mx-auto text-slate-400 mb-4" />
              <h3 className="text-lg text-slate-900 mb-2">No donations available</h3>
              <p className="text-slate-600">
                Check back later for new food donations
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDonations.map((donation, index) => {
              const timeInfo = getTimeRemaining(donation.expiryTime);
              return (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                >
                  <Card className="hover:shadow-xl transition-shadow overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-orange-100 to-green-100 relative overflow-hidden">
                      {donation.imageUrl ? (
                        <ImageWithFallback
                          src={donation.imageUrl}
                          alt={donation.foodName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package size={64} className="text-slate-400" />
                        </div>
                      )}
                      <div className="absolute top-3 right-3">
                        <Badge className="bg-white text-slate-900">
                          Available
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="pt-4">
                      <h3 className="text-lg text-slate-900 mb-2">
                        {donation.foodName}
                      </h3>
                      <p className="text-sm text-slate-600 mb-3">
                        by {donation.restaurantName}
                      </p>

                      <div className="space-y-2 text-sm text-slate-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Package size={16} />
                          <span>Quantity: {donation.quantity}</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <MapPin size={16} className="mt-0.5" />
                          <span className="flex-1">{donation.pickupLocation}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock size={16} />
                          <span className={timeInfo.color}>{timeInfo.text}</span>
                        </div>
                      </div>

                      <Button
                        className="w-full bg-orange-600 hover:bg-orange-700"
                        onClick={() => handleAccept(donation)}
                      >
                        Accept Donation
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../utils/storage';
import { mockUsers } from '../../data/mockData';
import { MapPin, Navigation, Store, Users, Clock, Package } from 'lucide-react';

export default function MapView() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<any[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<any>(null);
  const [filterType, setFilterType] = useState<'all' | 'pending' | 'restaurants' | 'ngos'>('all');

  useEffect(() => {
    const allDonations = getDonations();
    setDonations(allDonations);
  }, []);

  const restaurants = mockUsers.filter((u) => u.role === 'restaurant');
  const ngos = mockUsers.filter((u) => u.role === 'ngo');

  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
    const R = 6371; // Earth's radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const markers = [];

  if (filterType === 'all' || filterType === 'restaurants') {
    restaurants.forEach((rest) => {
      if (rest.location) {
        const distance = user?.location
          ? calculateDistance(
              user.location.lat,
              user.location.lng,
              rest.location.lat,
              rest.location.lng
            )
          : 0;
        markers.push({
          type: 'restaurant',
          id: rest.id,
          name: rest.name,
          location: rest.location,
          address: rest.address,
          distance,
          data: rest,
        });
      }
    });
  }

  if (filterType === 'all' || filterType === 'ngos') {
    ngos.forEach((ngo) => {
      if (ngo.location) {
        const distance = user?.location
          ? calculateDistance(
              user.location.lat,
              user.location.lng,
              ngo.location.lat,
              ngo.location.lng
            )
          : 0;
        markers.push({
          type: 'ngo',
          id: ngo.id,
          name: ngo.name,
          location: ngo.location,
          address: ngo.address,
          distance,
          data: ngo,
        });
      }
    });
  }

  if (filterType === 'all' || filterType === 'pending') {
    donations
      .filter((d) => d.status === 'pending')
      .forEach((donation) => {
        if (donation.location) {
          const distance = user?.location
            ? calculateDistance(
                user.location.lat,
                user.location.lng,
                donation.location.lat,
                donation.location.lng
              )
            : 0;
          markers.push({
            type: 'donation',
            id: donation.id,
            name: donation.foodName,
            location: donation.location,
            address: donation.pickupLocation,
            distance,
            data: donation,
          });
        }
      });
  }

  const nearbyMarkers = markers.filter((m) => m.distance <= 5);

  return (
    <DashboardLayout role={user?.role as any}>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl text-slate-900">Map View</h2>
            <p className="text-slate-600 mt-1">
              Discover nearby restaurants, NGOs, and food donations within 5km
            </p>
          </div>
          <div className="flex gap-2">
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'restaurants', label: 'Restaurants' },
              { key: 'ngos', label: 'NGOs' },
            ].map((filter) => (
              <Button
                key={filter.key}
                variant={filterType === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterType(filter.key as any)}
                className={filterType === filter.key ? 'bg-green-600 hover:bg-green-700' : ''}
              >
                {filter.label}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Map Area */}
          <Card className="lg:col-span-2">
            <CardContent className="p-0">
              <div className="relative h-[600px] bg-gradient-to-br from-slate-100 to-slate-200 rounded-lg">
                {/* Simulated Map Interface */}
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  {/* Grid Background */}
                  <svg className="absolute inset-0 w-full h-full opacity-20">
                    <defs>
                      <pattern
                        id="grid"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <path
                          d="M 40 0 L 0 0 0 40"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="1"
                        />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />
                  </svg>

                  {/* 5km Radius Circle */}
                  {user?.location && (
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 border-4 border-green-500 rounded-full opacity-30" />
                  )}

                  {/* Current User Location */}
                  {user?.location && (
                    <motion.div
                      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                      animate={{
                        scale: [1, 1.2, 1],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    >
                      <div className="bg-blue-500 w-6 h-6 rounded-full border-4 border-white shadow-lg" />
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap">
                        <Badge className="bg-blue-600">You</Badge>
                      </div>
                    </motion.div>
                  )}

                  {/* Markers */}
                  {nearbyMarkers.slice(0, 12).map((marker, index) => {
                    const angle = (index / nearbyMarkers.length) * 2 * Math.PI;
                    const radius = 120 + Math.random() * 100;
                    const x = 50 + Math.cos(angle) * (radius / 3);
                    const y = 50 + Math.sin(angle) * (radius / 3);

                    return (
                      <motion.div
                        key={marker.id}
                        className={`absolute cursor-pointer group`}
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: 'translate(-50%, -50%)',
                        }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => setSelectedMarker(marker)}
                      >
                        <div
                          className={`p-2 rounded-full shadow-lg border-2 border-white ${
                            marker.type === 'restaurant'
                              ? 'bg-green-500'
                              : marker.type === 'ngo'
                              ? 'bg-orange-500'
                              : 'bg-purple-500'
                          }`}
                        >
                          {marker.type === 'restaurant' ? (
                            <Store className="text-white" size={20} />
                          ) : marker.type === 'ngo' ? (
                            <Users className="text-white" size={20} />
                          ) : (
                            <Package className="text-white" size={20} />
                          )}
                        </div>
                        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="bg-white px-3 py-1 rounded shadow-lg whitespace-nowrap text-sm">
                            {marker.name}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Map Controls */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <Button size="sm" variant="secondary" className="bg-white shadow-lg">
                    <Navigation size={18} />
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white shadow-lg">
                    +
                  </Button>
                  <Button size="sm" variant="secondary" className="bg-white shadow-lg">
                    -
                  </Button>
                </div>

                {/* Legend */}
                <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-4">
                  <h4 className="text-sm text-slate-900 mb-2">Legend</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-green-500" />
                      <span className="text-slate-700">Restaurants</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-orange-500" />
                      <span className="text-slate-700">NGOs</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-purple-500" />
                      <span className="text-slate-700">Pending Donations</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 rounded-full bg-blue-500" />
                      <span className="text-slate-700">Your Location</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg text-slate-900 mb-4">
                  Nearby Locations ({nearbyMarkers.length})
                </h3>
                <div className="space-y-3 max-h-[520px] overflow-y-auto">
                  {nearbyMarkers.length === 0 ? (
                    <div className="text-center py-8">
                      <MapPin className="mx-auto text-slate-400 mb-2" size={32} />
                      <p className="text-slate-600 text-sm">
                        No locations found within 5km radius
                      </p>
                    </div>
                  ) : (
                    nearbyMarkers.map((marker) => (
                      <div
                        key={marker.id}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedMarker?.id === marker.id
                            ? 'border-green-500 bg-green-50'
                            : 'border-slate-200 hover:border-slate-300'
                        }`}
                        onClick={() => setSelectedMarker(marker)}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className={`p-2 rounded-lg ${
                              marker.type === 'restaurant'
                                ? 'bg-green-100'
                                : marker.type === 'ngo'
                                ? 'bg-orange-100'
                                : 'bg-purple-100'
                            }`}
                          >
                            {marker.type === 'restaurant' ? (
                              <Store
                                className={
                                  marker.type === 'restaurant'
                                    ? 'text-green-600'
                                    : 'text-orange-600'
                                }
                                size={20}
                              />
                            ) : marker.type === 'ngo' ? (
                              <Users className="text-orange-600" size={20} />
                            ) : (
                              <Package className="text-purple-600" size={20} />
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="text-slate-900 text-sm">{marker.name}</h4>
                            <p className="text-xs text-slate-600 mt-1">
                              <MapPin className="inline" size={12} />{' '}
                              {marker.distance.toFixed(2)} km away
                            </p>
                            {marker.type === 'donation' && (
                              <Badge className="mt-2 bg-purple-100 text-purple-800">
                                <Clock className="inline mr-1" size={12} />
                                {marker.data.quantity}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

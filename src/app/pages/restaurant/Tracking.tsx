import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, updateDonation } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Clock, CheckCircle, Package, MapPin, Phone, X, MessageSquare, User, Calendar } from 'lucide-react';

export default function RestaurantTracking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [donations, setDonations] = useState<Donation[]>([]);
  const [selectedDonation, setSelectedDonation] = useState<Donation | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const loadDonations = () => {
    const allDonations = getDonations();
    const myDonations = allDonations.filter((d) => d.restaurantId === user?.id);
    setDonations(myDonations);
  };

  useEffect(() => {
    loadDonations();
  }, [user]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };

  const getTimeRemaining = (expiryTime: string) => {
    const now = new Date().getTime();
    const expiry = new Date(expiryTime).getTime();
    const diff = expiry - now;
    if (diff < 0) return 'Expired';
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m remaining`;
  };

  const handleCancelDonation = (id: string) => {
    updateDonation(id, { status: 'cancelled' });
    loadDonations();
  };

  const handleChatWithNGO = (donation: Donation) => {
    // Navigate to chat page with the NGO pre-selected
    navigate('/restaurant/chat', { state: { ngoId: donation.ngoId, ngoName: donation.ngoName } });
  };

  const handleViewDetails = (donation: Donation) => {
    setSelectedDonation(donation);
    setShowDetails(true);
  };

  const pendingDonations = donations.filter((d) => d.status === 'pending');
  const activeDonations = donations.filter((d) => d.status === 'accepted');
  const completedDonations = donations.filter((d) => d.status === 'completed');
  const cancelledDonations = donations.filter((d) => d.status === 'cancelled');

  return (
    <DashboardLayout role="restaurant">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl text-slate-900">Track Donations</h2>
          <p className="text-slate-600 mt-1">Monitor the status of your food donations</p>
        </div>

        {/* Pending Donations */}
        {pendingDonations.length > 0 && (
          <div>
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="text-yellow-600" size={24} />
              Pending Donations ({pendingDonations.length})
            </h3>
            <div className="grid gap-4">
              {pendingDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg text-slate-900">{donation.foodName}</h4>
                            <Badge className={getStatusColor(donation.status)}>Pending</Badge>
                          </div>
                          <p className="text-slate-600 mb-2">
                            <Package className="inline mr-2" size={16} />
                            Quantity: {donation.quantity}
                          </p>
                          <p className="text-slate-600 mb-2">
                            <MapPin className="inline mr-2" size={16} />
                            {donation.pickupLocation}
                          </p>
                          <p className="text-slate-600 mb-2">
                            <Phone className="inline mr-2" size={16} />
                            {donation.contactNumber}
                          </p>
                          <p className="text-sm text-orange-600 mt-2">
                            <Clock className="inline mr-1" size={14} />
                            {getTimeRemaining(donation.expiryTime)}
                          </p>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleViewDetails(donation)}>
                            View Details
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => handleCancelDonation(donation.id)}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Active / Accepted Donations */}
        {activeDonations.length > 0 && (
          <div>
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Package className="text-blue-600" size={24} />
              Accepted Donations ({activeDonations.length})
            </h3>
            <div className="grid gap-4">
              {activeDonations.map((donation) => (
                <motion.div
                  key={donation.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="hover:shadow-lg transition-shadow border-blue-200">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <h4 className="text-lg text-slate-900">{donation.foodName}</h4>
                            <Badge className={getStatusColor(donation.status)}>Accepted</Badge>
                          </div>
                          <p className="text-green-600 mb-2">
                            Accepted by: <strong>{donation.ngoName}</strong>
                          </p>
                          <p className="text-slate-600 mb-2">
                            <Package className="inline mr-2" size={16} />
                            Quantity: {donation.quantity}
                          </p>
                          <p className="text-sm text-slate-500">
                            Accepted at:{' '}
                            {donation.acceptedAt
                              ? new Date(donation.acceptedAt).toLocaleString()
                              : 'N/A'}
                          </p>

                          {/* Timeline */}
                          <div className="mt-4 flex items-center gap-2">
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                                <CheckCircle className="text-white" size={16} />
                              </div>
                              <div className="h-0.5 w-16 bg-green-500" />
                            </div>
                            <div className="flex items-center">
                              <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center animate-pulse">
                                <Clock className="text-white" size={16} />
                              </div>
                              <div className="h-0.5 w-16 bg-slate-300" />
                            </div>
                            <div className="w-8 h-8 rounded-full bg-slate-300 flex items-center justify-center">
                              <CheckCircle className="text-slate-500" size={16} />
                            </div>
                          </div>
                          <div className="flex gap-16 mt-1 text-xs text-slate-600 ml-2">
                            <span>Posted</span>
                            <span>In Progress</span>
                            <span>Complete</span>
                          </div>
                        </div>
                        <div className="flex flex-col gap-2">
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleChatWithNGO(donation)}
                          >
                            <MessageSquare size={14} className="mr-1" />
                            Chat with NGO
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewDetails(donation)}
                          >
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Donations */}
        {completedDonations.length > 0 && (
          <div>
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={24} />
              Completed Donations ({completedDonations.length})
            </h3>
            <div className="grid gap-4">
              {completedDonations.map((donation) => (
                <Card key={donation.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <h4 className="text-slate-900">{donation.foodName}</h4>
                        <p className="text-sm text-slate-600">Delivered to {donation.ngoName}</p>
                        <p className="text-xs text-slate-500 mt-1">
                          Completed: {donation.completedAt ? new Date(donation.completedAt).toLocaleString() : 'N/A'}
                        </p>
                        {donation.completionPhotoUrl && (
                          <img
                            src={donation.completionPhotoUrl}
                            alt="Donation completion"
                            className="mt-2 w-32 h-20 object-cover rounded-lg border"
                          />
                        )}
                      </div>
                      <div className="flex flex-col gap-2 items-end">
                        <Badge className={getStatusColor(donation.status)}>Completed</Badge>
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(donation)}>
                          View Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {donations.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto text-slate-400 mb-4" size={48} />
              <h3 className="text-lg text-slate-900 mb-2">No donations yet</h3>
              <p className="text-slate-600 mb-4">Create your first donation to start tracking</p>
              <Button className="bg-green-600 hover:bg-green-700" onClick={() => navigate('/restaurant/donate')}>
                Create Donation
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Donation Details Modal */}
      <AnimatePresence>
        {showDetails && selectedDonation && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setShowDetails(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-slate-900">Donation Details</h3>
                <button onClick={() => setShowDetails(false)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Food Item</span>
                  <span className="text-slate-900 font-medium">{selectedDonation.foodName}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Quantity</span>
                  <span className="text-slate-900">{selectedDonation.quantity}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Status</span>
                  <Badge className={getStatusColor(selectedDonation.status)}>{selectedDonation.status}</Badge>
                </div>
                {selectedDonation.ngoName && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Accepted By</span>
                    <span className="text-slate-900 flex items-center gap-1">
                      <User size={14} /> {selectedDonation.ngoName}
                    </span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Pickup Location</span>
                  <span className="text-slate-900 text-sm text-right max-w-[200px]">{selectedDonation.pickupLocation}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Contact</span>
                  <span className="text-slate-900">{selectedDonation.contactNumber}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600">Posted</span>
                  <span className="text-slate-900 text-sm">
                    <Calendar size={14} className="inline mr-1" />
                    {new Date(selectedDonation.createdAt).toLocaleString()}
                  </span>
                </div>
                {selectedDonation.acceptedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Accepted At</span>
                    <span className="text-slate-900 text-sm">{new Date(selectedDonation.acceptedAt).toLocaleString()}</span>
                  </div>
                )}
                {selectedDonation.completedAt && (
                  <div className="flex items-center justify-between">
                    <span className="text-slate-600">Completed At</span>
                    <span className="text-slate-900 text-sm">{new Date(selectedDonation.completedAt).toLocaleString()}</span>
                  </div>
                )}
                {selectedDonation.completionPhotoUrl && (
                  <div>
                    <p className="text-slate-600 mb-2">Completion Photo (uploaded by NGO)</p>
                    <img
                      src={selectedDonation.completionPhotoUrl}
                      alt="Completion"
                      className="w-full h-48 object-cover rounded-xl border"
                    />
                  </div>
                )}
              </div>
              <div className="mt-6 flex gap-2">
                {selectedDonation.status === 'accepted' && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      handleChatWithNGO(selectedDonation);
                      setShowDetails(false);
                    }}
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Chat with NGO
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setShowDetails(false)}>
                  Close
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

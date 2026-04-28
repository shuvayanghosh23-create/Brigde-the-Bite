import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, updateDonation, addNotification } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Clock, CheckCircle, MapPin, Camera, Upload, Package, Phone, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NGORequests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState<Donation[]>([]);
  const [completingId, setCompletingId] = useState<string | null>(null);
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);
  const [showPhotoModal, setShowPhotoModal] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadRequests = () => {
    const allDonations = getDonations();
    const myRequests = allDonations.filter((d) => d.ngoId === user?.id);
    setRequests(myRequests.sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    ));
  };

  useEffect(() => {
    loadRequests();
  }, [user]);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setUploadedPhoto(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleConfirmComplete = (donation: Donation) => {
    if (!user) return;

    const updates: Partial<Donation> = {
      status: 'completed',
      completedAt: new Date().toISOString(),
    };
    if (uploadedPhoto) {
      updates.completionPhotoUrl = uploadedPhoto;
    }

    updateDonation(donation.id, updates);

    // Notify the restaurant
    addNotification({
      id: `notif_${Date.now()}`,
      userId: donation.restaurantId,
      type: 'donation',
      title: 'Donation Completed! ✅',
      message: `${user.name} has confirmed pickup and delivery of "${donation.foodName}".`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/restaurant/tracking',
    });

    // Notify admin
    addNotification({
      id: `notif_${Date.now() + 1}`,
      userId: 'admin1',
      type: 'donation',
      title: 'Donation Completed',
      message: `${donation.foodName} from ${donation.restaurantName} completed by ${user.name}.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/admin/donations',
    });

    toast.success('Donation marked as complete! Thank you for your service.');
    setCompletingId(null);
    setUploadedPhoto(null);
    loadRequests();
  };

  const activeRequests = requests.filter((r) => r.status === 'accepted');
  const completedRequests = requests.filter((r) => r.status === 'completed');

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8">
        <div>
          <h2 className="text-3xl text-slate-900">My Requests</h2>
          <p className="text-slate-600 mt-1">Track and manage your accepted donations</p>
        </div>

        {/* Active Requests */}
        {activeRequests.length > 0 && (
          <div>
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="text-blue-600" size={24} />
              Active Requests ({activeRequests.length})
            </h3>
            <div className="space-y-4">
              {activeRequests.map((request) => (
                <motion.div
                  key={request.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="border-blue-200 hover:shadow-lg transition-shadow">
                    <CardContent className="pt-6">
                      <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between">
                            <h4 className="text-lg text-slate-900">{request.foodName}</h4>
                            <Badge className="bg-blue-100 text-blue-800">
                              <Clock size={12} className="mr-1 inline" />In Progress
                            </Badge>
                          </div>
                          <p className="text-slate-600">
                            <Package className="inline mr-2" size={14} />
                            From: <strong>{request.restaurantName}</strong> · {request.quantity}
                          </p>
                          <p className="text-sm text-slate-600">
                            <MapPin className="inline mr-1" size={14} />
                            {request.pickupLocation}
                          </p>
                          <p className="text-sm text-slate-600">
                            <Phone className="inline mr-1" size={14} />
                            {request.contactNumber}
                          </p>
                          <p className="text-xs text-slate-500">
                            Accepted: {new Date(request.acceptedAt || request.createdAt).toLocaleString()}
                          </p>
                        </div>

                        <div className="flex flex-col gap-2 min-w-[160px]">
                          {completingId === request.id ? (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="space-y-3 p-3 bg-green-50 rounded-xl border border-green-200"
                            >
                              <p className="text-sm text-green-800 font-semibold">Confirm Completion</p>
                              <p className="text-xs text-slate-600">Optionally upload a photo of the donation:</p>

                              <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={handlePhotoUpload}
                              />

                              {uploadedPhoto ? (
                                <div className="relative">
                                  <img
                                    src={uploadedPhoto}
                                    alt="Proof"
                                    className="w-full h-24 object-cover rounded-lg"
                                  />
                                  <button
                                    onClick={() => setUploadedPhoto(null)}
                                    className="absolute top-1 right-1 bg-white rounded-full p-0.5 shadow"
                                  >
                                    <X size={12} />
                                  </button>
                                </div>
                              ) : (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full text-xs border-dashed"
                                  onClick={() => fileInputRef.current?.click()}
                                >
                                  <Camera size={14} className="mr-1" />
                                  Upload Photo
                                </Button>
                              )}

                              <div className="flex gap-1">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-xs"
                                  onClick={() => handleConfirmComplete(request)}
                                >
                                  <CheckCircle size={12} className="mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-xs"
                                  onClick={() => { setCompletingId(null); setUploadedPhoto(null); }}
                                >
                                  <X size={12} />
                                </Button>
                              </div>
                            </motion.div>
                          ) : (
                            <Button
                              size="sm"
                              className="bg-green-600 hover:bg-green-700"
                              onClick={() => setCompletingId(request.id)}
                            >
                              <CheckCircle size={14} className="mr-1" />
                              Mark as Complete
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        {/* Completed Requests */}
        {completedRequests.length > 0 && (
          <div>
            <h3 className="text-xl text-slate-900 mb-4 flex items-center gap-2">
              <CheckCircle className="text-green-600" size={24} />
              Completed ({completedRequests.length})
            </h3>
            <div className="space-y-3">
              {completedRequests.map((request) => (
                <Card key={request.id} className="opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="pt-4 pb-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <h4 className="text-slate-900">{request.foodName}</h4>
                        <p className="text-sm text-slate-600">
                          From: {request.restaurantName} · {request.quantity}
                        </p>
                        <p className="text-xs text-slate-500">
                          Completed: {request.completedAt ? new Date(request.completedAt).toLocaleString() : 'N/A'}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        {request.completionPhotoUrl && (
                          <button
                            onClick={() => setShowPhotoModal(request.completionPhotoUrl!)}
                            className="flex items-center gap-1 text-sm text-blue-600 hover:underline"
                          >
                            <Camera size={14} />
                            View Photo
                          </button>
                        )}
                        <Badge className="bg-green-100 text-green-800">
                          <CheckCircle size={12} className="mr-1 inline" />
                          Completed
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {requests.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center">
              <Package className="mx-auto text-slate-400 mb-4" size={48} />
              <h3 className="text-lg text-slate-900 mb-2">No active requests</h3>
              <p className="text-slate-600">Browse available donations to accept food donations.</p>
            </CardContent>
          </Card>
        )}

        {/* Photo Modal */}
        <AnimatePresence>
          {showPhotoModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
              onClick={() => setShowPhotoModal(null)}
            >
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
                className="relative max-w-lg w-full"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setShowPhotoModal(null)}
                  className="absolute -top-10 right-0 text-white hover:text-slate-300"
                >
                  <X size={24} />
                </button>
                <img
                  src={showPhotoModal}
                  alt="Donation completion photo"
                  className="w-full rounded-2xl shadow-2xl"
                />
                <p className="text-center text-white/70 text-sm mt-3">Donation completion photo uploaded by NGO</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </DashboardLayout>
  );
}

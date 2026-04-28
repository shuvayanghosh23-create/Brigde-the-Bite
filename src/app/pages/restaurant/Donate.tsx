import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { useAuth } from '../../contexts/AuthContext';
import { useNotifications } from '../../contexts/NotificationContext';
import { addDonation } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Upload, CheckCircle } from 'lucide-react';
import { ImageWithFallback } from '../../components/figma/ImageWithFallback';

export default function DonatePage() {
  const { user } = useAuth();
  const { addNotification } = useNotifications();
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    foodName: '',
    quantity: '',
    expiryTime: '',
    pickupLocation: user?.address || '',
    contactNumber: user?.phone || '',
    description: '',
  });

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const donation: Donation = {
      id: `don_${Date.now()}`,
      restaurantId: user!.id,
      restaurantName: user!.name,
      foodName: formData.foodName,
      quantity: formData.quantity,
      expiryTime: new Date(formData.expiryTime).toISOString(),
      pickupLocation: formData.pickupLocation,
      contactNumber: formData.contactNumber,
      status: 'pending',
      createdAt: new Date().toISOString(),
      location: user!.location || { lat: 12.9716, lng: 77.5946 },
      imageUrl: imagePreview || undefined,
    };

    addDonation(donation);
    
    addNotification({
      userId: user!.id,
      type: 'donation',
      title: 'Donation Posted Successfully',
      message: `Your donation of ${formData.foodName} has been posted and is now visible to NGOs`,
    });

    setSubmitted(true);
    setTimeout(() => {
      navigate('/restaurant/tracking');
    }, 2000);
  };

  if (submitted) {
    return (
      <DashboardLayout role="restaurant">
        <div className="flex items-center justify-center min-h-[60vh]">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-green-600" size={48} />
            </div>
            <h2 className="text-3xl text-slate-900 mb-4">Donation Posted Successfully!</h2>
            <p className="text-slate-600 mb-6">
              Your food donation is now live. Nearby NGOs will be notified.
            </p>
            <p className="text-sm text-slate-500">Redirecting to tracking page...</p>
          </motion.div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout role="restaurant">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl text-slate-900 mb-2">Generate Food Donation</h2>
          <p className="text-slate-600 mb-8">
            Fill in the details of the surplus food you'd like to donate
          </p>

          <Card>
            <CardHeader>
              <CardTitle>Donation Details</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="foodName">Food Name *</Label>
                  <Input
                    id="foodName"
                    placeholder="e.g., Mixed Vegetable Curry, Biryani"
                    value={formData.foodName}
                    onChange={(e) =>
                      setFormData({ ...formData, foodName: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    placeholder="e.g., 10 kg, 50 servings"
                    value={formData.quantity}
                    onChange={(e) =>
                      setFormData({ ...formData, quantity: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description (Optional)</Label>
                  <Textarea
                    id="description"
                    placeholder="Additional details about the food..."
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="expiryTime">Expiry Date & Time *</Label>
                  <Input
                    id="expiryTime"
                    type="datetime-local"
                    value={formData.expiryTime}
                    onChange={(e) =>
                      setFormData({ ...formData, expiryTime: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="image">Upload Food Image (Optional)</Label>
                  <div className="mt-2">
                    <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors cursor-pointer">
                      <input
                        id="image"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        {imagePreview ? (
                          <div className="space-y-4">
                            <img
                              src={imagePreview}
                              alt="Preview"
                              className="max-h-48 mx-auto rounded-lg"
                            />
                            <p className="text-sm text-slate-600">Click to change image</p>
                          </div>
                        ) : (
                          <div>
                            <Upload className="mx-auto text-slate-400 mb-2" size={32} />
                            <p className="text-slate-600">
                              Click to upload or drag and drop
                            </p>
                            <p className="text-sm text-slate-500 mt-1">
                              PNG, JPG up to 10MB
                            </p>
                          </div>
                        )}
                      </label>
                    </div>
                    {!imagePreview && (
                      <div className="mt-4 grid grid-cols-3 gap-4">
                        <ImageWithFallback
                          src="https://images.unsplash.com/photo-1690789626997-6f0c9aa0a1cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc3MTk1OTIzNnww&ixlib=rb-4.1.0&q=80&w=1080"
                          alt="Sample"
                          className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-75 transition-opacity"
                          onClick={() => setImagePreview("https://images.unsplash.com/photo-1690789626997-6f0c9aa0a1cb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmVzaCUyMHJlc3RhdXJhbnQlMjBmb29kfGVufDF8fHx8MTc3MTk1OTIzNnww&ixlib=rb-4.1.0&q=80&w=1080")}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <Label htmlFor="pickupLocation">Pickup Location *</Label>
                  <Input
                    id="pickupLocation"
                    placeholder="Enter pickup address"
                    value={formData.pickupLocation}
                    onChange={(e) =>
                      setFormData({ ...formData, pickupLocation: e.target.value })
                    }
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    type="tel"
                    placeholder="+91 XXXXX XXXXX"
                    value={formData.contactNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, contactNumber: e.target.value })
                    }
                    required
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => navigate('/restaurant/dashboard')}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    Submit Donation
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}

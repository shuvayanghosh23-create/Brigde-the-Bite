import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, getRatings, addRating } from '../../utils/storage';
import { Donation, Rating } from '../../data/mockData';
import { Star, ThumbsUp, Award, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';

function StarRating({ value, onChange, readonly = false }: { value: number; onChange?: (v: number) => void; readonly?: boolean }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onChange?.(star)}
          onMouseEnter={() => !readonly && setHovered(star)}
          onMouseLeave={() => !readonly && setHovered(0)}
          className={`transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <Star
            size={readonly ? 16 : 24}
            className={
              star <= (hovered || value)
                ? 'text-yellow-400 fill-yellow-400'
                : 'text-slate-300'
            }
          />
        </button>
      ))}
    </div>
  );
}

export default function NGOReviews() {
  const { user } = useAuth();
  const [receivedRatings, setReceivedRatings] = useState<Rating[]>([]);
  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);
  const [completedDonations, setCompletedDonations] = useState<Donation[]>([]);
  const [ratingForm, setRatingForm] = useState<{ donationId: string; restaurantId: string; restaurantName: string } | null>(null);
  const [score, setScore] = useState(5);
  const [review, setReview] = useState('');

  const loadData = () => {
    if (!user) return;
    const allRatings = getRatings();
    setReceivedRatings(allRatings.filter((r) => r.toId === user.id));
    setGivenRatings(allRatings.filter((r) => r.fromId === user.id));
    const allDonations = getDonations();
    const myCompleted = allDonations.filter(
      (d) => d.ngoId === user.id && d.status === 'completed'
    );
    setCompletedDonations(myCompleted);
  };

  useEffect(() => {
    loadData();
  }, [user]);

  const avgRating =
    receivedRatings.length > 0
      ? (receivedRatings.reduce((sum, r) => sum + r.score, 0) / receivedRatings.length).toFixed(1)
      : 'N/A';

  const alreadyRated = (donationId: string) =>
    givenRatings.some((r) => r.donationId === donationId);

  const handleSubmitRating = () => {
    if (!ratingForm || !user) return;
    if (!review.trim()) {
      toast.error('Please write a review');
      return;
    }
    const newRating: Rating = {
      id: `rating_${Date.now()}`,
      fromId: user.id,
      fromName: user.name,
      fromRole: 'ngo',
      toId: ratingForm.restaurantId,
      toName: ratingForm.restaurantName,
      toRole: 'restaurant',
      donationId: ratingForm.donationId,
      score,
      review: review.trim(),
      createdAt: new Date().toISOString(),
    };
    addRating(newRating);
    toast.success('Review submitted successfully!');
    setRatingForm(null);
    setScore(5);
    setReview('');
    loadData();
  };

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl text-slate-900">Reviews & Ratings</h2>
          <p className="text-slate-600 mt-1">Your reputation and feedback from restaurant partners</p>
        </div>

        {/* Rating Summary */}
        <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <div className="text-6xl text-orange-600 mb-1">{avgRating}</div>
                <StarRating value={Math.round(parseFloat(avgRating as string) || 0)} readonly />
                <p className="text-sm text-slate-600 mt-1">{receivedRatings.length} reviews</p>
              </div>
              <div className="flex-1 space-y-2">
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = receivedRatings.filter((r) => r.score === star).length;
                  const pct = receivedRatings.length ? (count / receivedRatings.length) * 100 : 0;
                  return (
                    <div key={star} className="flex items-center gap-3">
                      <span className="text-sm text-slate-600 w-8">{star}★</span>
                      <div className="flex-1 bg-slate-200 rounded-full h-2">
                        <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-slate-500 w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="bg-orange-100 p-4 rounded-2xl">
                  <Award size={48} className="text-orange-600 mx-auto mb-2" />
                  <p className="text-sm text-orange-800">Trusted NGO Partner</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate a Restaurant */}
        {completedDonations.filter((d) => !alreadyRated(d.id)).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp size={20} className="text-orange-600" />
                Rate Your Restaurant Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedDonations
                .filter((d) => !alreadyRated(d.id))
                .map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-slate-900">{donation.restaurantName}</p>
                      <p className="text-sm text-slate-500">
                        for {donation.foodName} — {new Date(donation.completedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-orange-500 hover:bg-orange-600"
                      onClick={() =>
                        setRatingForm({
                          donationId: donation.id,
                          restaurantId: donation.restaurantId,
                          restaurantName: donation.restaurantName,
                        })
                      }
                    >
                      <Star size={14} className="mr-1" />
                      Rate Restaurant
                    </Button>
                  </div>
                ))}

              {ratingForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white border border-orange-200 rounded-xl space-y-4"
                >
                  <h4 className="text-slate-900">
                    Rating for <strong>{ratingForm.restaurantName}</strong>
                  </h4>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your rating</p>
                    <StarRating value={score} onChange={setScore} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your review</p>
                    <Textarea
                      placeholder="Share your experience with this restaurant partner..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSubmitRating}>
                      Submit Review
                    </Button>
                    <Button variant="outline" onClick={() => { setRatingForm(null); setScore(5); setReview(''); }}>
                      Cancel
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Reviews Received */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare size={20} className="text-green-600" />
              Reviews from Restaurant Partners
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {receivedRatings.length === 0 ? (
              <div className="text-center py-8 text-slate-500">
                <Star size={32} className="mx-auto mb-2 opacity-30" />
                <p>No reviews yet. Complete more donations to receive ratings.</p>
              </div>
            ) : (
              receivedRatings.map((rating) => (
                <motion.div
                  key={rating.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-900">{rating.fromName}</p>
                      <p className="text-xs text-slate-400">{new Date(rating.createdAt).toLocaleDateString()}</p>
                    </div>
                    <StarRating value={rating.score} readonly />
                  </div>
                  <p className="text-slate-700 text-sm">{rating.review}</p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

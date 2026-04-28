import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations, getRatings, addRating, getRatingsForUser, getRatingsByUser } from '../../utils/storage';
import { Donation, Rating, mockUsers } from '../../data/mockData';
import { Star, ThumbsUp, MessageSquare, Award } from 'lucide-react';
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

export default function RestaurantRatings() {
  const { user } = useAuth();
  const [receivedRatings, setReceivedRatings] = useState<Rating[]>([]);
  const [completedDonations, setCompletedDonations] = useState<Donation[]>([]);
  const [ratingForm, setRatingForm] = useState<{ donationId: string; ngoId: string; ngoName: string } | null>(null);
  const [score, setScore] = useState(5);
  const [review, setReview] = useState('');
  const [givenRatings, setGivenRatings] = useState<Rating[]>([]);

  const loadData = () => {
    if (!user) return;
    const allRatings = getRatings();
    setReceivedRatings(allRatings.filter((r) => r.toId === user.id));
    setGivenRatings(allRatings.filter((r) => r.fromId === user.id));
    const allDonations = getDonations();
    const myCompleted = allDonations.filter(
      (d) => d.restaurantId === user.id && d.status === 'completed' && d.ngoId
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
      fromRole: 'restaurant',
      toId: ratingForm.ngoId,
      toName: ratingForm.ngoName,
      toRole: 'ngo',
      donationId: ratingForm.donationId,
      score,
      review: review.trim(),
      createdAt: new Date().toISOString(),
    };
    addRating(newRating);
    toast.success('Rating submitted successfully!');
    setRatingForm(null);
    setScore(5);
    setReview('');
    loadData();
  };

  return (
    <DashboardLayout role="restaurant">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div>
          <h2 className="text-3xl text-slate-900">Ratings & Reviews</h2>
          <p className="text-slate-600 mt-1">View your reputation and rate partner NGOs</p>
        </div>

        {/* Overall Rating Summary */}
        <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="text-center">
                <div className="text-6xl text-green-600 mb-1">{avgRating}</div>
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
                        <div className="bg-yellow-400 h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-sm text-slate-500 w-6">{count}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center">
                <div className="bg-green-100 p-4 rounded-2xl">
                  <Award size={48} className="text-green-600 mx-auto mb-2" />
                  <p className="text-sm text-green-800">Top Rated Restaurant</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Rate an NGO */}
        {completedDonations.filter((d) => !alreadyRated(d.id)).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ThumbsUp size={20} className="text-green-600" />
                Rate Your NGO Partners
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {completedDonations
                .filter((d) => !alreadyRated(d.id))
                .map((donation) => (
                  <div key={donation.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
                    <div>
                      <p className="text-slate-900">{donation.ngoName}</p>
                      <p className="text-sm text-slate-500">
                        for {donation.foodName} — {new Date(donation.completedAt || '').toLocaleDateString()}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() =>
                        setRatingForm({
                          donationId: donation.id,
                          ngoId: donation.ngoId!,
                          ngoName: donation.ngoName!,
                        })
                      }
                    >
                      <Star size={14} className="mr-1" />
                      Rate NGO
                    </Button>
                  </div>
                ))}

              {/* Rating form inline */}
              {ratingForm && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-white border border-green-200 rounded-xl mt-4 space-y-4"
                >
                  <h4 className="text-slate-900">
                    Rating for <strong>{ratingForm.ngoName}</strong>
                  </h4>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your rating</p>
                    <StarRating value={score} onChange={setScore} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-600 mb-2">Your review</p>
                    <Textarea
                      placeholder="Share your experience with this NGO partner..."
                      value={review}
                      onChange={(e) => setReview(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmitRating}>
                      Submit Rating
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
              <MessageSquare size={20} className="text-orange-600" />
              Reviews Received from NGOs
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
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-slate-50 rounded-xl"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <p className="text-slate-900">{rating.fromName}</p>
                      <p className="text-xs text-slate-500">{new Date(rating.createdAt).toLocaleDateString()}</p>
                    </div>
                    <StarRating value={rating.score} readonly />
                  </div>
                  <p className="text-slate-700 text-sm">{rating.review}</p>
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Ratings Given */}
        {givenRatings.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Ratings You've Given</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {givenRatings.map((rating) => (
                <div key={rating.id} className="flex items-start justify-between p-3 bg-slate-50 rounded-lg">
                  <div>
                    <p className="text-slate-900 text-sm">{rating.toName}</p>
                    <p className="text-xs text-slate-500">{rating.review}</p>
                  </div>
                  <StarRating value={rating.score} readonly />
                </div>
              ))}
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

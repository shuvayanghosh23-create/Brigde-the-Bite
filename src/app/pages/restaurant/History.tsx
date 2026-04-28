import React, { useEffect, useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Button } from '../../components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getDonations } from '../../utils/storage';
import { Donation } from '../../data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Download, Filter } from 'lucide-react';

export default function RestaurantHistory() {
  const { user } = useAuth();
  const [donations, setDonations] = useState<Donation[]>([]);

  useEffect(() => {
    const allDonations = getDonations();
    const myDonations = allDonations
      .filter((d) => d.restaurantId === user?.id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    setDonations(myDonations);
  }, [user]);

  return (
    <DashboardLayout role="restaurant">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-3xl text-slate-900">Donation History</h2>
            <p className="text-slate-600 mt-1">View all your past donations</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline">
              <Filter className="mr-2" size={18} />
              Filter
            </Button>
            <Button variant="outline">
              <Download className="mr-2" size={18} />
              Export
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food Item</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>NGO</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.foodName}</TableCell>
                    <TableCell>{donation.quantity}</TableCell>
                    <TableCell>{donation.ngoName || 'N/A'}</TableCell>
                    <TableCell>
                      {new Date(donation.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        className={
                          donation.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : donation.status === 'accepted'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }
                      >
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

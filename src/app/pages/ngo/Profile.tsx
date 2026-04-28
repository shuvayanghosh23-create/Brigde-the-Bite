import React, { useState } from 'react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { Camera, MapPin, Phone, Mail, Award } from 'lucide-react';

export default function NGOProfile() {
  const { user } = useAuth();
  const [editing, setEditing] = useState(false);

  return (
    <DashboardLayout role="ngo">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h2 className="text-3xl text-slate-900">Profile</h2>
          <p className="text-slate-600 mt-1">Manage your NGO information</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row items-start gap-6">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-orange-500 to-red-500 flex items-center justify-center text-white text-4xl">
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 bg-white border-2 border-slate-200 rounded-full p-2 hover:bg-slate-50">
                  <Camera size={20} className="text-slate-700" />
                </button>
              </div>

              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-2xl text-slate-900">{user?.name}</h3>
                  <p className="text-slate-600">{user?.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Award className="text-orange-600" size={20} />
                    <span className="text-orange-600">Verified NGO</span>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2 text-slate-600">
                    <Phone size={16} />
                    <span>{user?.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <Mail size={16} />
                    <span>{user?.email}</span>
                  </div>
                  <div className="flex items-start gap-2 text-slate-600 md:col-span-2">
                    <MapPin size={16} className="mt-0.5" />
                    <span>{user?.address}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>NGO Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>NGO Name</Label>
              <Input value={user?.name} disabled={!editing} />
            </div>
            <div>
              <Label>Darpan ID</Label>
              <Input value={user?.darpanId} disabled={!editing} />
            </div>
            <div>
              <Label>Address</Label>
              <Input value={user?.address} disabled={!editing} />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Phone Number</Label>
                <Input value={user?.phone} disabled={!editing} />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={user?.email} disabled={!editing} />
              </div>
            </div>

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button variant="outline" onClick={() => setEditing(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-orange-600 hover:bg-orange-700">
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="outline" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Impact Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-3xl text-orange-600">18</p>
                <p className="text-sm text-slate-600">Requests</p>
              </div>
              <div>
                <p className="text-3xl text-green-600">810</p>
                <p className="text-sm text-slate-600">Meals Received</p>
              </div>
              <div>
                <p className="text-3xl text-blue-600">450</p>
                <p className="text-sm text-slate-600">People Served</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

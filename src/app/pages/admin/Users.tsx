import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { getAllUsers, deleteUserById } from '../../utils/storage';
import { User } from '../../data/mockData';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../components/ui/table';
import { Search, Trash2, CheckCircle, XCircle, Eye, X, Phone, MapPin, Mail, Award, Star } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<'all' | 'restaurant' | 'ngo'>('all');
  const [viewUser, setViewUser] = useState<User | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const loadUsers = () => {
    const allUsers = getAllUsers().filter((u) => u.role !== 'admin');
    setUsers(allUsers);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users
    .filter((u) => filterRole === 'all' || u.role === filterRole)
    .filter((u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const handleDelete = (userId: string) => {
    deleteUserById(userId);
    toast.success('User account deleted successfully');
    setDeleteConfirmId(null);
    loadUsers();
  };

  const restaurantCount = users.filter((u) => u.role === 'restaurant').length;
  const ngoCount = users.filter((u) => u.role === 'ngo').length;
  const verifiedCount = users.filter((u) => u.verified).length;

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h2 className="text-3xl text-slate-900">Manage Users</h2>
          <p className="text-slate-600 mt-1">View and manage all platform users</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Restaurants', count: restaurantCount, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'NGOs', count: ngoCount, color: 'text-orange-600', bg: 'bg-orange-50' },
            { label: 'Verified', count: verifiedCount, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((item, i) => (
            <Card key={i} className={`${item.bg} border-none`}>
              <CardContent className="pt-4 pb-4 text-center">
                <p className={`text-2xl ${item.color}`}>{item.count}</p>
                <p className="text-sm text-slate-600">{item.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <Input
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {(['all', 'restaurant', 'ngo'] as const).map((role) => (
              <Button
                key={role}
                variant={filterRole === role ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterRole(role)}
                className={filterRole === role ? 'bg-blue-600 hover:bg-blue-700' : ''}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email / Username</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-slate-500">
                      No users found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id} className="hover:bg-slate-50">
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${
                            user.role === 'restaurant' ? 'bg-green-500' : 'bg-orange-500'
                          }`}>
                            {user.name.charAt(0)}
                          </div>
                          <span className="font-medium text-slate-900">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-600">{user.email}</TableCell>
                      <TableCell>
                        <Badge className={
                          user.role === 'restaurant'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-orange-100 text-orange-800'
                        }>
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-600">{user.phone || 'N/A'}</TableCell>
                      <TableCell>
                        {user.rating ? (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Star size={14} className="fill-yellow-400" />
                            {user.rating}
                          </span>
                        ) : 'N/A'}
                      </TableCell>
                      <TableCell>
                        {user.verified ? (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle size={12} className="mr-1 inline" />Verified
                          </Badge>
                        ) : (
                          <Badge className="bg-yellow-100 text-yellow-800">
                            <XCircle size={12} className="mr-1 inline" />Pending
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-blue-600 hover:bg-blue-50"
                            onClick={() => setViewUser(user)}
                          >
                            <Eye size={16} className="mr-1" />
                            View
                          </Button>
                          {deleteConfirmId === user.id ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                className="bg-red-600 hover:bg-red-700 text-xs h-8 px-2"
                                onClick={() => handleDelete(user.id)}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                className="text-xs h-8 px-2"
                                onClick={() => setDeleteConfirmId(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          ) : (
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600 hover:bg-red-50"
                              onClick={() => setDeleteConfirmId(user.id)}
                            >
                              <Trash2 size={16} />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      {/* User Details Modal */}
      <AnimatePresence>
        {viewUser && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setViewUser(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl text-slate-900">User Details</h3>
                <button onClick={() => setViewUser(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="text-center mb-6">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center text-white text-3xl mx-auto mb-3 ${
                  viewUser.role === 'restaurant' ? 'bg-gradient-to-br from-green-500 to-green-700' : 'bg-gradient-to-br from-orange-400 to-orange-600'
                }`}>
                  {viewUser.name.charAt(0)}
                </div>
                <h4 className="text-xl text-slate-900">{viewUser.name}</h4>
                <Badge className={`mt-1 ${viewUser.role === 'restaurant' ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                  {viewUser.role}
                </Badge>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  <Mail size={16} className="text-slate-400" />
                  <span className="text-sm text-slate-700">{viewUser.email}</span>
                </div>
                {viewUser.phone && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Phone size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{viewUser.phone}</span>
                  </div>
                )}
                {viewUser.address && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <MapPin size={16} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{viewUser.address}</span>
                  </div>
                )}
                {viewUser.fssaiNumber && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Award size={16} className="text-green-500" />
                    <span className="text-sm text-slate-700">FSSAI: {viewUser.fssaiNumber}</span>
                  </div>
                )}
                {viewUser.darpanId && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Award size={16} className="text-orange-500" />
                    <span className="text-sm text-slate-700">Darpan ID: {viewUser.darpanId}</span>
                  </div>
                )}
                {viewUser.rating && (
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                    <Star size={16} className="text-yellow-400" />
                    <span className="text-sm text-slate-700">Rating: {viewUser.rating}/5</span>
                  </div>
                )}
                <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                  {viewUser.verified ? (
                    <><CheckCircle size={16} className="text-green-500" /><span className="text-sm text-green-700">Verified Account</span></>
                  ) : (
                    <><XCircle size={16} className="text-yellow-500" /><span className="text-sm text-yellow-700">Pending Verification</span></>
                  )}
                </div>
              </div>

              <div className="mt-6 flex gap-2">
                {!viewUser.verified && (
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    onClick={() => {
                      toast.success(`${viewUser.name} has been verified`);
                      setViewUser(null);
                    }}
                  >
                    <CheckCircle size={16} className="mr-2" />
                    Verify Account
                  </Button>
                )}
                <Button variant="outline" className="flex-1" onClick={() => setViewUser(null)}>
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

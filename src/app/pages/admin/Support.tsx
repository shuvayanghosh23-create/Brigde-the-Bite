import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Textarea } from '../../components/ui/textarea';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { getSupportTickets, updateSupportTicket, addNotification } from '../../utils/storage';
import { SupportTicket } from '../../data/mockData';
import {
  HelpCircle, CheckCircle, Clock, MessageSquare, Search, RefreshCw,
  Store, Users, Filter, X
} from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSupport() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'open' | 'in_progress' | 'resolved'>('all');
  const [filterRole, setFilterRole] = useState<'all' | 'restaurant' | 'ngo'>('all');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [response, setResponse] = useState('');

  const loadTickets = () => {
    const all = getSupportTickets();
    setTickets(all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  };

  useEffect(() => {
    loadTickets();
  }, []);

  const filtered = tickets
    .filter((t) => filterStatus === 'all' || t.status === filterStatus)
    .filter((t) => filterRole === 'all' || t.userRole === filterRole)
    .filter((t) =>
      t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.userName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const counts = {
    open: tickets.filter((t) => t.status === 'open').length,
    in_progress: tickets.filter((t) => t.status === 'in_progress').length,
    resolved: tickets.filter((t) => t.status === 'resolved').length,
  };

  const handleRespond = (ticket: SupportTicket, newStatus: 'in_progress' | 'resolved') => {
    if (!response.trim()) {
      toast.error('Please write a response');
      return;
    }

    updateSupportTicket(ticket.id, {
      status: newStatus,
      adminResponse: response.trim(),
      respondedAt: new Date().toISOString(),
    });

    // Notify the user
    addNotification({
      id: `notif_${Date.now()}`,
      userId: ticket.userId,
      type: 'support',
      title: newStatus === 'resolved' ? 'Support Ticket Resolved ✅' : 'Admin Reply on Your Ticket',
      message: `Your ticket "${ticket.subject}" has been ${newStatus === 'resolved' ? 'resolved' : 'responded to'} by admin.`,
      timestamp: new Date().toISOString(),
      read: false,
      link: `/${ticket.userRole}/support`,
    });

    toast.success(`Response sent and ticket marked as ${newStatus.replace('_', ' ')}`);
    setResponse('');
    setSelectedTicket(null);
    loadTickets();
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'open':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock size={12} className="mr-1 inline" />Open</Badge>;
      case 'in_progress':
        return <Badge className="bg-blue-100 text-blue-800"><MessageSquare size={12} className="mr-1 inline" />In Progress</Badge>;
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle size={12} className="mr-1 inline" />Resolved</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const timeSince = (ts: string) => {
    const diff = Date.now() - new Date(ts).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-slate-900">Support Tickets</h2>
            <p className="text-slate-600 mt-1">Manage and respond to user support requests</p>
          </div>
          <Button variant="outline" size="sm" onClick={loadTickets}>
            <RefreshCw size={14} className="mr-1" />
            Refresh
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Open', value: counts.open, color: 'text-yellow-700', bg: 'bg-yellow-50', border: 'border-yellow-200' },
            { label: 'In Progress', value: counts.in_progress, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200' },
            { label: 'Resolved', value: counts.resolved, color: 'text-green-700', bg: 'bg-green-50', border: 'border-green-200' },
          ].map((stat, i) => (
            <Card key={i} className={`${stat.bg} ${stat.border}`}>
              <CardContent className="pt-3 pb-3 text-center">
                <p className={`text-2xl ${stat.color}`}>{stat.value}</p>
                <p className="text-xs text-slate-500">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <Input
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            <div className="flex gap-1">
              {(['all', 'open', 'in_progress', 'resolved'] as const).map((s) => (
                <Button
                  key={s}
                  variant={filterStatus === s ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterStatus(s)}
                  className={filterStatus === s ? 'bg-blue-600 hover:bg-blue-700 text-xs' : 'text-xs'}
                >
                  {s.replace('_', ' ').charAt(0).toUpperCase() + s.replace('_', ' ').slice(1)}
                </Button>
              ))}
            </div>
            <div className="flex gap-1">
              {(['all', 'restaurant', 'ngo'] as const).map((r) => (
                <Button
                  key={r}
                  variant={filterRole === r ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilterRole(r)}
                  className={filterRole === r ? 'bg-slate-700 hover:bg-slate-800 text-xs' : 'text-xs'}
                >
                  {r === 'all' ? 'All Roles' : r === 'restaurant' ? '🏪 Restaurant' : '🤝 NGO'}
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Tickets */}
        {filtered.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
              <p className="text-slate-600">No support tickets found.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtered.map((ticket) => (
              <motion.div
                key={ticket.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className={`hover:shadow-md transition-shadow ${
                  ticket.status === 'open' ? 'border-l-4 border-l-yellow-400' :
                  ticket.status === 'in_progress' ? 'border-l-4 border-l-blue-400' : ''
                }`}>
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {ticket.userRole === 'restaurant' ? (
                            <Store size={16} className="text-green-600" />
                          ) : (
                            <Users size={16} className="text-orange-600" />
                          )}
                          <span className="text-slate-900">{ticket.userName}</span>
                          <Badge className={ticket.userRole === 'restaurant' ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}>
                            {ticket.userRole}
                          </Badge>
                        </div>
                        <h4 className="text-slate-800">{ticket.subject}</h4>
                        <p className="text-xs text-slate-400 mt-1">{timeSince(ticket.createdAt)} · {new Date(ticket.createdAt).toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        {getStatusBadge(ticket.status)}
                        {ticket.status !== 'resolved' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setResponse(ticket.adminResponse || '');
                            }}
                          >
                            Respond
                          </Button>
                        )}
                      </div>
                    </div>

                    <p className="text-sm text-slate-600 bg-slate-50 p-3 rounded-lg">{ticket.message}</p>

                    {ticket.adminResponse && (
                      <div className="mt-3">
                        <p className="text-xs text-green-600 mb-1">
                          Admin response ({ticket.respondedAt ? new Date(ticket.respondedAt).toLocaleString() : ''}):
                        </p>
                        <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">{ticket.adminResponse}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Response Modal */}
      <AnimatePresence>
        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedTicket(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl text-slate-900">Respond to Ticket</h3>
                <button onClick={() => setSelectedTicket(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                  <X size={20} />
                </button>
              </div>

              <div className="bg-slate-50 rounded-lg p-4 mb-4">
                <p className="text-xs text-slate-500 mb-1">From: {selectedTicket.userName} ({selectedTicket.userRole})</p>
                <p className="text-slate-900 mb-2">{selectedTicket.subject}</p>
                <p className="text-sm text-slate-600">{selectedTicket.message}</p>
              </div>

              <div className="mb-4">
                <label className="text-sm text-slate-700 mb-2 block">Your Response:</label>
                <Textarea
                  placeholder="Write your response to help the user..."
                  value={response}
                  onChange={(e) => setResponse(e.target.value)}
                  rows={5}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-blue-600 hover:bg-blue-700"
                  onClick={() => handleRespond(selectedTicket, 'in_progress')}
                >
                  <MessageSquare size={14} className="mr-1" />
                  Respond
                </Button>
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => handleRespond(selectedTicket, 'resolved')}
                >
                  <CheckCircle size={14} className="mr-1" />
                  Respond & Resolve
                </Button>
                <Button variant="outline" onClick={() => setSelectedTicket(null)}>
                  Cancel
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </DashboardLayout>
  );
}

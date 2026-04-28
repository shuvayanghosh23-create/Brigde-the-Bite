import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Textarea } from '../../components/ui/textarea';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import {
  addSupportTicket,
  getUserSupportTickets,
  addNotification,
} from '../../utils/storage';
import { SupportTicket } from '../../data/mockData';
import { HelpCircle, Plus, Clock, CheckCircle, MessageSquare, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function RestaurantSupport() {
  const { user } = useAuth();
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [category, setCategory] = useState('general');
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);

  const loadTickets = () => {
    if (user) {
      const t = getUserSupportTickets(user.id);
      setTickets(t.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
    }
  };

  useEffect(() => {
    loadTickets();
  }, [user]);

  const handleSubmit = () => {
    if (!user) return;
    if (!subject.trim() || !message.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    const ticket: SupportTicket = {
      id: `ticket_${Date.now()}`,
      userId: user.id,
      userName: user.name,
      userRole: 'restaurant',
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    addSupportTicket(ticket);

    // Notify admin
    addNotification({
      id: `notif_${Date.now()}`,
      userId: 'admin1',
      type: 'support',
      title: 'New Support Ticket',
      message: `${user.name} submitted a ticket: "${subject.trim()}"`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/admin/support',
    });

    toast.success('Support ticket submitted successfully! Admin will respond soon.');
    setShowForm(false);
    setSubject('');
    setMessage('');
    setCategory('general');
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

  const categories = [
    { value: 'general', label: 'General Issue' },
    { value: 'donation', label: 'Donation Problem' },
    { value: 'chat', label: 'Chat Issue' },
    { value: 'account', label: 'Account & Billing' },
    { value: 'technical', label: 'Technical Bug' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <DashboardLayout role="restaurant">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-slate-900">Support Center</h2>
            <p className="text-slate-600 mt-1">Get help from our admin team</p>
          </div>
          <Button
            className="bg-green-600 hover:bg-green-700"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={16} className="mr-2" />
            New Ticket
          </Button>
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { icon: Clock, title: 'Response Time', desc: 'Within 2-4 hours on working days', color: 'text-blue-600', bg: 'bg-blue-50' },
            { icon: MessageSquare, title: 'Support Hours', desc: 'Mon–Sat, 8 AM to 8 PM IST', color: 'text-green-600', bg: 'bg-green-50' },
            { icon: HelpCircle, title: 'Emergency', desc: 'Call +91 1800 123 4567 (24×7)', color: 'text-orange-600', bg: 'bg-orange-50' },
          ].map((item, i) => (
            <Card key={i} className={`${item.bg} border-none`}>
              <CardContent className="pt-4 pb-4">
                <div className="flex items-center gap-3">
                  <item.icon size={24} className={item.color} />
                  <div>
                    <p className="text-slate-900 text-sm">{item.title}</p>
                    <p className="text-xs text-slate-600">{item.desc}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* New Ticket Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="border-green-200">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Submit New Support Ticket</span>
                  <button onClick={() => setShowForm(false)} className="p-1 hover:bg-slate-100 rounded">
                    <X size={18} />
                  </button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Category</Label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    {categories.map((c) => (
                      <option key={c.value} value={c.value}>{c.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <Label>Subject</Label>
                  <Input
                    placeholder="Briefly describe your issue..."
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label>Describe Your Issue</Label>
                  <Textarea
                    placeholder="Provide as much detail as possible so we can help you quickly..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="bg-green-600 hover:bg-green-700" onClick={handleSubmit}>
                    Submit Ticket
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tickets List */}
        <div>
          <h3 className="text-xl text-slate-900 mb-4">Your Support Tickets ({tickets.length})</h3>
          {tickets.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <HelpCircle size={48} className="mx-auto text-slate-300 mb-4" />
                <p className="text-slate-600">No support tickets yet.</p>
                <p className="text-sm text-slate-500 mt-1">Submit a ticket if you need help.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {tickets.map((ticket) => (
                <Card
                  key={ticket.id}
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTicket(selectedTicket?.id === ticket.id ? null : ticket)}
                >
                  <CardContent className="pt-4 pb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <AlertCircle size={16} className="text-slate-400" />
                          <h4 className="text-slate-900">{ticket.subject}</h4>
                        </div>
                        <p className="text-sm text-slate-500">
                          {new Date(ticket.createdAt).toLocaleString()}
                        </p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    {selectedTicket?.id === ticket.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                      >
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Your message:</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{ticket.message}</p>
                        </div>
                        {ticket.adminResponse && (
                          <div>
                            <p className="text-xs text-green-600 mb-1">Admin response ({new Date(ticket.respondedAt || '').toLocaleString()}):</p>
                            <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">{ticket.adminResponse}</p>
                          </div>
                        )}
                        {!ticket.adminResponse && (
                          <p className="text-xs text-slate-400 italic">Awaiting admin response...</p>
                        )}
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* FAQ */}
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { q: 'How do I post a donation?', a: 'Go to "Donate Food" in the sidebar, fill in the food details, set the expiry time and pickup location, then submit.' },
              { q: 'Why is my donation not showing to NGOs?', a: 'Ensure your location is set correctly in Profile. Donations are shown to NGOs within 5 km of your location.' },
              { q: 'How do I chat with an NGO?', a: 'Once an NGO accepts your donation, go to "Track Requests" and click "Chat with NGO", or use the Chat section directly.' },
              { q: 'Can I cancel a donation?', a: 'Yes, you can cancel pending donations from the "Track Requests" page. Accepted donations cannot be cancelled without admin approval.' },
            ].map((faq, i) => (
              <div key={i} className="border-b border-slate-100 pb-3 last:border-0">
                <p className="text-slate-900 mb-1">{faq.q}</p>
                <p className="text-sm text-slate-600">{faq.a}</p>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

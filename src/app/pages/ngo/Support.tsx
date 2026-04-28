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
import { addSupportTicket, getUserSupportTickets, addNotification } from '../../utils/storage';
import { SupportTicket } from '../../data/mockData';
import { HelpCircle, Plus, Clock, CheckCircle, MessageSquare, AlertCircle, X } from 'lucide-react';
import { toast } from 'sonner';

export default function NGOSupport() {
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
      userRole: 'ngo',
      subject: subject.trim(),
      message: message.trim(),
      status: 'open',
      createdAt: new Date().toISOString(),
    };

    addSupportTicket(ticket);

    addNotification({
      id: `notif_${Date.now()}`,
      userId: 'admin1',
      type: 'support',
      title: 'New Support Ticket (NGO)',
      message: `${user.name} submitted a ticket: "${subject.trim()}"`,
      timestamp: new Date().toISOString(),
      read: false,
      link: '/admin/support',
    });

    toast.success('Support ticket submitted! Admin will respond soon.');
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
    { value: 'browse', label: 'Browse / Find Food' },
    { value: 'chat', label: 'Chat Issue' },
    { value: 'account', label: 'Account Problem' },
    { value: 'technical', label: 'Technical Bug' },
    { value: 'other', label: 'Other' },
  ];

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8 max-w-4xl mx-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl text-slate-900">Support Center</h2>
            <p className="text-slate-600 mt-1">Get help from our admin team</p>
          </div>
          <Button
            className="bg-orange-500 hover:bg-orange-600"
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
            { icon: MessageSquare, title: 'Support Hours', desc: 'Mon–Sat, 8 AM to 8 PM IST', color: 'text-orange-600', bg: 'bg-orange-50' },
            { icon: HelpCircle, title: 'Emergency', desc: 'Call +91 1800 123 4567 (24×7)', color: 'text-green-600', bg: 'bg-green-50' },
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
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Card className="border-orange-200">
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
                    className="w-full mt-1 border border-slate-200 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                    placeholder="Provide as much detail as possible..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={5}
                    className="mt-1"
                  />
                </div>
                <div className="flex gap-2">
                  <Button className="bg-orange-500 hover:bg-orange-600" onClick={handleSubmit}>
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
                        <p className="text-sm text-slate-500">{new Date(ticket.createdAt).toLocaleString()}</p>
                      </div>
                      {getStatusBadge(ticket.status)}
                    </div>

                    {selectedTicket?.id === ticket.id && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="mt-4 pt-4 border-t border-slate-100 space-y-3"
                      >
                        <div>
                          <p className="text-xs text-slate-500 mb-1">Your message:</p>
                          <p className="text-sm text-slate-700 bg-slate-50 p-3 rounded-lg">{ticket.message}</p>
                        </div>
                        {ticket.adminResponse ? (
                          <div>
                            <p className="text-xs text-green-600 mb-1">
                              Admin response ({new Date(ticket.respondedAt || '').toLocaleString()}):
                            </p>
                            <p className="text-sm text-slate-700 bg-green-50 p-3 rounded-lg border border-green-100">
                              {ticket.adminResponse}
                            </p>
                          </div>
                        ) : (
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
              { q: 'How do I find available donations?', a: 'Go to "Browse Food" to see all available donations within 5 km of your location. You can filter by food type and quantity.' },
              { q: 'How do I accept a donation?', a: 'Click "Accept Donation" on any available listing. Coordinate pickup time with the restaurant via the built-in chat.' },
              { q: 'How do I mark a donation as complete?', a: 'Go to "My Requests", find the active donation, click "Mark as Complete" and optionally upload a proof photo.' },
              { q: 'Why am I not seeing nearby donations?', a: 'Ensure your address is correctly set in Profile. Donations are displayed within 5 km of your registered address.' },
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

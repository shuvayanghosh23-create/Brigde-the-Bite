import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router';
import { motion } from 'motion/react';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { mockUsers } from '../../data/mockData';
import { useAuth } from '../../contexts/AuthContext';
import { getChatMessages, addChatMessage } from '../../utils/storage';
import { Send, Search, MessageSquare } from 'lucide-react';

export default function RestaurantChat() {
  const { user } = useAuth();
  const location = useLocation();
  const locationState = location.state as { ngoId?: string; ngoName?: string } | null;

  const ngos = mockUsers.filter((u) => u.role === 'ngo');
  const [selectedNgoId, setSelectedNgoId] = useState<string | null>(
    locationState?.ngoId || ngos[0]?.id || null
  );
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Chat ID is always: restaurantId-ngoId
  const getChatId = (ngoId: string) => `${user!.id}-${ngoId}`;

  const loadMessages = () => {
    if (selectedNgoId) {
      const msgs = getChatMessages(getChatId(selectedNgoId));
      setMessages(msgs);
    }
  };

  useEffect(() => {
    loadMessages();
  }, [selectedNgoId, user]);

  // Auto-refresh messages every 2 seconds to simulate real-time
  useEffect(() => {
    const interval = setInterval(loadMessages, 2000);
    return () => clearInterval(interval);
  }, [selectedNgoId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!message.trim() || !selectedNgoId || !user) return;

    const newMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      senderName: user.name,
      message: message.trim(),
      timestamp: new Date().toISOString(),
      type: 'text' as const,
    };

    addChatMessage(getChatId(selectedNgoId), newMessage);
    setMessages((prev) => [...prev, newMessage]);
    setMessage('');
  };

  const selectedNgo = ngos.find((n) => n.id === selectedNgoId);
  const filteredNgos = ngos.filter((n) =>
    n.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <DashboardLayout role="restaurant">
      <div className="h-[calc(100vh-12rem)]">
        <Card className="h-full">
          <CardContent className="p-0 h-full">
            <div className="grid grid-cols-12 h-full">
              {/* Contacts List */}
              <div className="col-span-12 md:col-span-4 border-r border-slate-200 flex flex-col">
                <div className="p-4 border-b border-slate-200">
                  <h3 className="text-slate-900 mb-3">NGO Conversations</h3>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <Input
                      placeholder="Search NGOs..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto">
                  {filteredNgos.map((ngo) => {
                    const chatMsgs = getChatMessages(getChatId(ngo.id));
                    const lastMsg = chatMsgs[chatMsgs.length - 1];
                    return (
                      <div
                        key={ngo.id}
                        className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${
                          selectedNgoId === ngo.id ? 'bg-green-50 border-l-4 border-l-green-500' : ''
                        }`}
                        onClick={() => setSelectedNgoId(ngo.id)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white flex-shrink-0">
                            {ngo.name.charAt(0)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-slate-900 truncate">{ngo.name}</h4>
                            <p className="text-sm text-slate-500 truncate">
                              {lastMsg ? lastMsg.message : 'Click to start chatting...'}
                            </p>
                          </div>
                          {chatMsgs.length > 0 && (
                            <span className="text-xs text-slate-400 flex-shrink-0">
                              {new Date(chatMsgs[chatMsgs.length - 1].timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Chat Area */}
              <div className="col-span-12 md:col-span-8 flex flex-col h-full">
                {selectedNgo ? (
                  <>
                    {/* Chat Header */}
                    <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white">
                          {selectedNgo.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className="text-slate-900">{selectedNgo.name}</h3>
                          <p className="text-xs text-slate-500">{selectedNgo.address}</p>
                        </div>
                      </div>
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
                        Online
                      </div>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
                      {messages.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-full text-slate-400">
                          <MessageSquare size={48} className="mb-3 opacity-30" />
                          <p>No messages yet. Start the conversation!</p>
                        </div>
                      )}
                      {messages.map((msg, index) => {
                        const isSent = msg.senderId === user?.id;
                        return (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index < 5 ? index * 0.05 : 0 }}
                            className={`flex ${isSent ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[70%] rounded-2xl px-4 py-2 ${
                                isSent
                                  ? 'bg-green-600 text-white rounded-br-sm'
                                  : 'bg-white text-slate-900 border border-slate-200 rounded-bl-sm'
                              }`}
                            >
                              {!isSent && (
                                <p className="text-xs text-orange-600 mb-1">{msg.senderName}</p>
                              )}
                              <p>{msg.message}</p>
                              <p className={`text-xs mt-1 ${isSent ? 'text-green-100' : 'text-slate-400'}`}>
                                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </p>
                            </div>
                          </motion.div>
                        );
                      })}
                      <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-4 border-t border-slate-200 bg-white">
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          className="flex-1"
                        />
                        <Button
                          onClick={handleSendMessage}
                          className="bg-green-600 hover:bg-green-700"
                          disabled={!message.trim()}
                        >
                          <Send size={20} />
                        </Button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex-1 flex items-center justify-center text-slate-500">
                    <div className="text-center">
                      <MessageSquare size={48} className="mx-auto mb-3 opacity-30" />
                      <p>Select a conversation to start chatting</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

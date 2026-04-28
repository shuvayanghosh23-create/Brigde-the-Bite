import { useEffect } from 'react';
import { RouterProvider } from 'react-router';
import { router } from './routes';
import { AuthProvider } from './contexts/AuthContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { initializeStorage } from './utils/storage';
import {
  mockDonations,
  mockChatMessages,
  mockNotifications,
  mockSupportTickets,
  mockRatings,
} from './data/mockData';
import { Toaster } from './components/ui/sonner';

export default function App() {
  useEffect(() => {
    initializeStorage(mockDonations, mockChatMessages, mockNotifications, mockSupportTickets, mockRatings);
  }, []);

  return (
    <AuthProvider>
      <NotificationProvider>
        <RouterProvider router={router} />
        <Toaster />
      </NotificationProvider>
    </AuthProvider>
  );
}
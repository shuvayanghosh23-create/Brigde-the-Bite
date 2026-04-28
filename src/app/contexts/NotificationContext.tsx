import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Notification } from '../data/mockData';
import {
  getNotifications,
  addNotification as saveNotification,
  markNotificationAsRead as markAsReadStorage,
  markAllNotificationsAsRead,
} from '../utils/storage';
import { useAuth } from './AuthContext';

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const loadNotifications = () => {
    if (user) {
      const userNotifications = getNotifications(user.id);
      setNotifications(userNotifications);
    } else {
      setNotifications([]);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [user]);

  const addNotification = (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => {
    // This saves to any user's notifications (admin notifying restaurant, etc.)
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date().toISOString(),
      read: false,
    };

    saveNotification(newNotification);

    // If this notification is for the current user, add to state
    if (user && newNotification.userId === user.id) {
      setNotifications((prev) => [newNotification, ...prev]);
    }
  };

  const markAsRead = (id: string) => {
    markAsReadStorage(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    if (!user) return;
    markAllNotificationsAsRead(user.id);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const refreshNotifications = () => {
    loadNotifications();
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        addNotification,
        markAsRead,
        markAllAsRead,
        refreshNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

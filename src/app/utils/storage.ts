import { User, Donation, ChatMessage, Notification, SupportTicket, Rating, mockUsers } from '../data/mockData';

// LocalStorage keys
const KEYS = {
  USER: 'bridgethebite_current_user',
  DONATIONS: 'bridgethebite_donations',
  CHATS: 'bridgethebite_chats',
  NOTIFICATIONS: 'bridgethebite_notifications',
  SUPPORT_TICKETS: 'bridgethebite_support_tickets',
  RATINGS: 'bridgethebite_ratings',
  USERS: 'bridgethebite_users',
};

// ─── User storage ──────────────────────────────────────────────────────────────
export const getCurrentUser = (): User | null => {
  const user = localStorage.getItem(KEYS.USER);
  return user ? JSON.parse(user) : null;
};

export const setCurrentUser = (user: User | null) => {
  if (user) {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  } else {
    localStorage.removeItem(KEYS.USER);
  }
};

// ─── All Users (for admin management) ─────────────────────────────────────────
export const getAllUsers = (): User[] => {
  const stored = localStorage.getItem(KEYS.USERS);
  return stored ? JSON.parse(stored) : mockUsers;
};

export const saveAllUsers = (users: User[]) => {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
};

export const deleteUserById = (userId: string) => {
  const users = getAllUsers();
  const updated = users.filter((u) => u.id !== userId);
  saveAllUsers(updated);
};

export const updateUserPassword = (userId: string, newPassword: string): boolean => {
  const users = getAllUsers();
  const index = users.findIndex((u) => u.id === userId);
  if (index !== -1) {
    users[index].password = newPassword;
    saveAllUsers(users);
    // If this is the current user, update stored user too
    const currentUser = getCurrentUser();
    if (currentUser && currentUser.id === userId) {
      const updatedUser = { ...currentUser, password: newPassword };
      setCurrentUser(updatedUser);
    }
    return true;
  }
  return false;
};

export const verifyUserPassword = (userId: string, password: string): boolean => {
  const users = getAllUsers();
  const user = users.find((u) => u.id === userId);
  return user ? user.password === password : false;
};

// ─── Donation storage ──────────────────────────────────────────────────────────
export const getDonations = (): Donation[] => {
  const donations = localStorage.getItem(KEYS.DONATIONS);
  return donations ? JSON.parse(donations) : [];
};

export const saveDonations = (donations: Donation[]) => {
  localStorage.setItem(KEYS.DONATIONS, JSON.stringify(donations));
};

export const addDonation = (donation: Donation) => {
  const donations = getDonations();
  donations.push(donation);
  saveDonations(donations);
};

export const updateDonation = (id: string, updates: Partial<Donation>) => {
  const donations = getDonations();
  const index = donations.findIndex((d) => d.id === id);
  if (index !== -1) {
    donations[index] = { ...donations[index], ...updates };
    saveDonations(donations);
  }
};

// ─── Chat storage ──────────────────────────────────────────────────────────────
export const getChats = (): Record<string, ChatMessage[]> => {
  const chats = localStorage.getItem(KEYS.CHATS);
  return chats ? JSON.parse(chats) : {};
};

export const saveChats = (chats: Record<string, ChatMessage[]>) => {
  localStorage.setItem(KEYS.CHATS, JSON.stringify(chats));
};

export const addChatMessage = (chatId: string, message: ChatMessage) => {
  const chats = getChats();
  if (!chats[chatId]) {
    chats[chatId] = [];
  }
  chats[chatId].push(message);
  saveChats(chats);
};

export const getChatMessages = (chatId: string): ChatMessage[] => {
  const chats = getChats();
  return chats[chatId] || [];
};

// ─── Notification storage ──────────────────────────────────────────────────────
export const getNotifications = (userId: string): Notification[] => {
  const notifications = localStorage.getItem(KEYS.NOTIFICATIONS);
  const allNotifications: Notification[] = notifications ? JSON.parse(notifications) : [];
  return allNotifications.filter((n) => n.userId === userId).sort(
    (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );
};

export const addNotification = (notification: Notification) => {
  const notifications = localStorage.getItem(KEYS.NOTIFICATIONS);
  const allNotifications: Notification[] = notifications ? JSON.parse(notifications) : [];
  allNotifications.push(notification);
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));
};

export const markNotificationAsRead = (id: string) => {
  const notifications = localStorage.getItem(KEYS.NOTIFICATIONS);
  const allNotifications: Notification[] = notifications ? JSON.parse(notifications) : [];
  const index = allNotifications.findIndex((n) => n.id === id);
  if (index !== -1) {
    allNotifications[index].read = true;
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(allNotifications));
  }
};

export const markAllNotificationsAsRead = (userId: string) => {
  const notifications = localStorage.getItem(KEYS.NOTIFICATIONS);
  const allNotifications: Notification[] = notifications ? JSON.parse(notifications) : [];
  const updated = allNotifications.map((n) =>
    n.userId === userId ? { ...n, read: true } : n
  );
  localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(updated));
};

// ─── Support Ticket storage ────────────────────────────────────────────────────
export const getSupportTickets = (): SupportTicket[] => {
  const tickets = localStorage.getItem(KEYS.SUPPORT_TICKETS);
  return tickets ? JSON.parse(tickets) : [];
};

export const saveSupportTickets = (tickets: SupportTicket[]) => {
  localStorage.setItem(KEYS.SUPPORT_TICKETS, JSON.stringify(tickets));
};

export const addSupportTicket = (ticket: SupportTicket) => {
  const tickets = getSupportTickets();
  tickets.push(ticket);
  saveSupportTickets(tickets);
};

export const updateSupportTicket = (id: string, updates: Partial<SupportTicket>) => {
  const tickets = getSupportTickets();
  const index = tickets.findIndex((t) => t.id === id);
  if (index !== -1) {
    tickets[index] = { ...tickets[index], ...updates };
    saveSupportTickets(tickets);
    return tickets[index];
  }
  return null;
};

export const getUserSupportTickets = (userId: string): SupportTicket[] => {
  return getSupportTickets().filter((t) => t.userId === userId);
};

// ─── Ratings storage ───────────────────────────────────────────────────────────
export const getRatings = (): Rating[] => {
  const ratings = localStorage.getItem(KEYS.RATINGS);
  return ratings ? JSON.parse(ratings) : [];
};

export const saveRatings = (ratings: Rating[]) => {
  localStorage.setItem(KEYS.RATINGS, JSON.stringify(ratings));
};

export const addRating = (rating: Rating) => {
  const ratings = getRatings();
  ratings.push(rating);
  saveRatings(ratings);
};

export const getRatingsForUser = (userId: string): Rating[] => {
  return getRatings().filter((r) => r.toId === userId);
};

export const getRatingsByUser = (userId: string): Rating[] => {
  return getRatings().filter((r) => r.fromId === userId);
};

// ─── Initialize with mock data if empty ────────────────────────────────────────
export const initializeStorage = (
  mockDonations: Donation[],
  mockChats: Record<string, ChatMessage[]>,
  mockNotifications: Notification[],
  mockTickets: SupportTicket[],
  mockRatingsData: Rating[]
) => {
  if (!localStorage.getItem(KEYS.DONATIONS)) {
    saveDonations(mockDonations);
  }
  if (!localStorage.getItem(KEYS.CHATS)) {
    saveChats(mockChats);
  }
  if (!localStorage.getItem(KEYS.NOTIFICATIONS)) {
    localStorage.setItem(KEYS.NOTIFICATIONS, JSON.stringify(mockNotifications));
  }
  if (!localStorage.getItem(KEYS.SUPPORT_TICKETS)) {
    saveSupportTickets(mockTickets);
  }
  if (!localStorage.getItem(KEYS.RATINGS)) {
    saveRatings(mockRatingsData);
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    saveAllUsers(mockUsers);
  }
};

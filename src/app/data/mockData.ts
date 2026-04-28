// Mock data for BridgeTheBite platform

export interface User {
  id: string;
  email: string;
  password: string;
  role: 'restaurant' | 'ngo' | 'admin';
  name: string;
  phone?: string;
  address?: string;
  location?: { lat: number; lng: number };
  fssaiNumber?: string;
  darpanId?: string;
  rating?: number;
  verified?: boolean;
  avatar?: string;
}

export interface Donation {
  id: string;
  restaurantId: string;
  restaurantName: string;
  ngoId?: string;
  ngoName?: string;
  foodName: string;
  quantity: string;
  expiryTime: string;
  pickupLocation: string;
  contactNumber: string;
  imageUrl?: string;
  completionPhotoUrl?: string;
  status: 'pending' | 'accepted' | 'completed' | 'cancelled';
  createdAt: string;
  acceptedAt?: string;
  completedAt?: string;
  location: { lat: number; lng: number };
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  timestamp: string;
  type: 'text' | 'image';
  imageUrl?: string;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'donation' | 'request' | 'chat' | 'system' | 'support';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  link?: string;
}

export interface SupportTicket {
  id: string;
  userId: string;
  userName: string;
  userRole: 'restaurant' | 'ngo';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  createdAt: string;
  adminResponse?: string;
  respondedAt?: string;
}

export interface Rating {
  id: string;
  fromId: string;
  fromName: string;
  fromRole: 'restaurant' | 'ngo';
  toId: string;
  toName: string;
  toRole: 'restaurant' | 'ngo';
  donationId: string;
  score: number;
  review: string;
  createdAt: string;
}

// Demo users
export const mockUsers: User[] = [
  {
    id: 'admin1',
    email: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Admin User',
    verified: true,
  },
  {
    id: 'rest1',
    email: 'Food1',
    password: 'Food123',
    role: 'restaurant',
    name: 'The Golden Spoon',
    phone: '+91 98765 43210',
    address: '123 MG Road, Bangalore',
    location: { lat: 12.9716, lng: 77.5946 },
    fssaiNumber: 'FSSAI12345678',
    rating: 4.5,
    verified: true,
  },
  {
    id: 'rest2',
    email: 'Food2',
    password: 'Food123',
    role: 'restaurant',
    name: 'Taj Kitchen',
    phone: '+91 98765 43211',
    address: '456 Brigade Road, Bangalore',
    location: { lat: 12.9656, lng: 77.6061 },
    fssaiNumber: 'FSSAI87654321',
    rating: 4.7,
    verified: true,
  },
  {
    id: 'rest3',
    email: 'Food3',
    password: 'Food123',
    role: 'restaurant',
    name: 'Spice Garden Restaurant',
    phone: '+91 98765 43212',
    address: '789 Indiranagar, Bangalore',
    location: { lat: 12.9789, lng: 77.6408 },
    fssaiNumber: 'FSSAI11223344',
    rating: 4.3,
    verified: true,
  },
  {
    id: 'ngo1',
    email: 'NGO1',
    password: 'NGO123',
    role: 'ngo',
    name: 'Hope Foundation',
    phone: '+91 98765 43220',
    address: '321 Whitefield, Bangalore',
    location: { lat: 12.9698, lng: 77.7499 },
    darpanId: 'DARPAN11111',
    rating: 4.8,
    verified: true,
  },
  {
    id: 'ngo2',
    email: 'NGO2',
    password: 'NGO123',
    role: 'ngo',
    name: 'Food For All',
    phone: '+91 98765 43221',
    address: '654 Koramangala, Bangalore',
    location: { lat: 12.9352, lng: 77.6245 },
    darpanId: 'DARPAN22222',
    rating: 4.6,
    verified: true,
  },
  {
    id: 'ngo3',
    email: 'NGO3',
    password: 'NGO123',
    role: 'ngo',
    name: 'Helping Hands NGO',
    phone: '+91 98765 43222',
    address: '987 Jayanagar, Bangalore',
    location: { lat: 12.9250, lng: 77.5937 },
    darpanId: 'DARPAN33333',
    rating: 4.9,
    verified: true,
  },
];

// Mock donations
export const mockDonations: Donation[] = [
  {
    id: 'don1',
    restaurantId: 'rest1',
    restaurantName: 'The Golden Spoon',
    ngoId: 'ngo1',
    ngoName: 'Hope Foundation',
    foodName: 'Mixed Vegetable Curry',
    quantity: '15 kg',
    expiryTime: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    pickupLocation: '123 MG Road, Bangalore',
    contactNumber: '+91 98765 43210',
    status: 'completed',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    location: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: 'don2',
    restaurantId: 'rest2',
    restaurantName: 'Taj Kitchen',
    ngoId: 'ngo2',
    ngoName: 'Food For All',
    foodName: 'Biryani & Raita',
    quantity: '20 kg',
    expiryTime: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(),
    pickupLocation: '456 Brigade Road, Bangalore',
    contactNumber: '+91 98765 43211',
    status: 'accepted',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    location: { lat: 12.9656, lng: 77.6061 },
  },
  {
    id: 'don3',
    restaurantId: 'rest3',
    restaurantName: 'Spice Garden Restaurant',
    foodName: 'Dal Makhani & Roti',
    quantity: '12 kg',
    expiryTime: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(),
    pickupLocation: '789 Indiranagar, Bangalore',
    contactNumber: '+91 98765 43212',
    status: 'pending',
    createdAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 12.9789, lng: 77.6408 },
  },
  {
    id: 'don4',
    restaurantId: 'rest1',
    restaurantName: 'The Golden Spoon',
    ngoId: 'ngo3',
    ngoName: 'Helping Hands NGO',
    foodName: 'Paneer Tikka & Naan',
    quantity: '10 kg',
    expiryTime: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    pickupLocation: '123 MG Road, Bangalore',
    contactNumber: '+91 98765 43210',
    status: 'completed',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 23 * 60 * 60 * 1000).toISOString(),
    completedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    location: { lat: 12.9716, lng: 77.5946 },
  },
  {
    id: 'don5',
    restaurantId: 'rest1',
    restaurantName: 'The Golden Spoon',
    ngoId: 'ngo1',
    ngoName: 'Hope Foundation',
    foodName: 'Butter Chicken & Rice',
    quantity: '8 kg',
    expiryTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
    pickupLocation: '123 MG Road, Bangalore',
    contactNumber: '+91 98765 43210',
    status: 'accepted',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    acceptedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    location: { lat: 12.9716, lng: 77.5946 },
  },
];

// Platform statistics
export const platformStats = {
  totalMeals: 15420,
  activeNGOs: 127,
  restaurantsJoined: 89,
  mealsThisMonth: 2340,
  activeDonations: 34,
  completedToday: 12,
};

// Sample chat messages
export const mockChatMessages: Record<string, ChatMessage[]> = {
  'rest1-ngo1': [
    {
      id: 'msg1',
      senderId: 'ngo1',
      senderName: 'Hope Foundation',
      message: 'Hello! We would like to pick up the donation today.',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      type: 'text',
    },
    {
      id: 'msg2',
      senderId: 'rest1',
      senderName: 'The Golden Spoon',
      message: 'Great! The food will be ready by 2 PM. Please come to the back entrance.',
      timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
      type: 'text',
    },
    {
      id: 'msg3',
      senderId: 'ngo1',
      senderName: 'Hope Foundation',
      message: 'Perfect! We will be there at 2 PM. Thank you so much for your support!',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
      type: 'text',
    },
  ],
  'rest2-ngo2': [
    {
      id: 'msg4',
      senderId: 'rest2',
      senderName: 'Taj Kitchen',
      message: 'Hi, our biryani is ready for pickup anytime after 3 PM.',
      timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      type: 'text',
    },
    {
      id: 'msg5',
      senderId: 'ngo2',
      senderName: 'Food For All',
      message: 'We will send our team by 3:30 PM. Is that okay?',
      timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      type: 'text',
    },
  ],
};

// Mock notifications
export const mockNotifications: Notification[] = [
  {
    id: 'notif1',
    userId: 'rest1',
    type: 'request',
    title: 'Donation Accepted',
    message: 'Hope Foundation accepted your donation of Butter Chicken & Rice.',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    read: false,
    link: '/restaurant/tracking',
  },
  {
    id: 'notif2',
    userId: 'rest1',
    type: 'donation',
    title: 'Donation Completed',
    message: 'Paneer Tikka & Naan was successfully delivered to Helping Hands NGO.',
    timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/restaurant/history',
  },
  {
    id: 'notif3',
    userId: 'rest1',
    type: 'chat',
    title: 'New Message',
    message: 'Hope Foundation sent you a message.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/restaurant/chat',
  },
  {
    id: 'notif4',
    userId: 'ngo1',
    type: 'donation',
    title: 'New Donation Available',
    message: 'The Golden Spoon posted a new donation: Butter Chicken & Rice (8 kg) nearby.',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/ngo/browse',
  },
  {
    id: 'notif5',
    userId: 'ngo1',
    type: 'system',
    title: 'Profile Verified',
    message: 'Your NGO profile has been verified by admin. You can now request donations.',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/ngo/profile',
  },
  {
    id: 'notif6',
    userId: 'ngo1',
    type: 'chat',
    title: 'New Message',
    message: 'The Golden Spoon replied to your message.',
    timestamp: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/ngo/chat',
  },
  {
    id: 'notif7',
    userId: 'admin1',
    type: 'support',
    title: 'New Support Ticket',
    message: 'The Golden Spoon submitted a support ticket: "Issue with donation listing".',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/admin/support',
  },
  {
    id: 'notif8',
    userId: 'admin1',
    type: 'donation',
    title: 'Donation Completed',
    message: 'A donation from The Golden Spoon was successfully completed by Hope Foundation.',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    read: true,
    link: '/admin/donations',
  },
  {
    id: 'notif9',
    userId: 'admin1',
    type: 'system',
    title: 'New User Registered',
    message: 'A new restaurant "Spice Garden Restaurant" has registered on the platform.',
    timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
    read: false,
    link: '/admin/users',
  },
];

// Mock support tickets
export const mockSupportTickets: SupportTicket[] = [
  {
    id: 'ticket1',
    userId: 'rest1',
    userName: 'The Golden Spoon',
    userRole: 'restaurant',
    subject: 'Issue with donation listing',
    message: 'I posted a donation but it is not showing up in the NGO browse section. Please help.',
    status: 'open',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket2',
    userId: 'ngo1',
    userName: 'Hope Foundation',
    userRole: 'ngo',
    subject: 'Map not showing nearby restaurants',
    message: 'The map view is not displaying restaurants near our location. We are in Whitefield area.',
    status: 'resolved',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
    adminResponse: 'We have fixed the map rendering issue. Please clear your browser cache and try again.',
    respondedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'ticket3',
    userId: 'rest2',
    userName: 'Taj Kitchen',
    userRole: 'restaurant',
    subject: 'Chat not working properly',
    message: 'When I send messages to NGOs, they say they cannot see them. Please investigate.',
    status: 'in_progress',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    adminResponse: 'We are investigating this issue. Our team will update you shortly.',
    respondedAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
];

// Mock ratings
export const mockRatings: Rating[] = [
  {
    id: 'rating1',
    fromId: 'ngo1',
    fromName: 'Hope Foundation',
    fromRole: 'ngo',
    toId: 'rest1',
    toName: 'The Golden Spoon',
    toRole: 'restaurant',
    donationId: 'don1',
    score: 5,
    review: 'Excellent food quality and very cooperative staff. The food was packed hygienically.',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rating2',
    fromId: 'ngo3',
    fromName: 'Helping Hands NGO',
    fromRole: 'ngo',
    toId: 'rest1',
    toName: 'The Golden Spoon',
    toRole: 'restaurant',
    donationId: 'don4',
    score: 4,
    review: 'Great donation, food was fresh and quantity was as stated.',
    createdAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'rating3',
    fromId: 'rest1',
    fromName: 'The Golden Spoon',
    fromRole: 'restaurant',
    toId: 'ngo1',
    toName: 'Hope Foundation',
    toRole: 'ngo',
    donationId: 'don1',
    score: 5,
    review: 'Very prompt pickup and professional team. Great NGO to work with.',
    createdAt: new Date(Date.now() - 1.5 * 60 * 60 * 1000).toISOString(),
  },
];

// Activity timeline data
export const recentActivity = [
  {
    id: 'act1',
    type: 'donation',
    title: 'New Donation Posted',
    description: 'The Golden Spoon posted Mixed Vegetable Curry (15 kg)',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: 'utensils',
  },
  {
    id: 'act2',
    type: 'accepted',
    title: 'Donation Accepted',
    description: 'Hope Foundation accepted the donation',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    icon: 'check',
  },
  {
    id: 'act3',
    type: 'completed',
    title: 'Donation Completed',
    description: 'Food successfully delivered to Hope Foundation',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: 'heart',
  },
];

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, mockUsers } from '../data/mockData';
import {
  getCurrentUser,
  setCurrentUser as saveUser,
  getAllUsers,
  saveAllUsers,
  deleteUserById,
  updateUserPassword,
  verifyUserPassword,
} from '../utils/storage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => boolean;
  logout: () => void;
  signup: (userData: Omit<User, 'id' | 'verified'>) => boolean;
  changePassword: (currentPassword: string, newPassword: string) => { success: boolean; message: string };
  deleteAccount: (password: string) => { success: boolean; message: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (currentUser) {
      setUser(currentUser);
    }
  }, []);

  const login = (email: string, password: string): boolean => {
    // Try from localStorage users first (supports newly registered users & updated passwords)
    const allUsers = getAllUsers();
    const foundUser =
      allUsers.find((u) => u.email === email && u.password === password) ||
      mockUsers.find((u) => u.email === email && u.password === password);

    if (foundUser) {
      setUser(foundUser);
      saveUser(foundUser);
      return true;
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    saveUser(null);
  };

  const signup = (userData: Omit<User, 'id' | 'verified'>): boolean => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      verified: false,
    };

    const allUsers = getAllUsers();
    allUsers.push(newUser);
    saveAllUsers(allUsers);
    mockUsers.push(newUser);
    setUser(newUser);
    saveUser(newUser);
    return true;
  };

  const changePassword = (currentPassword: string, newPassword: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Not logged in' };
    if (!verifyUserPassword(user.id, currentPassword)) {
      return { success: false, message: 'Current password is incorrect' };
    }
    if (newPassword.length < 6) {
      return { success: false, message: 'New password must be at least 6 characters' };
    }
    updateUserPassword(user.id, newPassword);
    const updatedUser = { ...user, password: newPassword };
    setUser(updatedUser);
    saveUser(updatedUser);
    return { success: true, message: 'Password changed successfully' };
  };

  const deleteAccount = (password: string): { success: boolean; message: string } => {
    if (!user) return { success: false, message: 'Not logged in' };
    if (!verifyUserPassword(user.id, password)) {
      return { success: false, message: 'Password is incorrect' };
    }
    deleteUserById(user.id);
    setUser(null);
    saveUser(null);
    return { success: true, message: 'Account deleted successfully' };
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, signup, changePassword, deleteAccount }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

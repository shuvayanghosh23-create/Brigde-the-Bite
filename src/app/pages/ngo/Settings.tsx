import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useNavigate } from 'react-router';
import DashboardLayout from '../../components/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { useAuth } from '../../contexts/AuthContext';
import { Lock, Trash2, AlertTriangle, Eye, EyeOff, Mail, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

export default function NGOSettings() {
  const { user, changePassword, deleteAccount, logout } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [showDeletePass, setShowDeletePass] = useState(false);

  const [showForgotFlow, setShowForgotFlow] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all password fields');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    const result = changePassword(currentPassword, newPassword);
    if (result.success) {
      toast.success(result.message);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      toast.error(result.message);
    }
  };

  const handleDeleteAccount = () => {
    if (!deletePassword) {
      toast.error('Please enter your password');
      return;
    }
    const result = deleteAccount(deletePassword);
    if (result.success) {
      toast.success('Account deleted. Redirecting...');
      setTimeout(() => { logout(); navigate('/'); }, 1500);
    } else {
      toast.error(result.message);
    }
  };

  const handleForgotPassword = () => {
    if (!forgotEmail.trim()) {
      toast.error('Please enter your email/username');
      return;
    }
    setTimeout(() => { setForgotSent(true); toast.success('Reset instructions sent!'); }, 800);
  };

  const passwordStrength = (pwd: string) => {
    if (!pwd) return { label: '', color: '' };
    if (pwd.length < 6) return { label: 'Weak', color: 'text-red-500' };
    if (pwd.length < 10) return { label: 'Medium', color: 'text-yellow-500' };
    return { label: 'Strong', color: 'text-green-500' };
  };

  const pwdStrength = passwordStrength(newPassword);

  return (
    <DashboardLayout role="ngo">
      <div className="space-y-8 max-w-2xl mx-auto">
        <div>
          <h2 className="text-3xl text-slate-900">Settings</h2>
          <p className="text-slate-600 mt-1">Manage your account security and preferences</p>
        </div>

        {/* Change Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock size={20} className="text-orange-500" />
              Change Password
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Current Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showCurrent ? 'text' : 'password'}
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  placeholder="Enter current password"
                />
                <button type="button" onClick={() => setShowCurrent(!showCurrent)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <Label>New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                />
                <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {newPassword && <p className={`text-xs mt-1 ${pwdStrength.color}`}>Strength: {pwdStrength.label}</p>}
            </div>
            <div>
              <Label>Confirm New Password</Label>
              <div className="relative mt-1">
                <Input
                  type={showConfirm ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {confirmPassword && newPassword !== confirmPassword && <p className="text-xs text-red-500 mt-1">Passwords do not match</p>}
              {confirmPassword && newPassword === confirmPassword && <p className="text-xs text-green-500 mt-1 flex items-center gap-1"><CheckCircle size={12} />Passwords match</p>}
            </div>
            <Button className="bg-orange-500 hover:bg-orange-600 w-full" onClick={handleChangePassword}>
              Update Password
            </Button>
          </CardContent>
        </Card>

        {/* Forgot Password */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail size={20} className="text-blue-600" />
              Forgot Password
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showForgotFlow ? (
              <div className="flex items-center justify-between">
                <p className="text-sm text-slate-600">Forgot your password? We'll send reset instructions.</p>
                <Button variant="outline" onClick={() => setShowForgotFlow(true)}>Reset Password</Button>
              </div>
            ) : forgotSent ? (
              <div className="text-center py-4">
                <CheckCircle size={48} className="mx-auto text-green-500 mb-3" />
                <p className="text-slate-900">Reset instructions sent!</p>
                <p className="text-sm text-slate-600 mt-1">Check your registered email.</p>
                <Button variant="outline" className="mt-3" onClick={() => { setShowForgotFlow(false); setForgotSent(false); setForgotEmail(''); }}>Done</Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-600">Enter your registered email or username:</p>
                <Input placeholder="Email or username" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                <div className="flex gap-2">
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleForgotPassword}>Send Reset Link</Button>
                  <Button variant="outline" onClick={() => { setShowForgotFlow(false); setForgotEmail(''); }}>Cancel</Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Notification Preferences */}
        <Card>
          <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { label: 'Email alerts for new donations nearby', defaultOn: true },
              { label: 'SMS notifications for donation updates', defaultOn: true },
              { label: 'Push notifications for chat messages', defaultOn: false },
              { label: 'Monthly impact report', defaultOn: true },
            ].map((pref, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                <span className="text-sm text-slate-700">{pref.label}</span>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${pref.defaultOn ? 'bg-orange-500' : 'bg-slate-300'}`}
                  onClick={() => toast.info('Preference updated')}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ml-0.5 ${pref.defaultOn ? 'translate-x-6' : 'translate-x-0'}`} />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Delete Account */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-600">
              <Trash2 size={20} />
              Delete Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            {!showDeleteConfirm ? (
              <div className="flex items-start gap-4">
                <AlertTriangle size={24} className="text-red-500 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-slate-700 mb-1">Permanently delete your account</p>
                  <p className="text-sm text-slate-500 mb-4">This action cannot be undone. All your data will be permanently deleted.</p>
                  <Button variant="outline" className="border-red-300 text-red-600 hover:bg-red-50" onClick={() => setShowDeleteConfirm(true)}>
                    Delete My Account
                  </Button>
                </div>
              </div>
            ) : (
              <AnimatePresence>
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 text-sm mb-1 font-semibold">⚠️ This action is irreversible</p>
                    <p className="text-red-600 text-sm">Enter your password to confirm:</p>
                  </div>
                  <div className="relative">
                    <Input
                      type={showDeletePass ? 'text' : 'password'}
                      value={deletePassword}
                      onChange={(e) => setDeletePassword(e.target.value)}
                      placeholder="Enter your password to confirm"
                    />
                    <button type="button" onClick={() => setShowDeletePass(!showDeletePass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                      {showDeletePass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                  <div className="flex gap-2">
                    <Button className="bg-red-600 hover:bg-red-700 flex-1" onClick={handleDeleteAccount}>Confirm Delete Account</Button>
                    <Button variant="outline" onClick={() => { setShowDeleteConfirm(false); setDeletePassword(''); }}>Cancel</Button>
                  </div>
                </motion.div>
              </AnimatePresence>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

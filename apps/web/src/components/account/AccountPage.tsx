'use client';

import { useState } from 'react';
import { Save, Lock, User, Bell, Shield, Camera } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

type Tab = 'profile' | 'security' | 'notifications';

const TABS: { id: Tab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'security', label: 'Security', icon: Lock },
  { id: 'notifications', label: 'Notifications', icon: Bell },
];

export function AccountPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const [profile, setProfile] = useState({
    firstName: user?.firstName ?? '',
    lastName: user?.lastName ?? '',
    email: user?.email ?? '',
    phone: '',
    bio: '',
    language: 'en',
    timezone: 'America/New_York',
  });

  const [security, setSecurity] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notifPrefs, setNotifPrefs] = useState({
    gradePosted: true,
    absenceAlert: true,
    paymentDue: true,
    certificateReady: true,
    systemAnnouncements: false,
    emailNotifications: true,
    browserNotifications: false,
  });

  function handleSaveProfile() {
    toast.success('Profile updated successfully');
  }

  function handleChangePassword() {
    if (!security.currentPassword) return toast.error('Please enter your current password');
    if (security.newPassword.length < 8) return toast.error('New password must be at least 8 characters');
    if (security.newPassword !== security.confirmPassword) return toast.error('Passwords do not match');
    toast.success('Password changed successfully');
    setSecurity({ currentPassword: '', newPassword: '', confirmPassword: '' });
  }

  function handleSaveNotifications() {
    toast.success('Notification preferences saved');
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="My Account">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Left sidebar — Avatar + tabs */}
        <div className="md:w-56 shrink-0 space-y-4">
          {/* Avatar card */}
          <div className="bg-card rounded-card shadow-card p-5 flex flex-col items-center gap-3">
            <div className="relative">
              <Avatar
                src={user.avatarUrl}
                firstName={user.firstName}
                lastName={user.lastName}
                size="lg"
                className="!w-20 !h-20 text-xl"
              />
              <button className="absolute bottom-0 right-0 w-7 h-7 bg-accent rounded-full flex items-center justify-center shadow-sm hover:bg-accent/90 transition-colors">
                <Camera className="w-3.5 h-3.5 text-white" />
              </button>
            </div>
            <div className="text-center">
              <p className="font-semibold text-app-text">{user.firstName} {user.lastName}</p>
              <p className="text-xs text-muted">{user.email}</p>
              <Badge variant="secondary" className="mt-2 capitalize">{user.role.toLowerCase()}</Badge>
            </div>
          </div>

          {/* Nav tabs */}
          <nav className="space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all text-left ${
                    activeTab === tab.id
                      ? 'bg-accent/10 text-accent'
                      : 'text-muted hover:bg-surface hover:text-app-text'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {tab.label}
                </button>
              );
            })}
          </nav>

          {/* School info */}
          <div className="bg-surface border border-border rounded-card p-3">
            <div className="flex items-center gap-2 mb-1">
              <Shield className="w-3.5 h-3.5 text-muted" />
              <span className="text-xs text-muted font-medium">School</span>
            </div>
            <p className="text-xs font-semibold text-app-text">{user.school.name}</p>
            <p className="text-[11px] text-muted mt-0.5">ID: {user.school.id.slice(0, 8)}…</p>
          </div>
        </div>

        {/* Right content */}
        <div className="flex-1 min-w-0">
          {/* ─── Profile ─── */}
          {activeTab === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">First Name</label>
                    <input
                      className="input-field w-full"
                      value={profile.firstName}
                      onChange={(e) => setProfile((p) => ({ ...p, firstName: e.target.value }))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Last Name</label>
                    <input
                      className="input-field w-full"
                      value={profile.lastName}
                      onChange={(e) => setProfile((p) => ({ ...p, lastName: e.target.value }))}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-1">Email Address</label>
                  <input
                    type="email"
                    className="input-field w-full"
                    value={profile.email}
                    onChange={(e) => setProfile((p) => ({ ...p, email: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-1">Phone Number</label>
                  <input
                    type="tel"
                    className="input-field w-full"
                    placeholder="+1-555-000-0000"
                    value={profile.phone}
                    onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-app-text mb-1">Bio</label>
                  <textarea
                    className="input-field w-full resize-none"
                    rows={3}
                    placeholder="A short description about yourself…"
                    value={profile.bio}
                    onChange={(e) => setProfile((p) => ({ ...p, bio: e.target.value }))}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Language</label>
                    <select
                      className="input-field w-full"
                      value={profile.language}
                      onChange={(e) => setProfile((p) => ({ ...p, language: e.target.value }))}
                    >
                      <option value="en">English</option>
                      <option value="ar">Arabic (عربي)</option>
                      <option value="fr">French (Français)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Timezone</label>
                    <select
                      className="input-field w-full"
                      value={profile.timezone}
                      onChange={(e) => setProfile((p) => ({ ...p, timezone: e.target.value }))}
                    >
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end pt-2">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveProfile}>
                    Save Profile
                  </Button>
                </div>
              </div>
            </Card>
          )}

          {/* ─── Security ─── */}
          {activeTab === 'security' && (
            <div className="space-y-5">
              <Card>
                <CardHeader><CardTitle>Change Password</CardTitle></CardHeader>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Current Password</label>
                    <input
                      type="password"
                      className="input-field w-full"
                      value={security.currentPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, currentPassword: e.target.value }))}
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">New Password</label>
                    <input
                      type="password"
                      className="input-field w-full"
                      value={security.newPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, newPassword: e.target.value }))}
                      placeholder="Minimum 8 characters"
                    />
                    {/* Strength bar */}
                    {security.newPassword.length > 0 && (
                      <div className="mt-2">
                        <div className="flex gap-1">
                          {[0, 1, 2, 3].map((i) => {
                            const strength = getPasswordStrength(security.newPassword);
                            return (
                              <div
                                key={i}
                                className={`h-1 flex-1 rounded-full transition-colors ${
                                  i < strength
                                    ? strength <= 1 ? 'bg-danger' : strength <= 2 ? 'bg-warning' : 'bg-success'
                                    : 'bg-border'
                                }`}
                              />
                            );
                          })}
                        </div>
                        <p className={`text-xs mt-1 ${getStrengthColor(security.newPassword)}`}>
                          {getStrengthLabel(security.newPassword)}
                        </p>
                      </div>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Confirm New Password</label>
                    <input
                      type="password"
                      className="input-field w-full"
                      value={security.confirmPassword}
                      onChange={(e) => setSecurity((p) => ({ ...p, confirmPassword: e.target.value }))}
                      placeholder="Repeat new password"
                    />
                    {security.confirmPassword && security.newPassword !== security.confirmPassword && (
                      <p className="text-xs text-danger mt-1">Passwords do not match</p>
                    )}
                  </div>
                  <div className="flex justify-end pt-2">
                    <Button leftIcon={<Lock className="w-4 h-4" />} onClick={handleChangePassword}>
                      Change Password
                    </Button>
                  </div>
                </div>
              </Card>

              <Card>
                <CardHeader><CardTitle>Session Information</CardTitle></CardHeader>
                <div className="space-y-3">
                  {[
                    { device: 'Chrome on Windows', location: 'New York, US', time: 'Active now', current: true },
                    { device: 'Safari on iPhone', location: 'New York, US', time: '2 hrs ago', current: false },
                  ].map((session, i) => (
                    <div key={i} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border">
                      <div>
                        <p className="text-sm font-medium flex items-center gap-2">
                          {session.device}
                          {session.current && <Badge variant="success">Current</Badge>}
                        </p>
                        <p className="text-xs text-muted mt-0.5">{session.location} · {session.time}</p>
                      </div>
                      {!session.current && (
                        <Button variant="danger" size="sm" onClick={() => toast.info('Session revoked')}>
                          Revoke
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          )}

          {/* ─── Notifications ─── */}
          {activeTab === 'notifications' && (
            <Card>
              <CardHeader><CardTitle>Notification Preferences</CardTitle></CardHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-app-text mb-3">Delivery Channels</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'emailNotifications', label: 'Email Notifications', description: 'Receive important alerts via email' },
                      { key: 'browserNotifications', label: 'Browser Notifications', description: 'Push notifications in the browser' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-surface/80">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifPrefs[item.key as keyof typeof notifPrefs] as boolean}
                          onChange={(e) => setNotifPrefs((p) => ({ ...p, [item.key]: e.target.checked }))}
                          className="w-4 h-4 accent-accent"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-sm font-semibold text-app-text mb-3">Alert Types</h4>
                  <div className="space-y-2">
                    {[
                      { key: 'gradePosted', label: 'Grades Posted', description: 'When new grades are published' },
                      { key: 'absenceAlert', label: 'Absence Alerts', description: 'When marked absent from class' },
                      { key: 'paymentDue', label: 'Payment Reminders', description: 'When fees are due or overdue' },
                      { key: 'certificateReady', label: 'Certificate Ready', description: 'When a requested certificate is available' },
                      { key: 'systemAnnouncements', label: 'System Announcements', description: 'Platform updates and maintenance notices' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-surface/80">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifPrefs[item.key as keyof typeof notifPrefs] as boolean}
                          onChange={(e) => setNotifPrefs((p) => ({ ...p, [item.key]: e.target.checked }))}
                          className="w-4 h-4 accent-accent"
                        />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSaveNotifications}>
                    Save Preferences
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

function getPasswordStrength(password: string): number {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
}

function getStrengthLabel(password: string): string {
  const s = getPasswordStrength(password);
  return ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'][s] ?? '';
}

function getStrengthColor(password: string): string {
  const s = getPasswordStrength(password);
  return s <= 1 ? 'text-danger' : s <= 2 ? 'text-warning' : 'text-success';
}

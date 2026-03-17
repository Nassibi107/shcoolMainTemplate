'use client';

import { useState } from 'react';
import { Save, School, Bell, Calendar, Globe } from 'lucide-react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

type SettingsTab = 'school' | 'academic' | 'notifications' | 'localization';

const TABS: { id: SettingsTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: 'school', label: 'School Profile', icon: School },
  { id: 'academic', label: 'Academic Year', icon: Calendar },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'localization', label: 'Localization', icon: Globe },
];

export default function AdminSettingsPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<SettingsTab>('school');
  const [saved, setSaved] = useState(false);

  const [schoolForm, setSchoolForm] = useState({
    name: 'Scope International School',
    email: 'admin@scopeschool.com',
    phone: '+1-555-0100',
    address: '123 Education Blvd, Learning City, LC 45678',
    website: 'https://scopeschool.com',
    timezone: 'America/New_York',
    primaryColor: '#4361ee',
  });

  const [academicForm, setAcademicForm] = useState({
    academicYear: '2024-2025',
    startDate: '2024-09-01',
    endDate: '2025-06-30',
    termsCount: '3',
    gradingScale: 'percentage',
    passingGrade: '60',
  });

  const [notifForm, setNotifForm] = useState({
    absenceAlert: true,
    paymentDue: true,
    gradePosted: true,
    certificateReady: true,
    emailEnabled: true,
    smsEnabled: false,
    absenceThreshold: '3',
  });

  const [localeForm, setLocaleForm] = useState({
    defaultLanguage: 'en',
    rtlSupport: false,
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD',
  });

  function handleSave() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  if (!user) return null;

  return (
    <DashboardLayout user={user} pageTitle="Settings">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar */}
        <div className="md:w-52 shrink-0">
          <nav className="space-y-0.5">
            {TABS.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
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
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === 'school' && (
            <Card>
              <CardHeader>
                <CardTitle>School Profile</CardTitle>
                {saved && <Badge variant="success">Saved!</Badge>}
              </CardHeader>
              <div className="space-y-4 p-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">School Name</label>
                    <input className="input-field w-full" value={schoolForm.name} onChange={(e) => setSchoolForm((p) => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Email</label>
                    <input type="email" className="input-field w-full" value={schoolForm.email} onChange={(e) => setSchoolForm((p) => ({ ...p, email: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Phone</label>
                    <input className="input-field w-full" value={schoolForm.phone} onChange={(e) => setSchoolForm((p) => ({ ...p, phone: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Website</label>
                    <input type="url" className="input-field w-full" value={schoolForm.website} onChange={(e) => setSchoolForm((p) => ({ ...p, website: e.target.value }))} />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-1">Address</label>
                  <textarea className="input-field w-full resize-none" rows={2} value={schoolForm.address} onChange={(e) => setSchoolForm((p) => ({ ...p, address: e.target.value }))} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Timezone</label>
                    <select className="input-field w-full" value={schoolForm.timezone} onChange={(e) => setSchoolForm((p) => ({ ...p, timezone: e.target.value }))}>
                      <option value="America/New_York">America/New_York (EST)</option>
                      <option value="America/Chicago">America/Chicago (CST)</option>
                      <option value="America/Los_Angeles">America/Los_Angeles (PST)</option>
                      <option value="Europe/London">Europe/London (GMT)</option>
                      <option value="Africa/Cairo">Africa/Cairo (EET)</option>
                      <option value="Asia/Dubai">Asia/Dubai (GST)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Brand Color</label>
                    <div className="flex items-center gap-2">
                      <input type="color" className="w-10 h-10 rounded cursor-pointer border border-border" value={schoolForm.primaryColor} onChange={(e) => setSchoolForm((p) => ({ ...p, primaryColor: e.target.value }))} />
                      <input className="input-field flex-1" value={schoolForm.primaryColor} onChange={(e) => setSchoolForm((p) => ({ ...p, primaryColor: e.target.value }))} />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'academic' && (
            <Card>
              <CardHeader>
                <CardTitle>Academic Year Configuration</CardTitle>
                {saved && <Badge variant="success">Saved!</Badge>}
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="sm:col-span-1">
                    <label className="block text-sm font-medium text-app-text mb-1">Academic Year</label>
                    <input className="input-field w-full" value={academicForm.academicYear} onChange={(e) => setAcademicForm((p) => ({ ...p, academicYear: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Start Date</label>
                    <input type="date" className="input-field w-full" value={academicForm.startDate} onChange={(e) => setAcademicForm((p) => ({ ...p, startDate: e.target.value }))} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">End Date</label>
                    <input type="date" className="input-field w-full" value={academicForm.endDate} onChange={(e) => setAcademicForm((p) => ({ ...p, endDate: e.target.value }))} />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Number of Terms</label>
                    <select className="input-field w-full" value={academicForm.termsCount} onChange={(e) => setAcademicForm((p) => ({ ...p, termsCount: e.target.value }))}>
                      <option value="2">2 Semesters</option>
                      <option value="3">3 Terms</option>
                      <option value="4">4 Quarters</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Grading Scale</label>
                    <select className="input-field w-full" value={academicForm.gradingScale} onChange={(e) => setAcademicForm((p) => ({ ...p, gradingScale: e.target.value }))}>
                      <option value="percentage">Percentage (0–100%)</option>
                      <option value="letter">Letter (A–F)</option>
                      <option value="gpa">GPA (0.0–4.0)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Passing Grade (%)</label>
                    <input type="number" className="input-field w-full" value={academicForm.passingGrade} min="0" max="100" onChange={(e) => setAcademicForm((p) => ({ ...p, passingGrade: e.target.value }))} />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                {saved && <Badge variant="success">Saved!</Badge>}
              </CardHeader>
              <div className="space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-app-text mb-3">Delivery Channels</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'emailEnabled', label: 'Email Notifications', description: 'Send notifications via email' },
                      { key: 'smsEnabled', label: 'SMS Notifications', description: 'Send notifications via SMS (requires Twilio setup)' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-surface/80">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifForm[item.key as keyof typeof notifForm] as boolean}
                          onChange={(e) => setNotifForm((p) => ({ ...p, [item.key]: e.target.checked }))}
                          className="w-4 h-4 accent-accent"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-app-text mb-3">Alert Triggers</h4>
                  <div className="space-y-3">
                    {[
                      { key: 'absenceAlert', label: 'Absence Alerts', description: 'Notify parents when student is absent' },
                      { key: 'paymentDue', label: 'Payment Due Reminders', description: 'Remind parents of upcoming fee deadlines' },
                      { key: 'gradePosted', label: 'Grade Posted', description: 'Notify students/parents when grades are posted' },
                      { key: 'certificateReady', label: 'Certificate Ready', description: 'Notify when requested certificates are ready' },
                    ].map((item) => (
                      <label key={item.key} className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer hover:bg-surface/80">
                        <div>
                          <p className="text-sm font-medium">{item.label}</p>
                          <p className="text-xs text-muted">{item.description}</p>
                        </div>
                        <input
                          type="checkbox"
                          checked={notifForm[item.key as keyof typeof notifForm] as boolean}
                          onChange={(e) => setNotifForm((p) => ({ ...p, [item.key]: e.target.checked }))}
                          className="w-4 h-4 accent-accent"
                        />
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-app-text mb-1">Consecutive Absence Threshold (days)</label>
                  <input type="number" className="input-field w-32" value={notifForm.absenceThreshold} min="1" max="30" onChange={(e) => setNotifForm((p) => ({ ...p, absenceThreshold: e.target.value }))} />
                  <p className="text-xs text-muted mt-1">Alert admin when a student misses this many consecutive days</p>
                </div>
                <div className="flex justify-end">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'localization' && (
            <Card>
              <CardHeader>
                <CardTitle>Localization & Language</CardTitle>
                {saved && <Badge variant="success">Saved!</Badge>}
              </CardHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Default Language</label>
                    <select className="input-field w-full" value={localeForm.defaultLanguage} onChange={(e) => setLocaleForm((p) => ({ ...p, defaultLanguage: e.target.value }))}>
                      <option value="en">English</option>
                      <option value="ar">Arabic (عربي)</option>
                      <option value="fr">French (Français)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Date Format</label>
                    <select className="input-field w-full" value={localeForm.dateFormat} onChange={(e) => setLocaleForm((p) => ({ ...p, dateFormat: e.target.value }))}>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-app-text mb-1">Currency</label>
                    <select className="input-field w-full" value={localeForm.currency} onChange={(e) => setLocaleForm((p) => ({ ...p, currency: e.target.value }))}>
                      <option value="USD">USD ($)</option>
                      <option value="EUR">EUR (€)</option>
                      <option value="GBP">GBP (£)</option>
                      <option value="SAR">SAR (ر.س)</option>
                      <option value="AED">AED (د.إ)</option>
                      <option value="EGP">EGP (ج.م)</option>
                    </select>
                  </div>
                </div>
                <label className="flex items-center justify-between p-3 bg-surface rounded-lg border border-border cursor-pointer">
                  <div>
                    <p className="text-sm font-medium">RTL (Right-to-Left) Layout</p>
                    <p className="text-xs text-muted">Enable for Arabic and other RTL languages</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={localeForm.rtlSupport}
                    onChange={(e) => setLocaleForm((p) => ({ ...p, rtlSupport: e.target.checked }))}
                    className="w-4 h-4 accent-accent"
                  />
                </label>
                <div className="flex justify-end pt-2">
                  <Button leftIcon={<Save className="w-4 h-4" />} onClick={handleSave}>Save Changes</Button>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

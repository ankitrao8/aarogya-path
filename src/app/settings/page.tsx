'use client';

import { Logo } from '@/components/Logo';
import { SUPPORTED_LANGUAGES, SupportedLanguage, useTranslation } from '@/lib/i18n';
import {
  ArrowLeft,
  Bell,
  Check,
  ChevronRight,
  Globe,
  HelpCircle,
  Key,
  LayoutDashboard,
  Lock,
  LogOut,
  Moon,
  Phone,
  Shield,
  Trash2,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const { language, setLanguage, t } = useTranslation();
  const router = useRouter();

  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Ankit Rao',
    email: 'ankit.rao@gmail.com',
    phone: '9876543210',
    village: 'Gorakhpur, U.P.',
  });

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
    router.refresh();
  };

  const handleDeleteData = async () => {
    try {
      await fetch('/api/patient/delete-account', { method: 'DELETE' });
      window.location.href = '/';
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] py-8 px-4 sm:px-6 antialiased">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Top Header with Back */}
        <div className="flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3E6157] hover:text-[#0D9B75] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 text-[#0D9B75]" />
            <span>Back to Dashboard</span>
          </Link>
          <Logo theme="light" size="sm" />
        </div>

        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-sm space-y-6">
          <div className="border-b border-[#D9F5EA] pb-4">
            <h1 className="text-2xl font-black text-[#16352D]">Settings</h1>
            <p className="text-xs text-[#3E6157] mt-0.5">
              Manage your personal preferences, notifications and privacy.
            </p>
          </div>

          {/* User Profile Card (Matching Section 13) */}
          <div className="p-4 rounded-2xl bg-[#D9F5EA]/60 border border-[#D9F5EA] flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-[#0D9B75] text-white font-black text-xl flex items-center justify-center shrink-0 shadow-xs">
              {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
            </div>
            <div className="flex-1">
              <h2 className="font-extrabold text-[#16352D] text-base">
                {currentUser?.name || 'Ankit Rao'}
              </h2>
              <p className="text-xs text-[#3E6157]">{currentUser?.email || 'ankit.rao@gmail.com'}</p>
              <p className="text-[11px] font-semibold text-[#0D9B75] mt-0.5">
                Location: {currentUser?.village || 'Gorakhpur, U.P.'}
              </p>
            </div>
          </div>

          {/* Settings Items (Matching Section 13) */}
          <div className="divide-y divide-slate-100 text-sm">
            {/* 1. Profile Information */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Profile Information</div>
                  <div className="text-xs text-slate-500">Edit age, gender, contact details</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 2. Notifications Toggle */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Notifications</div>
                  <div className="text-xs text-slate-500">Follow-up reminders & triage updates</div>
                </div>
              </div>
              <button
                onClick={() => setNotifications(!notifications)}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  notifications ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    notifications ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 3. Language Selector */}
            <div className="py-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center">
                    <Globe className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-bold text-slate-900">Language</div>
                    <div className="text-xs text-slate-500">Select application interface script</div>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-700 uppercase">
                  {language === 'hi' ? 'Hindi (हिन्दी)' : language === 'bho' ? 'Bhojpuri' : 'English'}
                </span>
              </div>

              <div className="flex flex-wrap gap-2 pt-1 pl-12">
                {SUPPORTED_LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => setLanguage(lang.code as SupportedLanguage)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors ${
                      language === lang.code
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                    }`}
                  >
                    {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Dark Mode Switch */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center">
                  <Moon className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Dark Mode</div>
                  <div className="text-xs text-slate-500">High contrast dark theme</div>
                </div>
              </div>
              <button
                onClick={() => setDarkMode(!darkMode)}
                className={`w-12 h-7 rounded-full p-1 transition-colors ${
                  darkMode ? 'bg-emerald-500' : 'bg-slate-300'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white transition-transform ${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {/* 5. Privacy & Security */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Privacy & Security</div>
                  <div className="text-xs text-slate-500">DPDP Act 2023 compliance & data rights</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 6. Help & Support */}
            <div className="py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-slate-900">Help & Support</div>
                  <div className="text-xs text-slate-500">National Health Helpline 104 • Emergency 108</div>
                </div>
              </div>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>

            {/* 7. Log Out */}
            <div className="py-4 flex items-center justify-between">
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 text-red-600 hover:text-red-700 font-bold transition-colors"
              >
                <div className="w-9 h-9 rounded-xl bg-red-50 text-red-600 flex items-center justify-center">
                  <LogOut className="w-4 h-4" />
                </div>
                <span>Log Out</span>
              </button>
            </div>
          </div>
        </div>

        {/* Delete Account Data Compliance (DPDP Act) */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200 text-center space-y-2">
          {!deleteConfirm ? (
            <button
              onClick={() => setDeleteConfirm(true)}
              className="text-xs font-bold text-red-600 hover:underline flex items-center justify-center gap-1.5 mx-auto"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Right to Erasure (Delete all personal health data)</span>
            </button>
          ) : (
            <div className="space-y-2">
              <p className="text-xs text-red-700 font-bold">
                Are you sure you want to permanently delete all your health records?
              </p>
              <div className="flex justify-center gap-2">
                <button
                  onClick={handleDeleteData}
                  className="px-4 py-1.5 rounded-lg bg-red-600 text-white font-bold text-xs"
                >
                  Yes, Delete All
                </button>
                <button
                  onClick={() => setDeleteConfirm(false)}
                  className="px-4 py-1.5 rounded-lg bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

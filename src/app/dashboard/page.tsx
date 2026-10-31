'use client';

import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  Activity,
  ArrowRight,
  Bell,
  Calendar,
  CheckCircle2,
  ChevronRight,
  Clock,
  CloudSun,
  FileText,
  Heart,
  HeartPulse,
  Home,
  LayoutDashboard,
  LogOut,
  MapPin,
  Phone,
  Pill,
  Plus,
  Search,
  Settings,
  Sparkles,
  Stethoscope,
  TrendingUp,
  User,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>({
    name: 'Ankit Rao',
    village: 'Gorakhpur, U.P.',
  });
  const [searchQuery, setSearchQuery] = useState('');

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

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] flex flex-col lg:flex-row antialiased">
      {/* 1. Left Sidebar Navigation (Matching Section 2 of Mockup) */}
      <aside className="w-full lg:w-64 bg-white border-r border-[#D9F5EA] p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          {/* Logo */}
          <Link href="/" className="block">
            <Logo theme="light" size="md" />
          </Link>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2" aria-label="Sidebar Menu">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <LayoutDashboard className="w-4 h-4 text-white" />
              <span>Dashboard</span>
            </Link>

            <Link
              href="/triage"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#0D9B75]" />
              <span>Check Symptoms</span>
            </Link>

            <Link
              href="/health-checkup"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>AI Health Predictor</span>
            </Link>

            <Link
              href="/medicines"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Pill className="w-4 h-4 text-[#0D9B75]" />
              <span>Medicines & Shops</span>
            </Link>

            <Link
              href="/patient/records"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-[#3E6157]" />
              <span>My Health</span>
            </Link>

            <Link
              href="/facilities"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#3E6157]" />
              <span>Nearby Doctors</span>
            </Link>

            <Link
              href="/teleconsultation"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Video className="w-4 h-4 text-[#3E6157]" />
              <span>Teleconsultation</span>
            </Link>

            <Link
              href="/patient/records"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#3E6157]" />
              <span>Health Records</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#3E6157]" />
              <span>Settings</span>
            </Link>
          </nav>
        </div>

        {/* Bottom Card: Better Health, Stronger Villages */}
        <div className="pt-6 border-t border-[#D9F5EA]">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-center space-y-2">
            <div className="w-10 h-10 rounded-xl bg-[#D9F5EA] text-[#0D9B75] flex items-center justify-center mx-auto">
              <Heart className="w-5 h-5 fill-[#0D9B75] text-[#0D9B75]" />
            </div>
            <div className="font-extrabold text-xs text-[#16352D]">
              Better Health • Stronger Villages
            </div>
            <p className="text-[11px] text-[#3E6157] font-medium">
              Brighter Future for Rural India
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Main Dashboard Content (Matching Section 2 of Mockup) */}
      <main className="flex-1 p-5 sm:p-7 lg:p-8 space-y-6 max-w-7xl">
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white px-5 py-3.5 rounded-3xl border border-slate-200/80 shadow-xs">
          {/* Search bar */}
          <div className="relative w-full sm:w-[380px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search symptoms, doctors, or anything..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm focus:outline-hidden focus:border-emerald-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Right Header: Notification, User & Date */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <Calendar className="w-3.5 h-3.5 text-emerald-600" />
              <span>Today: 26 Oct 2026</span>
            </div>

            <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700">
              <CloudSun className="w-3.5 h-3.5 text-amber-500" />
              <span>24°C Gorakhpur</span>
            </div>

            {/* Notification Bell */}
            <button
              title="Notifications"
              className="p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/80 text-slate-600 relative transition-colors"
            >
              <Bell className="w-4 h-4" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-2 right-2 ring-2 ring-white" />
            </button>

            {/* User Profile */}
            <Link
              href="/settings"
              className="flex items-center gap-2.5 pl-1.5 pr-3 py-1 rounded-2xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
            >
              <div className="w-8 h-8 rounded-full bg-emerald-600 text-white font-black text-xs flex items-center justify-center shadow-xs">
                {currentUser?.name ? currentUser.name.charAt(0) : 'A'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser?.name || 'Ankit Rao'}
                </div>
                <div className="text-[10px] text-slate-500">Gorakhpur, U.P.</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Greeting Banner */}
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Good Morning, {currentUser?.name || 'Ankit'}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Take care of your health, it's the first step towards a better future.
          </p>
        </div>

        {/* 4 Feature Action Cards (Mint, Sky Blue, Lavender, Warm Amber) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* 1. Check Symptoms */}
          <Link
            href="/triage"
            className="p-5 rounded-3xl bg-[#ecfdf5] border border-emerald-200/80 hover:border-emerald-400 transition-all duration-200 hover:-translate-y-1 group shadow-xs block"
          >
            <div className="w-11 h-11 rounded-2xl bg-emerald-500 text-white flex items-center justify-center font-bold mb-4 shadow-sm shadow-emerald-500/25 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-emerald-700 transition-colors">
              Check Symptoms
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">Get instant AI guidance</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-emerald-700">
              <span>Start</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 2. Nearby Doctors */}
          <Link
            href="/facilities"
            className="p-5 rounded-3xl bg-[#f0f9ff] border border-sky-200/80 hover:border-sky-400 transition-all duration-200 hover:-translate-y-1 group shadow-xs block"
          >
            <div className="w-11 h-11 rounded-2xl bg-sky-500 text-white flex items-center justify-center font-bold mb-4 shadow-sm shadow-sky-500/25 group-hover:scale-105 transition-transform">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-sky-700 transition-colors">
              Nearby Doctors
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">PHC & Hospitals</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-sky-700">
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 3. Teleconsultation */}
          <Link
            href="/teleconsultation"
            className="p-5 rounded-3xl bg-[#f5f3ff] border border-purple-200/80 hover:border-purple-400 transition-all duration-200 hover:-translate-y-1 group shadow-xs block"
          >
            <div className="w-11 h-11 rounded-2xl bg-purple-600 text-white flex items-center justify-center font-bold mb-4 shadow-sm shadow-purple-500/25 group-hover:scale-105 transition-transform">
              <Video className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-purple-700 transition-colors">
              Teleconsultation
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">Talk to a doctor</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-purple-700">
              <span>Connect</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>

          {/* 4. Health Records */}
          <Link
            href="/patient/records"
            className="p-5 rounded-3xl bg-[#fffbeb] border border-amber-200/80 hover:border-amber-400 transition-all duration-200 hover:-translate-y-1 group shadow-xs block"
          >
            <div className="w-11 h-11 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-bold mb-4 shadow-sm shadow-amber-500/25 group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-slate-900 text-base group-hover:text-amber-700 transition-colors">
              Health Records
            </h3>
            <p className="text-xs text-slate-600 mt-0.5">View your reports</p>
            <div className="mt-4 flex items-center gap-1 text-xs font-bold text-amber-700">
              <span>Open</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
            </div>
          </Link>
        </div>

        {/* 3-Column Content Section: Quick Actions + Health Overview + Doctor Community Card */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Quick Actions (Col 4) */}
          <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">Quick Actions</h3>
            <div className="space-y-2.5">
              <Link
                href="/triage"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#ecfdf5] hover:bg-[#d1fae5] text-emerald-950 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Check Symptoms</span>
                </div>
                <ChevronRight className="w-4 h-4 text-emerald-600" />
              </Link>

              <Link
                href="/facilities"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f0f9ff] hover:bg-[#e0f2fe] text-sky-950 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-sky-600" />
                  <span>Find Nearby Doctors</span>
                </div>
                <ChevronRight className="w-4 h-4 text-sky-600" />
              </Link>

              <Link
                href="/teleconsultation"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#f5f3ff] hover:bg-[#ede9fe] text-purple-950 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Video className="w-4 h-4 text-purple-600" />
                  <span>Book Teleconsultation</span>
                </div>
                <ChevronRight className="w-4 h-4 text-purple-600" />
              </Link>

              <Link
                href="/medicines"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-teal-50 hover:bg-teal-100 text-teal-950 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Pill className="w-4 h-4 text-teal-600" />
                  <span>Medicines & Medical Stores</span>
                </div>
                <ChevronRight className="w-4 h-4 text-teal-600" />
              </Link>

              <Link
                href="/patient/records"
                className="flex items-center justify-between p-3.5 rounded-2xl bg-[#fffbeb] hover:bg-[#fef3c7] text-amber-950 font-bold text-xs transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <FileText className="w-4 h-4 text-amber-600" />
                  <span>View Health Records</span>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </Link>
            </div>
          </div>

          {/* Your Health Overview (Col 5) */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-wide">
              Your Health Overview
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2 text-emerald-600 mb-1">
                  <Calendar className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Last Checkup
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">12 Oct 2026</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Normal</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2 text-sky-600 mb-1">
                  <Clock className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Next Follow-up
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">Not Scheduled</div>
                <Link
                  href="/teleconsultation"
                  className="text-[11px] text-sky-600 font-bold mt-0.5 block hover:underline"
                >
                  Book Now →
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2 text-rose-500 mb-1">
                  <HeartPulse className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    Heart Rate
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">72 bpm</div>
                <div className="text-[11px] text-emerald-600 font-bold mt-0.5">Normal</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-100/80">
                <div className="flex items-center gap-2 text-amber-500 mb-1">
                  <Activity className="w-4 h-4" />
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    BMI Score
                  </span>
                </div>
                <div className="font-extrabold text-slate-900 text-sm">18.4</div>
                <div className="text-[11px] text-amber-600 font-bold mt-0.5">Underweight</div>
              </div>
            </div>
          </div>

          {/* Healthy People Build Stronger Communities Visual Card (Col 3) */}
          <div className="lg:col-span-3 rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs relative flex flex-col justify-end bg-slate-900 text-white min-h-[240px]">
            <img
              src="/images/phc-community.jpg"
              alt="Healthy Rural Communities"
              className="absolute inset-0 w-full h-full object-cover opacity-85"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
            <div className="relative p-5 z-10 space-y-1">
              <h4 className="font-black text-white text-sm sm:text-base leading-snug">
                Healthy People Build Stronger Communities
              </h4>
              <p className="text-[11px] text-emerald-300 font-medium">
                Serving over 1,200+ villages across India.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Health Tip & Live Stats Strip */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          {/* Health Tip Card */}
          <div className="md:col-span-5 bg-[#ecfdf5] border border-emerald-200/70 p-4 sm:p-5 rounded-3xl flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Heart className="w-5 h-5 fill-white" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase text-emerald-800 tracking-wider">
                Health Tip of the Day
              </div>
              <p className="text-xs text-slate-700 font-medium mt-0.5">
                "A healthy mind lives in a healthy body." Drink clean water & eat fresh seasonal vegetables.
              </p>
            </div>
          </div>

          {/* 4 Stats Chips */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-white p-4 rounded-3xl border border-slate-200/80 shadow-xs text-center">
            <div>
              <div className="text-lg font-black text-slate-900">1,248</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Total Users</div>
            </div>
            <div>
              <div className="text-lg font-black text-emerald-600">85+</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Doctors</div>
            </div>
            <div>
              <div className="text-lg font-black text-sky-600">&lt; 5 mins</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">Avg. Response</div>
            </div>
            <div>
              <div className="text-lg font-black text-purple-600">92%</div>
              <div className="text-[10px] text-slate-500 font-bold uppercase">System Accuracy</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

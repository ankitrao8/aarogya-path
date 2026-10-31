'use client';

import { FacilitiesMap } from '@/components/FacilitiesMap';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  FileText,
  Heart,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Search,
  Settings,
  Sparkles,
  Star,
  Stethoscope,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const DOCTORS_LIST = [
  {
    id: 'dr_priya',
    name: 'Dr. Priya Sharma',
    role: 'General Physician',
    facility: 'PHC Gorakhpur',
    rating: 4.8,
    reviews: 124,
    distance: '2.4 km',
    experience: '8 yrs exp',
    phone: '0551-220011',
    available: true,
  },
  {
    id: 'dr_ramesh',
    name: 'Dr. Ramesh Kumar',
    role: 'General Physician & Telehealth',
    facility: 'Community Health Centre (CHC)',
    rating: 4.6,
    reviews: 98,
    distance: '5.7 km',
    experience: '12 yrs exp',
    phone: '0551-220022',
    available: true,
  },
  {
    id: 'dr_neha',
    name: 'Dr. Neha Singh',
    role: 'Pediatrician (Child Specialist)',
    facility: 'District Hospital',
    rating: 4.7,
    reviews: 156,
    distance: '12.3 km',
    experience: '10 yrs exp',
    phone: '0551-220033',
    available: true,
  },
];

export default function FacilitiesPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'doctors' | 'phc' | 'hospitals'>('doctors');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] flex flex-col lg:flex-row antialiased">
      {/* 1. Left Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-r border-[#D9F5EA] p-5 flex flex-col justify-between shrink-0 shadow-xs">
        <div className="space-y-6">
          <Link href="/" className="block">
            <Logo theme="light" size="md" />
          </Link>

          <nav className="space-y-1.5 pt-2" aria-label="Sidebar Menu">
            <Link
              href="/dashboard"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <LayoutDashboard className="w-4 h-4 text-[#3E6157]" />
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
              href="/facilities"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <MapPin className="w-4 h-4 text-white" />
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

        <div className="pt-6 border-t border-[#D9F5EA]">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-center space-y-1">
            <Heart className="w-5 h-5 text-[#0D9B75] fill-[#0D9B75] mx-auto" />
            <div className="font-extrabold text-xs text-[#16352D]">
              Better Health • Stronger Villages
            </div>
            <p className="text-[11px] text-[#3E6157]">
              Verified Government Healthcare Centers
            </p>
          </div>
        </div>
      </aside>

      {/* 2. Main Facilities & Doctors View */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Top Header Search & Location Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-[#D9F5EA] shadow-xs">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-[#3E6157] absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search doctors, hospital or specialty..."
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-sm focus:outline-hidden focus:border-[#0D9B75] text-[#16352D]"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#F4FAF7] border border-[#D9F5EA] text-xs font-bold text-[#16352D]">
              <MapPin className="w-4 h-4 text-[#0D9B75]" />
              <span>Gorakhpur, U.P.</span>
            </div>

            <a
              href="tel:108"
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition-transform active:scale-95"
            >
              108 Emergency
            </a>
          </div>
        </div>

        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#16352D]">Nearby Health Centers</h1>
            <p className="text-xs text-[#3E6157] font-medium mt-0.5">
              Verified public health centers, doctors, and specialists in your vicinity.
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#D9F5EA] shadow-xs">
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'doctors'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              Doctors
            </button>
            <button
              onClick={() => setActiveTab('phc')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'phc'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              PHC & CHC
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === 'hospitals'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              Hospitals
            </button>
          </div>
        </div>

        {/* Split View: Doctor Cards on Left + Map on Right (Matching Section 4 & 11) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Doctor / Facility List (Col 5) */}
          <div className="lg:col-span-5 space-y-4">
            {DOCTORS_LIST.map((doc) => (
              <div
                key={doc.id}
                className="bg-white p-5 rounded-3xl border border-[#D9F5EA] hover:border-[#0D9B75] transition-all shadow-xs space-y-4 group"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-[#D9F5EA] text-[#0D9B75] flex items-center justify-center font-black text-sm shrink-0 border border-[#D9F5EA] group-hover:scale-105 transition-transform">
                      <Stethoscope className="w-6 h-6 text-[#0D9B75]" />
                    </div>
                    <div>
                      <h3 className="font-extrabold text-[#16352D] text-base">{doc.name}</h3>
                      <p className="text-xs text-slate-500">{doc.role}</p>
                      <p className="text-[11px] font-semibold text-[#0D9B75]">{doc.facility}</p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#D9F5EA] text-[#0D9B75] text-xs font-black">
                      <Navigation className="w-3 h-3 text-[#0D9B75]" />
                      <span>{doc.distance}</span>
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1 border-t border-[#D9F5EA]">
                  <div className="flex items-center gap-1 text-amber-500 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{doc.rating}</span>
                    <span className="text-slate-400 font-normal">({doc.reviews})</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <a
                      href={`tel:${doc.phone}`}
                      className="p-2 rounded-xl bg-[#F4FAF7] hover:bg-[#D9F5EA] text-[#16352D] transition-colors border border-[#D9F5EA]"
                      title="Call Facility"
                    >
                      <Phone className="w-3.5 h-3.5" />
                    </a>

                    <Link
                      href="/teleconsultation"
                      className="px-4 py-2 rounded-xl bg-[#0D9B75] hover:bg-[#0A8262] text-white font-black text-xs shadow-xs transition-transform active:scale-95"
                    >
                      Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Interactive Leaflet Map on Right (Col 7) */}
          <div className="lg:col-span-7 bg-white p-4 rounded-3xl border border-[#D9F5EA] shadow-xs space-y-3">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2 text-xs font-bold text-[#16352D]">
                <MapPin className="w-4 h-4 text-[#0D9B75]" />
                <span>PHC & Hospital Locations Map (Gorakhpur Hub)</span>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-[#D9F5EA] text-[#0D9B75] text-[10px] font-extrabold">
                Live Open Status
              </span>
            </div>

            <div className="rounded-2xl overflow-hidden border border-[#D9F5EA]">
              <FacilitiesMap />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

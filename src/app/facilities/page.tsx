'use client';

import { FacilitiesMap } from '@/components/FacilitiesMap';
import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  FileText,
  Heart,
  HeartPulse,
  Hospital,
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
    name: 'Dr. Priya Sharma (MBBS, DCH)',
    nameHi: 'डॉ. प्रिया शर्मा (एमबीबीएस, शिशु विशेषज्ञ)',
    role: 'General Physician & Maternal Care',
    roleHi: 'सामान्य चिकित्सा एवं मातृ स्वास्थ्य',
    facility: 'Primary Health Centre (PHC)',
    facilityHi: 'प्राथमिक स्वास्थ्य केंद्र (PHC)',
    rating: 4.9,
    reviews: 142,
    distance: '0.9 km',
    distanceHi: '0.9 किमी',
    experience: '8 yrs exp',
    phone: '0551-220011',
    available: true,
  },
  {
    id: 'dr_ramesh',
    name: 'Dr. Ramesh Kumar (MBBS, MD)',
    nameHi: 'डॉ. रमेश कुमार (एमबीबीएस, एमडी)',
    role: 'Emergency Medicine & Telehealth',
    roleHi: 'आपातकालीन चिकित्सा एवं टेलीहेल्थ',
    facility: 'Community Health Centre (CHC)',
    facilityHi: 'सामुदायिक स्वास्थ्य केंद्र (CHC)',
    rating: 4.8,
    reviews: 118,
    distance: '2.1 km',
    distanceHi: '2.1 किमी',
    experience: '12 yrs exp',
    phone: '0551-220022',
    available: true,
  },
  {
    id: 'dr_neha',
    name: 'Dr. Neha Singh (MD Pediatrics)',
    nameHi: 'डॉ. नेहा सिंह (एमडी बाल रोग)',
    role: 'Child Health & Intensive Care',
    roleHi: 'शिशु स्वास्थ्य एवं गहन चिकित्सा',
    facility: 'District Joint Hospital (DH)',
    facilityHi: 'जिला संयुक्त चिकित्सालय (DH)',
    rating: 4.9,
    reviews: 196,
    distance: '3.4 km',
    distanceHi: '3.4 किमी',
    experience: '10 yrs exp',
    phone: '0551-220033',
    available: true,
  },
];

export default function FacilitiesPage() {
  const { t, language } = useTranslation();
  const [activeTab, setActiveTab] = useState<'all' | 'hospitals' | 'phc' | 'doctors'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const mapFacilityType =
    activeTab === 'hospitals'
      ? 'DISTRICT_HOSPITAL'
      : activeTab === 'phc'
      ? 'CHC'
      : 'ALL';

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
              <span>{language === 'en' ? 'Dashboard' : language === 'bho' ? 'डैशबोर्ड' : 'डैशबोर्ड'}</span>
            </Link>

            <Link
              href="/triage"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Sparkles className="w-4 h-4 text-[#0D9B75]" />
              <span>{language === 'en' ? 'Check Symptoms' : language === 'bho' ? 'लक्षण जांचीं' : 'लक्षण जांचें'}</span>
            </Link>

            <Link
              href="/health-checkup"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <HeartPulse className="w-4 h-4 text-rose-600" />
              <span>{language === 'en' ? 'AI Health Predictor' : language === 'bho' ? 'AI स्वास्थ्य जांच' : 'AI स्वास्थ्य भविष्यवक्ता'}</span>
            </Link>

            <Link
              href="/medicines"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Pill className="w-4 h-4 text-[#0D9B75]" />
              <span>{language === 'en' ? 'Medicines & Shops' : language === 'bho' ? 'दवा आ दुकान' : 'दवाएं और दुकानें'}</span>
            </Link>

            <Link
              href="/facilities"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <MapPin className="w-4 h-4 text-white" />
              <span>{t('facilities.tabAll')}</span>
            </Link>

            <Link
              href="/teleconsultation"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Video className="w-4 h-4 text-[#3E6157]" />
              <span>{language === 'en' ? 'Teleconsultation' : language === 'bho' ? 'टेलीकंसल्टेशन' : 'टेलीकंसल्टेशन'}</span>
            </Link>

            <Link
              href="/patient/records"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <FileText className="w-4 h-4 text-[#3E6157]" />
              <span>{language === 'en' ? 'Health Records' : language === 'bho' ? 'स्वास्थ्य पर्ची' : 'स्वास्थ्य रिकॉर्ड'}</span>
            </Link>

            <Link
              href="/settings"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Settings className="w-4 h-4 text-[#3E6157]" />
              <span>{language === 'en' ? 'Settings' : language === 'bho' ? 'सेटिंग्स' : 'सेटिंग्स'}</span>
            </Link>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#D9F5EA]">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-center space-y-1">
            <Heart className="w-5 h-5 text-[#0D9B75] fill-[#0D9B75] mx-auto" />
            <div className="font-extrabold text-xs text-[#16352D]">
              {language === 'en' ? 'Better Health • Stronger Villages' : language === 'bho' ? 'बढ़िया सेहत • मजबूत गांव' : 'उत्तम स्वास्थ्य • सशक्त गांव'}
            </div>
            <p className="text-[11px] text-[#3E6157]">
              {language === 'en' ? 'GPS-Enabled Healthcare Network' : language === 'bho' ? 'GPS आधारित स्वास्थ्य नेटवर्क' : 'GPS आधारित स्वास्थ्य नेटवर्क'}
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
              placeholder={t('facilities.searchPlaceholder')}
              className="w-full pl-11 pr-4 py-2.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-sm focus:outline-hidden focus:border-[#0D9B75] text-[#16352D] font-medium"
            />
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-teal-50 border border-teal-200 text-xs font-bold text-teal-900">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t('facilities.liveGpsActive')}</span>
            </div>

            <a
              href="tel:108"
              className="px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black shadow-xs transition-transform active:scale-95 flex items-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{t('facilities.emergency108')}</span>
            </a>
          </div>
        </div>

        {/* Section Title & Filter Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-[#16352D]">
              {t('facilities.mainTitle')}
            </h1>
            <p className="text-xs text-[#3E6157] font-medium mt-0.5">
              {t('facilities.mainSubtitle')}
            </p>
          </div>

          <div className="flex items-center bg-white p-1 rounded-2xl border border-[#D9F5EA] shadow-xs overflow-x-auto">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'all'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              {t('facilities.tabAll')}
            </button>
            <button
              onClick={() => setActiveTab('hospitals')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'hospitals'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              {t('facilities.tabHospitals')}
            </button>
            <button
              onClick={() => setActiveTab('phc')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'phc'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              {t('facilities.tabPhc')}
            </button>
            <button
              onClick={() => setActiveTab('doctors')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                activeTab === 'doctors'
                  ? 'bg-[#0D9B75] text-white shadow-xs font-black'
                  : 'text-[#16352D] hover:bg-[#D9F5EA]'
              }`}
            >
              {t('facilities.tabDoctors')}
            </button>
          </div>
        </div>

        {/* Doctor Spotlight Cards when 'doctors' tab is clicked */}
        {activeTab === 'doctors' && (
          <div className="space-y-3 bg-white p-5 rounded-3xl border border-[#D9F5EA] shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-extrabold text-[#16352D] text-base flex items-center gap-2">
                <Stethoscope className="w-5 h-5 text-[#0D9B75]" />
                <span>{t('facilities.onDutyDoctorsTitle')}</span>
              </h3>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                {t('facilities.doctorsAvailableNow')}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              {DOCTORS_LIST.map((doc) => {
                const docName = language === 'en' ? doc.name : doc.nameHi;
                const docRole = language === 'en' ? doc.role : doc.roleHi;
                const docFacility = language === 'en' ? doc.facility : doc.facilityHi;
                const docDistance = language === 'en' ? doc.distance : doc.distanceHi;

                return (
                  <div
                    key={doc.id}
                    className="bg-[#F4FAF7] p-4 rounded-2xl border border-[#D9F5EA] hover:border-[#0D9B75] transition-all space-y-3"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h4 className="font-extrabold text-sm text-[#16352D]">{docName}</h4>
                        <p className="text-xs text-slate-500 font-medium">{docRole}</p>
                        <p className="text-[11px] font-bold text-[#0D9B75]">{docFacility}</p>
                      </div>
                      <span className="text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#0D9B75] border border-[#D9F5EA]">
                        {docDistance}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#D9F5EA]">
                      <div className="flex items-center gap-1 text-amber-500 font-bold">
                        <Star className="w-3.5 h-3.5 fill-amber-400" />
                        <span>{doc.rating}</span>
                        <span className="text-slate-400 font-normal">({doc.reviews})</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <a
                          href={`tel:${doc.phone}`}
                          className="p-1.5 rounded-lg bg-white hover:bg-slate-100 text-[#16352D] transition-colors border border-[#D9F5EA]"
                          title={t('facilities.call')}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                        <Link
                          href="/teleconsultation"
                          className="px-3 py-1.5 rounded-lg bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-xs"
                        >
                          {t('facilities.bookConsult')}
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Real-time Map & Facilities Network */}
        <div className="space-y-4">
          <FacilitiesMap
            initialType={mapFacilityType}
            searchQuery={searchQuery}
          />
        </div>
      </main>
    </div>
  );
}

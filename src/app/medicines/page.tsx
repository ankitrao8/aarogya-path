'use client';

import { Logo } from '@/components/Logo';
import {
  COMPREHENSIVE_MEDICINES,
  MEDICINE_CATEGORIES,
  MedicineInfo,
  searchMedicines,
} from '@/lib/medicine/data';
import {
  calculateDistanceKm,
  DISTRICT_LIST,
  NEARBY_PHARMACIES,
  PharmacyStore,
} from '@/lib/medicine/pharmacies';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  ChevronRight,
  Clock,
  Compass,
  ExternalLink,
  Heart,
  HeartPulse,
  Info,
  LayoutDashboard,
  MapPin,
  Navigation,
  Phone,
  Pill,
  Search,
  ShieldAlert,
  Sparkles,
  Stethoscope,
  Tag,
  TrendingDown,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';

export default function MedicinesPage() {
  const [activeTab, setActiveTab] = useState<'medicines' | 'shops'>('medicines');

  // Search & Filter state for Medicines
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Location & Filter state for Medical Shops / Clinics
  const [selectedDistrict, setSelectedDistrict] = useState('All Districts (सभी जिले)');
  const [shopTypeFilter, setShopTypeFilter] = useState<string>('ALL');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [locationStatus, setLocationStatus] = useState<string>('');

  // Auto request location on load or fallback gracefully
  const requestUserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('Geolocation is not supported by your browser');
      return;
    }

    setIsLocating(true);
    setLocationStatus('Getting GPS location...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLocation({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        });
        setIsLocating(false);
        setLocationStatus('Location found! Showing nearest stores by distance.');
      },
      (err) => {
        setIsLocating(false);
        setLocationStatus('Could not access live GPS. Showing stores by district.');
        console.warn('Geolocation error:', err.message);
      },
      { timeout: 8000 }
    );
  };

  // Filter medicines
  const filteredMedicines = useMemo(() => {
    return searchMedicines(searchQuery, selectedCategory);
  }, [searchQuery, selectedCategory]);

  // Filter & sort pharmacies
  const filteredPharmacies = useMemo(() => {
    let list = NEARBY_PHARMACIES.map((p) => {
      let dist = p.distanceKm;
      if (userLocation) {
        dist = calculateDistanceKm(userLocation.lat, userLocation.lng, p.lat, p.lng);
      }
      return { ...p, distanceKm: dist };
    });

    if (selectedDistrict !== 'All Districts (सभी जिले)') {
      list = list.filter((p) => p.district.toLowerCase() === selectedDistrict.toLowerCase());
    }

    if (shopTypeFilter !== 'ALL') {
      list = list.filter((p) => p.type === shopTypeFilter);
    }

    // Sort by distance if userLocation is available, else keep default order
    if (userLocation) {
      list.sort((a, b) => (a.distanceKm || 999) - (b.distanceKm || 999));
    }

    return list;
  }, [userLocation, selectedDistrict, shopTypeFilter]);

  const quickSearchPills = [
    { label: 'बुखार (Fever)', query: 'bukhar' },
    { label: 'पेट गैस / एसिडिटी', query: 'gas' },
    { label: 'मधुमेह / शुगर', query: 'sugar' },
    { label: 'हाई बीपी (Blood Pressure)', query: 'bp' },
    { label: 'खांसी (Cough)', query: 'khansi' },
    { label: 'उल्टी / दस्त (ORS)', query: 'dast' },
    { label: 'दर्द / मरोड़', query: 'pet dard' },
    { label: 'घाव / मरहम', query: 'chot' },
  ];

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] flex flex-col lg:flex-row antialiased">
      {/* Sidebar Navigation */}
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

            {/* Active Link: Medicine & Medical Shops */}
            <Link
              href="/medicines"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <Pill className="w-4 h-4 text-white" />
              <span>Medicines & Shops</span>
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
          </nav>
        </div>

        <div className="pt-6 border-t border-[#D9F5EA]">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-center space-y-1">
            <Heart className="w-5 h-5 text-[#0D9B75] fill-[#0D9B75] mx-auto" />
            <div className="text-xs font-black text-[#16352D]">Swasth Gaon • Sashakt Bharat</div>
            <div className="text-[11px] text-[#3E6157]">जन औषधि - सेवा भी, रोज़गार भी</div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Top Breadcrumb & Back Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-2 border-b border-[#D9F5EA]">
          <div className="flex items-center gap-2 text-sm text-[#3E6157]">
            <Link
              href="/dashboard"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-[#D9F5EA] hover:bg-[#D9F5EA] text-[#16352D] font-bold transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-4 h-4 text-[#0D9B75]" />
              <span>डैशबोर्ड (Back)</span>
            </Link>
            <span>/</span>
            <span className="font-semibold text-[#16352D]">दवा एवं मेडिकल स्टोर निर्देशिका</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#D9F5EA] text-[#0D9B75] border border-[#0D9B75]/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#0D9B75] animate-pulse"></span>
              जन औषधि मूल्य सत्यापन (PMBJP Generic Pricing)
            </span>
          </div>
        </div>

        {/* Hero Section Banner */}
        <div className="bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#08694F] text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
          <div className="relative z-10 max-w-3xl space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-black border border-emerald-500/30">
              <Pill className="w-3.5 h-3.5" />
              <span>सुलभ स्वास्थ्य व सस्ती दवाइयां</span>
            </div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight">
              दवा जानकारी व निकटतम मेडिकल स्टोर / क्लिनिक
            </h1>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
              किसी भी बीमारी, लक्षण या शारीरिक समस्या का नाम लिखकर आवश्यक दवा, सही खुराक, सावधानियां एवं जन औषधि केंद्र की सस्ती जेनेरिक कीमत जानें। साथ ही अपने सबसे नजदीकी 24 घंटे खुले मेडिकल स्टोर व सरकारी दवा काउंटर खोजें।
            </p>
          </div>
          {/* Subtle Decorative Background Element */}
          <div className="absolute right-0 bottom-0 translate-x-12 translate-y-12 opacity-10 pointer-events-none">
            <Pill className="w-80 h-80 text-white" />
          </div>
        </div>

        {/* Main Tab Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2.5 rounded-2xl border border-slate-200 shadow-2xs">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('medicines')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'medicines'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Pill className="w-4 h-4" />
              <span>1. बीमारी अनुसार दवा खोजें ({filteredMedicines.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('shops')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                activeTab === 'shops'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <MapPin className="w-4 h-4" />
              <span>2. नजदीकी मेडिकल स्टोर व क्लिनिक ({filteredPharmacies.length})</span>
            </button>
          </div>

          {activeTab === 'shops' && (
            <button
              onClick={requestUserLocation}
              disabled={isLocating}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-black bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 transition-colors"
            >
              <Navigation className={`w-3.5 h-3.5 text-emerald-600 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? 'स्थान खोज रहे हैं...' : 'मेरा GPS स्थान उपयोग करें (Locate Me)'}</span>
            </button>
          )}
        </div>

        {/* ================= TAB 1: MEDICINE DIRECTORY ================= */}
        {activeTab === 'medicines' && (
          <div className="space-y-6">
            {/* Search Bar & Quick Problem Chips */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="relative">
                <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="बीमारी, लक्षण या दवा का नाम लिखें (उदा: बुखार, खांसी, गैस, शुगर, Dolo, Pan 40, BP, चोट)..."
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl border border-slate-200 bg-slate-50/60 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-800 text-sm sm:text-base transition-all"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-700 bg-slate-200 px-2 py-1 rounded-md"
                  >
                    Clear
                  </button>
                )}
              </div>

              {/* Quick Symptom Chips */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-xs font-bold text-slate-500 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  त्वरित खोजें:
                </span>
                {quickSearchPills.map((pill) => (
                  <button
                    key={pill.query}
                    onClick={() => setSearchQuery(pill.query)}
                    className="px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 hover:bg-emerald-100 hover:text-emerald-900 text-slate-700 transition-colors border border-slate-200/80"
                  >
                    {pill.label}
                  </button>
                ))}
              </div>

              {/* Category Filter Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-2 no-scrollbar">
                {MEDICINE_CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                      selectedCategory === cat
                        ? 'bg-[#0D9B75] text-white shadow-xs'
                        : 'bg-[#F4FAF7] text-[#16352D] border border-[#D9F5EA] hover:bg-[#D9F5EA]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Results Counter & Advisory */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-slate-500 px-1">
              <span>
                कुल <strong>{filteredMedicines.length}</strong> दवाइयां उपलब्ध हैं
              </span>
              <span className="flex items-center gap-1 text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200/60 font-medium">
                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                यह जानकारी केवल प्राथमिक परामर्श हेतु है। गंभीर स्थिति में तुरंत डॉक्टर को दिखाएं।
              </span>
            </div>

            {/* Medicine Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredMedicines.map((med) => (
                <div
                  key={med.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header: Indication + OTC Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {med.category}
                        </span>
                        {med.prescriptionType === 'OTC' ? (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-200">
                            OTC (बिना पर्ची के उपलब्ध)
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-md text-[11px] font-black bg-amber-100 text-amber-800 border border-amber-200">
                            Rx (डॉक्टर की पर्ची आवश्यक)
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Hindi Name & Generic Salt */}
                    <div>
                      <h3 className="text-lg font-black text-slate-900">{med.hindiName}</h3>
                      <p className="text-xs font-bold text-emerald-700">{med.genericName}</p>
                    </div>

                    {/* Popular Brand Names */}
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-slate-500">प्रसिद्ध ब्रांड:</span>
                      {med.brandNames.map((brand) => (
                        <span
                          key={brand}
                          className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold border border-slate-200"
                        >
                          {brand}
                        </span>
                      ))}
                    </div>

                    {/* Treating Conditions (बीमारी / समस्याएं) */}
                    <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
                      <div className="text-xs font-bold text-slate-700 flex items-center gap-1">
                        <Tag className="w-3.5 h-3.5 text-emerald-600" />
                        <span>किन समस्याओं में उपयोग की जाती है:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {med.treatingConditionsHi.map((c) => (
                          <span
                            key={c}
                            className="px-2 py-0.5 rounded-full text-xs font-semibold bg-white text-slate-800 border border-slate-200 shadow-2xs"
                          >
                            ✓ {c}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing Comparison (Jan Aushadhi vs Market) */}
                    <div className="p-3.5 rounded-2xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                          <TrendingDown className="w-3.5 h-3.5 text-emerald-600" />
                          सस्ती जेनेरिक कीमत (Jan Aushadhi PMBJP)
                        </span>
                        <span className="text-xs font-black text-emerald-700 bg-white px-2 py-0.5 rounded-full border border-emerald-300">
                          60% - 85% बचत
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between pt-0.5">
                        <div className="text-base font-black text-emerald-900">{med.janAushadhiPrice}</div>
                        <div className="text-xs text-slate-500 line-through">
                          बाजार ब्रांडेड मूल्य: {med.marketPrice}
                        </div>
                      </div>
                    </div>

                    {/* Dosage / खुराक */}
                    <div className="space-y-1 pt-1">
                      <div className="text-xs font-bold text-slate-700">💊 सही खुराक एवं सेवन विधि:</div>
                      <p className="text-xs text-slate-600 leading-relaxed bg-white p-2.5 rounded-xl border border-slate-100">
                        {med.dosageHi}
                      </p>
                    </div>

                    {/* Precautions / सावधानियां */}
                    <div className="space-y-1">
                      <div className="text-xs font-bold text-rose-800 flex items-center gap-1">
                        <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                        <span>सावधानियां व चेतावनी:</span>
                      </div>
                      <p className="text-xs text-rose-900 bg-rose-50/70 p-2.5 rounded-xl border border-rose-200/60 leading-relaxed">
                        {med.warningsHi}
                      </p>
                    </div>
                  </div>

                  {/* Footer Action: Find Nearby Medical Store */}
                  <div className="pt-2 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setActiveTab('shops');
                        window.scrollTo({ top: 350, behavior: 'smooth' });
                      }}
                      className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-black bg-[#0D9B75] text-white hover:bg-[#0A8262] transition-colors shadow-2xs cursor-pointer"
                    >
                      <MapPin className="w-3.5 h-3.5 text-white" />
                      <span>यह दवा नजदीकी मेडिकल स्टोर पर खोजें</span>
                      <ChevronRight className="w-3.5 h-3.5 text-white/70" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {filteredMedicines.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Pill className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">कोई दवा नहीं मिली</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  कृपया किसी अन्य बीमारी या लक्षण का नाम लिखें, अथवा ऊपर दिए गए त्वरित खोज बटनों पर क्लिक करें।
                </p>
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('All');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  सभी दवाइयां देखें
                </button>
              </div>
            )}
          </div>
        )}

        {/* ================= TAB 2: NEARBY PHARMACIES & CLINICS ================= */}
        {activeTab === 'shops' && (
          <div className="space-y-6">
            {/* Filters Bar: District, Shop Type & Live GPS status */}
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                {/* District Dropdown */}
                <div className="w-full md:w-1/2 space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                    <span>जिला या शहर चुनें (Filter by District):</span>
                  </label>
                  <select
                    value={selectedDistrict}
                    onChange={(e) => setSelectedDistrict(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    {DISTRICT_LIST.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist}
                      </option>
                    ))}
                  </select>
                </div>

                {/* GPS Status indicator */}
                <div className="w-full md:w-1/2 flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200/80">
                  <div className="space-y-0.5">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      <span>स्थान स्थिति (GPS Status):</span>
                    </div>
                    <div className="text-[11px] text-slate-500">
                      {locationStatus || 'लाइव दूरी देखने हेतु GPS चालू करें'}
                    </div>
                  </div>
                  <button
                    onClick={requestUserLocation}
                    disabled={isLocating}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 shadow-2xs shrink-0"
                  >
                    {userLocation ? 'GPS अपडेट करें' : 'GPS चालू करें'}
                  </button>
                </div>
              </div>

              {/* Shop Type Filter Buttons */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 no-scrollbar">
                <button
                  onClick={() => setShopTypeFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    shopTypeFilter === 'ALL'
                      ? 'bg-[#0D9B75] text-white shadow-xs'
                      : 'bg-[#F4FAF7] text-[#16352D] border border-[#D9F5EA] hover:bg-[#D9F5EA]'
                  }`}
                >
                  सभी दुकानें व क्लिनिक (All)
                </button>
                <button
                  onClick={() => setShopTypeFilter('JAN_AUSHADHI')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    shopTypeFilter === 'JAN_AUSHADHI'
                      ? 'bg-[#0D9B75] text-white shadow-xs'
                      : 'bg-[#D9F5EA] text-[#0D9B75] hover:bg-[#B8EBD7] border border-[#0D9B75]/30'
                  }`}
                >
                  🟢 जन औषधि केंद्र (PMBJP)
                </button>
                <button
                  onClick={() => setShopTypeFilter('CHEMIST_24X7')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    shopTypeFilter === 'CHEMIST_24X7'
                      ? 'bg-rose-600 text-white shadow-xs'
                      : 'bg-rose-50 text-rose-800 hover:bg-rose-100 border border-rose-200'
                  }`}
                >
                  🔴 24x7 इमरजेंसी मेडिकल स्टोर
                </button>
                <button
                  onClick={() => setShopTypeFilter('PHC_DISPENSARY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    shopTypeFilter === 'PHC_DISPENSARY'
                      ? 'bg-teal-700 text-white shadow-xs'
                      : 'bg-teal-50 text-teal-800 hover:bg-teal-100 border border-teal-200'
                  }`}
                >
                  🏥 सरकारी अस्पताल व PHC दवा काउंटर
                </button>
                <button
                  onClick={() => setShopTypeFilter('CLINIC_PHARMACY')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                    shopTypeFilter === 'CLINIC_PHARMACY'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'bg-blue-50 text-blue-800 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  🩺 क्लिनिक व डे-केयर फार्मेसी
                </button>
              </div>
            </div>

            {/* Pharmacies & Clinics List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {filteredPharmacies.map((shop) => (
                <div
                  key={shop.id}
                  className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    {/* Header badge & Rating */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {shop.type === 'JAN_AUSHADHI' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                            🟢 जन औषधि केंद्र (PMBJP)
                          </span>
                        )}
                        {shop.type === 'CHEMIST_24X7' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-rose-100 text-rose-800 border border-rose-300">
                            🔴 24x7 इमरजेंसी स्टोर
                          </span>
                        )}
                        {shop.type === 'PHC_DISPENSARY' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-teal-100 text-teal-800 border border-teal-300">
                            🏥 सरकारी अस्पताल (नि:शुल्क दवा)
                          </span>
                        )}
                        {shop.type === 'CLINIC_PHARMACY' && (
                          <span className="px-2.5 py-0.5 rounded-md text-[11px] font-black bg-blue-100 text-blue-800 border border-blue-300">
                            🩺 डॉक्टर क्लिनिक व दवा दुकान
                          </span>
                        )}
                      </div>

                      {shop.distanceKm !== undefined && (
                        <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-[#16352D] text-white text-xs font-black shadow-2xs">
                          <Navigation className="w-3 h-3 text-[#0D9B75]" />
                          <span>{shop.distanceKm} किमी दूर</span>
                        </div>
                      )}
                    </div>

                    {/* Shop Name */}
                    <div>
                      <h3 className="text-base sm:text-lg font-black text-slate-900 leading-snug">
                        {shop.nameHi}
                      </h3>
                      <p className="text-xs font-semibold text-slate-500">{shop.name}</p>
                    </div>

                    {/* Address & Landmark */}
                    <div className="flex items-start gap-2 text-xs text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <div>
                        <div className="font-semibold text-slate-800">{shop.addressHi}</div>
                        <div className="text-[11px] text-slate-500 pt-0.5">
                          पिनकोड: {shop.pincode} • जिला: {shop.district}, {shop.state}
                        </div>
                      </div>
                    </div>

                    {/* Timings */}
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                      <span>खुलने का समय:</span>
                      <span className="font-semibold text-slate-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200/60">
                        {shop.openHoursHi}
                      </span>
                    </div>

                    {/* Services / Available Facilities */}
                    <div className="space-y-1.5 pt-1">
                      <div className="text-xs font-bold text-slate-600">उपलब्ध सुविधाएं:</div>
                      <div className="flex flex-wrap gap-1.5">
                        {shop.services.map((srv) => (
                          <span
                            key={srv}
                            className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60"
                          >
                            ✓ {srv}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Actions: Call & Google Maps Directions */}
                  <div className="grid grid-cols-2 gap-2 pt-3 border-t border-slate-100">
                    <a
                      href={`tel:${shop.phone}`}
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors shadow-2xs"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>कॉल करें ({shop.phone})</span>
                    </a>

                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shop.lat},${shop.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl text-xs font-bold bg-[#16352D] text-white hover:bg-[#0F2520] transition-colors shadow-2xs cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5 text-[#0D9B75]" />
                      <span>गूगल मैप्स पर रास्ता देखें</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>

            {filteredPharmacies.length === 0 && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <Building2 className="w-12 h-12 text-slate-300 mx-auto" />
                <h3 className="text-base font-bold text-slate-800">इस जिले में कोई स्टोर नहीं मिला</h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  कृपया 'All Districts (सभी जिले)' चुनें अथवा अन्य फिल्टर बदलकर खोजें।
                </p>
                <button
                  onClick={() => {
                    setSelectedDistrict('All Districts (सभी जिले)');
                    setShopTypeFilter('ALL');
                  }}
                  className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  सभी मेडिकल स्टोर देखें
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}


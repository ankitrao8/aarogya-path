'use client';

import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  Download,
  FileText,
  Heart,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Maximize2,
  Mic,
  MicOff,
  PhoneCall,
  PhoneOff,
  Pill,
  Send,
  Settings,
  Sparkles,
  Stethoscope,
  User,
  Video,
  VideoOff,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function TeleconsultationPage() {
  const { t } = useTranslation();
  const [callActive, setCallActive] = useState(true);
  const [micMuted, setMicMuted] = useState(false);
  const [videoDisabled, setVideoDisabled] = useState(false);
  const [callSeconds, setCallSeconds] = useState(754); // 12m 34s
  const [showRxModal, setShowRxModal] = useState(false);

  useEffect(() => {
    if (!callActive) return;
    const interval = setInterval(() => {
      setCallSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [callActive]);

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleDownloadRx = () => {
    setShowRxModal(true);
  };

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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <MapPin className="w-4 h-4 text-[#3E6157]" />
              <span>Nearby Doctors</span>
            </Link>

            <Link
              href="/teleconsultation"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <Video className="w-4 h-4 text-white" />
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
            <div className="text-xs font-black text-[#16352D]">Live Telemedicine</div>
            <p className="text-[10px] text-[#3E6157]">Govt. E-Sanjeevani Integrated</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Video Call & Live Prescription Interface */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-7xl">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="p-2.5 rounded-xl bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5 text-[#0D9B75]" />
            </Link>
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-[#16352D]">Video Consultation</h1>
              <p className="text-xs text-[#3E6157] font-medium">
                Connected with Community Health Centre (CHC) Telemedicine Desk
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#D9F5EA] border border-[#0D9B75]/30 text-[#0D9B75] text-xs font-bold">
              <span className="w-2.5 h-2.5 rounded-full bg-[#0D9B75] animate-ping" />
              <span>Live • {formatTimer(callSeconds)}</span>
            </div>
            <a
              href="tel:108"
              className="px-3.5 py-1.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black"
            >
              Emergency 108
            </a>
          </div>
        </div>

        {/* Video Screen & Prescription Split (Section 8 & 10) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Main Video Call Frame (Col 8) */}
          <div className="lg:col-span-8 bg-[#041512] rounded-3xl border-2 border-emerald-500/30 overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[480px]">
            {/* Top Doctor Info Pill */}
            <div className="absolute top-4 left-4 z-20 flex items-center gap-3 px-4 py-2 rounded-2xl bg-black/60 backdrop-blur-md border border-white/10">
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
              <div>
                <div className="font-bold text-xs text-white">Dr. Rahul Sharma (MBBS, MD)</div>
                <div className="text-[10px] text-emerald-300">General Physician • Gorakhpur CHC</div>
              </div>
            </div>

            {/* Top Right Fullscreen Button */}
            <button
              onClick={() => {}}
              className="absolute top-4 right-4 z-20 p-2 rounded-xl bg-black/60 backdrop-blur-md text-white/80 hover:text-white"
            >
              <Maximize2 className="w-4 h-4" />
            </button>

            {/* Doctor Video Feed */}
            {callActive ? (
              <div className="relative w-full h-[480px] bg-black">
                <img
                  src="/images/teleconsult-doctor.jpg"
                  alt="Doctor video consultation feed"
                  className="w-full h-full object-cover"
                />

                {/* Patient Camera Self-Preview Thumbnail (Picture-in-Picture) */}
                <div className="absolute bottom-20 right-4 w-32 h-44 rounded-2xl overflow-hidden border-2 border-emerald-400 shadow-xl bg-slate-900 z-20">
                  <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-950 flex flex-col items-center justify-center p-2 text-center">
                    <User className="w-10 h-10 text-emerald-400 mb-1" />
                    <span className="text-[10px] font-bold text-white">Ankit Rao</span>
                    <span className="text-[9px] text-emerald-300">You (Patient)</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-[480px] flex flex-col items-center justify-center text-center p-6 space-y-3">
                <div className="w-16 h-16 rounded-full bg-red-500/20 text-red-400 flex items-center justify-center">
                  <PhoneOff className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Consultation Ended</h3>
                <p className="text-xs text-slate-400">Total duration: {formatTimer(callSeconds)}</p>
                <button
                  onClick={() => setCallActive(true)}
                  className="px-6 py-2.5 rounded-xl gradient-emerald-btn font-bold text-xs"
                >
                  Reconnect
                </button>
              </div>
            )}

            {/* Bottom Call Control Action Bar */}
            <div className="p-4 bg-black/75 backdrop-blur-md border-t border-white/10 flex items-center justify-center gap-4 z-20">
              <button
                onClick={() => setMicMuted(!micMuted)}
                className={`p-3.5 rounded-2xl transition-all ${
                  micMuted
                    ? 'bg-red-500 text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={micMuted ? 'Unmute Mic' : 'Mute Mic'}
              >
                {micMuted ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setVideoDisabled(!videoDisabled)}
                className={`p-3.5 rounded-2xl transition-all ${
                  videoDisabled
                    ? 'bg-red-500 text-white'
                    : 'bg-white/15 hover:bg-white/25 text-white'
                }`}
                title={videoDisabled ? 'Enable Video' : 'Disable Video'}
              >
                {videoDisabled ? <VideoOff className="w-5 h-5" /> : <Video className="w-5 h-5" />}
              </button>

              <button
                onClick={() => setCallActive(false)}
                className="p-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white shadow-lg transition-transform active:scale-95"
                title="End Consultation"
              >
                <PhoneOff className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Right Live Prescription & Notes Drawer (Col 4) */}
          <div className="lg:col-span-4 bg-white rounded-3xl border border-[#D9F5EA] p-6 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9F5EA] pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#0D9B75]" />
                <h3 className="font-black text-[#16352D] text-base">Your Prescription</h3>
              </div>
              <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-[#D9F5EA] text-[#0D9B75]">
                Live Sync
              </span>
            </div>

            {/* Prescribed Medicines List */}
            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#16352D]">Tab. Paracetamol 500mg</span>
                  <span className="text-xs font-bold text-[#0D9B75]">1-0-1</span>
                </div>
                <div className="text-[11px] text-[#3E6157]">
                  Take after food • 5 days (as advised for fever & pain)
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-[#16352D]">ORS Hydration Solution</span>
                  <span className="text-xs font-bold text-[#0D9B75]">1 sachet / 1L</span>
                </div>
                <div className="text-[11px] text-[#3E6157]">
                  Sip throughout the day for electrolytes
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] space-y-1">
                <div className="font-extrabold text-sm text-[#16352D]">Rest & Hydration Advice</div>
                <p className="text-[11px] text-[#3E6157] leading-relaxed">
                  Adequate bed rest. Avoid cold food and drinks.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="p-3.5 rounded-2xl bg-[#D9F5EA]/40 border border-[#D9F5EA] space-y-1">
              <div className="font-bold text-xs text-[#0D9B75] flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#0D9B75]" />
                <span>Next Steps:</span>
              </div>
              <p className="text-[11px] text-[#3E6157] leading-relaxed">
                Follow up in 3 days if fever does not subside or if temperature exceeds 102°F.
              </p>
            </div>

            {/* Download Prescription CTA */}
            <button
              onClick={handleDownloadRx}
              className="w-full gradient-emerald-btn py-3.5 rounded-xl font-black text-xs flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download Signed Prescription</span>
            </button>
          </div>
        </div>

        {/* Prescription Modal Preview */}
        {showRxModal && (
          <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b pb-4">
                <Logo size="sm" />
                <span className="text-xs font-bold text-slate-500">Rx Slip #AP-2026-8841</span>
              </div>

              <div className="space-y-3 text-xs">
                <div className="flex justify-between font-bold text-slate-700">
                  <span>Patient: Ankit Rao (35y / M)</span>
                  <span>Date: 26 Oct 2026</span>
                </div>
                <div className="text-slate-600">
                  Doctor: Dr. Rahul Sharma (MBBS, MD) • Registration: MCI-84920
                </div>
                <hr className="my-2" />
                <div className="font-extrabold text-sm text-slate-900">Rx Medications:</div>
                <ol className="list-decimal list-inside space-y-1 font-medium text-slate-800">
                  <li>Tab. Paracetamol 500mg — 1 tablet morning and night after food for 5 days.</li>
                  <li>ORS Hydration Sachet — 1 packet mixed in 1 Liter clean water daily.</li>
                  <li>Adequate bed rest and temperature tracking.</li>
                </ol>
              </div>

              <div className="flex gap-3 pt-4 border-t">
                <button
                  onClick={() => alert('Prescription downloaded to device as PDF.')}
                  className="flex-1 gradient-emerald-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Save as PDF</span>
                </button>
                <button
                  onClick={() => setShowRxModal(false)}
                  className="px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

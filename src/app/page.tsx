'use client';

import { useTranslation } from '@/lib/i18n';
import {
  Activity,
  ArrowRight,
  CheckCircle2,
  Clock,
  Heart,
  HeartPulse,
  Lock,
  MapPin,
  Mic,
  PhoneCall,
  Play,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Users,
  Video,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const { language, t } = useTranslation();
  const router = useRouter();

  const handleQuickLogin = async (identifier: string, role: string) => {
    try {
      const password =
        role === 'ASHA'
          ? 'Asha@123'
          : role === 'DOCTOR'
          ? 'Doctor@123'
          : role === 'ADMIN'
          ? 'Admin@123'
          : 'Aarogya@123';

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      if (res.ok) {
        if (role === 'ASHA') router.push('/asha/dashboard');
        else if (role === 'DOCTOR') router.push('/doctor/dashboard');
        else if (role === 'ADMIN') router.push('/admin/dashboard');
        else router.push('/dashboard');
        router.refresh();
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="bg-[#F4FAF7] text-[#16352D] min-h-screen overflow-x-hidden">
      {/* 1. Cinematic Hero Section (Emerald Green + White) */}
      <section className="relative pt-8 pb-16 md:pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-b from-white via-[#F4FAF7] to-[#F4FAF7]">
        {/* Subtle Ambient Background Accents */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D9F5EA]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/3 right-10 w-96 h-96 bg-[#0D9B75]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto">
          {/* Top Tagline Badges */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#D9F5EA] border border-[#0D9B75]/30 text-[#0D9B75] text-xs sm:text-sm font-bold tracking-wide shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-[#0D9B75] animate-ping" />
              <span>AI + Healthcare | Rural India</span>
            </div>

            <div className="text-right">
              <span className="text-[#0D9B75] font-serif italic text-base sm:text-lg tracking-wide font-semibold">
                Swasth Gaon • Sashakt Bharat
              </span>
            </div>
          </div>

          {/* Main Hero Split Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            {/* Left Content Column */}
            <div className="lg:col-span-7 space-y-6 text-left">
              <div className="space-y-2">
                <span className="text-[#0D9B75] font-extrabold text-lg sm:text-xl tracking-wider uppercase block">
                  Aarogya Path
                </span>
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.15] text-[#16352D]">
                  {language === 'bho' ? (
                    <>
                      स्वस्थ गाँव खातिर{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#16352D]">
                        सही आ सुगम इलाज
                      </span>
                    </>
                  ) : language === 'hi' ? (
                    <>
                      स्वस्थ गाँव के लिए{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#16352D]">
                        सुलभ व सही स्वास्थ्य सेवा
                      </span>
                    </>
                  ) : (
                    <>
                      Smarter Health Access for a{' '}
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#16352D]">
                        Healthier Tomorrow
                      </span>
                    </>
                  )}
                </h1>
              </div>

              <p className="text-[#3E6157] text-base sm:text-xl leading-relaxed max-w-xl font-medium">
                {language === 'bho'
                  ? 'गांव-देहात खातिर एआई आधारित टेलीहेल्थ मंच, जवन सही समय पर सही अस्पताल आ डॉक्टर के रास्ता देखावेला।'
                  : language === 'hi'
                    ? 'ग्रामीण भारत के लिए एआई संचालित स्वास्थ्य मंच, जो सही समय पर सही अस्पताल और डॉक्टर का मार्ग दिखाता है।'
                    : 'AI-powered telehealth platform that helps rural communities get the right care, at the right time.'}
              </p>

              {/* Primary Call to Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  href="/triage"
                  className="gradient-emerald-btn px-8 py-4 rounded-2xl font-black text-base sm:text-lg flex items-center gap-3 glow-emerald transition-all"
                >
                  <Sparkles className="w-5 h-5 text-white" />
                  <span>{language === 'bho' ? 'जांच शुरू करीं' : language === 'hi' ? 'जांच शुरू करें' : 'Start Checking'}</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>

                <Link
                  href="/dashboard"
                  className="px-6 py-4 rounded-2xl font-bold text-base bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] shadow-xs transition-colors flex items-center gap-2"
                >
                  <span>{language === 'bho' ? 'डैशबोर्ड देखीं' : language === 'hi' ? 'डैशबोर्ड देखें' : 'Explore Dashboard'}</span>
                </Link>
              </div>

              {/* Micro Tagline */}
              <div className="pt-2 flex items-center gap-2 text-xs text-[#0D9B75] font-bold">
                <CheckCircle2 className="w-4 h-4 text-[#0D9B75] shrink-0" />
                <span>
                  {language === 'bho'
                    ? 'सही समे पर सही इलाज • 100% नि:शुल्क आ गोपनीय'
                    : 'सही समय पर सही इलाज • 100% नि:शुल्क एवं गोपनीय'}
                </span>
              </div>
            </div>

            {/* Right Visual Image Column */}
            <div className="lg:col-span-5 relative">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D9F5EA] shadow-xl group bg-white">
                <img
                  src="/images/hero-doctor.jpg"
                  alt="Compassionate Rural Telehealth Doctor in India examining a patient"
                  className="w-full h-[360px] sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#16352D]/80 via-transparent to-transparent opacity-70" />

                {/* Floating Verified Trust Pill */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#D9F5EA] shadow-md flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#D9F5EA] text-[#0D9B75] flex items-center justify-center font-bold">
                      <Stethoscope className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#16352D]">Dr. Priya & Medical Network</div>
                      <div className="text-[11px] text-[#3E6157] font-medium">PHC & District Health Connectivity</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-[#D9F5EA] text-[#0D9B75] text-[10px] font-black uppercase tracking-wider">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 4 Bottom Quick-Action Feature Cards */}
          <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              href="/triage"
              className="p-5 rounded-2xl bg-white hover:bg-[#D9F5EA]/30 border border-[#D9F5EA] transition-all duration-200 hover:-translate-y-1 shadow-sm group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#D9F5EA] text-[#0D9B75] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#16352D] text-base group-hover:text-[#0D9B75] transition-colors">
                    {language === 'bho' ? 'लक्षण जांच (Triage)' : language === 'hi' ? 'लक्षण जांच' : 'AI Symptom Checker'}
                  </h3>
                  <p className="text-xs text-[#3E6157] mt-1">
                    {language === 'bho' ? 'तुरंत जांच आ सलाह पाईं' : language === 'hi' ? 'तुरंत जांच व सलाह पाएं' : 'Get instant guidance and smart triage'}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/facilities"
              className="p-5 rounded-2xl bg-white hover:bg-[#D9F5EA]/30 border border-[#D9F5EA] transition-all duration-200 hover:-translate-y-1 shadow-sm group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#16352D] text-base group-hover:text-sky-700 transition-colors">
                    {language === 'bho' ? 'लगे के डॉक्टर आ अस्पताल' : language === 'hi' ? 'नजदीकी डॉक्टर व अस्पताल' : 'Find Nearby Doctors'}
                  </h3>
                  <p className="text-xs text-[#3E6157] mt-1">
                    {language === 'bho' ? 'पीएचसी, सीएचसी आ जिला अस्पताल' : 'PHC, CHC & District Hospitals'}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/medicines"
              className="p-5 rounded-2xl bg-white hover:bg-[#D9F5EA]/30 border border-[#D9F5EA] transition-all duration-200 hover:-translate-y-1 shadow-sm group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-[#0D9B75] flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#16352D] text-base group-hover:text-[#0D9B75] transition-colors">
                    {language === 'bho' ? 'दवा आ मेडिकल स्टोर' : language === 'hi' ? 'दवाइयां और मेडिकल स्टोर' : 'Medicines & Stores'}
                  </h3>
                  <p className="text-xs text-[#3E6157] mt-1">
                    {language === 'bho' ? 'जन औषधि दाम आ 24x7 दुकान' : 'Jan Aushadhi prices & 24x7 shops'}
                  </p>
                </div>
              </div>
            </Link>

            <Link
              href="/patient/records"
              className="p-5 rounded-2xl bg-white hover:bg-[#D9F5EA]/30 border border-[#D9F5EA] transition-all duration-200 hover:-translate-y-1 shadow-sm group block"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                  <HeartPulse className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-[#16352D] text-base group-hover:text-amber-700 transition-colors">
                    {language === 'bho' ? 'स्वास्थ्य इतिहास' : language === 'hi' ? 'स्वास्थ्य रिकॉर्ड' : 'Health Records'}
                  </h3>
                  <p className="text-xs text-[#3E6157] mt-1">
                    {language === 'bho' ? 'जांच पर्ची आ पुराना रिपोर्ट' : 'Access reports & prescriptions'}
                  </p>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Key Metrics & Impact Bar */}
      <section className="bg-white border-y border-[#D9F5EA] py-10 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-[#0D9B75]">1,200+</div>
            <div className="text-xs sm:text-sm text-[#3E6157] font-bold uppercase tracking-wider">
              Villages Connected
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-sky-600">85+</div>
            <div className="text-xs sm:text-sm text-[#3E6157] font-bold uppercase tracking-wider">
              Doctors Available
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-amber-600">&lt; 5 mins</div>
            <div className="text-xs sm:text-sm text-[#3E6157] font-bold uppercase tracking-wider">
              Avg Response Time
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl sm:text-4xl font-black text-purple-600">92%</div>
            <div className="text-xs sm:text-sm text-[#3E6157] font-bold uppercase tracking-wider">
              AI Triage Accuracy
            </div>
          </div>
        </div>
      </section>

      {/* 3. Emergency Dial 108 Callout */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-red-600 to-rose-600 border border-red-500/40 rounded-3xl p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6 text-white">
          <div className="flex items-center gap-4 text-center md:text-left">
            <div className="w-14 h-14 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <PhoneCall className="w-8 h-8 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                गंभीर आपातकाल में सीधे 108 या 112 डायल करें
              </h2>
              <p className="text-red-100 text-sm mt-0.5">
                सीने में तेज दर्द, सांस न आना, भारी रक्तस्राव या बेहोशी में बिना देर किए तुरंत एम्बुलेंस बुलाएं।
              </p>
            </div>
          </div>

          <a
            href="tel:108"
            className="w-full md:w-auto text-center bg-white text-red-700 hover:bg-red-50 font-black text-lg px-8 py-3.5 rounded-2xl shadow-md transition-transform active:scale-95 shrink-0"
          >
            कॉल 108 (Toll Free)
          </a>
        </div>
      </section>

      {/* 4. Alternate Design Banner: Healthcare Reaches Further */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="rounded-3xl bg-white border border-[#D9F5EA] p-8 sm:p-12 overflow-hidden relative shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-[#0D9B75] text-xs font-black uppercase tracking-widest bg-[#D9F5EA] px-3 py-1 rounded-full inline-block">
                Sehat Har Ghar Tak • Aarogya Path Ke Saath
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#16352D] leading-tight">
                Healthcare Reaches Further with{' '}
                <span className="text-[#0D9B75]">Aarogya Path</span>
              </h2>
              <p className="text-[#3E6157] text-base leading-relaxed">
                Empowering village citizens and ASHA workers with AI-backed triage, verified clinical referral pathways, and instant doctor consultations even on 2G/3G networks.
              </p>

              <div className="pt-2 flex flex-wrap gap-4">
                <Link
                  href="/dashboard"
                  className="gradient-emerald-btn px-6 py-3.5 rounded-xl font-black text-sm flex items-center gap-2"
                >
                  <span>Open Patient Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/teleconsultation"
                  className="px-6 py-3.5 rounded-xl font-bold text-sm bg-[#D9F5EA] hover:bg-[#B8EBD7] text-[#16352D] border border-[#0D9B75]/20 flex items-center gap-2"
                >
                  <Video className="w-4 h-4 text-[#0D9B75]" />
                  <span>Start Teleconsultation</span>
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <img
                src="/images/phc-community.jpg"
                alt="Village Health Center"
                className="rounded-2xl border border-[#D9F5EA] shadow-xl max-h-72 object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 5. 1-Click Demo Login Panel (Fast Testing) */}
      <section className="max-w-7xl mx-auto px-4 py-8 pb-16">
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-sm">
          <div className="text-center max-w-2xl mx-auto mb-6">
            <span className="text-xs font-bold text-[#0D9B75] uppercase tracking-wider bg-[#D9F5EA] px-3 py-1 rounded-full inline-block">
              Quick Role Switcher
            </span>
            <h2 className="text-2xl font-black text-[#16352D] mt-2">
              Explore Aarogya Path as Different Roles
            </h2>
            <p className="text-[#3E6157] text-sm mt-1">
              One-click access to test patient, ASHA community worker, doctor, and admin portals.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <button
              onClick={() => handleQuickLogin('9876543210', 'PATIENT')}
              className="p-4 rounded-2xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-[#D9F5EA] text-[#0D9B75] flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <Users className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-[#16352D] text-base">Patient (Ankit Rao)</div>
              <div className="text-xs text-[#3E6157] mt-1">Self symptom check, records, teleconsult</div>
              <div className="text-[#0D9B75] font-bold text-xs mt-3 flex items-center gap-1">
                <span>Login as Patient</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('9123456780', 'ASHA')}
              className="p-4 rounded-2xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <HeartPulse className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-[#16352D] text-base">ASHA Didi (Sunita Devi)</div>
              <div className="text-xs text-[#3E6157] mt-1">Village patient intake, offline sync, follow-up</div>
              <div className="text-sky-700 font-bold text-xs mt-3 flex items-center gap-1">
                <span>Login as ASHA</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('9876501234', 'DOCTOR')}
              className="p-4 rounded-2xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-[#16352D] text-base">Doctor (Dr. Ramesh)</div>
              <div className="text-xs text-[#3E6157] mt-1">Incoming teleconsults, clinical review & Rx</div>
              <div className="text-purple-700 font-bold text-xs mt-3 flex items-center gap-1">
                <span>Login as Doctor</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>

            <button
              onClick={() => handleQuickLogin('admin@aarogyapath.gov.in', 'ADMIN')}
              className="p-4 rounded-2xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-left transition-all group cursor-pointer"
            >
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold mb-3 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="font-extrabold text-[#16352D] text-base">Health Official / Admin</div>
              <div className="text-xs text-[#3E6157] mt-1">Outbreak heatmaps, red-flag monitoring, audit</div>
              <div className="text-amber-700 font-bold text-xs mt-3 flex items-center gap-1">
                <span>Login as Admin</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

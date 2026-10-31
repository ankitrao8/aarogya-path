'use client';

import { useTranslation } from '@/lib/i18n';
import {
  AlertOctagon,
  AlertTriangle,
  CheckCircle2,
  Clock,
  FileText,
  HeartPulse,
  PhoneCall,
  RefreshCw,
  Stethoscope,
  User,
  Video,
} from 'lucide-react';
import { useEffect, useState } from 'react';

export default function DoctorDashboard() {
  const { t } = useTranslation();

  const [referrals, setReferrals] = useState<any[]>([]);
  const [consults, setConsults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Consult action modal
  const [selectedConsult, setSelectedConsult] = useState<any>(null);
  const [doctorNotes, setDoctorNotes] = useState('');
  const [rxAdvice, setRxAdvice] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Case detail modal
  const [selectedCase, setSelectedCase] = useState<any>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [refRes, conRes] = await Promise.all([
        fetch('/api/referrals'),
        fetch('/api/consults/request'),
      ]);
      const refData = await refRes.json();
      const conData = await conRes.json();

      if (refData.referrals) setReferrals(refData.referrals);
      if (conData.consults) setConsults(conData.consults);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCompleteConsult = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConsult) return;

    setSubmitting(true);
    try {
      const res = await fetch('/api/doctor/consults', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedConsult.id,
          doctorNotes,
          rxAdvice,
          status: 'COMPLETED',
        }),
      });

      if (res.ok) {
        setSelectedConsult(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#F4FAF7] text-[#16352D] min-h-screen">
      {/* Top Doctor Header */}
      <div className="bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#08694F] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#D9F5EA] text-[#16352D] px-3 py-1 rounded-full text-xs font-black uppercase">
            चिकित्सा अधिकारी क्लिनिकल कंसोल (Clinical Hub)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{t('dashboard.doctorTitle')}</h1>
          <p className="text-emerald-100 text-sm max-w-xl">{t('dashboard.doctorSubtitle')}</p>
        </div>

        <button
          onClick={fetchData}
          className="bg-white/20 hover:bg-white/30 text-white font-bold px-4 py-2.5 rounded-xl border border-white/30 flex items-center gap-2 text-sm shrink-0 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          <span>रिफ्रेश (Refresh Queue)</span>
        </button>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">आपातकालीन रेफरल (RED)</span>
          <div className="text-3xl font-black text-red-600 mt-1">
            {referrals.filter((r) => r.level === 'RED').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">आवश्यक केस (ORANGE)</span>
          <div className="text-3xl font-black text-orange-600 mt-1">
            {referrals.filter((r) => r.level === 'ORANGE').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">टेलीकंसल्ट अनुरोध</span>
          <div className="text-3xl font-black text-[#0D9B75] mt-1">
            {consults.filter((c) => c.status === 'REQUESTED').length}
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">पूर्ण परामर्श</span>
          <div className="text-3xl font-black text-[#0D9B75] mt-1">
            {consults.filter((c) => c.status === 'COMPLETED').length}
          </div>
        </div>
      </div>

      {/* Incoming Referrals Table */}
      <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#D9F5EA]">
          <h2 className="text-xl font-black text-[#16352D] flex items-center gap-2">
            <HeartPulse className="w-5 h-5 text-red-600" />
            <span>इनकमिंग रेफरल कतार (Incoming Emergency Referrals)</span>
          </h2>
        </div>

        {referrals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            कोई रेफरल लंबित नहीं है।
          </div>
        ) : (
          <div className="divide-y divide-[#D9F5EA]">
            {referrals.map((ref) => {
              const isRed = ref.level === 'RED';
              const pat = ref.patientProfile?.user;
              let reasonsList: string[] = [];
              try {
                reasonsList = JSON.parse(ref.assessment?.reasons || '[]');
              } catch {}

              return (
                <div key={ref.id} className="p-6 hover:bg-[#F4FAF7] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            isRed ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                          }`}
                        >
                          {ref.level}
                        </span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#D9F5EA] text-[#16352D]">
                          {ref.status}
                        </span>
                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#16352D]">{pat?.name}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        उम्र: {ref.patientProfile?.age} वर्ष • {ref.patientProfile?.sex} • गांव: {pat?.village}, {pat?.district} • फोन: {pat?.phone}
                      </p>

                      {reasonsList.length > 0 && (
                        <p className="text-xs font-semibold text-[#16352D] bg-[#F4FAF7] p-2 rounded-lg border border-[#D9F5EA] inline-block">
                          नैदानिक कारण: {reasonsList[0]}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {pat?.phone && (
                        <a
                          href={`tel:${pat.phone}`}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-xs transition-colors"
                        >
                          <PhoneCall className="w-3.5 h-3.5" />
                          <span>कॉल करें</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => setSelectedCase(ref)}
                        className="px-4 py-2 rounded-xl bg-[#16352D] hover:bg-[#0D9B75] text-white font-bold text-xs transition-colors"
                      >
                        केस विवरण (View Case)
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Teleconsultation Requests Queue */}
      <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#D9F5EA]">
          <h2 className="text-xl font-black text-[#16352D] flex items-center gap-2">
            <Video className="w-5 h-5 text-[#0D9B75]" />
            <span>टेलीकंसल्टेशन अनुरोध (Teleconsultation Queue)</span>
          </h2>
        </div>

        {consults.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            कोई टेलीकंसल्टेशन अनुरोध नहीं है।
          </div>
        ) : (
          <div className="divide-y divide-[#D9F5EA]">
            {consults.map((con) => {
              const pat = con.patientProfile?.user;
              const isCompleted = con.status === 'COMPLETED';

              return (
                <div key={con.id} className="p-6 hover:bg-[#F4FAF7] transition-colors">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-1.5">
                      <div className="flex items-center gap-2.5">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                            isCompleted
                              ? 'bg-[#D9F5EA] text-[#0D9B75] border border-[#0D9B75]/30'
                              : 'bg-[#D9F5EA] text-[#16352D] border border-[#D9F5EA]'
                          }`}
                        >
                          {con.status}
                        </span>

                        <span className="text-xs font-bold text-slate-600">
                          स्लॉट: {con.preferredSlot}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-[#16352D]">{pat?.name}</h3>
                      <p className="text-xs text-slate-600 font-medium">
                        गांव: {pat?.village} • फोन: {pat?.phone}
                      </p>

                      <p className="text-sm font-semibold text-slate-800">
                        मुख्य शिकायत: {con.chiefComplaint}
                      </p>

                      {con.rxAdvice && (
                        <div className="text-xs bg-[#D9F5EA] text-[#16352D] p-2.5 rounded-xl border border-[#0D9B75]/30">
                          <span className="font-bold">डॉक्टर की सलाह / पर्ची: </span>
                          {con.rxAdvice}
                        </div>
                      )}
                    </div>

                    {!isCompleted && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedConsult(con);
                          setDoctorNotes(con.doctorNotes || '');
                          setRxAdvice(con.rxAdvice || '');
                        }}
                        className="px-5 py-2.5 rounded-xl bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-sm shrink-0 shadow-xs transition-colors"
                      >
                        परामर्श दें व पर्ची लिखें
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Consult Advice Modal */}
      {selectedConsult && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#D9F5EA]">
            <h3 className="text-xl font-extrabold text-[#16352D] mb-1">
              टेलीकंसल्टेशन सलाह व पर्ची (Rx Advice)
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              मरीज: {selectedConsult.patientProfile?.user?.name}
            </p>

            <form onSubmit={handleCompleteConsult} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">
                  क्लिनिकल अवलोकन (Clinical Notes):
                </label>
                <textarea
                  rows={2}
                  value={doctorNotes}
                  onChange={(e) => setDoctorNotes(e.target.value)}
                  placeholder="लक्षणों का नैदानिक विश्लेषण..."
                  className="w-full p-3 rounded-xl border border-[#D9F5EA] text-sm font-medium focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">
                  उपचार सलाह व दवा निर्देश (Prescription Advice for Patient/ASHA):
                </label>
                <textarea
                  rows={4}
                  required
                  value={rxAdvice}
                  onChange={(e) => setRxAdvice(e.target.value)}
                  placeholder="उदा. ओआरएस घोल दिन में 3 बार, पैरासिटामोल 500mg बुखार होने पर, यदि सांस फूले तो तुरंत अस्पताल जाएं..."
                  className="w-full p-3 rounded-xl border border-[#D9F5EA] text-sm font-medium focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedConsult(null)}
                  className="flex-1 py-3 font-bold text-[#16352D] bg-[#D9F5EA] hover:bg-[#D9F5EA]/80 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 font-bold text-white bg-[#0D9B75] hover:bg-[#0A8262] rounded-xl shadow-xs transition-colors"
                >
                  {submitting ? 'सुरक्षित हो रहा है...' : 'परामर्श पूर्ण करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Case Details Modal */}
      {selectedCase && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between border-b pb-3">
              <div>
                <span className="text-xs font-black uppercase text-red-600">
                  {selectedCase.level} इमरजेंसी केस विवरण
                </span>
                <h3 className="text-xl font-black text-slate-950">
                  {selectedCase.patientProfile?.user?.name}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="text-slate-400 hover:text-slate-700 font-bold text-xl"
              >
                ✕
              </button>
            </div>

            <div className="text-sm space-y-2 text-slate-700">
              <p>
                <b>उम्र/लिंग:</b> {selectedCase.patientProfile?.age} वर्ष • {selectedCase.patientProfile?.sex}
                {selectedCase.patientProfile?.isPregnant ? ' (गर्भवती)' : ''}
              </p>
              <p>
                <b>पता:</b> {selectedCase.patientProfile?.user?.village}, {selectedCase.patientProfile?.user?.district}
              </p>
              <p>
                <b>पुरानी बीमारियां:</b> {selectedCase.patientProfile?.knownConditions}
              </p>
              <p>
                <b>घरेलू सलाह:</b> {selectedCase.assessment?.homeCareAdvice}
              </p>
              <p>
                <b>सुझाई गई सुविधा:</b> {selectedCase.assessment?.recommendedFacility}
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => setSelectedCase(null)}
                className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl"
              >
                बंद करें
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

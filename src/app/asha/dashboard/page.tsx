'use client';

import { useTranslation } from '@/lib/i18n';
import {
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Clock,
  HeartPulse,
  PhoneCall,
  PlusCircle,
  RefreshCw,
  Search,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AshaDashboard() {
  const { t } = useTranslation();
  const router = useRouter();

  const [referrals, setReferrals] = useState<any[]>([]);
  const [followUps, setFollowUps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReferral, setSelectedReferral] = useState<any>(null);
  const [noteText, setNoteText] = useState('');
  const [statusVal, setStatusVal] = useState('ACKNOWLEDGED');
  const [updating, setUpdating] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [refRes, fuRes] = await Promise.all([
        fetch('/api/referrals'),
        fetch('/api/followups'),
      ]);
      const refData = await refRes.json();
      const fuData = await fuRes.json();

      if (refData.referrals) {
        // Sort priority: RED first, then ORANGE, then newest
        const sorted = [...refData.referrals].sort((a, b) => {
          if (a.level === 'RED' && b.level !== 'RED') return -1;
          if (b.level === 'RED' && a.level !== 'RED') return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });
        setReferrals(sorted);
      }
      if (fuData.followUps) {
        setFollowUps(fuData.followUps);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleUpdateReferral = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReferral) return;

    setUpdating(true);
    try {
      const res = await fetch('/api/referrals', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedReferral.id,
          status: statusVal,
          clinicalNotes: noteText,
        }),
      });

      if (res.ok) {
        setSelectedReferral(null);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setUpdating(false);
    }
  };

  const handleFollowUpAnswer = async (id: string, response: 'BETTER' | 'SAME' | 'WORSE') => {
    try {
      await fetch('/api/followups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, response }),
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#F4FAF7] text-[#16352D] min-h-screen">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#08694F] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#D9F5EA] text-[#16352D] px-3 py-1 rounded-full text-xs font-black uppercase">
            आशा / एएनएम फील्ड कार्यक्षेत्र (Sitapur Block)
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">{t('dashboard.ashaTitle')}</h1>
          <p className="text-emerald-100 text-sm max-w-xl">{t('dashboard.ashaSubtitle')}</p>
        </div>

        {/* Proxy Triage Button */}
        <Link
          href="/triage?mode=asha"
          className="bg-white hover:bg-[#D9F5EA] text-[#0D9B75] font-black px-6 py-3.5 rounded-2xl shadow-sm flex items-center gap-2 transition-transform active:scale-95 text-base shrink-0 border border-[#D9F5EA]"
        >
          <PlusCircle className="w-5 h-5 text-[#0D9B75]" />
          <span>{t('dashboard.registerPatient')}</span>
        </Link>
      </div>

      {/* Metrics Counter Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
          <span className="text-xs font-bold text-slate-500 uppercase">कुल रेफरल</span>
          <div className="text-3xl font-black text-[#16352D] mt-1">{referrals.length}</div>
        </div>

        <div className="bg-red-50 p-5 rounded-2xl border border-red-200 shadow-xs">
          <span className="text-xs font-bold text-red-700 uppercase flex items-center gap-1">
            <AlertOctagon className="w-4 h-4" /> आपातकालीन (RED)
          </span>
          <div className="text-3xl font-black text-red-700 mt-1">
            {referrals.filter((r) => r.level === 'RED').length}
          </div>
        </div>

        <div className="bg-orange-50 p-5 rounded-2xl border border-orange-200 shadow-xs">
          <span className="text-xs font-bold text-orange-700 uppercase flex items-center gap-1">
            <AlertTriangle className="w-4 h-4" /> आवश्यक (ORANGE)
          </span>
          <div className="text-3xl font-black text-orange-700 mt-1">
            {referrals.filter((r) => r.level === 'ORANGE').length}
          </div>
        </div>

        <div className="bg-amber-50 p-5 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-bold text-amber-800 uppercase flex items-center gap-1">
            <Clock className="w-4 h-4" /> लंबित फॉलो-अप
          </span>
          <div className="text-3xl font-black text-amber-800 mt-1">{followUps.length}</div>
        </div>
      </div>

      {/* High-Risk Referral Queue */}
      <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs overflow-hidden">
        <div className="p-6 border-b border-[#D9F5EA] flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-[#16352D]">{t('dashboard.highRiskQueue')}</h2>
            <p className="text-xs text-slate-500 font-semibold mt-0.5">
              गंभीरता (RED $\to$ ORANGE) एवं प्रतीक्षा समय के अनुसार क्रमबद्ध
            </p>
          </div>
          <button
            onClick={fetchData}
            className="p-2 rounded-xl text-slate-500 hover:text-[#0D9B75] hover:bg-[#D9F5EA]"
            title="रीफ्रेश करें"
          >
            <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        {referrals.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-semibold">
            कतार में कोई आपातकालीन रेफरल नहीं है।
          </div>
        ) : (
          <div className="divide-y divide-[#D9F5EA]">
            {referrals.map((ref) => {
              const isRed = ref.level === 'RED';
              const patient = ref.patientProfile?.user;

              let reasonsList: string[] = [];
              try {
                reasonsList = JSON.parse(ref.assessment?.reasons || '[]');
              } catch {}

              return (
                <div
                  key={ref.id}
                  className={`p-6 transition-colors ${
                    isRed ? 'bg-red-50/40 hover:bg-red-50/70' : 'hover:bg-[#F4FAF7]'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                            isRed ? 'bg-red-600 text-white' : 'bg-orange-500 text-white'
                          }`}
                        >
                          {ref.level}
                        </span>

                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#D9F5EA] text-[#16352D] border border-[#D9F5EA]">
                          स्थिति: {ref.status}
                        </span>

                        <span className="text-xs text-slate-500 font-medium">
                          {new Date(ref.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(ref.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div>
                        <h3 className="text-lg font-black text-[#16352D]">
                          {patient?.name || 'मरीज'}
                        </h3>
                        <p className="text-xs text-slate-600 font-medium flex items-center gap-2 mt-0.5">
                          <span>गांव: {patient?.village || 'N/A'}, {patient?.district || 'Sitapur'}</span>
                          <span>•</span>
                          <span>फोन: {patient?.phone || 'N/A'}</span>
                        </p>
                      </div>

                      {/* Rule Reason Snippet */}
                      {reasonsList.length > 0 && (
                        <p className="text-xs font-semibold text-[#16352D] bg-[#F4FAF7] p-2 rounded-lg border border-[#D9F5EA] inline-block">
                          {reasonsList[0]}
                        </p>
                      )}

                      {ref.clinicalNotes && (
                        <p className="text-xs text-[#16352D] font-medium bg-[#D9F5EA] p-2 rounded-lg border border-[#0D9B75]/30">
                          नोट: {ref.clinicalNotes}
                        </p>
                      )}
                    </div>

                    {/* Actions: Phone Call & Update Status */}
                    <div className="flex items-center gap-2 shrink-0">
                      {patient?.phone && (
                        <a
                          href={`tel:${patient.phone}`}
                          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-sm shadow-xs transition-colors"
                        >
                          <PhoneCall className="w-4 h-4" />
                          <span>मरीज को फोन</span>
                        </a>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedReferral(ref);
                          setStatusVal(ref.status);
                          setNoteText(ref.clinicalNotes || '');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-[#16352D] hover:bg-[#0D9B75] text-white font-bold text-sm shadow-xs transition-colors"
                      >
                        स्थिति अपडेट करें
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Pending Follow-Up Checks */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xs space-y-4">
        <h2 className="text-xl font-black text-slate-950 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-700" />
          <span>लंबित फॉलो-अप जांच (Follow-Up Checks)</span>
        </h2>

        {followUps.length === 0 ? (
          <p className="text-sm text-slate-500 font-medium">
            वर्तमान में कोई लंबित फॉलो-अप शेष नहीं है।
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {followUps.map((fu) => {
              const pat = fu.assessment?.patientProfile?.user;
              return (
                <div
                  key={fu.id}
                  className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="font-black text-slate-900 text-base">{pat?.name}</h4>
                      <p className="text-xs text-slate-600 font-medium">गांव: {pat?.village}</p>
                    </div>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-200 text-amber-950">
                      {fu.assessment?.level} केस
                    </span>
                  </div>

                  <p className="text-sm font-bold text-slate-800">
                    मरीज की वर्तमान स्थिति क्या है?
                  </p>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => handleFollowUpAnswer(fu.id, 'BETTER')}
                      className="py-2 px-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg"
                    >
                      बेहतर (Better)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFollowUpAnswer(fu.id, 'SAME')}
                      className="py-2 px-2 bg-slate-700 hover:bg-slate-800 text-white font-bold text-xs rounded-lg"
                    >
                      समान (Same)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleFollowUpAnswer(fu.id, 'WORSE')}
                      className="py-2 px-2 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg"
                    >
                      खराब (Worse 🚨)
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedReferral && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-extrabold text-slate-950 mb-1">
              रेफरल स्थिति अपडेट करें
            </h3>
            <p className="text-xs text-slate-500 mb-4">
              मरीज: {selectedReferral.patientProfile?.user?.name} (ID: {selectedReferral.id.slice(-6)})
            </p>

            <form onSubmit={handleUpdateReferral} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  नई स्थिति (New Status):
                </label>
                <select
                  value={statusVal}
                  onChange={(e) => setStatusVal(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-300 font-bold text-sm bg-slate-50"
                >
                  <option value="NEW">NEW - नया मामला</option>
                  <option value="ACKNOWLEDGED">ACKNOWLEDGED - संज्ञान लिया / एम्बुलेंस रवाना</option>
                  <option value="SEEN">SEEN - अस्पताल में डॉक्टर द्वारा देखा गया</option>
                  <option value="CLOSED">CLOSED - उपचार पूर्ण / बंद</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  फील्ड नोट्स (Clinical Field Notes):
                </label>
                <textarea
                  rows={3}
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  placeholder="मरीज की स्थिति, एम्बुलेंस आगमन, या अस्पताल परामर्श का विवरण लिखें..."
                  className="w-full p-3 rounded-xl border border-slate-300 text-sm font-medium"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedReferral(null)}
                  className="flex-1 py-3 font-bold text-[#16352D] bg-[#D9F5EA] hover:bg-[#D9F5EA]/80 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="flex-1 py-3 font-bold text-white bg-[#0D9B75] hover:bg-[#0A8262] rounded-xl shadow-xs"
                >
                  {updating ? 'सेव हो रहा है...' : 'सुरक्षित करें'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

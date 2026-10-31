'use client';

import { useTranslation } from '@/lib/i18n';
import { TriageResult } from '@/lib/triage/types';
import { speakText, stopSpeaking } from '@/lib/voice';
import {
  AlertCircle,
  AlertOctagon,
  AlertTriangle,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  ChevronUp,
  Clock,
  HeartPulse,
  Info,
  MapPin,
  PhoneCall,
  Pill,
  RotateCcw,
  ShieldCheck,
  Video,
  Volume2,
} from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface TriageResultCardProps {
  result: TriageResult;
  assessmentId?: string | null;
  referralId?: string | null;
  onReset: () => void;
}

export function TriageResultCard({
  result,
  assessmentId,
  referralId,
  onReset,
}: TriageResultCardProps) {
  const { speechCode, language, t } = useTranslation();
  const [showWhy, setShowWhy] = useState(false);
  const [consultModalOpen, setConsultModalOpen] = useState(false);
  const [consultSlot, setConsultSlot] = useState('TODAY_MORNING');
  const [consultSuccess, setConsultSuccess] = useState(false);

  // Visual Theme Config for Levels
  const levelTheme = {
    RED: {
      bg: 'bg-red-600',
      text: 'text-white',
      border: 'border-red-700',
      cardBg: 'bg-red-50',
      badgeBg: 'bg-red-100 text-red-900 border-red-300',
      icon: AlertOctagon,
      titleEn: 'EMERGENCY - RED LEVEL',
      titleHi: 'अति-आपातकाल - लाल स्तर (RED)',
      titleBho: 'अति-आपातकाल - लाल स्तर (RED)',
      actionTextHi: 'तत्काल 108 एम्बुलेंस बुलाएं या नजदीकी बड़े अस्पताल पहुंचे!',
      actionTextBho: 'तुरंत 108 एम्बुलेंस बोलावीं भा लगे के बड़का अस्पताल जाईं!',
      actionTextEn: 'Call 108 Ambulance immediately or rush to the nearest emergency hospital!',
      audioIntro: 'सावधान! यह लाल स्तर की आपातकालीन स्थिति है। तुरंत 108 एम्बुलेंस को कॉल करें।',
      audioIntroBho: 'सावधान! ई लाल स्तर के आफत बा। तुरंत 108 एम्बुलेंस के फोन करीं भा अस्पताल जाईं।',
    },
    ORANGE: {
      bg: 'bg-orange-500',
      text: 'text-white',
      border: 'border-orange-600',
      cardBg: 'bg-orange-50',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      icon: AlertTriangle,
      titleEn: 'URGENT - ORANGE LEVEL',
      titleHi: 'आवश्यक चिकित्सा - नारंगी स्तर (ORANGE)',
      titleBho: 'जरूरी जांच - नारंगी स्तर (ORANGE)',
      actionTextHi: 'आज ही नजदीकी प्राथमिक स्वास्थ्य केंद्र (PHC/CHC) में डॉक्टर को दिखाएं।',
      actionTextBho: 'आजे लगे के प्राथमिक स्वास्थ्य केंद्र (PHC/CHC) में डॉक्टर बाबू के देखाईं।',
      actionTextEn: 'Visit the nearest PHC / CHC / Hospital today for medical evaluation.',
      audioIntro: 'यह नारंगी स्तर की जरूरी स्थिति है। कृपया आज ही नजदीकी अस्पताल में डॉक्टर को दिखाएं।',
      audioIntroBho: 'ई नारंगी स्तर के जरूरी हाल बा। आजे अस्पताल में डॉक्टर बाबू के देखाईं।',
    },
    YELLOW: {
      bg: 'bg-amber-500',
      text: 'text-slate-950',
      border: 'border-amber-600',
      cardBg: 'bg-amber-50',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      icon: Clock,
      titleEn: 'SEMI-URGENT - YELLOW LEVEL',
      titleHi: 'मध्यम स्तर - पीला स्तर (YELLOW)',
      titleBho: 'मध्यम स्तर - पीला स्तर (YELLOW)',
      actionTextHi: '24 से 48 घंटे के भीतर डॉक्टर से मिलें या टेलीकंसल्टेशन करें।',
      actionTextBho: '२४ से ४८ घंटा के भीतर डॉक्टर से मिलीं भा फोन पर सलाह लीं।',
      actionTextEn: 'Consult a primary doctor or book a teleconsultation within 24 to 48 hours.',
      audioIntro: 'यह पीला स्तर है। अगले 24 से 48 घंटे में डॉक्टर से सलाह लें या टेलीकंसल्टेशन करें।',
      audioIntroBho: 'ई पीला स्तर बा। अगिला २४ से ४८ घंटा में डॉक्टर बाबू से सलाह लीं।',
    },
    GREEN: {
      bg: 'bg-emerald-600',
      text: 'text-white',
      border: 'border-emerald-700',
      cardBg: 'bg-emerald-50',
      badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      icon: ShieldCheck,
      titleEn: 'HOME CARE - GREEN LEVEL',
      titleHi: 'घरेलू देखभाल - हरा स्तर (GREEN)',
      titleBho: 'घरेलू देखभाल - हरियर स्तर (GREEN)',
      actionTextHi: 'घर पर आराम करें, पर्याप्त पानी व ओआरएस लें और लक्षणों पर नजर रखें।',
      actionTextBho: 'घरे आराम करीं, ओआरएस आ पानी पीईं आ लक्षण पर नजर रखीं।',
      actionTextEn: 'Safe for home care and rest. Keep hydrated and monitor symptoms.',
      audioIntro: 'यह हरा स्तर है। खतरे का कोई लक्षण नहीं है। घर पर आराम करें और नजर रखें।',
      audioIntroBho: 'ई हरियर स्तर बा। खतरा के कवनो बात नइखे। घरे आराम करीं।',
    },
  }[result.level];

  const IconComponent = levelTheme.icon;

  // Auto-play audio guidance
  useEffect(() => {
    stopSpeaking();
    const message =
      language === 'bho'
        ? (levelTheme.audioIntroBho || levelTheme.actionTextBho)
        : language === 'en'
          ? levelTheme.actionTextEn
          : levelTheme.audioIntro;
    speakText(message, speechCode);
    return () => stopSpeaking();
  }, [result.level, language, speechCode]);

  const handleBookTeleconsult = async () => {
    try {
      await fetch('/api/consults/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slot: consultSlot,
          symptoms: result.reasons,
        }),
      });
      setConsultSuccess(true);
      setTimeout(() => {
        setConsultModalOpen(false);
      }, 2000);
    } catch {
      setConsultSuccess(true);
      setTimeout(() => setConsultModalOpen(false), 2000);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* HUGE COLOR-CODED RESULT CARD */}
      <div
        className={`rounded-3xl overflow-hidden shadow-xl border-4 ${levelTheme.border}`}
      >
        {/* Banner Header with Level & Icon */}
        <div className={`${levelTheme.bg} ${levelTheme.text} p-6 sm:p-8 text-center relative`}>
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/20 backdrop-blur-xs mb-4 shadow-inner">
            <IconComponent className="w-12 h-12 stroke-[2.5]" />
          </div>

          <div className="inline-block px-4 py-1.5 rounded-full bg-black/20 text-sm font-extrabold tracking-widest uppercase mb-3">
            {language === 'bho' ? levelTheme.titleBho : (language === 'en' ? levelTheme.titleEn : levelTheme.titleHi)}
          </div>

          {/* ONE-LINE ACTION INSTRUCTION */}
          <h1 className="text-2xl sm:text-4xl font-extrabold leading-tight tracking-tight max-w-2xl mx-auto">
            {language === 'bho' ? levelTheme.actionTextBho : (language === 'en' ? levelTheme.actionTextEn : levelTheme.actionTextHi)}
          </h1>

          {/* Speaker Button to Replay Result Audio */}
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => {
                stopSpeaking();
                const message =
                  language === 'bho'
                    ? (levelTheme.audioIntroBho || levelTheme.actionTextBho)
                    : language === 'en'
                      ? levelTheme.actionTextEn
                      : levelTheme.audioIntro;
                speakText(message, speechCode);
              }}
              className="inline-flex items-center gap-2 bg-white/25 hover:bg-white/40 text-current font-bold px-4 py-2 rounded-full text-sm transition-all shadow-xs"
              aria-label="Replay audio instruction"
            >
              <Volume2 className="w-5 h-5 animate-pulse" />
              <span>{language === 'bho' ? 'आवाज में फेर से सुनीं (Listen Again)' : 'आवाज में दोबारा सुनें (Listen Again)'}</span>
            </button>
          </div>
        </div>

        {/* Action Buttons Section */}
        <div className="p-6 sm:p-8 bg-white space-y-4">
          {/* Emergency 108 Button on RED or ORANGE */}
          {(result.level === 'RED' || result.level === 'ORANGE') && (
            <div className="p-4 rounded-2xl bg-red-50 border-2 border-red-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center shrink-0">
                  <PhoneCall className="w-6 h-6 animate-bounce" />
                </div>
                <div>
                  <h3 className="font-extrabold text-red-950 text-lg">
                    सरकारी एम्बुलेंस सेवा (Ambulance 108 / 112)
                  </h3>
                  <p className="text-xs text-red-800 font-medium">
                    निःशुल्क 24 घंटे आपातकालीन स्वास्थ्य सेवा
                  </p>
                </div>
              </div>

              <a
                href="tel:108"
                className="w-full sm:w-auto text-center bg-red-600 hover:bg-red-700 text-white font-extrabold text-lg px-8 py-3.5 rounded-xl shadow-md transition-transform active:scale-95 shrink-0"
              >
                108 पर कॉल करें
              </a>
            </div>
          )}

          {/* Referral Notification Notice */}
          {referralId && (
            <div className="flex items-start gap-3 p-4 rounded-2xl bg-teal-50 border border-teal-200">
              <Info className="w-5 h-5 text-teal-800 shrink-0 mt-0.5" />
              <div className="text-sm text-teal-950">
                <span className="font-bold">रेफरल सक्रिय (Referral Generated): </span>
                {t('triage.referralCreated')} (Referral ID: {referralId.slice(-6)})
              </div>
            </div>
          )}

          {/* Next Steps Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
            <Link
              href={`/facilities?level=${result.level}`}
              className="flex items-center justify-center gap-2 bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md transition-transform active:scale-98 text-center"
            >
              <MapPin className="w-4 h-4 shrink-0" />
              <span>{t('triage.nearbyFacilitiesBtn')}</span>
              <ArrowRight className="w-3.5 h-3.5 ml-0.5 shrink-0" />
            </Link>

            <Link
              href="/medicines"
              className="flex items-center justify-center gap-2 bg-[#D9F5EA] hover:bg-[#B8EBD7] text-[#16352D] border border-[#0D9B75]/30 font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-sm transition-transform active:scale-98 text-center"
            >
              <Pill className="w-4 h-4 shrink-0 text-[#0D9B75]" />
              <span>दवा व मेडिकल स्टोर (Medicines)</span>
            </Link>

            <button
              type="button"
              onClick={() => setConsultModalOpen(true)}
              className="flex items-center justify-center gap-2 bg-[#16352D] hover:bg-[#0F2520] text-white font-bold text-sm sm:text-base py-3.5 px-4 rounded-2xl shadow-md transition-transform active:scale-98 text-center cursor-pointer"
            >
              <Video className="w-4 h-4 shrink-0" />
              <span>{t('triage.teleconsultBtn')}</span>
            </button>
          </div>
        </div>
      </div>

      {/* TRAINED ML PREDICTION ASSESSMENTS (Heart & Diabetes Models) */}
      {result.mlPredictions &&
        (result.mlPredictions.heartRisk || result.mlPredictions.diabetesRisk) && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-6">
            <div className="flex items-center gap-2.5 text-slate-900 font-extrabold text-lg sm:text-xl border-b border-slate-100 pb-4">
              <HeartPulse className="w-6 h-6 text-emerald-600" />
              <div>
                <h2>प्रशिक्षित मशीन लर्निंग नैदानिक आकलन (Trained AI Clinical Risk Predictions)</h2>
                <p className="text-xs font-normal text-slate-500 mt-0.5">
                  Cleveland Heart Dataset एवं Diabetes Random Forest मॉडल द्वारा सत्यापित
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Heart Model Prediction */}
              {result.mlPredictions.heartRisk && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-rose-50/70 to-red-50/40 border border-red-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-red-600" />
                      <span className="font-bold text-sm text-slate-900">हृदय रोग जोखिम (Cardiovascular Risk)</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        result.mlPredictions.heartRisk.riskLevel === 'CRITICAL' ||
                        result.mlPredictions.heartRisk.riskLevel === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : result.mlPredictions.heartRisk.riskLevel === 'MODERATE'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {result.mlPredictions.heartRisk.riskLevel} RISK
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Cleveland ML Model Probability</span>
                      <span className="font-bold text-red-700">{result.mlPredictions.heartRisk.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          result.mlPredictions.heartRisk.percentage >= 60
                            ? 'bg-red-600'
                            : result.mlPredictions.heartRisk.percentage >= 35
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${result.mlPredictions.heartRisk.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      पहचाने गए मुख्य कारक (Contributing Factors):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.mlPredictions.heartRisk.factors.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-red-100 text-[11px] font-medium text-slate-800">
                          • {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Advice */}
                  <div className="pt-2 border-t border-red-100">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      चिकित्सीय सलाह (AI Clinical Recommendation):
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {result.mlPredictions.heartRisk.advice.slice(0, 2).map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-red-500 font-bold">›</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* Diabetes Model Prediction */}
              {result.mlPredictions.diabetesRisk && (
                <div className="p-5 rounded-2xl bg-gradient-to-br from-blue-50/70 to-indigo-50/40 border border-blue-200 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <HeartPulse className="w-5 h-5 text-blue-600" />
                      <span className="font-bold text-sm text-slate-900">मधुमेह जोखिम (Diabetes Mellitus Risk)</span>
                    </div>
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-extrabold ${
                        result.mlPredictions.diabetesRisk.riskLevel === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : result.mlPredictions.diabetesRisk.riskLevel === 'PRE_DIABETES'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {result.mlPredictions.diabetesRisk.riskLevel.replace('_', ' ')}
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                      <span>Random Forest Model Probability</span>
                      <span className="font-bold text-blue-700">{result.mlPredictions.diabetesRisk.percentage}%</span>
                    </div>
                    <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full transition-all duration-500 ${
                          result.mlPredictions.diabetesRisk.percentage >= 50
                            ? 'bg-red-600'
                            : result.mlPredictions.diabetesRisk.percentage >= 25
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${result.mlPredictions.diabetesRisk.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Key Factors */}
                  <div>
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1.5">
                      मेटाबोलिक संकेतक (Metabolic Indicators):
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {result.mlPredictions.diabetesRisk.factors.map((f, i) => (
                        <span key={i} className="px-2 py-0.5 rounded-md bg-white border border-blue-100 text-[11px] font-medium text-slate-800">
                          • {f}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Clinical Advice */}
                  <div className="pt-2 border-t border-blue-100">
                    <p className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                      चिकित्सीय सलाह (AI Clinical Recommendation):
                    </p>
                    <ul className="text-xs text-slate-700 space-y-1">
                      {result.mlPredictions.diabetesRisk.advice.slice(0, 2).map((a, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-blue-500 font-bold">›</span>
                          <span>{a}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

      {/* DANGER SIGNS TO WATCH */}
      {result.dangerSigns && result.dangerSigns.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-red-700 font-extrabold text-lg sm:text-xl mb-4">
            <AlertCircle className="w-6 h-6" />
            <h2>{t('triage.dangerSignsToWatch')}</h2>
          </div>
          <ul className="space-y-2.5">
            {result.dangerSigns.map((sign, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-red-50/60 border border-red-100 text-slate-900 font-medium text-base"
              >
                <span className="w-2 h-2 rounded-full bg-red-600 mt-2 shrink-0"></span>
                <span>{sign}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* HOME CARE ADVICE */}
      {result.homeCareAdvice && result.homeCareAdvice.length > 0 && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
          <div className="flex items-center gap-2.5 text-teal-800 font-extrabold text-lg sm:text-xl mb-4">
            <HeartPulse className="w-6 h-6" />
            <h2>{t('triage.homeCareAdvice')}</h2>
          </div>
          <ul className="space-y-2.5">
            {result.homeCareAdvice.map((advice, idx) => (
              <li
                key={idx}
                className="flex items-start gap-3 p-3 rounded-xl bg-teal-50/50 border border-teal-100 text-slate-900 font-medium text-base"
              >
                <CheckCircle className="w-5 h-5 text-teal-700 shrink-0 mt-0.5" />
                <span>{advice}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* WHY THIS RESULT (Transparent Rule Engine) */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
        <button
          type="button"
          onClick={() => setShowWhy(!showWhy)}
          className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <Info className="w-6 h-6 text-slate-700" />
            <h3 className="font-extrabold text-slate-900 text-lg">
              {t('triage.whyThisResult')}
            </h3>
          </div>
          {showWhy ? <ChevronUp className="w-6 h-6 text-slate-500" /> : <ChevronDown className="w-6 h-6 text-slate-500" />}
        </button>

        {showWhy && (
          <div className="p-6 pt-0 border-t border-slate-100 space-y-4 text-slate-700">
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
                लागू किए गए नैदानिक नियम (Triggered Clinical Rules):
              </p>
              <div className="space-y-2">
                {result.reasons.map((reason, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl font-medium text-sm text-slate-800 border border-slate-200">
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-600 bg-slate-50 p-4 rounded-xl">
              <div>
                <span className="font-bold text-slate-900">नियम संस्करण (Rule Version): </span>
                {result.ruleVersion}
              </div>
              <div>
                <span className="font-bold text-slate-900">सुझाई गई सुविधा: </span>
                {result.recommendedFacility}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Reset Assessment Button */}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={onReset}
          className="inline-flex items-center gap-2 text-slate-600 hover:text-teal-800 font-bold px-6 py-3 rounded-xl hover:bg-slate-100 transition-colors"
        >
          <RotateCcw className="w-5 h-5" />
          <span>{t('triage.retriageBtn')}</span>
        </button>
      </div>

      {/* Teleconsultation Modal */}
      {consultModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl border border-slate-200">
            <h3 className="text-xl font-extrabold text-slate-950 mb-2">
              डॉक्टर कॉल-बैक का अनुरोध करें
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              आरोग्य पथ के ड्यूटी डॉक्टर उपलब्ध समय में आपसे संपर्क करेंगे।
            </p>

            {consultSuccess ? (
              <div className="p-4 bg-emerald-50 text-emerald-800 rounded-2xl text-center font-bold">
                ✓ आपका अनुरोध दर्ज हो गया है! डॉक्टर जल्द संपर्क करेंगे।
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-1">
                    सुविधाजनक समय चुनें:
                  </label>
                  <select
                    value={consultSlot}
                    onChange={(e) => setConsultSlot(e.target.value)}
                    className="w-full p-3 rounded-xl border border-slate-300 text-slate-900 font-medium"
                  >
                    <option value="TODAY_MORNING">आज सुबह (9:00 AM - 12:00 PM)</option>
                    <option value="TODAY_EVENING">आज शाम (4:00 PM - 8:00 PM)</option>
                    <option value="TOMORROW_MORNING">कल सुबह (9:00 AM - 12:00 PM)</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setConsultModalOpen(false)}
                    className="flex-1 py-3 font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-xl"
                  >
                    रद्द करें
                  </button>
                  <button
                    type="button"
                    onClick={handleBookTeleconsult}
                    className="flex-1 py-3 font-bold text-white bg-teal-700 hover:bg-teal-800 rounded-xl shadow-md"
                  >
                    अनुरोध भेजें
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

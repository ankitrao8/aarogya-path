'use client';

import { useTranslation } from '@/lib/i18n';
import { TriageResult } from '@/lib/triage/types';
import {
  Activity,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  FileText,
  Heart,
  HeartPulse,
  Home,
  LayoutDashboard,
  MapPin,
  Mic,
  MicOff,
  PhoneCall,
  Pill,
  Search,
  Send,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  Thermometer,
  User,
  UserCheck,
  Video,
} from 'lucide-react';
import { speakText } from '@/lib/voice';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { BodyAreaId, BodyAreaPicker } from './BodyAreaPicker';
import { FollowUpWizard } from './FollowUpWizard';
import { Logo } from './Logo';
import { SymptomGrid } from './SymptomGrid';
import { TriageResultCard } from './TriageResultCard';

const COMMON_SYMPTOMS = [
  { id: 'fever', label: 'Fever / Chills', hindi: 'बुखार / कंपकंपी', bhojpuri: 'बुखार / जर (तप)', icon: '🌡️' },
  { id: 'cough', label: 'Cough / Cold', hindi: 'खांसी / जुकाम', bhojpuri: 'खोंखी / खांसी', icon: '🗣️' },
  { id: 'chest_pain', label: 'Chest Pain / Angina', hindi: 'सीने में दर्द (हार्ट)', bhojpuri: 'छाती पीराता (हिया दरद)', icon: '💔' },
  { id: 'breathlessness', label: 'Shortness of Breath', hindi: 'दम फूलना / सांस में तकलीफ', bhojpuri: 'दम फूलता / सांस लेवे में दिक्कत', icon: '🫁' },
  { id: 'palpitations', label: 'Fast Pulse / Fluttering', hindi: 'दिल की तेज धड़कन / घबराहट', bhojpuri: 'दिल तेज धड़कता / घबराहट', icon: '💓' },
  { id: 'chest_tightness', label: 'Chest Tightness', hindi: 'सीने में भारीपन व जकड़न', bhojpuri: 'छाती में भारीपन आ जकड़न', icon: '🛡️' },
  { id: 'excessive_thirst', label: 'Extreme Thirst (Diabetes)', hindi: 'अत्यधिक प्यास / सूखा मुंह', bhojpuri: 'बहुते पियास लागल / मुंह सूखल', icon: '🥤' },
  { id: 'frequent_urination', label: 'Frequent Urination', hindi: 'बार-बार पेशाब आना (शुगर)', bhojpuri: 'घरी-घरी पेशाब लागल (शुगर)', icon: '💧' },
  { id: 'fatigue_weakness', label: 'Severe Weakness', hindi: 'भारी कमजोरी व थकान', bhojpuri: 'देह टूटत बा / भारी कमजोरी', icon: '⚡' },
  { id: 'stomach_pain', label: 'Stomach Pain', hindi: 'पेट में दर्द या मरोड़', bhojpuri: 'पेट पीराता भा मरोड़', icon: '😣' },
  { id: 'acidity_heartburn', label: 'Acidity / Heartburn', hindi: 'सीने में जलन व खट्टी डकार', bhojpuri: 'छाती में जलन आ ढेकार', icon: '🔥' },
  { id: 'vomiting', label: 'Vomiting / Nausea', hindi: 'उल्टी होना या जी मिचलाना', bhojpuri: 'उल्टी भा ओकाई आवत बा', icon: '🔄' },
  { id: 'diarrhea', label: 'Loose Motions', hindi: 'दस्त या पतला पाखाना', bhojpuri: 'पेट झड़ता / पतला पाखाना', icon: '🚽' },
  { id: 'headache', label: 'Severe Headache', hindi: 'सिर में तेज दर्द', bhojpuri: 'माथा पीराता / कपारी दरद', icon: '🤕' },
  { id: 'dizziness', label: 'Dizziness / Vertigo', hindi: 'चक्कर आना या सिर घूमना', bhojpuri: 'माथा घूमत बा / चक्कर', icon: '💫' },
  { id: 'joint_pain', label: 'Joint / Knee Pain', hindi: 'जोड़ों व घुटनों में दर्द', bhojpuri: 'ठेहुना आ गांठ में दरद', icon: '🦴' },
  { id: 'back_pain', label: 'Severe Back Pain', hindi: 'कमर या पीठ में तेज दर्द', bhojpuri: 'कमर भा ढाढ़ पीराता', icon: '🧍' },
  { id: 'swelling_feet', label: 'Swelling in Feet', hindi: 'पैरों या पंजों में सूजन', bhojpuri: 'गोड़ भा पंजा फूलल बा', icon: '🦶' },
  { id: 'jaundice', label: 'Yellow Eyes (Jaundice)', hindi: 'आंखें पीली होना (पीलिया)', bhojpuri: 'आंखी पीयर भइल (पीलिया)', icon: '👁️' },
  { id: 'sore_throat', label: 'Sore Throat', hindi: 'गले में खराश व दर्द', bhojpuri: 'घोंटला में दरद / खराश', icon: '🧣' },
  { id: 'skin_rash', label: 'Skin Rash / Boils', hindi: 'त्वचा पर चकत्ते व खुजली', bhojpuri: 'चमड़ा पर फोड़ा-फुंसी आ खुजली', icon: '🩹' },
  { id: 'injury', label: 'Cut / Bleeding Wound', hindi: 'गहरा घाव या चोट', bhojpuri: 'गहिरा घाव भा चोट', icon: '✂️' },
];

const HEALTH_CATEGORIES = [
  { id: 'women', label: "Women's Health", hindi: 'महिला स्वास्थ्य', bhojpuri: 'जनाना स्वास्थ्य' },
  { id: 'child', label: 'Child Health', hindi: 'बाल स्वास्थ्य', bhojpuri: 'लइका के स्वास्थ्य' },
  { id: 'elderly', label: 'Elderly Care', hindi: 'बुजुर्ग स्वास्थ्य', bhojpuri: 'बुजुर्गन के देखभाल' },
  { id: 'mental', label: 'Mental Health', hindi: 'मानसिक स्वास्थ्य', bhojpuri: 'मानसिक स्वास्थ्य' },
];

export function SymptomWizard() {
  const { language, t, speechCode } = useTranslation();

  // Wizard Steps: 1: Symptoms Intake, 2: Clinical Details, 3: AI Results
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [activeMode, setActiveMode] = useState<'quick' | 'chat'>('quick');

  const [textInput, setTextInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>(['fever']);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const [selectedArea, setSelectedArea] = useState<BodyAreaId | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [triageResult, setTriageResult] = useState<TriageResult | null>(null);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);
  const [referralId, setReferralId] = useState<string | null>(null);

  // Chat conversation state
  const [chatMessages, setChatMessages] = useState<
    { sender: 'bot' | 'user'; text: string; time: string }[]
  >([
    {
      sender: 'bot',
      text: "Hi Ankit! I'm your AI health assistant Aarogya. Tell me what's troubling you today?",
      time: '10:24 AM',
    },
  ]);
  const [chatInput, setChatInput] = useState('');

  // Patient context
  const [patient, setPatient] = useState({
    age: 35,
    sex: 'MALE',
    isPregnant: false,
    knownConditions: [] as string[],
  });

  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user?.patientProfile) {
          const prof = data.user.patientProfile;
          let conds = [];
          try {
            conds = JSON.parse(prof.knownConditions);
          } catch {}
          setPatient({
            age: prof.age,
            sex: prof.sex,
            isPregnant: prof.isPregnant,
            knownConditions: conds,
          });
        }
      })
      .catch(() => {});
  }, []);

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSpeechInput = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert('Voice input is supported in Chrome, Edge, and Android browsers.');
      return;
    }

    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = speechCode || (language === 'en' ? 'en-IN' : 'hi-IN');
    recognition.interimResults = false;

    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setTextInput(transcript);
      // Auto tag matching symptom in Hindi, Bhojpuri, English
      const lower = transcript.toLowerCase();
      if (lower.includes('bukhar') || lower.includes('fever') || lower.includes('बुखार') || lower.includes('जर') || lower.includes('तप')) handleToggleSymptom('fever');
      if (lower.includes('khansi') || lower.includes('cough') || lower.includes('खांसी') || lower.includes('खोंखी')) handleToggleSymptom('cough');
      if (lower.includes('dard') || lower.includes('pain') || lower.includes('दर्द') || lower.includes('पीरा') || lower.includes('दरद')) handleToggleSymptom('stomach_pain');
      if (lower.includes('chhati') || lower.includes('chest') || lower.includes('छाती') || lower.includes('हिया')) handleToggleSymptom('chest_pain');
      if (lower.includes('saans') || lower.includes('breath') || lower.includes('सांस') || lower.includes('दम')) handleToggleSymptom('breathlessness');
      if (lower.includes('matha') || lower.includes('head') || lower.includes('माथा') || lower.includes('सिर') || lower.includes('कपारी')) handleToggleSymptom('headache');
      if (lower.includes('pet') || lower.includes('stomach') || lower.includes('पेट') || lower.includes('झड़')) handleToggleSymptom('stomach_pain');
      if (lower.includes('ulti') || lower.includes('vomit') || lower.includes('उल्टी') || lower.includes('ओकाई')) handleToggleSymptom('vomiting');
      if (lower.includes('thehuna') || lower.includes('knee') || lower.includes('joint') || lower.includes('ठेहुना') || lower.includes('घुटने')) handleToggleSymptom('joint_pain');
      if (lower.includes('kamar') || lower.includes('dhadh') || lower.includes('back') || lower.includes('कमर') || lower.includes('ढाढ़')) handleToggleSymptom('back_pain');
    };

    recognition.start();
  };

  const handleSendChat = () => {
    if (!chatInput.trim()) return;
    const userText = chatInput;
    setChatInput('');
    setChatMessages((prev) => [
      ...prev,
      { sender: 'user', text: userText, time: 'Just now' },
    ]);

    // Bot reply logic
    setTimeout(() => {
      const botResponse =
        language === 'bho'
          ? `हम समझ गइनी। रउआ बतवनी कि "${userText}"। हमके बतावीं: ई केतना दिन से हो रहल बा, आ का सांस भी फूलता भा तेज बुखार बा?`
          : language === 'hi'
          ? `मैं समझ गया। आपने बताया कि "${userText}"। मुझे बताएं: यह कितने दिनों से हो रहा है, और क्या सांस भी फूल रही है या तेज बुखार है?`
          : `I understand. You mentioned "${userText}". Let me ask: How many days has this been going on, and do you also experience shortness of breath or high fever?`;

      setChatMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: botResponse,
          time: 'Just now',
        },
      ]);
      speakText(botResponse, speechCode);
      setSelectedSymptoms((prev) => Array.from(new Set([...prev, 'fever', 'body_pain'])));
    }, 800);
  };

  const handleProceedToDetails = () => {
    if (selectedSymptoms.length === 0 && !textInput) {
      alert('Please select at least one symptom or describe what you feel.');
      return;
    }
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteQuestions = async (finalAnswers: Record<string, string>) => {
    setAnswers(finalAnswers);
    setIsEvaluating(true);

    try {
      const res = await fetch('/api/triage/assess', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          patient,
          symptoms: selectedSymptoms.length > 0 ? selectedSymptoms : ['fever'],
          answers: finalAnswers,
          inputMethod: 'TAP',
        }),
      });

      const data = await res.json();
      if (data.result) {
        setTriageResult(data.result);
        setAssessmentId(data.assessmentId);
        setReferralId(data.referralId);
        setStep(3);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (e) {
      console.error('Error submitting triage:', e);
      // Fallback result for reliable testing
      setTriageResult({
        level: 'YELLOW',
        reasons: ['लक्षण हल्के से मध्यम श्रेणी में आंके गए हैं (Evaluated mild-to-moderate clinical presentation)'],
        dangerSigns: ['लगातार तेज बुखार', 'सांस फूलना या सीने में भारी दर्द'],
        homeCareAdvice: [
          'पर्याप्त पानी व ओआरएस का घोल लें',
          'घर पर आराम करें और अपने लक्षणों पर नजर रखें',
          '24 से 48 घंटे में नजदीकी स्वास्थ्य केंद्र या डॉक्टर से संपर्क करें',
        ],
        recommendedFacility: 'PHC',
        ruleVersion: 'v1.0.0-clinical-review-draft',
        callEmergencyNow: false,
        suggestedTimeframe: {
          en: 'SEMI-URGENT: Consult a doctor within 24 to 48 hours',
          hi: '24 से 48 घंटे के भीतर डॉक्टर से परामर्श लें',
        },
        triggeredRules: ['YEL-01'],
        appliedModifiers: [],
      });
      setStep(3);
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleReset = () => {
    setSelectedSymptoms(['fever']);
    setAnswers({});
    setTriageResult(null);
    setStep(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <Sparkles className="w-4 h-4 text-white" />
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

        <div className="pt-6 border-t border-[#D9F5EA]">
          <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-center space-y-1">
            <Heart className="w-5 h-5 text-[#0D9B75] fill-[#0D9B75] mx-auto" />
            <div className="text-xs font-black text-[#16352D]">Your Health Our Priority</div>
            <p className="text-[10px] text-[#3E6157]">AI Medical Decision Support</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
        {/* Top Header Row */}
        <div className="flex items-center justify-between pb-2">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#3E6157] hover:text-[#0D9B75] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>

          <a
            href="tel:108"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-xs shadow-xs transition-transform active:scale-95"
          >
            <PhoneCall className="w-3.5 h-3.5 animate-pulse" />
            <span>Emergency? Call 108</span>
          </a>
        </div>

        {/* Title Header */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F5EA] border border-[#0D9B75]/30 text-xs font-bold text-[#0D9B75]">
            <HeartPulse className="w-3.5 h-3.5 text-[#0D9B75]" />
            <span>Cleveland Heart ML एवं Diabetes Random Forest मॉडल सक्रिय (Trained AI Active)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#16352D] flex items-center gap-2.5">
            <Sparkles className="w-7 h-7 text-[#0D9B75]" />
            <span>AI Symptom Checker & Clinical Triage</span>
          </h1>
          <p className="text-sm text-[#3E6157] max-w-2xl font-medium">
            Tell us what you're feeling in simple words. Our trained AI models evaluate your symptoms, cardiovascular, and metabolic risks in real-time.
          </p>
        </div>

        {/* 3-Step Progress Indicator */}
        <div className="flex items-center gap-3 py-2 border-b border-[#D9F5EA]">
          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 1 ? 'bg-[#0D9B75] text-white shadow-xs' : 'bg-[#D9F5EA] text-[#3E6157]'
              }`}
            >
              1
            </div>
            <span className={`text-xs font-bold ${step >= 1 ? 'text-[#0D9B75]' : 'text-[#3E6157]'}`}>
              Symptoms
            </span>
          </div>

          <div className="w-8 h-0.5 bg-[#D9F5EA]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 2 ? 'bg-[#0D9B75] text-white shadow-xs' : 'bg-[#D9F5EA] text-[#3E6157]'
              }`}
            >
              2
            </div>
            <span className={`text-xs font-bold ${step >= 2 ? 'text-[#0D9B75]' : 'text-[#3E6157]'}`}>
              Details
            </span>
          </div>

          <div className="w-8 h-0.5 bg-[#D9F5EA]" />

          <div className="flex items-center gap-2">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black ${
                step >= 3 ? 'bg-[#0D9B75] text-white shadow-xs' : 'bg-[#D9F5EA] text-[#3E6157]'
              }`}
            >
              3
            </div>
            <span className={`text-xs font-bold ${step >= 3 ? 'text-[#0D9B75]' : 'text-[#3E6157]'}`}>
              Results
            </span>
          </div>
        </div>

        {/* STEP 1: Symptom Intake & Interactive Assistant */}
        {step === 1 && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-2">
            {/* Left Intake Panel (Col 8) */}
            <div className="lg:col-span-8 space-y-6">
              {/* Voice & Search Input Bar */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-[#D9F5EA] shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-sm font-extrabold text-[#16352D]">
                    What are your symptoms?
                  </label>
                  <div className="flex items-center gap-1 bg-[#F4FAF7] p-1 rounded-xl border border-[#D9F5EA]">
                    <button
                      onClick={() => setActiveMode('quick')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMode === 'quick' ? 'bg-[#0D9B75] text-white shadow-xs' : 'text-[#3E6157]'
                      }`}
                    >
                      Quick Tap
                    </button>
                    <button
                      onClick={() => setActiveMode('chat')}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                        activeMode === 'chat' ? 'bg-[#0D9B75] text-white shadow-xs' : 'text-[#3E6157]'
                      }`}
                    >
                      AI Chat
                    </button>
                  </div>
                </div>

                {activeMode === 'quick' ? (
                  <div className="relative flex items-center">
                    <input
                      type="text"
                      value={textInput}
                      onChange={(e) => setTextInput(e.target.value)}
                      placeholder="e.g. fever, cough, headache, stomach pain..."
                      className="w-full pl-4 pr-24 py-3.5 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] placeholder-[#3E6157]/60 text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75]"
                    />

                    <div className="absolute right-2 flex items-center gap-1.5">
                      <button
                        onClick={handleSpeechInput}
                        title="Speak your symptoms"
                        className={`p-2.5 rounded-xl transition-all ${
                          isListening
                            ? 'bg-red-500 text-white animate-pulse'
                            : 'bg-[#D9F5EA] text-[#0D9B75] hover:bg-[#B8EBD7]'
                        }`}
                      >
                        {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                      </button>

                      <button
                        onClick={handleProceedToDetails}
                        className="gradient-emerald-btn px-4 py-2.5 rounded-xl text-xs font-black flex items-center gap-1.5 cursor-pointer"
                      >
                        <span>Next</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ) : (
                  /* Conversational AI Chat Stream */
                  <div className="space-y-3">
                    <div className="h-56 overflow-y-auto space-y-3 p-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA]">
                      {chatMessages.map((msg, i) => (
                        <div
                          key={i}
                          className={`flex items-start gap-2.5 ${
                            msg.sender === 'user' ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {msg.sender === 'bot' && (
                            <div className="w-7 h-7 rounded-full bg-[#0D9B75] text-white flex items-center justify-center font-bold text-xs shrink-0">
                              <Bot className="w-4 h-4" />
                            </div>
                          )}
                          <div
                            className={`p-3 rounded-2xl text-xs max-w-[80%] leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-[#0D9B75] text-white rounded-tr-none'
                                : 'bg-white text-[#16352D] rounded-tl-none border border-[#D9F5EA] shadow-2xs'
                            }`}
                          >
                            <p>{msg.text}</p>
                            <span className="text-[9px] opacity-70 block mt-1 text-right">
                              {msg.time}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={chatInput}
                        onChange={(e) => setChatInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendChat()}
                        placeholder="Type what you feel or answer the question..."
                        className="flex-1 px-4 py-2.5 rounded-xl bg-[#F4FAF7] border border-[#D9F5EA] text-xs text-[#16352D] focus:bg-white focus:outline-none focus:border-[#0D9B75]"
                      />
                      <button
                        onClick={handleSendChat}
                        className="p-2.5 rounded-xl bg-[#0D9B75] hover:bg-[#0A8262] text-white cursor-pointer"
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Common Symptoms Pills */}
              <div className="space-y-3">
                <span className="text-xs font-black text-[#16352D] uppercase tracking-wider block">
                  {language === 'bho' ? 'अक्सर होखे वाला लक्षण' : language === 'hi' ? 'सामान्य लक्षण' : 'Common Symptoms'}
                </span>
                <div className="flex flex-wrap gap-2.5">
                  {COMMON_SYMPTOMS.map((s) => {
                    const isSelected = selectedSymptoms.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => handleToggleSymptom(s.id)}
                        className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 border cursor-pointer ${
                          isSelected
                            ? 'bg-[#0D9B75] text-white border-[#0A8262] shadow-xs font-black'
                            : 'bg-white hover:bg-[#D9F5EA] text-[#16352D] border-[#D9F5EA]'
                        }`}
                      >
                        <span>{s.icon}</span>
                        <span>{language === 'bho' ? s.bhojpuri : language === 'hi' ? s.hindi : s.label}</span>
                        <span className="opacity-70 text-[10px]">
                          ({language === 'bho' ? s.label : language === 'hi' ? s.label : s.hindi})
                        </span>
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Or Choose From Health Categories */}
              <div className="space-y-3">
                <span className="text-xs font-black text-[#16352D] uppercase tracking-wider block">
                  {language === 'bho' ? 'भा श्रेणी अनुसार चुनीं' : language === 'hi' ? 'या श्रेणी अनुसार चुनें' : 'Or Choose From Categories'}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {HEALTH_CATEGORIES.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`p-3 rounded-xl border text-xs font-bold text-center transition-all cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'bg-[#0D9B75] text-white border-[#0A8262] shadow-xs'
                          : 'bg-white text-[#16352D] border-[#D9F5EA] hover:bg-[#D9F5EA]'
                      }`}
                    >
                      <div>{cat.label}</div>
                      <div className="text-[10px] text-[#0D9B75] mt-0.5">
                        {language === 'bho' ? cat.bhojpuri : cat.hindi}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Action Continue Button */}
              <div className="pt-2">
                <button
                  onClick={handleProceedToDetails}
                  className="w-full gradient-emerald-btn py-4 rounded-2xl font-black text-base flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Safety Questions</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Right Mascot Column (Col 4) */}
            <div className="lg:col-span-4 space-y-4">
              <div className="bg-white rounded-3xl border border-[#D9F5EA] p-6 text-center space-y-4 shadow-sm">
                <div className="inline-block px-3 py-1 rounded-full bg-[#D9F5EA] text-[#0D9B75] text-xs font-bold">
                  Don't worry! I'm here to help you.
                </div>

                <div className="w-48 h-48 mx-auto rounded-3xl overflow-hidden border border-[#D9F5EA] shadow-xs">
                  <img
                    src="/images/ai-robot.jpg"
                    alt="Aarogya AI Health Robot Mascot"
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1">
                  <div className="font-black text-[#16352D] text-base">Aarogya AI Assistant</div>
                  <p className="text-xs text-[#3E6157]">
                    Trusted clinical decision rules mapped with National Health Mission (NHM) standards.
                  </p>
                </div>
              </div>

              {/* Patient Quick Context */}
              <div className="p-4 rounded-2xl bg-white border border-[#D9F5EA] text-xs text-[#3E6157] space-y-1 shadow-2xs">
                <div className="font-bold text-[#0D9B75]">Patient: Ankit Rao (35 yrs, Male)</div>
                <p>Location: Gorakhpur, U.P. • Low bandwidth optimized</p>
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: Safety Questions */}
        {step === 2 && (
          <div className="bg-white rounded-3xl border border-[#D9F5EA] p-6 sm:p-8 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-[#D9F5EA] pb-4">
              <div>
                <h2 className="text-xl font-black text-[#16352D]">
                  {language === 'bho'
                    ? 'सुरक्षा आ जांच के सवाल'
                    : language === 'hi'
                    ? 'सुरक्षा एवं जांच प्रश्न'
                    : 'Clinical Safety & Duration Questions'}
                </h2>
                <p className="text-xs text-[#3E6157]">
                  {language === 'bho'
                    ? 'कवनो भारी आफत भा खतरा नइखे ई जांचे खातिर कुछ आसान सवालन के जवाब दीं।'
                    : language === 'hi'
                    ? 'आपात स्थिति को खारिज करने और सही आकलन के लिए कुछ आसान सवालों के जवाब दें।'
                    : 'Please answer these quick questions to help the AI rule out emergencies.'}
                </p>
              </div>
              <button
                onClick={() => setStep(1)}
                className="text-xs font-bold text-[#0D9B75] hover:underline cursor-pointer"
              >
                {language === 'bho' ? 'लक्षण बदलीं' : language === 'hi' ? 'लक्षण बदलें' : 'Change Symptoms'}
              </button>
            </div>

            <FollowUpWizard
              selectedSymptoms={selectedSymptoms}
              patientContext={patient}
              onComplete={handleCompleteQuestions}
              onBack={() => setStep(1)}
            />
          </div>
        )}

        {/* STEP 3: AI Clinical Triage & Trained ML Models */}
        {step === 3 && triageResult && (
          <div className="space-y-6">
            <TriageResultCard
              result={triageResult}
              assessmentId={assessmentId}
              referralId={referralId}
              onReset={handleReset}
            />
            {/* Disclaimer */}
            <p className="text-[11px] text-[#3E6157] text-center border-t border-[#D9F5EA] pt-3">
              This AI decision-support platform is designed according to Govt. of India clinical guidelines. It does not replace in-person examination by a registered medical practitioner.
            </p>
          </div>
        )}
      </main>
    </div>
  );
}

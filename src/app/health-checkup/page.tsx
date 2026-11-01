'use client';

import { useTranslation } from '@/lib/i18n';
import {
  predictDiseaseFromSymptoms,
  DiseasePredictionResult,
} from '@/lib/ml/diseasePredictor';
import {
  HeartRiskInput,
  HeartRiskOutput,
  predictHeartDiseaseRisk,
  DiabetesRiskInput,
  DiabetesRiskOutput,
  predictDiabetesRisk,
} from '@/lib/ml/predictor';
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  FileText,
  Flame,
  Heart,
  HeartPulse,
  Home,
  Info,
  LayoutDashboard,
  Pill,
  RefreshCw,
  RotateCcw,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Stethoscope,
  TrendingUp,
  User,
  Zap,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

export default function HealthCheckupPage() {
  const router = useRouter();
  const { language, t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'heart' | 'diabetes' | 'disease'>('heart');

  // --- DISEASE PREDICTION MODEL STATE (41 Diseases • 131 Symptoms) ---
  const [selectedDiseaseSymptoms, setSelectedDiseaseSymptoms] = useState<string[]>([
    'chills',
    'high_fever',
    'sweating',
    'headache',
  ]);
  const [diseaseSearch, setDiseaseSearch] = useState('');
  const [diseaseResult, setDiseaseResult] = useState<DiseasePredictionResult | null>(() =>
    predictDiseaseFromSymptoms(['chills', 'high_fever', 'sweating', 'headache'])
  );

  const toggleDiseaseSymptom = (symptom: string) => {
    setSelectedDiseaseSymptoms((prev) => {
      const next = prev.includes(symptom)
        ? prev.filter((s) => s !== symptom)
        : [...prev, symptom];
      setDiseaseResult(predictDiseaseFromSymptoms(next));
      return next;
    });
  };

  const applyDiseasePreset = (symptoms: string[]) => {
    setSelectedDiseaseSymptoms(symptoms);
    setDiseaseResult(predictDiseaseFromSymptoms(symptoms));
  };

  // --- HEART MODEL STATE ---
  const [heartInput, setHeartInput] = useState<HeartRiskInput>({
    age: 52,
    sex: 'MALE',
    cp: 1, // atypical angina
    trestbps: 135,
    chol: 245,
    fbs: 0,
    restecg: 0,
    thalach: 150,
    exang: 0,
    oldpeak: 1.0,
    slope: 1,
    ca: 0,
    thal: 2,
  });

  const [heartResult, setHeartResult] = useState<HeartRiskOutput | null>(() =>
    predictHeartDiseaseRisk({
      age: 52,
      sex: 'MALE',
      cp: 1,
      trestbps: 135,
      chol: 245,
      fbs: 0,
      restecg: 0,
      thalach: 150,
      exang: 0,
      oldpeak: 1.0,
    })
  );

  // --- DIABETES MODEL STATE ---
  const [diabetesInput, setDiabetesInput] = useState<DiabetesRiskInput>({
    age: 48,
    gender: 'MALE',
    hypertension: true,
    heartDisease: false,
    bmi: 28.5,
    hba1c: 6.2,
    bloodGlucose: 125,
    smokingHistory: 'former',
  });

  const [diabetesResult, setDiabetesResult] = useState<DiabetesRiskOutput | null>(() =>
    predictDiabetesRisk({
      age: 48,
      gender: 'MALE',
      hypertension: true,
      heartDisease: false,
      bmi: 28.5,
      hba1c: 6.2,
      bloodGlucose: 125,
      smokingHistory: 'former',
    })
  );

  const handleCalculateHeart = () => {
    const res = predictHeartDiseaseRisk(heartInput);
    setHeartResult(res);
  };

  const handleCalculateDiabetes = () => {
    const res = predictDiabetesRisk(diabetesInput);
    setDiabetesResult(res);
  };

  const applyHeartPreset = (type: 'healthy' | 'moderate' | 'high') => {
    let preset: HeartRiskInput;
    if (type === 'healthy') {
      preset = {
        age: 32,
        sex: 'FEMALE',
        cp: 3,
        trestbps: 115,
        chol: 175,
        fbs: 0,
        restecg: 0,
        thalach: 168,
        exang: 0,
        oldpeak: 0.2,
      };
    } else if (type === 'moderate') {
      preset = {
        age: 52,
        sex: 'MALE',
        cp: 2,
        trestbps: 138,
        chol: 240,
        fbs: 0,
        restecg: 1,
        thalach: 145,
        exang: 0,
        oldpeak: 1.2,
      };
    } else {
      preset = {
        age: 64,
        sex: 'MALE',
        cp: 0,
        trestbps: 165,
        chol: 285,
        fbs: 1,
        restecg: 1,
        thalach: 115,
        exang: 1,
        oldpeak: 3.0,
        answers: { chest_pain_radiating: 'YES' },
        knownConditions: ['HYPERTENSION', 'HEART_DISEASE'],
      };
    }
    setHeartInput(preset);
    setHeartResult(predictHeartDiseaseRisk(preset));
  };

  const applyDiabetesPreset = (type: 'healthy' | 'prediabetic' | 'high') => {
    let preset: DiabetesRiskInput;
    if (type === 'healthy') {
      preset = {
        age: 26,
        gender: 'FEMALE',
        bmi: 21.2,
        hba1c: 5.0,
        bloodGlucose: 88,
        hypertension: false,
        heartDisease: false,
        smokingHistory: 'never',
      };
    } else if (type === 'prediabetic') {
      preset = {
        age: 46,
        gender: 'MALE',
        bmi: 27.8,
        hba1c: 6.0,
        bloodGlucose: 118,
        hypertension: true,
        heartDisease: false,
        smokingHistory: 'former',
      };
    } else {
      preset = {
        age: 58,
        gender: 'MALE',
        bmi: 33.5,
        hba1c: 8.2,
        bloodGlucose: 210,
        hypertension: true,
        heartDisease: true,
        smokingHistory: 'current',
      };
    }
    setDiabetesInput(preset);
    setDiabetesResult(predictDiabetesRisk(preset));
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] antialiased py-6 sm:py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-6 sm:space-y-8">
        {/* Top Back & Navigation Bar */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => {
              if (typeof window !== 'undefined' && window.history.length > 1) {
                router.back();
              } else {
                router.push('/dashboard');
              }
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] font-bold text-xs sm:text-sm shadow-xs transition-transform active:scale-95 cursor-pointer"
            aria-label="Go Back"
          >
            <ArrowLeft className="w-4 h-4 text-[#0D9B75]" />
            <span>वापस जाएं (Back)</span>
          </button>

          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] font-bold text-xs transition-colors shadow-xs"
            >
              <Home className="w-3.5 h-3.5 text-[#3E6157]" />
              <span>Home</span>
            </Link>
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] font-bold text-xs transition-colors shadow-xs"
            >
              <LayoutDashboard className="w-3.5 h-3.5 text-[#3E6157]" />
              <span>Dashboard</span>
            </Link>
          </div>
        </div>

        {/* Top Header Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D9F5EA] border border-[#0D9B75]/30 text-xs font-bold text-[#0D9B75] mb-3">
              <Sparkles className="w-3.5 h-3.5 text-[#0D9B75]" />
              <span>प्रशिक्षित मशीन लर्निंग मॉडल (Trained Clinical ML Models)</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#16352D] tracking-tight">
              AI स्वास्थ्य जोखिम विश्लेषक (AI Health Risk Predictor)
            </h1>
            <p className="text-sm sm:text-base text-[#3E6157] mt-1 max-w-2xl font-medium">
              क्लिवलैंड हृदय रोग डेटासेट (<code className="text-xs bg-[#F4FAF7] px-1.5 py-0.5 rounded text-[#0D9B75] font-semibold border border-[#D9F5EA]">cleaned_heart_dataset.csv</code>) एवं रैंडम फ़ॉरेस्ट मधुमेह मॉडल (<code className="text-xs bg-[#F4FAF7] px-1.5 py-0.5 rounded text-[#0D9B75] font-semibold border border-[#D9F5EA]">diabetes_model.pkl</code>) द्वारा संचालित वास्तविक क्लिनिकल जोखिम आकलन।
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/medicines"
              className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-white hover:bg-[#D9F5EA] border border-[#D9F5EA] text-[#16352D] font-bold text-xs sm:text-sm transition-colors shadow-2xs whitespace-nowrap"
            >
              <Pill className="w-4 h-4 text-[#0D9B75]" />
              <span>दवा व मेडिकल स्टोर (Medicines)</span>
            </Link>
            <Link
              href="/triage"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-xs sm:text-sm shadow-md shadow-[#0D9B75]/25 transition-transform active:scale-98 whitespace-nowrap"
            >
              <Stethoscope className="w-4 h-4" />
              <span>ट्रायज लक्षण जांच (Triage)</span>
            </Link>
          </div>
        </div>

        {/* Tab Selection */}
        <div className="flex gap-3 border-b border-slate-200 pb-2">
          <button
            onClick={() => setActiveTab('heart')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'heart'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <HeartPulse className="w-5 h-5" />
            <span>हृदय रोग जोखिम मॉडल (Heart Disease ML)</span>
          </button>

          <button
            onClick={() => setActiveTab('diabetes')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'diabetes'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Activity className="w-5 h-5" />
            <span>मधुमेह जोखिम मॉडल (Diabetes Random Forest)</span>
          </button>

          <button
            onClick={() => setActiveTab('disease')}
            className={`flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-bold text-sm sm:text-base transition-all ${
              activeTab === 'disease'
                ? 'bg-[#0D9B75] text-white shadow-md shadow-[#0D9B75]/25'
                : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200'
            }`}
          >
            <Sparkles className="w-5 h-5" />
            <span>रोग लक्षण मॉडल (Disease Symptom ML - 41 Diseases)</span>
          </button>
        </div>

        {/* TAB 1: HEART DISEASE */}
        {activeTab === 'heart' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Heart className="w-5 h-5 text-rose-600 fill-rose-600" />
                  <h2 className="font-extrabold text-lg text-slate-900">
                    रोगी का क्लिनिकल विवरण (Clinical Inputs)
                  </h2>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">नमूने:</span>
                  <button
                    onClick={() => applyHeartPreset('healthy')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  >
                    सामान्य (Low)
                  </button>
                  <button
                    onClick={() => applyHeartPreset('moderate')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                  >
                    मध्यम (Mod)
                  </button>
                  <button
                    onClick={() => applyHeartPreset('high')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  >
                    अति-गंभीर (High)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आयु (Age in years)
                  </label>
                  <input
                    type="number"
                    value={heartInput.age}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, age: Number(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  />
                </div>

                {/* Sex */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लिंग (Sex)
                  </label>
                  <select
                    value={heartInput.sex}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, sex: e.target.value as any })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  >
                    <option value="MALE">पुरुष (Male - 1)</option>
                    <option value="FEMALE">महिला (Female - 0)</option>
                  </select>
                </div>

                {/* Chest Pain Type (cp) */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    सीने में दर्द का प्रकार (Chest Pain Type - cp)
                  </label>
                  <select
                    value={heartInput.cp}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, cp: Number(e.target.value) })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  >
                    <option value={0}>0: Typical Angina (विशिष्ट एंजाइना - भारी दबाव व जकड़न)</option>
                    <option value={1}>1: Atypical Angina (अविशिष्ट सीने में दर्द)</option>
                    <option value={2}>2: Non-anginal Chest Pain (गैर-एंजाइना दर्द / गैस्ट्रिक)</option>
                    <option value={3}>3: Asymptomatic (कोई सीने का दर्द नहीं)</option>
                  </select>
                </div>

                {/* Resting BP (trestbps) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    रक्तचाप (Resting Blood Pressure - mmHg)
                  </label>
                  <input
                    type="number"
                    value={heartInput.trestbps}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, trestbps: Number(e.target.value) || 0 })
                    }
                    placeholder="120"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">सामान्य: 110 - 130 mmHg</span>
                </div>

                {/* Serum Cholesterol (chol) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    कोलेस्ट्रॉल (Serum Cholesterol - mg/dL)
                  </label>
                  <input
                    type="number"
                    value={heartInput.chol}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, chol: Number(e.target.value) || 0 })
                    }
                    placeholder="200"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">सामान्य: 150 - 220 mg/dL</span>
                </div>

                {/* Max Heart Rate (thalach) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    अधिकतम हृदय गति (Max Heart Rate - bpm)
                  </label>
                  <input
                    type="number"
                    value={heartInput.thalach}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, thalach: Number(e.target.value) || 0 })
                    }
                    placeholder="150"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">सामान्य: 70 - 180 bpm</span>
                </div>

                {/* ST Depression (oldpeak) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    ईसीजी एसटी डिप्रेशन (ST Depression - mm)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={heartInput.oldpeak}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, oldpeak: Number(e.target.value) || 0 })
                    }
                    placeholder="0.0"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  />
                  <span className="text-[10px] text-slate-400">&gt; 1.5 mm संकेत करता है इस्केमिया</span>
                </div>

                {/* Exercise Induced Angina (exang) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    व्यायाम/मेहनत से दर्द (Exercise Angina - exang)
                  </label>
                  <select
                    value={heartInput.exang ? 1 : 0}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, exang: Number(e.target.value) === 1 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  >
                    <option value={0}>नहीं (No - 0)</option>
                    <option value={1}>हाँ (Yes - 1)</option>
                  </select>
                </div>

                {/* Fasting Blood Sugar > 120 (fbs) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    खाली पेट शुगर &gt; 120 (Fasting Blood Sugar)
                  </label>
                  <select
                    value={heartInput.fbs ? 1 : 0}
                    onChange={(e) =>
                      setHeartInput({ ...heartInput, fbs: Number(e.target.value) === 1 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-rose-500"
                  >
                    <option value={0}>सामान्य (&lt; 120 mg/dL)</option>
                    <option value={1}>उच्च (&gt; 120 mg/dL - 1)</option>
                  </select>
                </div>
              </div>

              <button
                onClick={handleCalculateHeart}
                className="w-full py-3.5 px-6 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-rose-600/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                <HeartPulse className="w-5 h-5" />
                <span>हृदय जोखिम की गणना करें (Predict Heart Risk)</span>
              </button>
            </div>

            {/* Results Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {heartResult && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      ML विश्लेषण परिणाम
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        heartResult.riskLevel === 'CRITICAL' || heartResult.riskLevel === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : heartResult.riskLevel === 'MODERATE'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {heartResult.riskLevel} RISK
                    </span>
                  </div>

                  {/* Probability Gauge */}
                  <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900">
                      {heartResult.percentage}%
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      हृदय संबंधी जटिलता की संभावना (Cardiovascular Probability)
                    </p>
                    <div className="w-48 bg-slate-200 h-2.5 rounded-full mx-auto mt-3 overflow-hidden">
                      <div
                        className={`h-full ${
                          heartResult.percentage >= 60
                            ? 'bg-red-600'
                            : heartResult.percentage >= 35
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${heartResult.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      मॉडल द्वारा पाए गए जोखिम कारक (Risk Factors):
                    </h4>
                    <ul className="space-y-1.5">
                      {heartResult.factors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-800 p-2 rounded-xl bg-rose-50/50 border border-rose-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0"></span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advice */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      क्लिनिकल दिशानिर्देश (Doctor Recommendations):
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {heartResult.advice.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                    <span className="font-bold">सत्यापित मॉडल: </span> {heartResult.modelUsed}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: DIABETES */}
        {activeTab === 'diabetes' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Form (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5 text-blue-600" />
                  <h2 className="font-extrabold text-lg text-slate-900">
                    रोगी का मेटाबोलिक विवरण (Diabetes Parameters)
                  </h2>
                </div>
                {/* Presets */}
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">नमूने:</span>
                  <button
                    onClick={() => applyDiabetesPreset('healthy')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
                  >
                    सामान्य (Low)
                  </button>
                  <button
                    onClick={() => applyDiabetesPreset('prediabetic')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
                  >
                    प्री-डायबिटीज (Mod)
                  </button>
                  <button
                    onClick={() => applyDiabetesPreset('high')}
                    className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
                  >
                    मधुमेह ग्रस्त (High)
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Age */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    आयु (Age in years)
                  </label>
                  <input
                    type="number"
                    value={diabetesInput.age}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, age: Number(e.target.value) || 0 })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  />
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    लिंग (Gender)
                  </label>
                  <select
                    value={diabetesInput.gender}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, gender: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="MALE">पुरुष (Male)</option>
                    <option value="FEMALE">महिला (Female)</option>
                    <option value="OTHER">अन्य (Other)</option>
                  </select>
                </div>

                {/* Blood Glucose Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    रक्त शर्करा (Fasting Blood Glucose - mg/dL)
                  </label>
                  <input
                    type="number"
                    value={diabetesInput.bloodGlucose}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, bloodGlucose: Number(e.target.value) || 0 })
                    }
                    placeholder="100"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">सामान्य: 70 - 99 mg/dL | &gt;126 मधुमेह</span>
                </div>

                {/* HbA1c Level */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    एचबीए1सी (HbA1c %)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={diabetesInput.hba1c}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, hba1c: Number(e.target.value) || 0 })
                    }
                    placeholder="5.4"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">&lt;5.7% सामान्य | 5.7-6.4% प्री-डायबिटीज | &gt;6.5% मधुमेह</span>
                </div>

                {/* Body Mass Index (BMI) */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    बॉडी मास इंडेक्स (BMI - kg/m²)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={diabetesInput.bmi}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, bmi: Number(e.target.value) || 0 })
                    }
                    placeholder="24.5"
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  />
                  <span className="text-[10px] text-slate-400">18.5 - 24.9 सामान्य | 25+ अधिक वजन</span>
                </div>

                {/* Smoking History */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    धूम्रपान इतिहास (Smoking History)
                  </label>
                  <select
                    value={diabetesInput.smokingHistory}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, smokingHistory: e.target.value })
                    }
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm font-semibold focus:outline-hidden focus:border-blue-500"
                  >
                    <option value="never">कभी नहीं (Never Smoked)</option>
                    <option value="current">वर्तमान धूम्रपानकर्ता (Current Smoker)</option>
                    <option value="former">पहले पीते थे, अब छोड़ दिया (Former Smoker)</option>
                    <option value="ever">कभी-कभार (Ever Smoked)</option>
                    <option value="not current">वर्तमान में नहीं (Not Current)</option>
                  </select>
                </div>

                {/* Hypertension Checkbox */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="hyperCheck"
                    checked={Boolean(diabetesInput.hypertension)}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, hypertension: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="hyperCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    उच्च रक्तचाप (Hypertension) का इतिहास है
                  </label>
                </div>

                {/* Heart Disease Checkbox */}
                <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="checkbox"
                    id="heartCheck"
                    checked={Boolean(diabetesInput.heartDisease)}
                    onChange={(e) =>
                      setDiabetesInput({ ...diabetesInput, heartDisease: e.target.checked })
                    }
                    className="w-4 h-4 rounded text-blue-600"
                  />
                  <label htmlFor="heartCheck" className="text-xs font-bold text-slate-700 cursor-pointer">
                    हृदय रोग (Heart Disease) का इतिहास है
                  </label>
                </div>
              </div>

              <button
                onClick={handleCalculateDiabetes}
                className="w-full py-3.5 px-6 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-sm sm:text-base shadow-md shadow-blue-600/25 transition-transform active:scale-98 flex items-center justify-center gap-2"
              >
                <Activity className="w-5 h-5" />
                <span>मधुमेह जोखिम की गणना करें (Predict Diabetes Risk)</span>
              </button>
            </div>

            {/* Results Card (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {diabetesResult && (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                    <span className="text-xs font-bold text-slate-400 uppercase">
                      Random Forest परिणाम
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-extrabold ${
                        diabetesResult.riskLevel === 'HIGH'
                          ? 'bg-red-600 text-white'
                          : diabetesResult.riskLevel === 'PRE_DIABETES'
                          ? 'bg-amber-500 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {diabetesResult.riskLevel.replace('_', ' ')}
                    </span>
                  </div>

                  {/* Probability Gauge */}
                  <div className="text-center py-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="text-4xl sm:text-5xl font-black text-slate-900">
                      {diabetesResult.percentage}%
                    </div>
                    <p className="text-xs font-bold text-slate-500 mt-1">
                      मधुमेह (टाइप-2) होने की संभावना (Diabetes Probability)
                    </p>
                    <div className="w-48 bg-slate-200 h-2.5 rounded-full mx-auto mt-3 overflow-hidden">
                      <div
                        className={`h-full ${
                          diabetesResult.percentage >= 50
                            ? 'bg-red-600'
                            : diabetesResult.percentage >= 25
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${diabetesResult.percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Contributing Factors */}
                  <div>
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      मॉडल द्वारा चिन्हित कारक (Contributing Factors):
                    </h4>
                    <ul className="space-y-1.5">
                      {diabetesResult.factors.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs font-semibold text-slate-800 p-2 rounded-xl bg-blue-50/50 border border-blue-100">
                          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 shrink-0"></span>
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Advice */}
                  <div className="pt-3 border-t border-slate-100">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                      आहार व जीवनशैली मार्गदर्शन (Diet & Lifestyle Guidance):
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-700">
                      {diabetesResult.advice.map((adv, i) => (
                        <li key={i} className="flex items-start gap-2">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{adv}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 text-[11px] text-slate-500">
                    <span className="font-bold">सत्यापित मॉडल: </span> {diabetesResult.modelUsed}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 3: DISEASE SYMPTOM PREDICTOR (41 DISEASES • 131 SYMPTOMS) */}
        {activeTab === 'disease' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Input Selection (7 Cols) */}
            <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xs space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#D9F5EA]">
                <div className="flex items-center gap-2">
                  <Stethoscope className="w-5 h-5 text-[#0D9B75]" />
                  <h2 className="font-extrabold text-lg text-[#16352D]">
                    रोग लक्षण चयन (Select Patient Symptoms)
                  </h2>
                </div>
                <div className="text-xs font-bold text-[#0D9B75] bg-[#D9F5EA] px-3 py-1 rounded-full">
                  {selectedDiseaseSymptoms.length} लक्षण चयनित (Selected)
                </div>
              </div>

              {/* Clinical Presets */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold text-[#3E6157] uppercase tracking-wider block">
                  त्वरित नैदानिक नमूने (Clinical Presets):
                </span>
                <div className="flex flex-wrap gap-2">
                  {[
                    { label: 'मलेरिया (Malaria)', syms: ['chills', 'high_fever', 'sweating', 'headache', 'nausea'] },
                    { label: 'डेंगू (Dengue)', syms: ['high_fever', 'joint_pain', 'loss_of_appetite', 'red_spots_over_body', 'muscle_pain'] },
                    { label: 'निमोनिया (Pneumonia)', syms: ['cough', 'high_fever', 'breathlessness', 'chest_pain', 'phlegm'] },
                    { label: 'पीलिया (Jaundice)', syms: ['yellowish_skin', 'dark_urine', 'vomiting', 'fatigue', 'itching'] },
                    { label: 'टाइफाइड (Typhoid)', syms: ['high_fever', 'chills', 'fatigue', 'headache', 'abdominal_pain', 'diarrhoea'] },
                    { label: 'डायबिटीज (Diabetes)', syms: ['polyuria', 'fatigue', 'increased_appetite', 'weight_loss'] },
                    { label: 'फंगल (Fungal)', syms: ['itching', 'skin_rash', 'nodal_skin_eruptions'] },
                  ].map((p, i) => (
                    <button
                      key={i}
                      onClick={() => applyDiseasePreset(p.syms)}
                      className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#F4FAF7] text-[#16352D] hover:bg-[#D9F5EA] border border-[#D9F5EA] transition-all"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Symptom Filter/Search */}
              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="लक्षण खोजें / Search symptom (e.g. fever, cough, pain, vomiting, rash)..."
                  value={diseaseSearch}
                  onChange={(e) => setDiseaseSearch(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#D9F5EA] text-sm focus:outline-hidden focus:ring-2 focus:ring-[#0D9B75] bg-[#F4FAF7]"
                />
              </div>

              {/* Interactive Symptom Chips Grid */}
              <div className="space-y-3">
                <span className="text-[11px] font-bold text-[#3E6157] uppercase tracking-wider block">
                  मुख्य लक्षण सूची (131 Clinical Symptoms):
                </span>
                <div className="flex flex-wrap gap-2 max-h-96 overflow-y-auto p-1 border border-[#D9F5EA]/60 rounded-2xl">
                  {[
                    'high_fever', 'chills', 'sweating', 'shivering', 'mild_fever', 'fatigue', 'weight_loss', 'malaise',
                    'headache', 'dizziness', 'altered_sensorium', 'loss_of_balance', 'unsteadiness', 'slurred_speech',
                    'cough', 'breathlessness', 'chest_pain', 'phlegm', 'sinus_pressure', 'runny_nose', 'congestion', 'throat_irritation',
                    'stomach_pain', 'acidity', 'vomiting', 'nausea', 'indigestion', 'abdominal_pain', 'diarrhoea', 'constipation',
                    'itching', 'skin_rash', 'nodal_skin_eruptions', 'red_spots_over_body', 'yellowish_skin', 'yellowing_of_eyes', 'blister',
                    'joint_pain', 'knee_pain', 'back_pain', 'neck_pain', 'muscle_pain', 'muscle_weakness', 'swelling_joints',
                    'polyuria', 'increased_appetite', 'excessive_hunger', 'burning_micturition', 'dark_urine', 'yellow_urine',
                    'palpitations', 'fast_heart_rate', 'loss_of_appetite', 'pain_behind_the_eyes', 'blurred_and_distorted_vision',
                    'dehydration', 'sunken_eyes', 'patches_in_throat', 'cold_hands_and_feets', 'lethargy', 'anxiety'
                  ]
                    .filter((sym) =>
                      diseaseSearch
                        ? sym.toLowerCase().includes(diseaseSearch.toLowerCase().replace(/\s+/g, '_'))
                        : true
                    )
                    .map((sym) => {
                      const isSelected = selectedDiseaseSymptoms.includes(sym);
                      return (
                        <button
                          key={sym}
                          onClick={() => toggleDiseaseSymptom(sym)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                            isSelected
                              ? 'bg-[#0D9B75] text-white shadow-xs'
                              : 'bg-[#F4FAF7] text-[#16352D] hover:bg-[#D9F5EA] border border-[#D9F5EA]'
                          }`}
                        >
                          <span>{isSelected ? '✓' : '+'}</span>
                          <span className="capitalize">{sym.replace(/_/g, ' ')}</span>
                        </button>
                      );
                    })}
                </div>
              </div>
            </div>

            {/* Results Sidebar (5 Cols) */}
            <div className="lg:col-span-5 space-y-6">
              {diseaseResult ? (
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xs space-y-6">
                  <div className="flex items-center justify-between pb-3 border-b border-[#D9F5EA]">
                    <span className="text-xs font-bold text-[#3E6157] uppercase tracking-wider">
                      मशीन लर्निंग विश्लेषण परिणाम
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-black uppercase ${
                        diseaseResult.topDisease.urgency === 'RED'
                          ? 'bg-red-600 text-white'
                          : diseaseResult.topDisease.urgency === 'ORANGE'
                          ? 'bg-orange-500 text-white'
                          : diseaseResult.topDisease.urgency === 'YELLOW'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {diseaseResult.topDisease.urgency} URGENCY
                    </span>
                  </div>

                  {/* Top Predicted Disease */}
                  <div className="space-y-2">
                    <span className="text-xs font-bold text-[#0D9B75] uppercase">
                      सर्वाधिक संभावित रोग (Top Diagnosis):
                    </span>
                    <h3 className="text-2xl font-black text-[#16352D]">
                      {language === 'bho'
                        ? diseaseResult.topDisease.diseaseBho
                        : language === 'hi'
                        ? diseaseResult.topDisease.diseaseHi
                        : diseaseResult.topDisease.disease}
                    </h3>
                    <p className="text-xs font-semibold text-[#3E6157]">
                      {diseaseResult.topDisease.disease}
                    </p>
                  </div>

                  {/* Confidence Gauge */}
                  <div className="p-4 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] space-y-2">
                    <div className="flex justify-between items-center text-xs font-bold">
                      <span className="text-[#3E6157]">मॉडल विश्वसनीयता (Confidence):</span>
                      <span className="text-lg font-black text-[#0D9B75]">{diseaseResult.topDisease.percentage}%</span>
                    </div>
                    <div className="w-full bg-[#D9F5EA] h-3 rounded-full overflow-hidden p-0.5">
                      <div
                        className="h-full bg-gradient-to-r from-[#0D9B75] to-[#0A8262] rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(diseaseResult.topDisease.percentage, 100)}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[11px] text-[#3E6157] font-semibold pt-1">
                      <span>Severity Score: {diseaseResult.cumulativeSeverityScore}</span>
                      <span>Symptoms Matched: {diseaseResult.totalSymptomsReported}</span>
                    </div>
                  </div>

                  {/* Clinical Description */}
                  <div className="space-y-1.5">
                    <h4 className="text-xs font-bold text-[#16352D] uppercase tracking-wider">
                      रोग का नैदानिक विवरण (Medical Overview):
                    </h4>
                    <p className="text-xs text-[#3E6157] leading-relaxed p-3 rounded-xl bg-[#F4FAF7] border border-[#D9F5EA]">
                      {diseaseResult.topDisease.description}
                    </p>
                  </div>

                  {/* Precautions */}
                  {diseaseResult.topDisease.precautions.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="text-xs font-bold text-[#16352D] uppercase tracking-wider">
                        डॉक्टरी सावधानियां व परहेज (Clinical Precautions):
                      </h4>
                      <ul className="space-y-1.5">
                        {diseaseResult.topDisease.precautions.map((prec, i) => (
                          <li
                            key={i}
                            className="flex items-start gap-2 text-xs font-bold text-[#16352D] p-2 rounded-xl bg-[#F4FAF7] border border-[#D9F5EA]"
                          >
                            <span className="w-4 h-4 rounded-full bg-[#0D9B75] text-white flex items-center justify-center text-[10px] shrink-0 font-black">
                              {i + 1}
                            </span>
                            <span className="capitalize">{prec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Differential Diagnoses */}
                  <div className="space-y-2 pt-2 border-t border-[#D9F5EA]">
                    <h4 className="text-xs font-bold text-[#3E6157] uppercase tracking-wider">
                      अन्य संभावित विकल्प (Differential Diagnoses):
                    </h4>
                    <div className="space-y-1.5">
                      {diseaseResult.differentialDiagnoses.map((alt, i) => (
                        <div
                          key={i}
                          className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded-lg bg-[#F4FAF7]"
                        >
                          <span className="font-semibold text-[#16352D]">
                            {language === 'bho'
                              ? alt.diseaseBho
                              : language === 'hi'
                              ? alt.diseaseHi
                              : alt.disease}
                          </span>
                          <span className="font-black text-[#0D9B75]">{alt.percentage}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#F4FAF7] border border-[#D9F5EA] text-[11px] text-[#3E6157]">
                    <span className="font-bold">प्रशिक्षित मॉडल: </span> {diseaseResult.modelUsed}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-3xl p-8 border border-[#D9F5EA] text-center space-y-3">
                  <Stethoscope className="w-8 h-8 text-[#0D9B75] mx-auto" />
                  <h3 className="font-bold text-base text-[#16352D]">कोई लक्षण चयनित नहीं</h3>
                  <p className="text-xs text-[#3E6157]">
                    कृपया बाईं ओर दी गई सूची से रोगी के लक्षण चुनें या किसी त्वरित नमूने पर क्लिक करें।
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


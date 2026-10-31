'use client';

import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  Calendar,
  CheckCircle2,
  ChevronRight,
  Download,
  Eye,
  FileCheck,
  FileText,
  Heart,
  HeartPulse,
  LayoutDashboard,
  MapPin,
  Pill,
  Plus,
  Search,
  Settings,
  Sparkles,
  Stethoscope,
  Trash2,
  User,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

const HEALTH_RECORDS_LIST = [
  {
    id: 'rec_1',
    title: 'Blood Test Report (CBC & Sugar)',
    date: '02 Oct 2026',
    facility: 'PHC Gorakhpur',
    doctor: 'Dr. Priya Sharma',
    type: 'report',
    status: 'Normal',
    iconColor: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  },
  {
    id: 'rec_2',
    title: 'Chest X-Ray Digital Report',
    date: '05 Aug 2026',
    facility: 'District Hospital Gorakhpur',
    doctor: 'Dr. Neha Singh',
    type: 'report',
    status: 'Clear',
    iconColor: 'bg-sky-50 text-sky-600 border-sky-200',
  },
  {
    id: 'rec_3',
    title: 'Clinical Prescription & Advice',
    date: '05 Aug 2026',
    facility: 'Community Health Centre',
    doctor: 'Dr. Ramesh Kumar',
    type: 'prescription',
    status: 'Completed',
    iconColor: 'bg-purple-50 text-purple-600 border-purple-200',
  },
  {
    id: 'rec_4',
    title: 'Adult Booster Vaccination Record',
    date: '15 Jan 2026',
    facility: 'Community Health Centre (CHC)',
    doctor: 'ANM Rekha Devi',
    type: 'vaccine',
    status: 'Verified',
    iconColor: 'bg-amber-50 text-amber-600 border-amber-200',
  },
];

const LAB_TEST_DETAILS = [
  { name: 'Hemoglobin', result: '13.2 g/dL', normal: '12 - 16', status: 'Normal' },
  { name: 'WBC Count', result: '7,800 /uL', normal: '4,000 - 11,000', status: 'Normal' },
  { name: 'Platelets', result: '2.5 L/uL', normal: '1.5 - 4.5', status: 'Normal' },
  { name: 'Blood Sugar (Fasting)', result: '92 mg/dL', normal: '70 - 99', status: 'Normal' },
  { name: 'Cholesterol Total', result: '168 mg/dL', normal: '125 - 200', status: 'Normal' },
];

export default function HealthRecordsPage() {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'reports' | 'prescriptions' | 'history'>('reports');
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRecords = HEALTH_RECORDS_LIST.filter((r) => {
    if (activeTab === 'prescriptions') return r.type === 'prescription';
    if (activeTab === 'reports') return r.type === 'report' || r.type === 'vaccine';
    return true;
  });

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
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75] transition-colors"
            >
              <Video className="w-4 h-4 text-[#3E6157]" />
              <span>Teleconsultation</span>
            </Link>

            <Link
              href="/patient/records"
              className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-black bg-[#0D9B75] text-white shadow-sm shadow-[#0D9B75]/25"
            >
              <FileText className="w-4 h-4 text-white" />
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

        <div className="pt-6 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-100 text-center space-y-1">
            <Heart className="w-5 h-5 text-emerald-600 fill-emerald-600 mx-auto" />
            <div className="font-extrabold text-xs text-emerald-950">
              ABHA & DPDP Compliant
            </div>
            <p className="text-[10px] text-emerald-700">Encrypted personal health records</p>
          </div>
        </div>
      </aside>

      {/* 2. Main Health Records View (Section 5 & 12) */}
      <main className="flex-1 p-4 sm:p-6 lg:p-8 space-y-6 max-w-6xl">
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-950">My Health Records</h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Access your past lab reports, clinical prescriptions and medical history.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => alert('Downloading all records as a combined zip archive...')}
              className="px-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-bold text-xs flex items-center gap-2 shadow-xs transition-colors"
            >
              <Download className="w-4 h-4 text-emerald-600" />
              <span>Download All</span>
            </button>

            <Link
              href="/triage"
              className="gradient-emerald-btn px-4 py-2.5 rounded-2xl font-black text-xs flex items-center gap-2 shadow-xs"
            >
              <Plus className="w-4 h-4" />
              <span>New Checkup</span>
            </Link>
          </div>
        </div>

        {/* Search Bar & Tabs */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-3 rounded-2xl border border-slate-200 shadow-xs">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              onClick={() => setActiveTab('reports')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'reports'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Reports
            </button>
            <button
              onClick={() => setActiveTab('prescriptions')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'prescriptions'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Prescriptions
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 sm:flex-none px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'history'
                  ? 'bg-emerald-500 text-white font-black shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              History
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search records..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:outline-hidden focus:border-emerald-500"
            />
          </div>
        </div>

        {/* Record Cards List (Section 5) */}
        <div className="space-y-3">
          {filteredRecords.map((rec) => (
            <div
              key={rec.id}
              className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 hover:border-emerald-300 transition-all shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-center gap-4">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold shrink-0 border ${rec.iconColor}`}
                >
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm sm:text-base group-hover:text-emerald-700 transition-colors">
                    {rec.title}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 text-xs text-slate-500 mt-0.5">
                    <span className="font-semibold text-slate-700">{rec.date}</span>
                    <span>•</span>
                    <span>{rec.facility}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">{rec.doctor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <button
                  onClick={() => setSelectedReport(rec)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-600" />
                  <span>View</span>
                </button>

                <button
                  onClick={() => alert(`Downloading ${rec.title} as PDF`)}
                  className="px-4 py-2 rounded-xl gradient-emerald-btn text-xs font-black flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Report Detail Modal (Section 12 of Mockup) */}
        {selectedReport && (
          <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white text-slate-900 rounded-3xl max-w-2xl w-full p-6 sm:p-8 space-y-6 shadow-2xl overflow-y-auto max-h-[90vh]">
              {/* Modal Header */}
              <div className="flex items-start justify-between border-b pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center font-bold">
                    <FileCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-lg sm:text-xl font-black text-slate-950">
                      {selectedReport.title}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {selectedReport.date} • {selectedReport.facility}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedReport(null)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Lab Parameters Table (Exact structure as Section 12) */}
              <div className="space-y-3">
                <span className="text-xs font-black text-slate-700 uppercase tracking-wider block">
                  Diagnostic Parameters & Biomarkers
                </span>

                <div className="overflow-x-auto rounded-2xl border border-slate-200">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
                      <tr>
                        <th className="py-3 px-4">Test Name</th>
                        <th className="py-3 px-4">Result</th>
                        <th className="py-3 px-4">Normal Range</th>
                        <th className="py-3 px-4 text-right">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 font-medium">
                      {LAB_TEST_DETAILS.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-3 px-4 font-bold text-slate-900">{row.name}</td>
                          <td className="py-3 px-4 font-extrabold text-emerald-700">{row.result}</td>
                          <td className="py-3 px-4 text-slate-500">{row.normal}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 font-bold text-[10px] border border-emerald-200">
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Doctor's Remark */}
              <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-100 space-y-1">
                <div className="text-xs font-bold text-emerald-900">Physician's Impression:</div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  All hemogram values and fasting blood glucose are well within physiological limits. Recommend repeating periodic routine check in 6 months.
                </p>
              </div>

              {/* Modal Footer Actions */}
              <div className="flex gap-3 pt-3 border-t">
                <button
                  onClick={() => alert('Report downloaded as PDF.')}
                  className="flex-1 gradient-emerald-btn py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Lab Report PDF</span>
                </button>
                <button
                  onClick={() => setSelectedReport(null)}
                  className="px-6 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs"
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

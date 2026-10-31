'use client';

import { RED_FLAG_RULES, RISK_MODIFIERS, TRIAGE_RULE_VERSION } from '@/lib/triage/rules';
import {
  Activity,
  AlertOctagon,
  BarChart2,
  Building2,
  CheckCircle2,
  Database,
  FileSpreadsheet,
  Layers,
  Plus,
  RefreshCw,
  ShieldAlert,
  Upload,
  Users,
} from 'lucide-react';
import React, { useEffect, useState } from 'react';
import {
  Bar,
  BarChart,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'ANALYTICS' | 'FACILITIES' | 'RULES'>('ANALYTICS');

  // CSV Import State
  const [csvText, setCsvText] = useState('');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // New Facility Form Modal
  const [showAddFacility, setShowAddFacility] = useState(false);
  const [newFac, setNewFac] = useState({
    name: '',
    nameHi: '',
    type: 'PHC',
    district: 'Sitapur',
    block: '',
    address: '',
    phone: '',
    lat: '27.5683',
    lng: '80.6828',
    openingHours: '24x7',
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [statsRes, facRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/facilities'),
      ]);
      const sData = await statsRes.json();
      const fData = await facRes.json();

      if (sData.stats) setStats(sData.stats);
      if (fData.facilities) setFacilities(fData.facilities);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateFacility = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newFac),
      });
      if (res.ok) {
        setShowAddFacility(false);
        fetchData();
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCsvImport = async () => {
    if (!csvText.trim()) return;
    setImportStatus('CSV पार्स एवं आयात हो रहा है...');

    try {
      const lines = csvText.trim().split('\n');
      const headers = lines[0].split(',').map((h) => h.trim());
      const records = [];

      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue;
        const values = lines[i].split(',').map((v) => v.trim());
        const item: any = {};
        headers.forEach((h, idx) => {
          item[h] = values[idx] || '';
        });
        if (item.name && item.type) {
          records.push(item);
        }
      }

      const res = await fetch('/api/facilities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(records),
      });

      const data = await res.json();
      if (data.success) {
        setImportStatus(`सफलतापूर्वक ${data.count} नए स्वास्थ्य केंद्र आयात किए गए!`);
        setCsvText('');
        fetchData();
      } else {
        setImportStatus('आयात विफल रहा।');
      }
    } catch {
      setImportStatus('CSV फ़ाइल प्रारूप अमान्य है।');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8 bg-[#F4FAF7] text-[#16352D] min-h-screen">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0D9B75] via-[#0A8262] to-[#08694F] text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <div className="inline-flex items-center gap-2 bg-[#D9F5EA] text-[#16352D] px-3 py-1 rounded-full text-xs font-black uppercase">
            जिला स्वास्थ्य प्रशासन कमान केंद्र
          </div>
          <h1 className="text-2xl sm:text-3xl font-black">
            जिला स्वास्थ्य निगरानी एवं नियंत्रण डैशबोर्ड
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            रीयल-टाइम ट्रायज वितरण, रेफरल क्षमता और प्राथमिक स्वास्थ्य केंद्रों का केंद्रीय प्रबंधन
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex bg-white/20 p-1.5 rounded-2xl border border-white/30 shrink-0">
          <button
            onClick={() => setActiveTab('ANALYTICS')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
              activeTab === 'ANALYTICS' ? 'bg-white text-[#16352D] shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            एनालिटिक्स चार्ट
          </button>
          <button
            onClick={() => setActiveTab('FACILITIES')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
              activeTab === 'FACILITIES' ? 'bg-white text-[#16352D] shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            अस्पताल प्रबंधन ({facilities.length})
          </button>
          <button
            onClick={() => setActiveTab('RULES')}
            className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-colors ${
              activeTab === 'RULES' ? 'bg-white text-[#16352D] shadow-xs' : 'text-white hover:bg-white/10'
            }`}
          >
            ट्रायज नियम परीक्षक
          </button>
        </div>
      </div>

      {/* TAB 1: ANALYTICS & CHARTS */}
      {activeTab === 'ANALYTICS' && stats && (
        <div className="space-y-8 animate-fadeIn">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">कुल मरीज मूल्यांकन</span>
              <div className="text-3xl font-black text-[#16352D] mt-1">{stats.totalAssessments}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">जनरेट हुए रेफरल</span>
              <div className="text-3xl font-black text-[#0D9B75] mt-1">{stats.totalReferrals}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">सक्रिय स्वास्थ्य सुविधाएं</span>
              <div className="text-3xl font-black text-[#0D9B75] mt-1">{stats.totalFacilities}</div>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#D9F5EA] shadow-xs">
              <span className="text-xs font-bold text-slate-500 uppercase">नियम प्रणाली संस्करण</span>
              <div className="text-xl font-black text-[#16352D] mt-2">{stats.ruleVersion}</div>
            </div>
          </div>

          {/* Visual Recharts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Severity Level Distribution */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9F5EA] shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-[#16352D] text-lg">
                  गंभीरता स्तर वितरण (Triage Urgency Breakdown)
                </h3>
                <p className="text-xs text-slate-500">
                  रेड (आपातकाल), ऑरेंज (आज ही), येलो (24-48h), ग्रीन (घरेलू)
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.severityDistribution}>
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                      {stats.severityDistribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Top Symptoms Reported */}
            <div className="bg-white p-6 rounded-3xl border border-[#D9F5EA] shadow-xs space-y-4">
              <div>
                <h3 className="font-extrabold text-[#16352D] text-lg">
                  शीर्ष लक्षण रिपोर्ट (Top Clinical Symptoms)
                </h3>
                <p className="text-xs text-slate-500">
                  नागरिकों एवं आशा कार्यकर्ताओं द्वारा दर्ज मुख्य लक्षण
                </p>
              </div>

              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.topSymptoms} layout="vertical">
                    <XAxis type="number" allowDecimals={false} />
                    <YAxis dataKey="symptom" type="category" width={140} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0D9B75" radius={[0, 8, 8, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: FACILITIES MANAGEMENT */}
      {activeTab === 'FACILITIES' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Management Actions */}
          <div className="bg-white p-6 rounded-3xl border border-[#D9F5EA] shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-[#16352D]">स्वास्थ्य केंद्र प्रबंधन (Facilities)</h2>
              <p className="text-xs text-slate-500">
                पीएचसी, सीएचसी और जिला अस्पतालों का विवरण देखें अथवा नई सुविधा जोड़ें
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowAddFacility(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#0D9B75] hover:bg-[#0A8262] text-white font-bold text-sm rounded-xl shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>नया केंद्र जोड़ें</span>
              </button>
            </div>
          </div>

          {/* CSV Bulk Import Box */}
          <div className="bg-white p-6 rounded-3xl border border-[#D9F5EA] space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-[#0D9B75]" />
                <h3 className="font-extrabold text-[#16352D] text-base">
                  बल्क CSV आयात (Bulk CSV Import)
                </h3>
              </div>
              <span className="text-xs text-slate-500 font-mono">
                name,type,district,address,phone,lat,lng
              </span>
            </div>

            <textarea
              rows={3}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="name,type,district,address,phone,lat,lng&#10;Primary Health Centre Raipur,PHC,Sitapur,Raipur Village,05862-211111,27.56,80.68"
              className="w-full p-3 rounded-xl border border-[#D9F5EA] font-mono text-xs bg-[#F4FAF7] focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
            />

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleCsvImport}
                className="flex items-center gap-2 px-5 py-2.5 bg-[#16352D] hover:bg-[#0D9B75] text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
              >
                <Upload className="w-4 h-4" />
                <span>CSV से आयात करें</span>
              </button>

              {importStatus && (
                <span className="text-xs font-bold text-[#0D9B75]">{importStatus}</span>
              )}
            </div>
          </div>

          {/* Facilities Table */}
          <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-[#16352D]">
                <thead className="bg-[#D9F5EA]/50 text-[#16352D] uppercase font-black text-xs">
                  <tr>
                    <th className="p-4">नाम</th>
                    <th className="p-4">प्रकार</th>
                    <th className="p-4">जिला/ब्लॉक</th>
                    <th className="p-4">फ़ोन</th>
                    <th className="p-4">जीपीएस (Lat/Lng)</th>
                    <th className="p-4">समय</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#D9F5EA]">
                  {facilities.map((f) => (
                    <tr key={f.id} className="hover:bg-[#F4FAF7]">
                      <td className="p-4 font-bold text-[#16352D]">
                        {f.nameHi || f.name}
                        {f.nameHi && <div className="text-xs text-slate-500 font-normal">{f.name}</div>}
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#D9F5EA] text-[#16352D] font-bold text-xs border border-[#D9F5EA]">
                          {f.type}
                        </span>
                      </td>
                      <td className="p-4">{f.district} {f.block ? `(${f.block})` : ''}</td>
                      <td className="p-4 font-mono text-xs">{f.phone}</td>
                      <td className="p-4 font-mono text-xs text-slate-500">
                        {f.lat.toFixed(4)}, {f.lng.toFixed(4)}
                      </td>
                      <td className="p-4 text-xs font-semibold">{f.openingHours}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: TRIAGE RULE VIEWER */}
      {activeTab === 'RULES' && (
        <div className="space-y-6 animate-fadeIn">
          <div className="bg-white p-6 rounded-3xl border border-[#D9F5EA] shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#16352D]">
                  पारदर्शी ट्रायज नियम परीक्षक (Clinical Rule Viewer)
                </h2>
                <p className="text-xs text-slate-500">
                  डॉक्टरों एवं चिकित्सा विशेषज्ञों द्वारा समीक्षा हेतु सक्रिय नियम
                </p>
              </div>
              <span className="px-3 py-1 rounded-full bg-[#D9F5EA] text-[#0D9B75] font-black text-xs">
                वर्जन: {TRIAGE_RULE_VERSION}
              </span>
            </div>
          </div>

          {/* Red Flag Rules List */}
          <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs p-6 space-y-4">
            <h3 className="text-lg font-black text-red-700 flex items-center gap-2">
              <AlertOctagon className="w-5 h-5" />
              <span>रेड फ्लैग नियम (Red Flag Rules - Always Win Priority)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RED_FLAG_RULES.map((rule) => (
                <div key={rule.id} className="p-4 rounded-2xl bg-red-50/50 border border-red-200 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="font-black text-red-800 text-xs">{rule.id}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-red-600 text-white">
                      RED
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{rule.titleHi}</h4>
                  <p className="text-xs text-slate-600 font-medium">{rule.reasonsHi[0]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Risk Modifiers List */}
          <div className="bg-white rounded-3xl border border-[#D9F5EA] shadow-xs p-6 space-y-4">
            <h3 className="text-lg font-black text-amber-800 flex items-center gap-2">
              <ShieldAlert className="w-5 h-5" />
              <span>जोखिम वृद्धिकारक (Risk Modifiers - Escalates Urgency)</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {RISK_MODIFIERS.map((mod) => (
                <div key={mod.id} className="p-4 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <span className="font-black text-amber-900 text-xs">{mod.id}</span>
                  <h4 className="font-bold text-slate-900 text-sm">{mod.nameHi}</h4>
                  <p className="text-xs text-slate-600">{mod.nameEn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Facility Modal */}
      {showAddFacility && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-[#D9F5EA]">
            <h3 className="text-xl font-extrabold text-[#16352D] mb-4">
              नया स्वास्थ्य केंद्र जोड़ें
            </h3>
            <form onSubmit={handleCreateFacility} className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">केंद्र का नाम (English):</label>
                <input
                  type="text"
                  required
                  value={newFac.name}
                  onChange={(e) => setNewFac({ ...newFac, name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D9F5EA] text-sm focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">हिंदी नाम (Hindi Name):</label>
                <input
                  type="text"
                  value={newFac.nameHi}
                  onChange={(e) => setNewFac({ ...newFac, nameHi: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D9F5EA] text-sm focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-bold text-[#16352D] mb-1">प्रकार:</label>
                  <select
                    value={newFac.type}
                    onChange={(e) => setNewFac({ ...newFac, type: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D9F5EA] text-sm font-semibold focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                  >
                    <option value="PHC">PHC</option>
                    <option value="CHC">CHC</option>
                    <option value="DISTRICT_HOSPITAL">DISTRICT_HOSPITAL</option>
                    <option value="SUB_CENTRE">SUB_CENTRE</option>
                    <option value="TELECONSULT_PARTNER">TELECONSULT_PARTNER</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#16352D] mb-1">फ़ोन:</label>
                  <input
                    type="text"
                    required
                    value={newFac.phone}
                    onChange={(e) => setNewFac({ ...newFac, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#D9F5EA] text-sm focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">पता (Address):</label>
                <input
                  type="text"
                  required
                  value={newFac.address}
                  onChange={(e) => setNewFac({ ...newFac, address: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-[#D9F5EA] text-sm focus:ring-2 focus:ring-[#0D9B75] focus:outline-hidden"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setShowAddFacility(false)}
                  className="flex-1 py-2.5 font-bold text-[#16352D] bg-[#D9F5EA] hover:bg-[#D9F5EA]/80 rounded-xl"
                >
                  रद्द करें
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 font-bold text-white bg-[#0D9B75] hover:bg-[#0A8262] rounded-xl shadow-xs transition-colors"
                >
                  सुरक्षित करें
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

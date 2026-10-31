'use client';

import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import { ArrowRight, CheckCircle2, Lock, Phone, ShieldCheck, User } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [village, setVillage] = useState('Gorakhpur');
  const [district, setDistrict] = useState('Gorakhpur');
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState('MALE');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          phone,
          password,
          name,
          age,
          sex,
          village,
          district,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Registration failed.');
        setLoading(false);
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Connection failed. Please check internet.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] flex items-center justify-center p-4 sm:p-6 relative antialiased">
      <div className="max-w-md w-full space-y-6">
        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xl space-y-6">
          {/* Header & Logo */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Logo theme="light" size="lg" />
            </div>
            <h1 className="text-2xl font-black text-[#16352D] pt-2">Create Your Account</h1>
            <p className="text-xs text-[#3E6157] font-medium">
              Join us for a healthier tomorrow. Quick & secure.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16352D] mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-[#0D9B75] absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75] font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#16352D] mb-1">Mobile Number</label>
              <div className="relative flex items-center">
                <div className="absolute left-4 text-xs font-bold text-[#3E6157]">+91</div>
                <input
                  type="tel"
                  required
                  maxLength={10}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter 10-digit mobile number"
                  className="w-full pl-14 pr-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75] font-medium"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">Age</label>
                <input
                  type="number"
                  min="1"
                  max="120"
                  value={age}
                  onChange={(e) => setAge(Number(e.target.value))}
                  className="w-full px-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] text-sm font-medium focus:bg-white focus:border-[#0D9B75]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#16352D] mb-1">Gender</label>
                <select
                  value={sex}
                  onChange={(e) => setSex(e.target.value)}
                  className="w-full px-3 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] text-sm font-medium focus:bg-white focus:border-[#0D9B75]"
                >
                  <option value="MALE">Male (पुरुष)</option>
                  <option value="FEMALE">Female (महिला)</option>
                  <option value="OTHER">Other (अन्य)</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a password"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:outline-hidden focus:border-emerald-500 font-medium"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Confirm Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75] font-medium"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-emerald-btn py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Creating Account...</span>
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="text-center text-xs text-[#3E6157] pt-2 border-t border-[#D9F5EA]">
            <span>Already have an account? </span>
            <Link href="/login" className="text-[#0D9B75] font-extrabold hover:underline">
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

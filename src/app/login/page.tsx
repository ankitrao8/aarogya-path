'use client';

import { Logo } from '@/components/Logo';
import { useTranslation } from '@/lib/i18n';
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  Lock,
  LogIn,
  Phone,
  ShieldCheck,
  User,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();

  const [identifier, setIdentifier] = useState('9876543210');
  const [password, setPassword] = useState('Aarogya@123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillQuickDemo = (id: string, pass: string) => {
    setIdentifier(id);
    setPassword(pass);
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Login failed. Please verify credentials.');
        setLoading(false);
        return;
      }

      const role = data.user?.role;
      if (role === 'ASHA') {
        router.push('/asha/dashboard');
      } else if (role === 'DOCTOR') {
        router.push('/doctor/dashboard');
      } else if (role === 'ADMIN') {
        router.push('/admin/dashboard');
      } else {
        router.push('/dashboard');
      }
      router.refresh();
    } catch {
      setError('Connection failed. Please check internet.');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F4FAF7] text-[#16352D] flex items-center justify-center p-4 sm:p-6 relative overflow-hidden antialiased">
      {/* Decorative Subtle Ambient Blobs */}
      <div className="w-96 h-96 rounded-full bg-[#D9F5EA]/50 blur-3xl absolute -top-10 -left-10 pointer-events-none" />
      <div className="w-96 h-96 rounded-full bg-[#0D9B75]/10 blur-3xl absolute -bottom-10 -right-10 pointer-events-none" />

      <div className="max-w-md w-full relative z-10 space-y-6">
        {/* Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#D9F5EA] shadow-xl space-y-6">
          {/* Logo at Header */}
          <div className="text-center space-y-2">
            <div className="flex justify-center">
              <Logo theme="light" size="lg" />
            </div>
            <h1 className="text-2xl font-black text-[#16352D] pt-2">Welcome Back!</h1>
            <p className="text-xs text-[#3E6157] leading-relaxed font-medium">
              Your health matters. Let's keep you on the path to better health.
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs font-bold text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#16352D] mb-1.5">
                Email / Mobile Number
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#0D9B75] absolute left-4 top-3.5" />
                <input
                  type="text"
                  required
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  placeholder="Enter your email or mobile number"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] placeholder-[#3E6157]/50 text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75]"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-[#16352D]">Password</label>
                <a href="#" className="text-[11px] text-[#0D9B75] hover:underline font-semibold">
                  Forgot Password?
                </a>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#0D9B75] absolute left-4 top-3.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-4 py-3 rounded-2xl bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D] placeholder-[#3E6157]/50 text-sm focus:outline-hidden focus:bg-white focus:border-[#0D9B75]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full gradient-emerald-btn py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <span>Signing in...</span>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Social / Phone OTP Divider */}
          <div className="relative text-center my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#D9F5EA]" />
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold text-[#3E6157] uppercase">
              Or continue with
            </span>
          </div>

          <div className="flex justify-center gap-3">
            <button
              type="button"
              onClick={() => fillQuickDemo('9876543210', 'Aarogya@123')}
              className="px-4 py-2.5 rounded-xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-xs font-bold text-[#16352D] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Google</span>
            </button>
            <button
              type="button"
              onClick={() => fillQuickDemo('9876543210', 'Aarogya@123')}
              className="px-4 py-2.5 rounded-xl bg-[#F4FAF7] hover:bg-[#D9F5EA] border border-[#D9F5EA] text-xs font-bold text-[#16352D] transition-colors flex items-center gap-2 cursor-pointer"
            >
              <span>Phone OTP</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="text-center text-xs text-[#3E6157] pt-2 border-t border-[#D9F5EA]">
            <span>Don't have an account? </span>
            <Link href="/register" className="text-[#0D9B75] font-extrabold hover:underline">
              Sign Up
            </Link>
          </div>
        </div>

        {/* 1-Click Fast Fill for Reviewers */}
        <div className="p-4 rounded-2xl bg-white border border-[#D9F5EA] text-center space-y-2 shadow-xs">
          <span className="text-[11px] font-bold text-[#3E6157] uppercase tracking-wide block">
            Demo Credentials
          </span>
          <div className="flex flex-wrap justify-center gap-2">
            <button
              onClick={() => fillQuickDemo('9876543210', 'Aarogya@123')}
              className="px-3 py-1 rounded-lg bg-[#D9F5EA] text-[#0D9B75] text-xs font-bold hover:bg-[#B8EBD7] cursor-pointer"
            >
              Patient
            </button>
            <button
              onClick={() => fillQuickDemo('9123456780', 'Asha@123')}
              className="px-3 py-1 rounded-lg bg-sky-100 text-sky-700 text-xs font-bold hover:bg-sky-200 cursor-pointer"
            >
              ASHA Worker
            </button>
            <button
              onClick={() => fillQuickDemo('9876501234', 'Doctor@123')}
              className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-bold hover:bg-purple-200 cursor-pointer"
            >
              Doctor
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

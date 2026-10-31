'use client';

import { DisclaimerBanner } from '@/components/DisclaimerBanner';
import { Logo } from '@/components/Logo';
import { Navbar } from '@/components/Navbar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Landing page has top navbar and footer
  const isLandingPage = pathname === '/';

  if (!isLandingPage) {
    // App pages (Dashboard, Triage, Facilities, Teleconsultation, Records, Settings, Auth)
    // get a clean, full-screen viewport without redundant top website navbars or footers
    return <main className="flex-1 min-h-screen w-full">{children}</main>;
  }

  return (
    <div className="min-h-screen flex flex-col w-full overflow-x-hidden">
      <DisclaimerBanner />
      <Navbar />
      <main className="flex-1 w-full overflow-x-hidden">{children}</main>

      {/* Landing Page Footer */}
      <footer className="bg-white text-[#16352D] py-12 px-4 sm:px-6 lg:px-8 border-t border-[#D9F5EA]">
        <div className="max-w-7xl mx-auto space-y-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-[#D9F5EA]">
            <Logo theme="light" size="lg" />
            <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-[#16352D]">
              <Link href="/" className="hover:text-[#0D9B75] transition-colors">
                Home
              </Link>
              <Link href="/dashboard" className="hover:text-[#0D9B75] transition-colors">
                Dashboard
              </Link>
              <Link href="/triage" className="hover:text-[#0D9B75] transition-colors">
                AI Symptom Checker
              </Link>
              <Link href="/medicines" className="hover:text-[#0D9B75] transition-colors">
                Medicines & Shops
              </Link>
              <Link href="/facilities" className="hover:text-[#0D9B75] transition-colors">
                Nearby Doctors
              </Link>
              <Link href="/teleconsultation" className="hover:text-[#0D9B75] transition-colors">
                Teleconsultation
              </Link>
              <Link href="/patient/records" className="hover:text-[#0D9B75] transition-colors">
                Health Records
              </Link>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-[#3E6157]">
            <p>
              © 2026 Aarogya Path (आरोग्य पथ). Health for Every Home • Swasth Gaon, Sashakt Bharat.
            </p>
            <div className="flex items-center gap-4">
              <span>DPDP Act 2023 Compliant</span>
              <span>•</span>
              <span>National Health Mission Standards</span>
              <span>•</span>
              <a href="tel:108" className="text-red-600 font-bold hover:underline">
                Emergency: 108
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

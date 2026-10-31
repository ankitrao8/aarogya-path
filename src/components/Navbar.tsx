'use client';

import { SUPPORTED_LANGUAGES, SupportedLanguage, useTranslation } from '@/lib/i18n';
import {
  Activity,
  ChevronDown,
  FileText,
  Globe,
  HeartPulse,
  LayoutDashboard,
  LogOut,
  MapPin,
  Menu,
  PhoneCall,
  Pill,
  Sparkles,
  Type,
  Video,
  X,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';

export function Navbar() {
  const { language, setLanguage, t } = useTranslation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);
  const [isLargeText, setIsLargeText] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const pathname = usePathname();
  const router = useRouter();
  const langMenuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target as Node)) {
        setLangMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch current user session
  useEffect(() => {
    fetch('/api/auth/me')
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setCurrentUser(data.user);
        } else {
          setCurrentUser(null);
        }
      })
      .catch(() => setCurrentUser(null));
  }, [pathname]);

  // Accessibility: Toggle large text mode
  const toggleLargeText = () => {
    const nextState = !isLargeText;
    setIsLargeText(nextState);
    if (nextState) {
      document.body.classList.add('large-text');
    } else {
      document.body.classList.remove('large-text');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      setCurrentUser(null);
      router.push('/');
      router.refresh();
    } catch (e) {
      console.error(e);
    }
  };

  const navLinks = [
    { name: 'Home', href: '/', icon: Activity },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Check Symptoms', href: '/triage', icon: Sparkles },
    { name: 'AI Predictor', href: '/health-checkup', icon: HeartPulse },
    { name: 'Medicines', href: '/medicines', icon: Pill },
    { name: 'Nearby Doctors', href: '/facilities', icon: MapPin },
    { name: 'Teleconsultation', href: '/teleconsultation', icon: Video },
    { name: 'Health Records', href: '/patient/records', icon: FileText },
  ];

  const currentLangObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === language) || SUPPORTED_LANGUAGES[0];

  return (
    <header className="sticky top-0 z-50 w-full overflow-x-clip transition-colors duration-200 border-b bg-white/95 backdrop-blur-md border-[#D9F5EA] text-[#16352D] shadow-xs">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20 gap-2 sm:gap-4">
          {/* Logo & Branding */}
          <Link href="/" className="flex items-center gap-2 shrink-0 focus:outline-hidden">
            <Logo theme="light" size="md" />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className={`px-2 xl:px-2.5 py-1.5 rounded-xl text-xs xl:text-sm font-semibold transition-all whitespace-nowrap ${
                    isActive
                      ? 'bg-[#0D9B75] text-white font-bold shadow-xs'
                      : 'text-[#16352D] hover:bg-[#D9F5EA] hover:text-[#0D9B75]'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Controls: Unified Language Selector, Accessibility & Auth */}
          <div className="hidden lg:flex items-center gap-2 xl:gap-3 shrink-0">
            {/* Unified Language Selector Dropdown */}
            <div className="relative" ref={langMenuRef}>
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#D9F5EA] text-xs font-bold transition-all bg-[#F4FAF7] text-[#16352D] hover:bg-[#D9F5EA] hover:border-[#0D9B75]/40 shadow-2xs"
                title="भाषा चुनें / Select Language"
                aria-expanded={langMenuOpen}
              >
                <Globe className="w-3.5 h-3.5 text-[#0D9B75]" />
                <span className="font-extrabold">{currentLangObj.nativeName}</span>
                <ChevronDown
                  className={`w-3 h-3 text-[#3E6157] transition-transform ${
                    langMenuOpen ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {langMenuOpen && (
                <div className="absolute right-0 mt-2 w-44 rounded-2xl border border-[#D9F5EA] bg-white shadow-xl py-1.5 z-50 text-[#16352D] animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-1 border-b border-[#D9F5EA]/60 text-[10px] font-bold text-[#3E6157] uppercase tracking-wider">
                    भाषा चुनें / Language
                  </div>
                  {SUPPORTED_LANGUAGES.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLanguage(lang.code as SupportedLanguage);
                        setLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2 text-xs font-semibold flex items-center justify-between transition-colors ${
                        language === lang.code
                          ? 'bg-[#D9F5EA] text-[#0D9B75] font-black'
                          : 'hover:bg-[#F4FAF7] text-[#16352D]'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        {language === lang.code && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0D9B75]" />
                        )}
                        <span>{lang.nativeName}</span>
                      </span>
                      <span className="text-[10px] opacity-70 uppercase font-mono">{lang.code}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Accessibility: Large Text Toggle */}
            <button
              onClick={toggleLargeText}
              title="Toggle Large Text for Better Readability"
              className={`p-1.5 px-2.5 rounded-xl border text-xs font-bold transition-colors flex items-center gap-1 ${
                isLargeText
                  ? 'bg-[#0D9B75] text-white border-[#0A8262] font-extrabold'
                  : 'bg-[#F4FAF7] text-[#16352D] border-[#D9F5EA] hover:bg-[#D9F5EA]'
              }`}
            >
              <Type className="w-3.5 h-3.5" />
              <span>{isLargeText ? 'A-' : 'A+'}</span>
            </button>

            {/* User Profile */}
            {currentUser && (
              <div className="flex items-center gap-2 shrink-0">
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all bg-[#D9F5EA] hover:bg-[#B8EBD7] text-[#16352D] border border-[#0D9B75]/30"
                >
                  <div className="w-5 h-5 rounded-full bg-[#0D9B75] text-white flex items-center justify-center font-black text-xs">
                    {currentUser.name ? currentUser.name.charAt(0).toUpperCase() : 'U'}
                  </div>
                  <span className="font-bold truncate max-w-[100px]">
                    {currentUser.name?.split(' ')[0] || 'User'}
                  </span>
                </Link>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 rounded-xl hover:bg-red-50 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>

          {/* Mobile Right Controls */}
          <div className="flex items-center gap-2 lg:hidden">
            <a
              href="tel:108"
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-red-600 text-white text-xs font-bold shadow-xs"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>108</span>
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-[#D9F5EA] text-[#16352D] bg-[#F4FAF7] hover:bg-[#D9F5EA]"
              aria-label="Toggle Navigation Menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#D9F5EA] px-4 pt-4 pb-8 space-y-4 bg-white text-[#16352D] shadow-xl">
          {/* Language Selector */}
          <div className="flex items-center justify-between pb-3 border-b border-[#D9F5EA]">
            <span className="text-xs font-bold uppercase tracking-wider text-[#3E6157]">Language:</span>
            <div className="flex flex-wrap gap-1.5">
              {SUPPORTED_LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => {
                    setLanguage(lang.code as SupportedLanguage);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                    language === lang.code
                      ? 'bg-[#0D9B75] text-white'
                      : 'bg-[#F4FAF7] text-[#16352D] border border-[#D9F5EA]'
                  }`}
                >
                  {lang.nativeName}
                </button>
              ))}
            </div>
          </div>

          {/* Mobile Links */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`p-3 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 ${
                    isActive
                      ? 'bg-[#0D9B75] text-white font-black shadow-xs'
                      : 'bg-[#F4FAF7] text-[#16352D] hover:bg-[#D9F5EA] border border-[#D9F5EA]/60'
                  }`}
                >
                  <link.icon className="w-4 h-4 text-[#0D9B75] shrink-0" />
                  <span className="truncate">{link.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Auth in Mobile Menu */}
          <div className="pt-3 border-t border-[#D9F5EA] flex items-center justify-between">
            {currentUser ? (
              <div className="w-full flex items-center justify-between">
                <span className="text-xs font-bold text-[#0D9B75] truncate">
                  Logged in: {currentUser.name || 'User'}
                </span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded-xl bg-red-100 text-red-700 font-bold text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="w-full flex gap-3">
                <Link
                  href="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl font-bold text-xs sm:text-sm bg-[#F4FAF7] border border-[#D9F5EA] text-[#16352D]"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex-1 text-center py-2.5 rounded-xl font-bold text-xs sm:text-sm gradient-emerald-btn"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

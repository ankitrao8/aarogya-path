import { ServiceWorkerRegister } from '@/components/ServiceWorkerRegister';
import { SiteShell } from '@/components/SiteShell';
import { I18nProvider } from '@/lib/i18n';
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Aarogya Path | Rural Telehealth Triage & Referral',
  description:
    'Smarter Health Access for a Healthier Tomorrow • Multilingual rural telehealth triage and doctor referral platform for India.',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="hi" className="h-full overflow-x-hidden">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#0D9B75" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
      </head>
      <body className="min-h-full flex flex-col bg-[#F4FAF7] text-[#16352D] antialiased overflow-x-hidden w-full max-w-full selection:bg-[#0D9B75] selection:text-white">
        <I18nProvider>
          <SiteShell>{children}</SiteShell>
          <ServiceWorkerRegister />
        </I18nProvider>
      </body>
    </html>
  );
}

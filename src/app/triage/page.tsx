import { SymptomWizard } from '@/components/SymptomWizard';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'लक्षण ट्रायज जांच | Aarogya Path Triage',
  description: 'Multilingual symptom intake and deterministic clinical rule triage for rural India.',
};

export default function TriagePage() {
  return (
    <div className="py-4">
      <SymptomWizard />
    </div>
  );
}

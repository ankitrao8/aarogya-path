'use client';

import { useTranslation } from '@/lib/i18n';
import { COMMON_SYMPTOMS, SymptomDefinition } from '@/lib/triage/symptoms';
import { isSpeechRecognitionAvailable, speakText, stopSpeaking } from '@/lib/voice';
import {
  Activity,
  AlertTriangle,
  Bone,
  Brain,
  CheckCircle2,
  Crosshair,
  Droplets,
  Flame,
  HeartPulse,
  Mic,
  MicOff,
  RefreshCw,
  Scissors,
  ShieldAlert,
  Skull,
  Smile,
  Thermometer,
  Volume2,
  Wind,
  Zap,
} from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';
import { BodyAreaId } from './BodyAreaPicker';

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  HeartPulse,
  Wind,
  Activity,
  Thermometer,
  AlertTriangle,
  Zap,
  Flame,
  RefreshCw,
  Droplets,
  Brain,
  Smile,
  Volume2,
  ShieldAlert,
  Skull,
  Crosshair,
  Bone,
  Scissors,
};

interface SymptomGridProps {
  selectedArea: BodyAreaId | null;
  selectedSymptoms: string[];
  onToggleSymptom: (id: string) => void;
  onAddSymptoms: (ids: string[]) => void;
}

export function SymptomGrid({
  selectedArea,
  selectedSymptoms,
  onToggleSymptom,
  onAddSymptoms,
}: SymptomGridProps) {
  const { speechCode, language, t } = useTranslation();
  const [voiceText, setVoiceText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [recognitionSupported, setRecognitionSupported] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    setRecognitionSupported(isSpeechRecognitionAvailable());
  }, []);

  const handleStartVoice = () => {
    if (!isSpeechRecognitionAvailable()) return;

    try {
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = speechCode;
      recognition.interimResults = true;
      recognition.continuous = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let transcript = '';
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setVoiceText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (err) {
      console.error('Error starting speech recognition:', err);
      setIsListening(false);
    }
  };

  const handleStopVoice = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  const handleAnalyzeText = async () => {
    if (!voiceText.trim()) return;
    setIsExtracting(true);
    try {
      const res = await fetch('/api/triage/extract-symptoms', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: voiceText }),
      });
      const data = await res.json();
      if (Array.isArray(data.symptoms) && data.symptoms.length > 0) {
        onAddSymptoms(data.symptoms);
        // Play positive confirmation sound / speech
        const confirmMsg =
          language === 'bho'
            ? 'लक्षण पहचानल गइल बा। कृपा क के आगे के सवालन के जवाब दीं।'
            : language === 'en'
            ? 'Symptoms identified. Please answer the safety questions.'
            : 'लक्षण पहचाने गए हैं। कृपया आगे के प्रश्नों के उत्तर दें।';
        speakText(confirmMsg, speechCode);
      } else {
        const noMatchMsg =
          language === 'bho'
            ? 'कवनो मुख्य लक्षण ना मिलल। कृपा क के नीचे दिहल सूची से लक्षण चुनीं।'
            : language === 'en'
            ? 'No primary symptom matched. Please select from the list below.'
            : 'कोई मुख्य लक्षण नहीं मिला। कृपया नीचे दी गई सूची से लक्षण चुनें।';
        speakText(noMatchMsg, speechCode);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsExtracting(false);
    }
  };

  const filteredSymptoms = selectedArea
    ? COMMON_SYMPTOMS.filter((s) => s.bodyArea === selectedArea)
    : COMMON_SYMPTOMS;

  return (
    <div className="space-y-6">
      {/* Voice & Free Text Input Section */}
      <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
        <label className="block font-bold text-slate-900 text-base md:text-lg mb-2">
          {t('triage.voicePrompt')}
        </label>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <input
              type="text"
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              placeholder="बोलें या लिखें... (जैसे: दम फूल रहा है, छाती में दर्द, तेज बुखार)"
              className="w-full px-4 py-3.5 rounded-xl border border-slate-300 focus:border-teal-700 text-slate-900 text-base shadow-xs"
            />
          </div>

          <div className="flex gap-2 shrink-0">
            {recognitionSupported ? (
              <button
                type="button"
                onClick={isListening ? handleStopVoice : handleStartVoice}
                className={`flex items-center gap-2 px-4 py-3.5 rounded-xl font-bold text-white transition-transform active:scale-95 ${
                  isListening
                    ? 'bg-red-600 hover:bg-red-700 animate-pulse'
                    : 'bg-teal-700 hover:bg-teal-800'
                }`}
                title={isListening ? t('triage.stopVoice') : t('triage.startVoice')}
                aria-label={isListening ? 'Stop listening' : 'Start voice recognition'}
              >
                {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                <span className="hidden sm:inline">
                  {isListening ? t('triage.stopVoice') : t('triage.startVoice')}
                </span>
              </button>
            ) : null}

            <button
              type="button"
              onClick={handleAnalyzeText}
              disabled={isExtracting || !voiceText.trim()}
              className="px-4 py-3.5 rounded-xl font-bold bg-[#0D9B75] hover:bg-[#0A8262] disabled:bg-slate-300 text-white transition-colors cursor-pointer shadow-xs"
            >
              {isExtracting ? 'जांच हो रही है...' : t('triage.extractSymptoms')}
            </button>
          </div>
        </div>

        {isListening && (
          <p className="text-teal-700 font-semibold text-sm mt-2 flex items-center gap-2 animate-pulse">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-600"></span>
            {t('triage.listeningNow')}
          </p>
        )}
      </div>

      {/* Symptom Tap Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-lg">
            {selectedArea ? 'चुने गए हिस्से के लक्षण:' : 'सभी सामान्य लक्षण:'}
          </h3>
          <span className="text-sm font-semibold text-teal-800 bg-teal-50 px-3 py-1 rounded-full border border-teal-200">
            {selectedSymptoms.length} चुने गए
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filteredSymptoms.map((symptom: SymptomDefinition) => {
            const isSelected = selectedSymptoms.includes(symptom.id);
            const IconComponent = ICON_MAP[symptom.icon] || Activity;

            return (
              <div
                key={symptom.id}
                className={`relative flex items-center justify-between p-3.5 rounded-xl border-2 transition-all ${
                  isSelected
                    ? 'border-teal-700 bg-teal-50/70 shadow-sm'
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                {/* Clickable Symptom Tap Area */}
                <button
                  type="button"
                  onClick={() => onToggleSymptom(symptom.id)}
                  className="flex items-center gap-3 flex-1 text-left py-1 pr-2 cursor-pointer focus:outline-hidden"
                >
                  <div
                    className={`w-11 h-11 rounded-lg flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-teal-700 text-white' : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    <IconComponent className="w-6 h-6" />
                  </div>

                  <div className="flex flex-col">
                    <span className="font-bold text-slate-900 text-base leading-snug">
                      {language === 'bho'
                        ? (symptom.labelBho || symptom.labelHi)
                        : (language === 'en' ? symptom.labelEn : symptom.labelHi)}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'bho'
                        ? symptom.labelEn
                        : (language === 'en' ? symptom.labelHi : symptom.labelEn)}
                    </span>
                  </div>
                </button>

                {/* Right controls: Audio pronunciation and Checkmark */}
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      stopSpeaking();
                      const textToSay = language === 'bho'
                        ? (symptom.pronounceTextBho || symptom.pronounceTextHi)
                        : (language === 'en' ? symptom.labelEn : symptom.pronounceTextHi);
                      speakText(textToSay, speechCode);
                    }}
                    className="p-2 rounded-lg text-slate-500 hover:text-teal-700 hover:bg-slate-100 transition-colors"
                    title={t('triage.listenPronounce')}
                    aria-label={`Listen pronunciation for ${language === 'bho' ? (symptom.labelBho || symptom.labelHi) : symptom.labelHi}`}
                  >
                    <Volume2 className="w-5 h-5" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onToggleSymptom(symptom.id)}
                    className="p-1 cursor-pointer"
                    aria-label={`Select ${symptom.labelHi}`}
                  >
                    <CheckCircle2
                      className={`w-6 h-6 ${
                        isSelected ? 'text-teal-700 fill-teal-100' : 'text-slate-300'
                      }`}
                    />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

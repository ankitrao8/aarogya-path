'use client';

import { useTranslation } from '@/lib/i18n';
import {
  COMMON_SYMPTOMS,
  FOLLOW_UP_QUESTIONS_REGISTRY,
  FollowUpQuestionDefinition,
} from '@/lib/triage/symptoms';
import { speakText, stopSpeaking } from '@/lib/voice';
import { AlertCircle, ArrowLeft, Check, HelpCircle, Volume2, X } from 'lucide-react';
import { useEffect, useState } from 'react';

interface FollowUpWizardProps {
  selectedSymptoms: string[];
  patientContext: any;
  onComplete: (answers: Record<string, string>) => void;
  onBack: () => void;
}

export function FollowUpWizard({
  selectedSymptoms,
  patientContext,
  onComplete,
  onBack,
}: FollowUpWizardProps) {
  const { speechCode, language, t } = useTranslation();

  // Aggregate questions based on selected symptoms
  const [questionList, setQuestionList] = useState<FollowUpQuestionDefinition[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    const questionIds = new Set<string>();

    selectedSymptoms.forEach((symId) => {
      const def = COMMON_SYMPTOMS.find((s) => s.id === symId);
      if (def?.followUpQuestions) {
        def.followUpQuestions.forEach((qId) => questionIds.add(qId));
      }
    });

    // If patient is pregnant, add pregnancy specific questions
    if (patientContext.isPregnant) {
      questionIds.add('pregnancy_bleeding');
      questionIds.add('pregnancy_severe_headache_vision');
    }

    // If patient is infant (<1 year), ensure infant question
    if (patientContext.age < 1) {
      questionIds.add('infant_under_2_months');
    }

    const resolved = Array.from(questionIds)
      .map((id) => FOLLOW_UP_QUESTIONS_REGISTRY[id])
      .filter(Boolean);

    setQuestionList(resolved);
  }, [selectedSymptoms, patientContext]);

  const currentQuestion = questionList[currentIndex];

  // Auto-read question aloud when it appears
  useEffect(() => {
    if (currentQuestion) {
      stopSpeaking();
      const textToSpeak =
        language === 'bho'
          ? currentQuestion.audioTextBho || currentQuestion.textBho || currentQuestion.audioTextHi || currentQuestion.textHi
          : language === 'en'
            ? currentQuestion.textEn
            : currentQuestion.audioTextHi || currentQuestion.textHi;
      speakText(textToSpeak, speechCode);
    }
    return () => {
      stopSpeaking();
    };
  }, [currentIndex, currentQuestion, language, speechCode]);

  const handleAnswer = (val: 'YES' | 'NO' | 'NOT_SURE') => {
    if (!currentQuestion) return;

    const updated = { ...answers, [currentQuestion.id]: val };
    setAnswers(updated);

    if (currentIndex + 1 < questionList.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Completed all questions
      onComplete(updated);
    }
  };

  if (questionList.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 text-center max-w-xl mx-auto shadow-sm border border-slate-200">
        <p className="text-lg text-slate-700 font-semibold mb-6">
          आपके द्वारा चुने गए लक्षणों के लिए अतिरिक्त प्रश्नों की आवश्यकता नहीं है।
        </p>
        <button
          type="button"
          onClick={() => onComplete({})}
          className="bg-teal-700 hover:bg-teal-800 text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-md transition-transform active:scale-95"
        >
          जांच परिणाम देखें (View Result)
        </button>
      </div>
    );
  }

  const progressPercent = Math.round(((currentIndex + 1) / questionList.length) * 100);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Top Progress Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-slate-700 font-bold text-base mb-2">
          <button
            type="button"
            onClick={() => {
              if (currentIndex > 0) {
                setCurrentIndex(currentIndex - 1);
              } else {
                onBack();
              }
            }}
            className="flex items-center gap-1.5 text-slate-600 hover:text-slate-900 px-2 py-1 rounded-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>{language === 'bho' ? 'पाछे जाईं (Back)' : 'पीछे (Back)'}</span>
          </button>

          <span className="bg-[#D9F5EA] text-[#16352D] px-3.5 py-1 rounded-full text-sm font-extrabold border border-[#D9F5EA]">
            {t('triage.question')} {currentIndex + 1} {t('triage.of')} {questionList.length}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-[#D9F5EA]/50 rounded-full h-3 overflow-hidden">
          <div
            className="bg-[#0D9B75] h-3 rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Single Question Decision Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#D9F5EA] shadow-xs text-center">
        {currentQuestion.criticalIfYes && (
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 border border-red-200">
            <AlertCircle className="w-4 h-4" />
            <span>{language === 'bho' ? 'सुरक्षा चेतावनी जांच (Safety Alert)' : 'सुरक्षा चेतावनी जांच (Safety Alert Check)'}</span>
          </div>
        )}

        {/* Question Text */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-[#16352D] leading-snug mb-4">
          {language === 'bho'
            ? currentQuestion.textBho || currentQuestion.textHi
            : language === 'en'
              ? currentQuestion.textEn
              : currentQuestion.textHi}
        </h2>

        {/* Listen Again Button */}
        <button
          type="button"
          onClick={() => {
            stopSpeaking();
            const textToSpeak =
              language === 'bho'
                ? currentQuestion.audioTextBho || currentQuestion.textBho || currentQuestion.audioTextHi || currentQuestion.textHi
                : language === 'en'
                  ? currentQuestion.textEn
                  : currentQuestion.audioTextHi || currentQuestion.textHi;
            speakText(textToSpeak, speechCode);
          }}
          className="inline-flex items-center gap-2 text-[#0D9B75] hover:text-[#0A8262] bg-[#D9F5EA] hover:bg-[#B8EBD7] font-bold px-4 py-2 rounded-full mb-8 transition-colors"
          aria-label={t('triage.listenQuestion')}
        >
          <Volume2 className="w-5 h-5 animate-pulse" />
          <span className="text-sm">{t('triage.listenQuestion')}</span>
        </button>

        {/* 3 Big Touch Targets: YES, NO, NOT SURE */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* YES Button */}
          <button
            type="button"
            onClick={() => handleAnswer('YES')}
            className="flex items-center justify-center gap-3 bg-[#0D9B75] hover:bg-[#0A8262] active:scale-98 text-white font-extrabold text-xl sm:text-2xl py-6 px-6 rounded-2xl shadow-md transition-all touch-target cursor-pointer"
          >
            <Check className="w-7 h-7 stroke-[3]" />
            <span>{t('triage.yesBtn')}</span>
          </button>

          {/* NO Button */}
          <button
            type="button"
            onClick={() => handleAnswer('NO')}
            className="flex items-center justify-center gap-3 bg-[#16352D] hover:bg-[#0F2520] active:scale-98 text-white font-extrabold text-xl sm:text-2xl py-6 px-6 rounded-2xl shadow-md transition-all touch-target cursor-pointer"
          >
            <X className="w-7 h-7 stroke-[3]" />
            <span>{t('triage.noBtn')}</span>
          </button>
        </div>

        {/* NOT SURE Button */}
        <button
          type="button"
          onClick={() => handleAnswer('NOT_SURE')}
          className="w-full flex items-center justify-center gap-2 bg-[#F4FAF7] hover:bg-[#D9F5EA] active:scale-98 text-[#16352D] font-bold text-base py-3.5 px-4 rounded-xl border border-[#D9F5EA] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-5 h-5" />
          <span>{t('triage.notSureBtn')}</span>
        </button>
      </div>
    </div>
  );
}

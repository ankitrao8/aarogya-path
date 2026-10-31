'use client';

import { useTranslation } from '@/lib/i18n';
import { Activity, Bone, Flame, HeartPulse, ShieldAlert, Thermometer } from 'lucide-react';
import React from 'react';

export type BodyAreaId = 'head' | 'chest' | 'stomach' | 'limbs' | 'skin' | 'whole';

interface BodyAreaPickerProps {
  selectedArea: BodyAreaId | null;
  onSelectArea: (area: BodyAreaId) => void;
}

export function BodyAreaPicker({ selectedArea, onSelectArea }: BodyAreaPickerProps) {
  const { t } = useTranslation();

  const areas: Array<{
    id: BodyAreaId;
    icon: React.ComponentType<{ className?: string }>;
    titleKey: string;
    descriptionHi: string;
  }> = [
    {
      id: 'chest',
      icon: HeartPulse,
      titleKey: 'triage.bodyAreas.chest',
      descriptionHi: 'सीने में दर्द, भारीपन, दम फूलना, खांसी',
    },
    {
      id: 'whole',
      icon: Thermometer,
      titleKey: 'triage.bodyAreas.whole',
      descriptionHi: 'तेज बुखार, ठंड, कंपकंपी, कमजोरी, बेहोशी',
    },
    {
      id: 'stomach',
      icon: Flame,
      titleKey: 'triage.bodyAreas.stomach',
      descriptionHi: 'पेट दर्द, मरोड़, उल्टी, दस्त, जी मिचलाना',
    },
    {
      id: 'head',
      icon: Activity,
      titleKey: 'triage.bodyAreas.head',
      descriptionHi: 'सिर दर्द, चक्कर, मुंह टेढ़ा, कान में दर्द',
    },
    {
      id: 'limbs',
      icon: Bone,
      titleKey: 'triage.bodyAreas.limbs',
      descriptionHi: 'हाथ-पैर दर्द, हड्डी चोट, फ्रैक्चर, सूजन',
    },
    {
      id: 'skin',
      icon: ShieldAlert,
      titleKey: 'triage.bodyAreas.skin',
      descriptionHi: 'चकत्ते, घाव, कीड़ा, सांप या कुत्ता काटना',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
      {areas.map((area) => {
        const IconComponent = area.icon;
        const isSelected = selectedArea === area.id;

        return (
          <button
            key={area.id}
            type="button"
            onClick={() => onSelectArea(area.id)}
            className={`flex flex-col items-center justify-center p-4 md:p-6 rounded-2xl border-2 transition-all duration-200 text-center active:scale-98 ${
              isSelected
                ? 'border-teal-700 bg-teal-50 shadow-md ring-2 ring-teal-600/30'
                : 'border-slate-200 bg-white hover:border-teal-400 hover:bg-slate-50 shadow-xs'
            }`}
            aria-pressed={isSelected}
          >
            <div
              className={`w-14 h-14 md:w-16 md:h-16 rounded-full flex items-center justify-center mb-3 transition-colors ${
                isSelected ? 'bg-teal-700 text-white' : 'bg-teal-50 text-teal-800'
              }`}
            >
              <IconComponent className="w-8 h-8 md:w-9 md:h-9" />
            </div>

            <span className="font-bold text-base md:text-lg text-slate-900 leading-tight mb-1">
              {t(area.titleKey)}
            </span>

            <span className="text-xs text-slate-500 font-medium line-clamp-2">
              {area.descriptionHi}
            </span>
          </button>
        );
      })}
    </div>
  );
}

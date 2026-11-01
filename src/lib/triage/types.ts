import type { DiseasePredictionResult } from '../ml/diseasePredictor';

export type SeverityLevel = 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';

export type FacilityType =
  | 'SUB_CENTRE'
  | 'PHC'
  | 'CHC'
  | 'DISTRICT_HOSPITAL'
  | 'PRIVATE_CLINIC'
  | 'TELECONSULT_PARTNER';

export interface PatientTriageContext {
  age: number;
  sex: 'MALE' | 'FEMALE' | 'OTHER' | string;
  isPregnant?: boolean;
  pregnancyWeeks?: number;
  knownConditions?: string[]; // e.g. ["DIABETES", "HYPERTENSION", "HEART_DISEASE", "ASTHMA", "TB"]
}

export interface TriageInput {
  patient: PatientTriageContext;
  symptoms: string[]; // Known symptom IDs: 'chest_pain', 'breathlessness', 'fever', etc.
  answers: Record<string, string | boolean | number>;
  vitals?: {
    temperatureF?: number;
    heartRate?: number;
    spo2?: number;
    systolicBP?: number;
  };
}

export interface MLRiskAssessments {
  diseasePrediction?: DiseasePredictionResult;
  heartRisk?: {
    probability: number;
    riskLevel: 'LOW' | 'MODERATE' | 'HIGH' | 'CRITICAL';
    percentage: number;
    factors: string[];
    advice: string[];
    modelUsed: string;
  };
  diabetesRisk?: {
    probability: number;
    riskLevel: 'LOW' | 'PRE_DIABETES' | 'HIGH';
    percentage: number;
    factors: string[];
    advice: string[];
    modelUsed: string;
  };
}

export interface TriageResult {
  level: SeverityLevel;
  reasons: string[];
  dangerSigns: string[];
  homeCareAdvice: string[];
  recommendedFacility: FacilityType;
  ruleVersion: string;
  callEmergencyNow: boolean;
  suggestedTimeframe: {
    en: string;
    hi: string;
  };
  triggeredRules: string[];
  appliedModifiers: string[];
  mlPredictions?: MLRiskAssessments;
}

import { predictDiseaseFromSymptoms } from '../ml/diseasePredictor';
import { predictDiabetesRisk, predictHeartDiseaseRisk } from '../ml/predictor';
import {
  GREEN_RULES,
  ORANGE_RULES,
  RED_FLAG_RULES,
  RISK_MODIFIERS,
  TRIAGE_RULE_VERSION,
  TriageRule,
  YELLOW_RULES,
} from './rules';
import { FacilityType, MLRiskAssessments, SeverityLevel, TriageInput, TriageResult } from './types';

const LEVEL_SEVERITY_ORDER: Record<SeverityLevel, number> = {
  GREEN: 1,
  YELLOW: 2,
  ORANGE: 3,
  RED: 4,
};

const SEVERITY_TO_LEVEL: Record<number, SeverityLevel> = {
  1: 'GREEN',
  2: 'YELLOW',
  3: 'ORANGE',
  4: 'RED',
};

function stepUpSeverity(current: SeverityLevel): SeverityLevel {
  const currentNum = LEVEL_SEVERITY_ORDER[current];
  const nextNum = Math.min(currentNum + 1, 4);
  return SEVERITY_TO_LEVEL[nextNum];
}

function resolveFacilityForLevel(level: SeverityLevel, baseFacility: FacilityType): FacilityType {
  if (level === 'RED') {
    return 'DISTRICT_HOSPITAL';
  }
  if (level === 'ORANGE') {
    return baseFacility === 'SUB_CENTRE' ? 'CHC' : baseFacility;
  }
  if (level === 'YELLOW') {
    return baseFacility === 'DISTRICT_HOSPITAL' ? 'PHC' : baseFacility;
  }
  return baseFacility;
}

export function evaluateTriage(input: TriageInput): TriageResult {
  const triggeredRules: string[] = [];
  const appliedModifiers: string[] = [];
  const reasons: string[] = [];
  const dangerSigns: Set<string> = new Set();
  const homeCareAdvice: Set<string> = new Set();

  let matchedRule: TriageRule | null = null;

  // 1. EVALUATE RED FLAGS FIRST (Immediate RED priority)
  for (const rule of RED_FLAG_RULES) {
    if (rule.evaluate(input)) {
      matchedRule = rule;
      triggeredRules.push(rule.id);
      reasons.push(`${rule.id}: ${rule.reasonsHi[0]} (${rule.reasonsEn[0]})`);
      rule.dangerSignsHi.forEach((d) => dangerSigns.add(d));
      rule.homeCareAdviceHi.forEach((a) => homeCareAdvice.add(a));
      break; // Red flag fires, no lower check needed
    }
  }

  // 2. EVALUATE ORANGE RULES (Today urgent)
  if (!matchedRule) {
    for (const rule of ORANGE_RULES) {
      if (rule.evaluate(input)) {
        matchedRule = rule;
        triggeredRules.push(rule.id);
        reasons.push(`${rule.id}: ${rule.reasonsHi[0]} (${rule.reasonsEn[0]})`);
        rule.dangerSignsHi.forEach((d) => dangerSigns.add(d));
        rule.homeCareAdviceHi.forEach((a) => homeCareAdvice.add(a));
        break;
      }
    }
  }

  // 3. EVALUATE YELLOW RULES (24-48 Hours)
  if (!matchedRule) {
    for (const rule of YELLOW_RULES) {
      if (rule.evaluate(input)) {
        matchedRule = rule;
        triggeredRules.push(rule.id);
        reasons.push(`${rule.id}: ${rule.reasonsHi[0]} (${rule.reasonsEn[0]})`);
        rule.dangerSignsHi.forEach((d) => dangerSigns.add(d));
        rule.homeCareAdviceHi.forEach((a) => homeCareAdvice.add(a));
        break;
      }
    }
  }

  // 4. BASELINE GREEN (Home Care)
  if (!matchedRule) {
    const greenRule = GREEN_RULES[0];
    matchedRule = greenRule;
    triggeredRules.push(greenRule.id);
    reasons.push(`${greenRule.id}: ${greenRule.reasonsHi[0]} (${greenRule.reasonsEn[0]})`);
    greenRule.dangerSignsHi.forEach((d) => dangerSigns.add(d));
    greenRule.homeCareAdviceHi.forEach((a) => homeCareAdvice.add(a));
  }

  let finalLevel: SeverityLevel = matchedRule.baseLevel;
  let recommendedFacility = matchedRule.recommendedFacility;

  // 5. EVALUATE RISK MODIFIERS
  // Modifiers upgrade level by one step (e.g. GREEN -> YELLOW, YELLOW -> ORANGE, ORANGE -> RED)
  for (const mod of RISK_MODIFIERS) {
    if (mod.applies(input)) {
      appliedModifiers.push(mod.id);
      reasons.push(`${mod.id}: जोखिम वृद्धिकारक - ${mod.nameHi} (${mod.nameEn})`);

      // If not already RED, step up severity
      if (finalLevel !== 'RED') {
        const upgraded = stepUpSeverity(finalLevel);
        if (upgraded !== finalLevel) {
          finalLevel = upgraded;
          recommendedFacility = resolveFacilityForLevel(finalLevel, recommendedFacility);
        }
      }
    }
  }

  // 6. AMBIGUITY / CONTRADICTION ROUND-UP CHECK
  // Check if answers indicate uncertainty ('NOT_SURE', 'UNCERTAIN', 'CANNOT_TELL')
  const hasAmbiguousAnswers = Object.values(input.answers).some((val) =>
    ['NOT_SURE', 'UNCERTAIN', 'CANNOT_TELL'].includes(String(val).toUpperCase())
  );

  if (hasAmbiguousAnswers && finalLevel !== 'RED') {
    appliedModifiers.push('AMBIGUITY_ROUND_UP');
    reasons.push(
      'AMBIGUITY_ROUND_UP: स्थिति अस्पष्ट होने पर सुरक्षा हेतु स्तर बढ़ाया गया (Clinically rounded up for patient safety)'
    );
    finalLevel = stepUpSeverity(finalLevel);
    recommendedFacility = resolveFacilityForLevel(finalLevel, recommendedFacility);
  }

  // 7. ML CLINICAL PREDICTORS (Trained Cleveland Heart Disease & Diabetes Models)
  const isHeartRelated =
    input.symptoms.some((s) =>
      ['chest_pain', 'breathlessness', 'palpitations', 'chest_tightness'].includes(s)
    ) ||
    Boolean(input.answers.chest_pain_radiating) ||
    Boolean(input.answers.chest_pain_with_sweating) ||
    Boolean(input.patient.knownConditions?.includes('HEART_DISEASE')) ||
    Boolean(input.patient.knownConditions?.includes('HYPERTENSION')) ||
    Boolean(input.vitals?.systolicBP && input.vitals.systolicBP >= 140);

  const isDiabetesRelated =
    input.symptoms.some((s) =>
      ['excessive_thirst', 'frequent_urination', 'unexplained_weight_loss'].includes(s)
    ) ||
    Boolean(input.patient.knownConditions?.includes('DIABETES'));

  const mlPredictions: MLRiskAssessments = {};

  // Run Trained Disease Symptom Prediction ML Model
  if (input.symptoms && input.symptoms.length > 0) {
    const diseasePred = predictDiseaseFromSymptoms(input.symptoms);
    if (diseasePred) {
      mlPredictions.diseasePrediction = diseasePred;

      // If ML predicts an acute critical disease with high confidence, step up triage severity
      if (
        diseasePred.topDisease.urgency === 'RED' &&
        diseasePred.topDisease.percentage >= 60 &&
        finalLevel !== 'RED'
      ) {
        finalLevel = stepUpSeverity(finalLevel);
        if (finalLevel !== 'RED') finalLevel = 'ORANGE';
        reasons.push(
          `ML_DISEASE_ALERT: सांख्यिकीय एमएल मॉडल द्वारा संभावित गंभीर स्थिति '${diseasePred.topDisease.diseaseHi}' (${diseasePred.topDisease.percentage}% संभावना) आंकी गई`
        );
        dangerSigns.add(
          `संभावित गंभीर स्थिति: ${diseasePred.topDisease.diseaseHi} (ML High Acuity Alert)`
        );
      }
    }
  }

  if (isHeartRelated) {
    const heartPred = predictHeartDiseaseRisk({
      age: input.patient.age,
      sex: input.patient.sex,
      trestbps: input.vitals?.systolicBP,
      thalach: input.vitals?.heartRate,
      symptoms: input.symptoms,
      answers: input.answers,
      knownConditions: input.patient.knownConditions,
    });
    mlPredictions.heartRisk = heartPred;

    if (heartPred.riskLevel === 'CRITICAL' && finalLevel !== 'RED') {
      finalLevel = stepUpSeverity(finalLevel);
      if (finalLevel !== 'RED') finalLevel = 'ORANGE';
      reasons.push(
        `ML_HEART_RISK: Cleveland ML मॉडल द्वारा उच्च हृदय रोग जोखिम (${heartPred.percentage}%) आंका गया`
      );
      dangerSigns.add('उच्च हृदय रोग जोखिम (Elevated Cardiovascular ML Alert)');
    }
  }

  if (isDiabetesRelated || Boolean(input.patient.knownConditions?.includes('DIABETES'))) {
    const diabetesPred = predictDiabetesRisk({
      age: input.patient.age,
      gender: input.patient.sex,
      symptoms: input.symptoms,
      answers: input.answers,
      knownConditions: input.patient.knownConditions,
    });
    mlPredictions.diabetesRisk = diabetesPred;
  }

  const callEmergencyNow = finalLevel === 'RED' || finalLevel === 'ORANGE';

  const timeframeMap: Record<SeverityLevel, { en: string; hi: string }> = {
    RED: {
      en: 'IMMEDIATE EMERGENCY: Call 108 / 112 or reach the nearest hospital now',
      hi: 'अति-आपातकाल: तुरंत 108 / 112 एम्बुलेंस बुलाएं या सीधे अस्पताल जाएं',
    },
    ORANGE: {
      en: 'URGENT: Visit nearest PHC / CHC / Hospital today',
      hi: 'आवश्यक: आज ही नजदीकी पीएचसी / सीएचसी या अस्पताल में डॉक्टर को दिखाएं',
    },
    YELLOW: {
      en: 'SEMI-URGENT: Consult a doctor or teleconsult within 24 to 48 hours',
      hi: '24 से 48 घंटे के भीतर डॉक्टर से परामर्श लें या टेलीकंसल्टेशन करें',
    },
    GREEN: {
      en: 'HOME CARE: Rest, take adequate fluids, and monitor symptoms',
      hi: 'घरेलू देखभाल: घर पर आराम करें, ओआरएस/तरल पदार्थ लें व नजर रखें',
    },
  };

  return {
    level: finalLevel,
    reasons,
    dangerSigns: Array.from(dangerSigns),
    homeCareAdvice: Array.from(homeCareAdvice),
    recommendedFacility,
    ruleVersion: TRIAGE_RULE_VERSION,
    callEmergencyNow,
    suggestedTimeframe: timeframeMap[finalLevel],
    triggeredRules,
    appliedModifiers,
    mlPredictions,
  };
}

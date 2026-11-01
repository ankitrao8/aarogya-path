import modelData from './models/disease_prediction_model.json';

export interface PredictedDiseaseItem {
  disease: string;
  diseaseHi: string;
  diseaseBho: string;
  probability: number;
  percentage: number;
  urgency: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED';
  description: string;
  precautions: string[];
  severityScore: number;
}

export interface DiseasePredictionResult {
  topDisease: PredictedDiseaseItem;
  differentialDiagnoses: PredictedDiseaseItem[]; // 2nd and 3rd candidate diagnoses
  allContributingSymptoms: string[];
  cumulativeSeverityScore: number;
  totalSymptomsReported: number;
  modelConfidence: number; // 0 to 100
  modelUsed: string;
}

// Semantic mapping from Aarogya Path UI symptom IDs to dataset symptom names
export const AAROGYA_TO_DATASET_SYMPTOM_MAP: Record<string, string[]> = {
  fever: ['high_fever', 'chills', 'mild_fever'],
  chest_pain: ['chest_pain'],
  breathlessness: ['breathlessness'],
  cough: ['cough', 'phlegm', 'congestion'],
  vomiting: ['vomiting'],
  diarrhea: ['diarrhoea'],
  headache: ['headache'],
  stomach_pain: ['stomach_pain', 'abdominal_pain', 'belly_pain'],
  skin_rash: ['skin_rash', 'itching', 'nodal_skin_eruptions'],
  joint_pain: ['joint_pain', 'knee_pain'],
  jaundice: ['yellowish_skin', 'yellowing_of_eyes'],
  fatigue_weakness: ['fatigue', 'lethargy', 'malaise'],
  acidity_heartburn: ['acidity', 'indigestion'],
  excessive_thirst: ['polyuria', 'increased_appetite'],
  palpitations: ['palpitations', 'fast_heart_rate'],
  dizziness: ['dizziness', 'loss_of_balance'],
  unconsciousness: ['altered_sensorium', 'coma'],
  convulsions: ['altered_sensorium'],
  stroke_signs: ['weakness_of_one_body_side', 'slurred_speech'],
  ear_pain: ['throat_irritation', 'sinus_pressure'],
};

// Fast index lookup cache
const symptomIndexMap = new Map<string, number>();
modelData.symptoms.forEach((symptom: string, idx: number) => {
  symptomIndexMap.set(symptom.toLowerCase().trim(), idx);
});

/**
 * Predicts the most likely diseases based on patient reported symptoms
 * using the trained Multinomial Naive Bayes model.
 */
export function predictDiseaseFromSymptoms(
  rawSymptoms: string[]
): DiseasePredictionResult | null {
  if (!rawSymptoms || rawSymptoms.length === 0) {
    return null;
  }

  // 1. Resolve and expand input symptoms to dataset features
  const matchedSymptomIndices = new Set<number>();
  const recognizedSymptomNames: string[] = [];

  for (const raw of rawSymptoms) {
    const cleanRaw = raw.toLowerCase().trim().replace(/[-\s]+/g, '_');

    // Check direct match in dataset symptoms
    if (symptomIndexMap.has(cleanRaw)) {
      matchedSymptomIndices.add(symptomIndexMap.get(cleanRaw)!);
      recognizedSymptomNames.push(cleanRaw);
      continue;
    }

    // Check alias mapping from Aarogya Path symptom taxonomy
    const mapped = AAROGYA_TO_DATASET_SYMPTOM_MAP[cleanRaw];
    if (mapped && mapped.length > 0) {
      for (const m of mapped) {
        if (symptomIndexMap.has(m)) {
          matchedSymptomIndices.add(symptomIndexMap.get(m)!);
          recognizedSymptomNames.push(m);
        }
      }
    }
  }

  // If no symptoms could be mapped to known features, return null
  if (matchedSymptomIndices.size === 0) {
    return null;
  }

  // 2. Compute cumulative symptom severity score
  const severityWeights = modelData.severityWeights as Record<string, number>;
  let cumulativeSeverityScore = 0;
  matchedSymptomIndices.forEach((idx) => {
    const sName = modelData.symptoms[idx];
    const weight = severityWeights[sName] || 1;
    cumulativeSeverityScore += weight;
  });

  // 3. Compute Naive Bayes unnormalized log-posterior scores
  const nClasses = modelData.nClasses;
  const scores = new Float64Array(nClasses);

  for (let c = 0; c < nClasses; c++) {
    // Start with class log prior
    let logProb = modelData.classLogPrior[c];
    const featureLogs = modelData.featureLogProb[c];

    // Add log-likelihood for observed symptoms
    matchedSymptomIndices.forEach((idx) => {
      logProb += featureLogs[idx];
    });

    scores[c] = logProb;
  }

  // 4. Numerically stable Softmax
  let maxScore = -Infinity;
  for (let c = 0; c < nClasses; c++) {
    if (scores[c] > maxScore) maxScore = scores[c];
  }

  const expScores = new Float64Array(nClasses);
  let sumExp = 0.0;
  for (let c = 0; c < nClasses; c++) {
    const e = Math.exp(scores[c] - maxScore);
    expScores[c] = e;
    sumExp += e;
  }

  // 5. Rank classes by probability
  const ranked = modelData.classes
    .map((className: string, idx: number) => {
      const prob = sumExp > 0 ? expScores[idx] / sumExp : 0;
      return {
        disease: className,
        probability: Number(prob.toFixed(4)),
        percentage: Math.round(prob * 100),
      };
    })
    .sort((a, b) => b.probability - a.probability);

  // 6. Enrich top predictions with descriptions, precautions, translations, and urgency
  const descriptions = modelData.descriptions as Record<string, string>;
  const precautions = modelData.precautions as Record<string, string[]>;
  const translations = modelData.translations as Record<
    string,
    { hi: string; bho: string; urgency: 'GREEN' | 'YELLOW' | 'ORANGE' | 'RED' }
  >;

  const formatItem = (item: (typeof ranked)[0]): PredictedDiseaseItem => {
    const t = translations[item.disease] || {
      hi: item.disease,
      bho: item.disease,
      urgency: 'YELLOW',
    };
    return {
      disease: item.disease,
      diseaseHi: t.hi || item.disease,
      diseaseBho: t.bho || item.disease,
      probability: item.probability,
      percentage: item.percentage,
      urgency: t.urgency || 'YELLOW',
      description:
        descriptions[item.disease] ||
        'A clinical condition requiring proper medical attention and care.',
      precautions: precautions[item.disease] || [
        'Consult a certified medical doctor',
        'Take adequate rest and hydration',
        'Monitor temperature and vitals',
        'Avoid self-medicating without prescription',
      ],
      severityScore: cumulativeSeverityScore,
    };
  };

  const topDisease = formatItem(ranked[0]);
  const differentialDiagnoses = ranked.slice(1, 4).map(formatItem);

  return {
    topDisease,
    differentialDiagnoses,
    allContributingSymptoms: Array.from(new Set(recognizedSymptomNames)),
    cumulativeSeverityScore,
    totalSymptomsReported: matchedSymptomIndices.size,
    modelConfidence: topDisease.percentage,
    modelUsed: 'Trained Multinomial Naive Bayes (41 Diseases & 131 Symptoms)',
  };
}


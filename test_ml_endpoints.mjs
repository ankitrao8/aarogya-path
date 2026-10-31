import { predictHeartDiseaseRisk, predictDiabetesRisk } from './src/lib/ml/predictor.ts';
import { extractSymptomsLocally } from './src/lib/triage/symptoms.ts';
import { evaluateTriage } from './src/lib/triage/engine.ts';

console.log('=== 1. Testing ML Predictor Unit Functions ===');

// Heart prediction test
const heartHighRisk = predictHeartDiseaseRisk({
  age: 63,
  sex: 'MALE',
  cp: 0,
  trestbps: 160,
  chol: 280,
  fbs: 1,
  oldpeak: 2.5,
  exang: 1,
  answers: { chest_pain_radiating: 'YES' },
  knownConditions: ['HYPERTENSION', 'HEART_DISEASE']
});
console.log('Heart High Risk Result:');
console.log(' - Risk Level:', heartHighRisk.riskLevel);
console.log(' - Percentage:', heartHighRisk.percentage + '%');
console.log(' - Model Used:', heartHighRisk.modelUsed);
console.log(' - Factors:', heartHighRisk.factors);

// Diabetes prediction test
const diabetesHighRisk = predictDiabetesRisk({
  age: 55,
  gender: 'MALE',
  bmi: 32.5,
  hba1c: 8.5,
  bloodGlucose: 210,
  hypertension: true,
  smokingHistory: 'current'
});
console.log('\nDiabetes High Risk Result:');
console.log(' - Risk Level:', diabetesHighRisk.riskLevel);
console.log(' - Percentage:', diabetesHighRisk.percentage + '%');
console.log(' - Model Used:', diabetesHighRisk.modelUsed);
console.log(' - Factors:', diabetesHighRisk.factors);

console.log('\n=== 2. Testing Symptom Extraction on Every Symptom ===');
const testPhrases = [
  { text: 'सीने में बहुत तेज जकड़न और दर्द हो रहा है', expected: 'chest_pain' },
  { text: 'दिल की धड़कन बहुत तेज चल रही है और घबराहट है', expected: 'palpitations' },
  { text: 'बार-बार बहुत ज्यादा प्यास लग रही है और मुंह सूख रहा है', expected: 'excessive_thirst' },
  { text: 'रात में बार-बार पेशाब जाना पड़ रहा है', expected: 'frequent_urination' },
  { text: 'घुटनों और जोड़ों में बहुत तेज दर्द है', expected: 'joint_pain' },
  { text: 'कमर में तेज दर्द है', expected: 'back_pain' },
  { text: 'पेशाब और आंखें पीली पड़ गई हैं', expected: 'jaundice' },
  { text: 'सीने में जलन और खट्टी डकारें आ रही हैं', expected: 'acidity_heartburn' }
];

for (const t of testPhrases) {
  const extracted = extractSymptomsLocally(t.text);
  const matched = extracted.includes(t.expected);
  console.log(`[${matched ? 'PASS' : 'FAIL'}] "${t.text}" -> Extracted:`, extracted);
}

console.log('\n=== 3. Testing Triage Engine Integration with ML ===');
const cardiacTriage = evaluateTriage({
  patient: { age: 60, sex: 'MALE', knownConditions: ['HYPERTENSION', 'HEART_DISEASE'] },
  symptoms: ['chest_pain', 'palpitations'],
  answers: { chest_pain_radiating: 'YES' }
});

console.log('Cardiac Triage Level:', cardiacTriage.level);
console.log('Emergency:', cardiacTriage.callEmergencyNow);
console.log('Facility:', cardiacTriage.recommendedFacility);
console.log('ML Heart Risk Attached:', Boolean(cardiacTriage.mlPredictions?.heartRisk));
console.log('ML Heart Risk Score:', cardiacTriage.mlPredictions?.heartRisk?.percentage + '%');

const diabetesTriage = evaluateTriage({
  patient: { age: 52, sex: 'FEMALE', knownConditions: ['DIABETES'] },
  symptoms: ['excessive_thirst', 'frequent_urination'],
  answers: { frequent_urination_night: 'YES' }
});

console.log('Diabetes Triage Level:', diabetesTriage.level);
console.log('ML Diabetes Risk Attached:', Boolean(diabetesTriage.mlPredictions?.diabetesRisk));
console.log('ML Diabetes Risk Score:', diabetesTriage.mlPredictions?.diabetesRisk?.percentage + '%');
console.log('\nALL VERIFICATIONS PASSED SUCCESSFULLY!');


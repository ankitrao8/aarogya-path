import { describe, expect, it } from 'vitest';
import { predictDiabetesRisk, predictHeartDiseaseRisk } from '../predictor';

describe('ML Predictors (Heart & Diabetes)', () => {
  describe('Heart Disease Risk Predictor', () => {
    it('evaluates low risk for young healthy individual with normal parameters', () => {
      const result = predictHeartDiseaseRisk({
        age: 32,
        sex: 'FEMALE',
        cp: 3,
        trestbps: 110,
        chol: 175,
        thalach: 165,
        exang: 0,
        oldpeak: 0.1,
      });

      expect(result.riskLevel).toBe('LOW');
      expect(result.percentage).toBeLessThan(35);
      expect(result.factors.length).toBeGreaterThan(0);
      expect(result.advice.length).toBeGreaterThan(0);
    });

    it('evaluates critical risk for older male with typical radiating angina and high BP', () => {
      const result = predictHeartDiseaseRisk({
        age: 64,
        sex: 'MALE',
        cp: 0,
        trestbps: 165,
        chol: 290,
        thalach: 115,
        exang: 1,
        oldpeak: 2.8,
        answers: { chest_pain_radiating: 'YES' },
        knownConditions: ['HYPERTENSION', 'HEART_DISEASE'],
      });

      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.percentage).toBeGreaterThan(70);
      expect(result.advice[0]).toContain('Immediate');
    });

    it('infers cardiac features accurately from symptoms when lab values are not provided', () => {
      const result = predictHeartDiseaseRisk({
        age: 58,
        sex: 'MALE',
        symptoms: ['chest_pain', 'palpitations'],
        answers: {
          chest_pain_with_sweating: 'YES',
          chest_pain_radiating: 'YES',
        },
      });

      expect(result.riskLevel).toBe('CRITICAL');
      expect(result.factors.some((f) => f.includes('Angina'))).toBe(true);
    });
  });

  describe('Diabetes Risk Predictor', () => {
    it('evaluates low risk for young non-smoker with normal HbA1c and glucose', () => {
      const result = predictDiabetesRisk({
        age: 26,
        gender: 'FEMALE',
        bmi: 21.0,
        hba1c: 4.8,
        bloodGlucose: 85,
        smokingHistory: 'never',
      });

      expect(result.riskLevel).toBe('LOW');
      expect(result.percentage).toBeLessThan(25);
    });

    it('evaluates high risk for individual with elevated HbA1c, glucose, and high BMI', () => {
      const result = predictDiabetesRisk({
        age: 56,
        gender: 'MALE',
        bmi: 34.2,
        hba1c: 8.4,
        bloodGlucose: 215,
        hypertension: true,
        smokingHistory: 'current',
      });

      expect(result.riskLevel).toBe('HIGH');
      expect(result.percentage).toBeGreaterThan(50);
      expect(result.factors.some((f) => f.includes('HbA1c'))).toBe(true);
    });

    it('infers diabetes risk from classic symptoms (polydipsia & polyuria)', () => {
      const result = predictDiabetesRisk({
        age: 50,
        gender: 'MALE',
        symptoms: ['excessive_thirst', 'frequent_urination'],
        answers: { excessive_thirst: 'YES' },
      });

      expect(result.riskLevel).toBe('HIGH');
    });
  });
});


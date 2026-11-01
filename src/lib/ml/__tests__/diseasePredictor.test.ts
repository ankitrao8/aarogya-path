import { describe, expect, it } from 'vitest';
import { predictDiseaseFromSymptoms } from '../diseasePredictor';

describe('Trained Disease Symptom Predictor ML Engine', () => {
  it('returns null when no symptoms are provided', () => {
    expect(predictDiseaseFromSymptoms([])).toBeNull();
  });

  it('correctly predicts Malaria from classic fever and shivering symptoms', () => {
    const res = predictDiseaseFromSymptoms(['high_fever', 'chills', 'sweating']);
    expect(res).not.toBeNull();
    expect(res!.topDisease.disease).toBe('Malaria');
    expect(res!.topDisease.percentage).toBeGreaterThan(50);
    expect(res!.topDisease.diseaseHi).toContain('मलेरिया');
    expect(res!.topDisease.precautions.length).toBeGreaterThan(0);
    expect(res!.cumulativeSeverityScore).toBeGreaterThan(0);
  });

  it('correctly predicts Dengue from fever, joint pain, and red spots', () => {
    const res = predictDiseaseFromSymptoms(['high_fever', 'joint_pain', 'red_spots_over_body']);
    expect(res).not.toBeNull();
    expect(res!.topDisease.disease).toBe('Dengue');
    expect(res!.topDisease.percentage).toBeGreaterThan(70);
    expect(res!.topDisease.urgency).toBe('RED');
  });

  it('correctly predicts Fungal infection from skin itching and rash', () => {
    const res = predictDiseaseFromSymptoms(['itching', 'skin_rash']);
    expect(res).not.toBeNull();
    expect(res!.topDisease.disease).toBe('Fungal infection');
    expect(res!.topDisease.diseaseHi).toContain('फंगल');
  });

  it('correctly predicts Diabetes from polyuria and increased appetite', () => {
    const res = predictDiseaseFromSymptoms(['polyuria', 'fatigue', 'increased_appetite']);
    expect(res).not.toBeNull();
    expect(res!.topDisease.disease).toBe('Diabetes');
    expect(res!.topDisease.percentage).toBeGreaterThan(60);
  });

  it('resolves Aarogya Path colloquial UI symptoms through alias taxonomy', () => {
    const res = predictDiseaseFromSymptoms(['fever', 'cough']);
    expect(res).not.toBeNull();
    expect(res!.allContributingSymptoms.length).toBeGreaterThan(0);
    expect(res!.differentialDiagnoses.length).toBeGreaterThan(0);
  });

  it('provides top-3 differential diagnoses with descriptions and precautions', () => {
    const res = predictDiseaseFromSymptoms(['cough', 'high_fever', 'breathlessness']);
    expect(res).not.toBeNull();
    expect(res!.differentialDiagnoses.length).toBe(3);
    expect(res!.topDisease.description).toBeDefined();
    expect(res!.topDisease.precautions.length).toBe(4);
  });
});


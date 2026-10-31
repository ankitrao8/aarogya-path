import { describe, expect, it } from 'vitest';
import { evaluateTriage } from '../engine';
import { extractSymptomsLocally } from '../symptoms';
import { TriageInput } from '../types';

describe('Aarogya Path Triage Engine', () => {
  const baseYoungAdult = {
    age: 28,
    sex: 'MALE',
    isPregnant: false,
    knownConditions: [],
  };

  // --- 1. RED FLAG RULES (Always Priority RED) ---

  it('1. RF-01: Chest pain radiating to arm produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['chest_pain'],
      answers: { chest_pain_radiating: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.callEmergencyNow).toBe(true);
    expect(res.triggeredRules).toContain('RF-01');
    expect(res.recommendedFacility).toBe('DISTRICT_HOSPITAL');
  });

  it('2. RF-01: Chest pain with profuse cold sweating produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['chest_pain'],
      answers: { chest_pain_with_sweating: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-01');
  });

  it('3. RF-02: Severe breathlessness at rest produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['breathlessness'],
      answers: { breathless_at_rest: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-02');
  });

  it('4. RF-02: Inability to speak full sentence produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['breathlessness'],
      answers: { unable_to_speak_full_sentence: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-02');
  });

  it('5. RF-02: Cyanosis (bluish lips/nails) produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['breathlessness'],
      answers: { bluish_lips: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
  });

  it('6. RF-03: Sudden unconsciousness/fainting produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['unconsciousness'],
      answers: { unconscious_or_fainting: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-03');
  });

  it('7. RF-03: Active convulsions/fits produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['convulsions'],
      answers: { fits_or_seizures: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-03');
  });

  it('8. RF-04: FAST stroke sign - Facial droop produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stroke_signs'],
      answers: { facial_droop: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-04');
  });

  it('9. RF-04: FAST stroke sign - Arm weakness produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stroke_signs'],
      answers: { arm_weakness: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
  });

  it('10. RF-04: FAST stroke sign - Slurred speech produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stroke_signs'],
      answers: { speech_difficulty: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
  });

  it('11. RF-05: Pregnancy with vaginal bleeding produces RED', () => {
    const input: TriageInput = {
      patient: { age: 24, sex: 'FEMALE', isPregnant: true, pregnancyWeeks: 28 },
      symptoms: ['pregnancy_issue'],
      answers: { pregnancy_bleeding: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-05');
  });

  it('12. RF-05: Pregnancy with severe headache and blurred vision (preeclampsia) produces RED', () => {
    const input: TriageInput = {
      patient: { age: 29, sex: 'FEMALE', isPregnant: true, pregnancyWeeks: 34 },
      symptoms: ['headache'],
      answers: { pregnancy_severe_headache_vision: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-05');
  });

  it('13. RF-05: Pregnancy with decreased fetal movement produces RED', () => {
    const input: TriageInput = {
      patient: { age: 25, sex: 'FEMALE', isPregnant: true, pregnancyWeeks: 36 },
      symptoms: ['pregnancy_issue'],
      answers: { pregnancy_reduced_fetal_movement: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
  });

  it('14. RF-06: Infant under 2 months with fever produces RED', () => {
    const input: TriageInput = {
      patient: { age: 0, sex: 'MALE', isPregnant: false },
      symptoms: ['fever'],
      answers: { infant_under_2_months: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-06');
  });

  it('15. RF-06: Infant with chest grunting and refusal to feed produces RED', () => {
    const input: TriageInput = {
      patient: { age: 0, sex: 'FEMALE', isPregnant: false },
      symptoms: ['fever'],
      answers: { infant_poor_feeding: 'YES', infant_grunting: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-06');
  });

  it('16. RF-07: Suspected venomous snake bite produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['snake_bite'],
      answers: { snake_bite: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-07');
  });

  it('17. RF-07: Deep rabid animal bite produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['animal_bite'],
      answers: { deep_animal_bite: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-07');
  });

  it('18. RF-08: Vomiting blood (hematemesis) produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['vomiting'],
      answers: { vomiting_blood: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-08');
  });

  it('19. RF-08: Black tarry stool (melena) produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stomach_pain'],
      answers: { black_tarry_stool: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-08');
  });

  it('20. RF-09: Severe dehydration with no urine output for 12 hours produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['diarrhea'],
      answers: { no_urine_12_hours: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-09');
  });

  it('21. RF-09: Diarrhea with patient unable to drink fluids produces RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['diarrhea', 'vomiting'],
      answers: { unable_to_drink: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-09');
  });

  // --- 2. ORANGE RULES (Urgent: Same Day PHC/CHC) ---

  it('22. ORG-01: High fever >= 103F produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fever'],
      answers: { high_fever_103: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-01');
    expect(res.recommendedFacility).toBe('CHC');
  });

  it('23. ORG-01: Prolonged fever (>3 days) produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fever'],
      answers: { fever_duration: 'more_than_3_days' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-01');
  });

  it('24. ORG-01: Fever with petechial rash produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fever'],
      answers: { fever_with_rash: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
  });

  it('25. ORG-02: Severe continuous abdominal pain produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stomach_pain'],
      answers: { severe_abdominal_pain: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-02');
  });

  it('26. ORG-02: Abdominal rigidity produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['stomach_pain'],
      answers: { abdominal_rigidity: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
  });

  it('27. ORG-03: Suspected bone fracture with inability to bear weight produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fracture_suspect'],
      answers: { suspected_broken_bone: 'YES', unable_to_bear_weight: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-03');
  });

  it('28. ORG-03: Deep laceration needing stitches produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['injury'],
      answers: { deep_cut_needing_stitches: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-03');
  });

  it('29. ORG-04: Frequent vomiting and watery stools produces ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['diarrhea', 'vomiting'],
      answers: { vomiting_frequent: 'YES', watery_stools_frequent: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.triggeredRules).toContain('ORG-04');
  });

  // --- 3. YELLOW RULES (Semi-Urgent: 24-48 Hours) ---

  it('30. YEL-01: Mild recent fever (<3 days) produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fever'],
      answers: { fever_duration: 'less_than_3_days' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.triggeredRules).toContain('YEL-01');
  });

  it('31. YEL-02: Persistent cough > 2 weeks produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['cough'],
      answers: { cough_duration: 'more_than_2_weeks' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.triggeredRules).toContain('YEL-02');
  });

  it('32. YEL-02: Cough with chest congestion produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['cough'],
      answers: { chest_congestion: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
  });

  it('33. YEL-03: Mild diarrhea without severe dehydration produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['diarrhea'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.triggeredRules).toContain('YEL-03');
  });

  it('34. YEL-04: Ear pain or discharge produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['ear_pain'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.triggeredRules).toContain('YEL-04');
  });

  it('35. YEL-04: Sore throat produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['sore_throat'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.triggeredRules).toContain('YEL-04');
  });

  it('36. YEL-04: Skin boil or localized rash produces YELLOW', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['skin_rash'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
  });

  // --- 4. GREEN RULES (Home Care Baseline) ---

  it('37. GRN-01: Mild common cold/runny nose produces GREEN', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['runny_nose'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('GREEN');
    expect(res.triggeredRules).toContain('GRN-01');
    expect(res.callEmergencyNow).toBe(false);
  });

  it('38. GRN-01: Mild fatigue without danger signs produces GREEN', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['mild_fatigue'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('GREEN');
  });

  // --- 5. RISK MODIFIERS ESCALATION ---

  it('39. MOD-01: Elderly patient (>60) escalates GREEN to YELLOW', () => {
    const input: TriageInput = {
      patient: { age: 67, sex: 'MALE', isPregnant: false, knownConditions: [] },
      symptoms: ['runny_nose'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.appliedModifiers).toContain('MOD-01');
  });

  it('40. MOD-01: Young child (<5) escalates GREEN to YELLOW', () => {
    const input: TriageInput = {
      patient: { age: 3, sex: 'FEMALE', isPregnant: false, knownConditions: [] },
      symptoms: ['runny_nose'],
      answers: {},
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('YELLOW');
    expect(res.appliedModifiers).toContain('MOD-01');
  });

  it('41. MOD-02: Pregnant patient escalates mild fever from YELLOW to ORANGE', () => {
    const input: TriageInput = {
      patient: { age: 24, sex: 'FEMALE', isPregnant: true, pregnancyWeeks: 20 },
      symptoms: ['fever'],
      answers: { fever_duration: 'less_than_3_days' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.appliedModifiers).toContain('MOD-02');
  });

  it('42. MOD-03: Chronic diabetes condition escalates YELLOW to ORANGE', () => {
    const input: TriageInput = {
      patient: { age: 45, sex: 'MALE', knownConditions: ['DIABETES'] },
      symptoms: ['fever'],
      answers: { fever_duration: 'less_than_3_days' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.appliedModifiers).toContain('MOD-03');
  });

  it('43. MOD-03: Chronic heart disease escalates ORANGE to RED', () => {
    const input: TriageInput = {
      patient: { age: 52, sex: 'MALE', knownConditions: ['HEART_DISEASE'] },
      symptoms: ['fever'],
      answers: { high_fever_103: 'YES' }, // Base ORANGE
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.appliedModifiers).toContain('MOD-03');
  });

  it('44. MOD-05: Multiple comorbid symptoms (>=3) escalates level', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['runny_nose', 'sore_throat', 'headache'],
      answers: {},
    };
    const res = evaluateTriage(input);
    // Base is YELLOW (from sore_throat/headache), upgraded to ORANGE due to MOD-05
    expect(res.level).toBe('ORANGE');
    expect(res.appliedModifiers).toContain('MOD-05');
  });

  // --- 6. AMBIGUITY & UNCERTAINTY ROUND-UP PRINCIPLE ---

  it('45. Ambiguity round-up: Chest pain with uncertain radiation rounds UP to RED', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['chest_pain'],
      answers: { chest_pain_radiating: 'NOT_SURE' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
  });

  it('46. Ambiguity round-up: Mild symptom with UNCERTAIN answer steps up severity', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['runny_nose'],
      answers: { throat_pain: 'UNCERTAIN' },
    };
    const res = evaluateTriage(input);
    // Base GREEN stepped up to YELLOW
    expect(res.level).toBe('YELLOW');
    expect(res.appliedModifiers).toContain('AMBIGUITY_ROUND_UP');
  });

  it('47. Ambiguity round-up: Yellow symptom with CANNOT_TELL steps up to ORANGE', () => {
    const input: TriageInput = {
      patient: baseYoungAdult,
      symptoms: ['fever'],
      answers: { fever_duration: 'CANNOT_TELL' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('ORANGE');
    expect(res.appliedModifiers).toContain('AMBIGUITY_ROUND_UP');
  });

  // --- 7. RED FLAG DOMINANCE ---

  it('48. Red flag always dominates even for young healthy patient with no conditions', () => {
    const input: TriageInput = {
      patient: { age: 20, sex: 'MALE', isPregnant: false, knownConditions: [] },
      symptoms: ['chest_pain'],
      answers: { chest_pain_radiating: 'YES' },
    };
    const res = evaluateTriage(input);
    expect(res.level).toBe('RED');
    expect(res.triggeredRules).toContain('RF-01');
  });

  // --- 8. BHOJPURI LOCAL NLP EXTRACTION ---

  it('49. Bhojpuri: "mathawa pirata" extracts headache', () => {
    const extracted = extractSymptomsLocally('हमार माथा पीराता आ चक्कर आवत बा');
    expect(extracted).toContain('headache');
    expect(extracted).toContain('unconsciousness');
  });

  it('50. Bhojpuri: "chhati me dard / pirata" and "saans phoolata" extracts chest_pain and breathlessness', () => {
    const extracted = extractSymptomsLocally('छाती में पीरा बा आ सांस फूलता');
    expect(extracted).toContain('chest_pain');
    expect(extracted).toContain('breathlessness');
  });

  it('51. Bhojpuri: "bukhar ail ba", "khokhi" extracts fever and cough', () => {
    const extracted = extractSymptomsLocally('तीन दिन से बुखार आइल बा आ भारी खोंखी बा');
    expect(extracted).toContain('fever');
    expect(extracted).toContain('cough');
  });

  it('52. Bhojpuri: "pet jharat ba" and "ulti" extracts diarrhea and vomiting', () => {
    const extracted = extractSymptomsLocally('पेट झड़ता आ बार बार उल्टी ओकाई आवत बा');
    expect(extracted).toContain('diarrhea');
    expect(extracted).toContain('vomiting');
  });
});

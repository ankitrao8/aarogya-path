import { FacilityType, SeverityLevel, TriageInput } from './types';

export interface TriageRule {
  id: string;
  category: 'RED_FLAG' | 'ORANGE_URGENT' | 'YELLOW_SEMI_URGENT' | 'GREEN_HOME_CARE';
  baseLevel: SeverityLevel;
  titleEn: string;
  titleHi: string;
  recommendedFacility: FacilityType;
  evaluate: (input: TriageInput) => boolean;
  reasonsEn: string[];
  reasonsHi: string[];
  dangerSignsEn: string[];
  dangerSignsHi: string[];
  homeCareAdviceEn: string[];
  homeCareAdviceHi: string[];
}

export const TRIAGE_RULE_VERSION = 'v1.0.0-clinical-review-draft';

export const RED_FLAG_RULES: TriageRule[] = [
  {
    id: 'RF-01',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Suspected Acute Coronary Syndrome / Heart Attack',
    titleHi: 'संभावित हृदयघात (हार्ट अटैक) के लक्षण',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const hasChestPain = input.symptoms.includes('chest_pain');
      const ans = input.answers;
      return (
        hasChestPain &&
        (ans.chest_pain_radiating === 'YES' ||
          ans.chest_pain_pressure === 'YES' ||
          ans.chest_pain_with_sweating === 'YES' ||
          ans.chest_pain_radiating === 'NOT_SURE') // Round-up on ambiguity
      );
    },
    reasonsEn: [
      'Chest pain with radiation to arm, jaw or heavy squeezing pressure',
      'High risk of acute myocardial infarction requiring immediate emergency care',
    ],
    reasonsHi: [
      'सीने में तेज दर्द, भारीपन या दर्द हाथ व जबड़े तक फैल रहा है',
      'संभावित दिल का दौरा - तत्काल आपातकालीन चिकित्सा आवश्यक है',
    ],
    dangerSignsEn: ['Sudden fainting or collapse', 'Cold clammy sweats', 'Severe breathlessness'],
    dangerSignsHi: ['अचानक बेहोशी या चक्कर आना', 'ठंडे पसीने छूटना', 'अत्यधिक सांस फूलना'],
    homeCareAdviceEn: [
      'Do not allow patient to exert or walk',
      'Keep patient resting comfortably in half-seated position',
      'Dial 108 ambulance immediately',
    ],
    homeCareAdviceHi: [
      'मरीज को बिल्कुल भी चलने या जोर न लगाने दें',
      'मरीज को तकिए के सहारे आधा बैठाकर शांत रखें',
      'तुरंत 108 या 112 एम्बुलेंस को कॉल करें',
    ],
  },
  {
    id: 'RF-02',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Severe Respiratory Distress / Stridor',
    titleHi: 'गंभीर सांस फूलना या बोलने में असमर्थता',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const hasBreathlessness = input.symptoms.includes('breathlessness');
      const ans = input.answers;
      return (
        hasBreathlessness &&
        (ans.breathless_at_rest === 'YES' ||
          ans.unable_to_speak_full_sentence === 'YES' ||
          ans.bluish_lips === 'YES' ||
          ans.unable_to_speak_full_sentence === 'NOT_SURE')
      );
    },
    reasonsEn: [
      'Severe breathlessness at rest or inability to complete a sentence in one breath',
      'Critical oxygenation compromise requiring immediate medical resuscitation',
    ],
    reasonsHi: [
      'बैठे-बैठे भी अत्यधिक सांस फूल रही है या एक सांस में वाक्य नहीं बोल पा रहे हैं',
      'ऑक्सीजन की भारी कमी का खतरा - तत्काल अस्पताल पहुंचें',
    ],
    dangerSignsEn: ['Bluish discolouration of lips or fingernails', 'Drowsiness or confusion'],
    dangerSignsHi: ['होंठ या नाखूनों का नीला पड़ना', 'अत्यधिक सुस्ती या भ्रम'],
    homeCareAdviceEn: ['Loosen tight clothing', 'Keep head and chest elevated', 'Do not delay transport'],
    homeCareAdviceHi: ['तंग कपड़े ढीले करें', 'मरीज की पीठ सीधी रखें', 'तुरंत 108 बुलाएं'],
  },
  {
    id: 'RF-03',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Altered Mental Status / Convulsions / Unconsciousness',
    titleHi: 'बेहोशी, दौरे (झटके) या अत्यधिक भ्रम',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const sym = input.symptoms;
      const ans = input.answers;
      return (
        sym.includes('unconsciousness') ||
        sym.includes('convulsions') ||
        ans.fits_or_seizures === 'YES' ||
        ans.unconscious_or_fainting === 'YES' ||
        ans.sudden_confusion === 'YES'
      );
    },
    reasonsEn: [
      'Active convulsions, loss of consciousness, or severe acute confusion',
      'Life-threatening neurological or metabolic emergency',
    ],
    reasonsHi: [
      'मरीज बेहोश हुआ है, मिर्गी जैसे दौरे पड़े हैं या गंभीर भ्रम की स्थिति है',
      'गंभीर न्यूरोलॉजिकल आपातकाल - तत्काल अस्पताल रेफरल अनिवार्य है',
    ],
    dangerSignsEn: ['Repeated seizures without waking', 'No response to voice or touch', 'Difficulty breathing'],
    dangerSignsHi: ['बार-बार दौरे आना', 'आवाज देने पर प्रतिक्रिया न होना', 'सांस रुक-रुक कर आना'],
    homeCareAdviceEn: [
      'Turn patient on their side (recovery position) to prevent choking',
      'Do NOT put spoon, water, or keys in mouth',
      'Call emergency 108 immediately',
    ],
    homeCareAdviceHi: [
      'मरीज को करवट से लिटाएं (रिकवरी पोजीशन) ताकि उल्टी गले में न फंसे',
      'मुंह में चम्मच, पानी, कपड़ा या जूता न डालें',
      'तुरंत 108 पर कॉल करें',
    ],
  },
  {
    id: 'RF-04',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Acute Stroke Symptoms (FAST Protocol)',
    titleHi: 'लकवा (स्ट्रोक) के लक्षण - मुंह टेढ़ा, हाथ कमजोर, बोली लड़खड़ाना',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const ans = input.answers;
      return (
        ans.facial_droop === 'YES' ||
        ans.arm_weakness === 'YES' ||
        ans.speech_difficulty === 'YES' ||
        input.symptoms.includes('stroke_signs')
      );
    },
    reasonsEn: [
      'Signs of acute stroke: facial drooping, one-sided weakness, or speech impairment',
      'Golden hour window: urgent neuroimaging and thrombolysis required',
    ],
    reasonsHi: [
      'चेहरे का टेढ़ापन, एक तरफ के हाथ-पैर में कमजोरी या आवाज का लड़खड़ाना',
      'गोल्डन ऑवर में सीटी स्कैन व आपातकालीन स्ट्रोक उपचार आवश्यक है',
    ],
    dangerSignsEn: ['Worsening weakness', 'Loss of consciousness', 'Inability to swallow'],
    dangerSignsHi: ['कमजोरी का और बढ़ना', 'बेहोश होना', 'निगलने में असमर्थता'],
    homeCareAdviceEn: ['Note the exact time symptoms started', 'Do NOT give any food, water, or aspirin orally'],
    homeCareAdviceHi: ['लक्षण शुरू होने का ठीक समय नोट करें', 'मरीज को कुछ भी खिलाएं-पिलाएं नहीं, तुरंत अस्पताल ले जाएं'],
  },
  {
    id: 'RF-05',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'High-Risk Obstetric Emergency',
    titleHi: 'गर्भावस्था में गंभीर खतरे के लक्षण',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      if (!input.patient.isPregnant) return false;
      const ans = input.answers;
      return (
        ans.pregnancy_bleeding === 'YES' ||
        ans.pregnancy_severe_headache_vision === 'YES' ||
        ans.pregnancy_fits === 'YES' ||
        ans.pregnancy_water_broke_green === 'YES' ||
        ans.pregnancy_reduced_fetal_movement === 'YES'
      );
    },
    reasonsEn: [
      'Obstetric danger sign in pregnancy: bleeding, severe headache/vision change, convulsions, or reduced movement',
      'Risk of eclampsia, placental abruption, or fetal distress',
    ],
    reasonsHi: [
      'गर्भावस्था में खतरे का संकेत: रक्तस्राव, तेज सिरदर्द के साथ धुंधलापन, दौरे या बच्चे की हलचल बंद होना',
      'संभावित एक्लम्पसिया या प्रसव आपातकाल - तत्काल 108 द्वारा जिला अस्पताल ले जाएं',
    ],
    dangerSignsEn: ['Heavy bleeding soaking pads', 'Severe abdominal rigidity', 'Convulsions'],
    dangerSignsHi: ['अधिक रक्तस्राव', 'पेट का बहुत सख्त होना', 'झटके आना'],
    homeCareAdviceEn: ['Keep pregnant woman lying on her left side', 'Carry Mother-Child Protection (MCP) card'],
    homeCareAdviceHi: ['गर्भवती को बाईं करवट लिटाएं', 'ममता/एमसीपी कार्ड साथ रखें और तुरंत अस्पताल निकलें'],
  },
  {
    id: 'RF-06',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Neonatal/Young Infant High-Risk Fever (<2 Months)',
    titleHi: 'नवजात व 2 माह से छोटे शिशु में बुखार व सुस्ती',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const isInfant = input.patient.age < 1; // Under 1 year / young infant
      const hasFever = input.symptoms.includes('fever');
      const ans = input.answers;
      return (
        isInfant &&
        (hasFever ||
          ans.infant_under_2_months === 'YES' ||
          ans.infant_poor_feeding === 'YES' ||
          ans.infant_grunting === 'YES')
      );
    },
    reasonsEn: [
      'Fever or lethargy in young infant under 2 months',
      'Immature neonatal immune system susceptible to rapid systemic sepsis',
    ],
    reasonsHi: [
      'छोटे शिशु में बुखार, दूध न पीना या छाती अंदर धंसना',
      'नवजात में गंभीर संक्रमण (सेप्सिस) का खतरा - तुरंत एसएनसीयू/अस्पताल ले जाएं',
    ],
    dangerSignsEn: ['Refusal to feed', 'Lethargic/not waking up', 'Chest indrawing/grunting'],
    dangerSignsHi: ['दूध पीने से बिल्कुल मना करना', 'सुस्त पड़े रहना', 'सांस लेते समय कराहना'],
    homeCareAdviceEn: ['Keep baby warm through skin-to-skin contact', 'Do not self-medicate'],
    homeCareAdviceHi: ['शिशु को मां के सीने से सटाकर गर्म रखें (कंगारू मदर केयर)', 'बिना डॉक्टर दवा न दें'],
  },
  {
    id: 'RF-07',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Suspected Venomous Snake Bite / Rabid Animal Bite',
    titleHi: 'सांप या संदिग्ध पागल जानवर का काटना',
    recommendedFacility: 'CHC',
    evaluate: (input) => {
      const sym = input.symptoms;
      const ans = input.answers;
      return (
        sym.includes('snake_bite') ||
        sym.includes('animal_bite') ||
        ans.snake_bite === 'YES' ||
        ans.deep_animal_bite === 'YES'
      );
    },
    reasonsEn: [
      'Suspected venomous snakebite or severe animal bite',
      'Risk of neurotoxic/hemotoxic envenomation or rabies requiring immediate anti-snake venom (ASV) / rabies immunoglobulin',
    ],
    reasonsHi: [
      'सांप का काटना या गहरे घाव वाला जानवर का काटना',
      'एंटी-स्नेक वेनम (ASV) या रेबीज टीके की तुरंत आवश्यकता है',
    ],
    dangerSignsEn: ['Drooping eyelids (ptosis)', 'Difficulty swallowing or breathing', 'Swelling rapidly spreading'],
    dangerSignsHi: ['पलकें भारी होना या गिरना', 'थूक निगलने या सांस में दिक्कत', 'काटने वाली जगह पर सूजन तेजी से फैलना'],
    homeCareAdviceEn: [
      'Keep patient calm and still; immobilise the bitten limb like a fracture',
      'Do NOT tie tight tourniquets, do NOT cut or suck the wound',
      'Go immediately to CHC or District Hospital with ASV',
    ],
    homeCareAdviceHi: [
      'मरीज को शांत रखें और काटे गए अंग को बिना हिलाए लकड़ी की खपच्ची से स्थिर रखें',
      'कसा हुआ धागा या पट्टी न बांधें, न ही चीरा लगाएं या मुंह से चूसें',
      'सीधे नजदीकी सीएचसी या जिला अस्पताल पहुंचें जहां एंटी-वेनम मौजूद हो',
    ],
  },
  {
    id: 'RF-08',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Severe Hemorrhage / Hematemesis / Melena',
    titleHi: 'भारी रक्तस्राव, खून की उल्टी या काला दस्त',
    recommendedFacility: 'DISTRICT_HOSPITAL',
    evaluate: (input) => {
      const ans = input.answers;
      return (
        ans.vomiting_blood === 'YES' ||
        ans.black_tarry_stool === 'YES' ||
        ans.uncontrolled_bleeding === 'YES' ||
        input.symptoms.includes('severe_bleeding')
      );
    },
    reasonsEn: [
      'Massive acute bleeding or gastrointestinal hemorrhage (hematemesis/melena)',
      'High risk of hemorrhagic shock and hemodynamic collapse',
    ],
    reasonsHi: [
      'खून की उल्टी, काला तारकोल जैसा दस्त या अनियंत्रित रक्तस्राव',
      'शरीर में खून की भारी कमी व शॉक का खतरा - तत्काल रक्त व आईवी ड्रिप की जरूरत',
    ],
    dangerSignsEn: ['Rapid weak pulse', 'Cold skin and dizziness', 'Fainting upon standing'],
    dangerSignsHi: ['नाड़ी की गति बहुत तेज या कमजोर होना', 'चक्कर खाकर गिर पड़ना'],
    homeCareAdviceEn: ['Apply firm direct pressure with clean cloth to external wounds', 'Elevate feet slightly'],
    homeCareAdviceHi: ['बाहरी घाव पर साफ कपड़े से जोर से दबाकर रखें', 'तुरंत 108 पर एम्बुलेंस बुलाएं'],
  },
  {
    id: 'RF-09',
    category: 'RED_FLAG',
    baseLevel: 'RED',
    titleEn: 'Severe Dehydration with Shock Signs',
    titleHi: 'अतिसार (डायरिया) में गंभीर निर्जलीकरण व शॉक',
    recommendedFacility: 'CHC',
    evaluate: (input) => {
      const hasDiarrhea = input.symptoms.includes('diarrhea') || input.symptoms.includes('vomiting');
      const ans = input.answers;
      return (
        hasDiarrhea &&
        (ans.no_urine_12_hours === 'YES' ||
          ans.unable_to_drink === 'YES' ||
          ans.skin_pinch_very_slow === 'YES')
      );
    },
    reasonsEn: [
      'Severe dehydration: unable to drink, no urine output in 12+ hours, or lethargic shock state',
      'Emergency IV fluid rehydration required to avert acute kidney injury',
    ],
    reasonsHi: [
      'पानी की भारी कमी: 12 घंटे से पेशाब न होना, पानी पीने में असमर्थ, आंखें अंदर धंसना',
      'गुर्दे खराब होने व शॉक का खतरा - तत्काल आईवी ड्रिप लगवाने हेतु अस्पताल ले जाएं',
    ],
    dangerSignsEn: ['Sunken eyes with dry mouth', 'Unresponsiveness', 'Cold extremities'],
    dangerSignsHi: ['धंसी हुई आंखें, सूखा मुंह', 'बेहोशी या बुलाने पर न बोलना'],
    homeCareAdviceEn: ['Try sips of ORS only if conscious', 'Transport immediately for IV fluids'],
    homeCareAdviceHi: ['यदि होश में हो तो चम्मच से ओआरएस घोल पिलाते रहें और तुरंत अस्पताल चलें'],
  },
];

export const ORANGE_RULES: TriageRule[] = [
  {
    id: 'ORG-01',
    category: 'ORANGE_URGENT',
    baseLevel: 'ORANGE',
    titleEn: 'High or Prolonged Fever with Warning Signs',
    titleHi: 'तेज बुखार या 3 दिन से अधिक का बुखार',
    recommendedFacility: 'CHC',
    evaluate: (input) => {
      const hasFever = input.symptoms.includes('fever');
      const ans = input.answers;
      const vit = input.vitals;
      const isHighTemp = (vit?.temperatureF && vit.temperatureF >= 103) || ans.high_fever_103 === 'YES';
      const isLongFever = ans.fever_duration === 'more_than_3_days';
      return hasFever && (isHighTemp || isLongFever || ans.fever_with_rash === 'YES');
    },
    reasonsEn: [
      'High grade fever (>=103°F) or fever continuing for over 3 days',
      'Evaluation required today for malaria, dengue, typhoid, or acute bacterial infection',
    ],
    reasonsHi: [
      '103°F से अधिक तेज बुखार या 3 दिन से लगातार बुखार बना हुआ है',
      'मलेरिया, डेंगू या टाइफाइड की तुरंत जांच के लिए आज ही अस्पताल दिखाएं',
    ],
    dangerSignsEn: ['Bleeding from gums/nose', 'Severe abdominal pain', 'Continuous vomiting'],
    dangerSignsHi: ['मसूड़ों या नाक से खून आना', 'पेट में असहनीय दर्द', 'लगातार उल्टी होना'],
    homeCareAdviceEn: [
      'Sponge forehead and body with normal tap water (not cold)',
      'Offer plenty of liquids (boiled water, dal water, ORS)',
      'Visit PHC/CHC today for blood test',
    ],
    homeCareAdviceHi: [
      'साधारण ताजे पानी से मरीज के बदन व माथे पर पट्टी करें',
      'खूब पानी, दाल का पानी और ओआरएस पिलाएं',
      'खून की जांच के लिए आज ही नजदीकी अस्पताल जाएं',
    ],
  },
  {
    id: 'ORG-02',
    category: 'ORANGE_URGENT',
    baseLevel: 'ORANGE',
    titleEn: 'Severe Acute Abdominal Pain',
    titleHi: 'पेट में अचानक असहनीय तेज दर्द',
    recommendedFacility: 'CHC',
    evaluate: (input) => {
      const hasAbdoPain = input.symptoms.includes('stomach_pain');
      const ans = input.answers;
      return (
        hasAbdoPain &&
        (ans.severe_abdominal_pain === 'YES' ||
          ans.abdominal_rigidity === 'YES' ||
          ans.stomach_pain_continuous === 'YES')
      );
    },
    reasonsEn: [
      'Acute severe abdominal tenderness or continuous severe cramping',
      'Requires in-person examination to rule out acute appendicitis, bowel obstruction, or perforation',
    ],
    reasonsHi: [
      'पेट में लगातार तेज दर्द या पेट छूने पर कड़ा महसूस होना',
      'अपेंडिक्स या आंतों की रुकावट की जांच हेतु आज ही डॉक्टर को दिखाएं',
    ],
    dangerSignsEn: ['Inability to pass stool or gas', 'Persistent vomiting', 'High fever with stomach pain'],
    dangerSignsHi: ['पेट फूलना और गैस या मल पास न होना', 'बार-बार उल्टी होना'],
    homeCareAdviceEn: ['Do NOT take strong laxatives or pain injections without doctor advice', 'Avoid solid food'],
    homeCareAdviceHi: ['बिना डॉक्टर कोई दर्द की सुई या पेट साफ करने की दवा न लें', 'ठोस भोजन न दें'],
  },
  {
    id: 'ORG-03',
    category: 'ORANGE_URGENT',
    baseLevel: 'ORANGE',
    titleEn: 'Suspected Fracture / Deep Wound / Severe Trauma',
    titleHi: 'हड्डी टूटने की आशंका या गहरा घाव',
    recommendedFacility: 'CHC',
    evaluate: (input) => {
      const sym = input.symptoms;
      const ans = input.answers;
      return (
        sym.includes('fracture_suspect') ||
        sym.includes('injury') ||
        ans.suspected_broken_bone === 'YES' ||
        ans.deep_cut_needing_stitches === 'YES' ||
        ans.unable_to_bear_weight === 'YES'
      );
    },
    reasonsEn: [
      'Suspected bone fracture with deformity or deep laceration requiring suturing',
      'Needs X-ray and wound management today',
    ],
    reasonsHi: [
      'हड्डी में फ्रैक्चर की आशंका, अंग का मुड़ जाना या टांके लगाने योग्य गहरा घाव',
      'एक्स-रे व घाव की ड्रेसिंग हेतु आज ही अस्पताल जाएं',
    ],
    dangerSignsEn: ['Bone protruding through skin', 'Numbness in fingers or toes below injury'],
    dangerSignsHi: ['हड्डी का त्वचा से बाहर दिखना', 'चोट के नीचे के हिस्से का सुन्न पड़ना'],
    homeCareAdviceEn: ['Immobilise the limb with a splint', 'Cover wounds with clean dry cloth'],
    homeCareAdviceHi: ['चोट वाले अंग को लकड़ी या गत्ते से बांधकर स्थिर रखें', 'साफ कपड़े से ढकें'],
  },
  {
    id: 'ORG-04',
    category: 'ORANGE_URGENT',
    baseLevel: 'ORANGE',
    titleEn: 'Moderate Dehydration / Persistent Vomiting',
    titleHi: 'उल्टी-दस्त में पानी की कमी (मध्यम)',
    recommendedFacility: 'PHC',
    evaluate: (input) => {
      const hasDiarrhea = input.symptoms.includes('diarrhea') || input.symptoms.includes('vomiting');
      const ans = input.answers;
      return (
        hasDiarrhea &&
        (ans.vomiting_frequent === 'YES' ||
          ans.thirst_extreme === 'YES' ||
          ans.watery_stools_frequent === 'YES')
      );
    },
    reasonsEn: [
      'Frequent watery stools or persistent vomiting leading to moderate dehydration',
      'Needs clinical assessment for oral rehydration monitoring or day-care fluids',
    ],
    reasonsHi: [
      'बार-बार पतले दस्त या उल्टी से शरीर में पानी की कमी हो रही है',
      'आज ही प्राथमिक स्वास्थ्य केंद्र पर डॉक्टर या एएनएम को दिखाएं',
    ],
    dangerSignsEn: ['Decreasing urination', 'Drowsiness', 'Vomiting everything taken'],
    dangerSignsHi: ['पेशाब बहुत कम होना', 'सुस्ती छाना', 'जो भी पिएं तुरंत उल्टी हो जाना'],
    homeCareAdviceEn: ['Give ORS in small sips continuously', 'Continue breastfeeding infants'],
    homeCareAdviceHi: ['ओआरएस का घोल एक-एक घूंट कर लगातार पिलाते रहें', 'शिशु को स्तनपान जारी रखें'],
  },
];

export const YELLOW_RULES: TriageRule[] = [
  {
    id: 'YEL-01',
    category: 'YELLOW_SEMI_URGENT',
    baseLevel: 'YELLOW',
    titleEn: 'Mild-to-Moderate Fever (<3 Days) without Red Flags',
    titleHi: 'हल्का या मध्यम बुखार (3 दिन से कम)',
    recommendedFacility: 'PHC',
    evaluate: (input) => {
      const hasFever = input.symptoms.includes('fever');
      const ans = input.answers;
      return hasFever && ans.fever_duration !== 'more_than_3_days';
    },
    reasonsEn: [
      'Fever of recent onset (<3 days) without immediate danger signs',
      'Consult a primary doctor or teleconsult within 24 to 48 hours if not improving',
    ],
    reasonsHi: [
      'हाल ही में शुरू हुआ बुखार (3 दिन से कम), खतरे के कोई लक्षण नहीं हैं',
      '24 से 48 घंटे में नजदीकी पीएचसी या टेलीकंसल्टेशन द्वारा डॉक्टर की सलाह लें',
    ],
    dangerSignsEn: ['Fever rising above 103°F', 'Severe shivering with confusion', 'Breathlessness'],
    dangerSignsHi: ['बुखार 103°F से ऊपर जाना', 'सांस फूलना', 'अत्यधिक कपकपी या सुस्ती'],
    homeCareAdviceEn: [
      'Rest in a cool room, drink plenty of fluids',
      'Paracetamol can be taken as per weight/doctor advice',
      'Seek immediate care if danger signs develop',
    ],
    homeCareAdviceHi: [
      'मरीज को आराम करने दें और पर्याप्त पानी व तरल पदार्थ दें',
      'पैरासिटामोल डॉक्टर के बताए अनुसार लें',
      'यदि स्थिति बिगड़े तो तुरंत अस्पताल जाएं',
    ],
  },
  {
    id: 'YEL-02',
    category: 'YELLOW_SEMI_URGENT',
    baseLevel: 'YELLOW',
    titleEn: 'Persistent Cough / Respiratory Infection (>1 Week)',
    titleHi: 'लगातार खांसी या छाती में जकड़न (1 सप्ताह से अधिक)',
    recommendedFacility: 'PHC',
    evaluate: (input) => {
      const hasCough = input.symptoms.includes('cough');
      const ans = input.answers;
      return hasCough && (ans.cough_duration === 'more_than_2_weeks' || ans.chest_congestion === 'YES');
    },
    reasonsEn: [
      'Cough persisting for over 1-2 weeks or accompanied by chest congestion',
      'Evaluation needed for bronchitis, asthma flare, or sputum testing for TB',
    ],
    reasonsHi: [
      'एक-दो सप्ताह से अधिक पुरानी खांसी या सीने में बलगम',
      'टीबी की बलगम जांच या डॉक्टर से फेफड़ों की जांच हेतु 24-48 घंटे में दिखाएं',
    ],
    dangerSignsEn: ['Coughing up blood', 'Night sweats with unexplained weight loss', 'Severe breathlessness'],
    dangerSignsHi: ['खांसी में खून आना', 'रात में पसीना और वजन घटना', 'सांस फूलना'],
    homeCareAdviceEn: ['Warm water gargles, steam inhalation', 'Get free sputum test at nearest PHC/DMC'],
    homeCareAdviceHi: ['गुनगुना पानी पिएं और भाप लें', 'नजदीकी पीएचसी पर बलगम की मुफ्त जांच कराएं'],
  },
  {
    id: 'YEL-03',
    category: 'YELLOW_SEMI_URGENT',
    baseLevel: 'YELLOW',
    titleEn: 'Mild Diarrhea or Digestive Distress',
    titleHi: 'हल्के दस्त या पेट में मरोड़',
    recommendedFacility: 'SUB_CENTRE',
    evaluate: (input) => {
      const hasDiarrhea = input.symptoms.includes('diarrhea') || input.symptoms.includes('vomiting');
      return hasDiarrhea;
    },
    reasonsEn: [
      'Mild gastrointestinal upset with adequate hydration',
      'Can be managed with home ORS; visit Sub-Centre/PHC if not resolving in 24-48h',
    ],
    reasonsHi: [
      'हल्के दस्त या पेट में खराबी, शरीर में पानी की गंभीर कमी नहीं है',
      'ओआरएस घोल लें; यदि 1-2 दिन में सुधार न हो तो उप-केंद्र या पीएचसी जाएं',
    ],
    dangerSignsEn: ['Blood in stool', 'High fever', 'Inability to drink fluids'],
    dangerSignsHi: ['दस्त में खून आना', 'तेज बुखार', 'पानी न पी पाना'],
    homeCareAdviceEn: ['Prepare ORS in 1 litre clean boiled water', 'Give Zinc tablets for children under 5 for 14 days'],
    homeCareAdviceHi: ['1 लीटर साफ उबले पानी में 1 पैकेट ओआरएस घोलें', '5 साल से छोटे बच्चों को 14 दिन जिंक की गोली दें'],
  },
  {
    id: 'YEL-04',
    category: 'YELLOW_SEMI_URGENT',
    baseLevel: 'YELLOW',
    titleEn: 'Ear Infection / Throat Pain / Skin Boil',
    titleHi: 'कान बहना, गले में दर्द या फोड़ा-फुंसी',
    recommendedFacility: 'PHC',
    evaluate: (input) => {
      const sym = input.symptoms;
      return (
        sym.includes('ear_pain') ||
        sym.includes('sore_throat') ||
        sym.includes('skin_rash') ||
        sym.includes('headache')
      );
    },
    reasonsEn: [
      'Localized symptom (ear pain, throat infection, localized skin lesion)',
      'Requires primary healthcare doctor or teleconsultation within 24-48 hours',
    ],
    reasonsHi: [
      'कान में दर्द, गले में खराश या त्वचा पर संक्रमण',
      '24 से 48 घंटे में डॉक्टर या एएनएम से मिलकर दवा लें',
    ],
    dangerSignsEn: ['Swelling behind the ear', 'Difficulty opening mouth or swallowing', 'Rapidly spreading redness'],
    dangerSignsHi: ['कान के पीछे सूजन व दर्द', 'मुंह खोलने या निगलने में असमर्थता', 'लालिमा का तेजी से फैलना'],
    homeCareAdviceEn: ['Do not insert oil or sticks in ears', 'Keep skin clean and dry'],
    homeCareAdviceHi: ['कान में सरसों का तेल, लकड़ी या तीली बिल्कुल न डालें', 'घाव को साफ व सूखा रखें'],
  },
];

export const GREEN_RULES: TriageRule[] = [
  {
    id: 'GRN-01',
    category: 'GREEN_HOME_CARE',
    baseLevel: 'GREEN',
    titleEn: 'Minor Cold / Superficial Symptom for Home Care',
    titleHi: 'सामान्य सर्दी-जुकाम या हल्की परेशानी (घरेलू देखभाल)',
    recommendedFacility: 'SUB_CENTRE',
    evaluate: () => true, // Fallback baseline
    reasonsEn: [
      'Symptoms are mild with no red flags or warning signs',
      'Suitable for home care, rest, and monitoring',
    ],
    reasonsHi: [
      'लक्षण हल्के हैं और खतरे का कोई संकेत नहीं है',
      'घर पर आराम, घरेलू देखभाल व निगरानी से ठीक हो सकते हैं',
    ],
    dangerSignsEn: ['Difficulty breathing', 'High fever persisting >3 days', 'Inability to eat or drink'],
    dangerSignsHi: ['सांस फूलने लगना', '3 दिन से ज्यादा बुखार रहना', 'खाना-पीना न कर पाना'],
    homeCareAdviceEn: [
      'Get plenty of bed rest and drink warm water',
      'Eat light, freshly cooked, nutritious meals',
      'Re-triage or visit Ayushman Arogya Mandir if symptoms worsen',
    ],
    homeCareAdviceHi: [
      'मरीज को भरपूर आराम करने दें और गुनगुना पानी पिलाएं',
      'हल्का, ताजा व सुपाच्य भोजन दें',
      'यदि परेशानी बढ़े तो दोबारा जांच करें या आयुष्मान आरोग्य मंदिर जाएं',
    ],
  },
];

export interface RiskModifier {
  id: string;
  nameEn: string;
  nameHi: string;
  applies: (input: TriageInput) => boolean;
}

export const RISK_MODIFIERS: RiskModifier[] = [
  {
    id: 'MOD-01',
    nameEn: 'Vulnerable Age Group (< 5 years or > 60 years)',
    nameHi: 'अतिसंवेदनशील आयु वर्ग (5 वर्ष से छोटे या 60 वर्ष से वृद्ध)',
    applies: (input) => input.patient.age < 5 || input.patient.age > 60,
  },
  {
    id: 'MOD-02',
    nameEn: 'Active Pregnancy',
    nameHi: 'गर्भावस्था',
    applies: (input) => !!input.patient.isPregnant,
  },
  {
    id: 'MOD-03',
    nameEn: 'Chronic Comorbidities (Diabetes / Hypertension / Heart Disease / Asthma / TB)',
    nameHi: 'पुरानी गंभीर बीमारी (शुगर, बीपी, हृदय रोग, दमा या टीबी)',
    applies: (input) => {
      const conds = input.patient.knownConditions || [];
      return conds.some((c) =>
        ['DIABETES', 'HYPERTENSION', 'HEART_DISEASE', 'ASTHMA', 'TB'].includes(c.toUpperCase())
      );
    },
  },
  {
    id: 'MOD-04',
    nameEn: 'Extreme High Fever (>=104°F) or Combined Persistent High Fever',
    nameHi: 'अत्यधिक तेज बुखार (>=104°F) या 3 दिन से अधिक के साथ तेज बुखार',
    applies: (input) => {
      const ans = input.answers;
      const vit = input.vitals;
      const extremeTemp = vit?.temperatureF !== undefined && vit.temperatureF >= 104;
      const combinedDurationAndHigh =
        ans.fever_duration === 'more_than_3_days' && ans.high_fever_103 === 'YES';
      return extremeTemp || combinedDurationAndHigh;
    },
  },
  {
    id: 'MOD-05',
    nameEn: 'Multiple Comorbid Symptoms (>=3 Symptoms combined)',
    nameHi: 'एक साथ 3 या अधिक लक्षण मौजूद हैं',
    applies: (input) => input.symptoms.length >= 3,
  },
];

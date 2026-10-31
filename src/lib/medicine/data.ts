export interface MedicineInfo {
  id: string;
  genericName: string;
  brandNames: string[];
  hindiName: string;
  category:
    | 'Fever & Pain'
    | 'Cough & Cold'
    | 'Heart & Blood Pressure'
    | 'Diabetes & Metabolic'
    | 'Digestion & Acidity'
    | 'Infections & Antibiotics'
    | 'Skin & Allergy'
    | 'First Aid & Rehydration'
    | 'Vitamins & Iron'
    | 'Respiratory & Asthma';
  treatingConditions: string[]; // Diseases / problems it treats
  treatingConditionsHi: string[];
  standardDosage: string;
  dosageHi: string;
  prescriptionType: 'OTC' | 'Rx'; // OTC = Over the counter, Rx = Doctor prescription needed
  janAushadhiPrice: string; // Indian Generic price
  marketPrice: string;
  sideEffects: string[];
  warningsHi: string;
  howItWorks: string;
}

export const COMPREHENSIVE_MEDICINES: MedicineInfo[] = [
  // --- 1. FEVER & PAIN ---
  {
    id: 'paracetamol',
    genericName: 'Paracetamol / Acetaminophen (650mg / 500mg)',
    brandNames: ['Dolo 650', 'Crocin 650', 'Calpol 500', 'Pacimol'],
    hindiName: 'पैरासिटामोल (बुखार एवं हल्का दर्द)',
    category: 'Fever & Pain',
    treatingConditions: [
      'Fever',
      'Headache',
      'Body Ache',
      'Viral Fever',
      'Dengue Fever (Non-Aspirin)',
      'Toothache',
      'Malaria Fever Symptom',
    ],
    treatingConditionsHi: ['बुखार', 'सिरदर्द', 'बदन दर्द', 'वायरल बुखार', 'दांत दर्द', 'हल्का जोड़ों का दर्द'],
    standardDosage:
      'Adults: 500mg - 650mg every 4 to 6 hours as needed after food. Max 3000mg (4 tablets of 650mg) in 24 hours.',
    dosageHi: 'वयस्क: 1 गोली (650mg) खाना खाने के बाद दिन में 2-3 बार। 24 घंटे में अधिकतम 4 गोली से ज्यादा न लें।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹10 - ₹15 (10 गोलियां)',
    marketPrice: '₹30 - ₹40 (15 गोलियां)',
    sideEffects: ['Safe when taken in recommended doses', 'Excessive overdose causes severe liver toxicity'],
    warningsHi: 'शराब के साथ बिल्कुल न लें। लीवर की समस्या वाले मरीज डॉक्टर से परामर्श के बाद ही लें।',
    howItWorks: 'Acts on hypothalamus in brain to regulate body temperature and blocks pain messengers.',
  },
  {
    id: 'ibuprofen',
    genericName: 'Ibuprofen (400mg) / Paracetamol Combination',
    brandNames: ['Brufen 400', 'Combiflam', 'Ibugesic Plus'],
    hindiName: 'आइबुप्रोफेन / कॉम्बीफ्लेम (तेज दर्द व सूजन)',
    category: 'Fever & Pain',
    treatingConditions: [
      'Severe Joint Pain',
      'Dental Pain',
      'Muscle Strain',
      'Sprain',
      'Arthritis Swelling',
      'Menstrual Cramps',
      'Back Pain',
    ],
    treatingConditionsHi: ['जोड़ों का तेज दर्द', 'मांसपेशियों में खिंचाव', 'चोट व मोच', 'दांत में सूजन व दर्द', 'कमर दर्द'],
    standardDosage: 'Adults: 400mg twice daily strictly after meals with water. Do not take on empty stomach.',
    dosageHi: 'वयस्क: 1 गोली भोजन के तुरंत बाद पानी के साथ। खाली पेट कभी न लें।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹8 - ₹12 (10 गोलियां)',
    marketPrice: '₹28 - ₹45 (15 गोलियां)',
    sideEffects: ['Acidity', 'Stomach irritation', 'Nausea'],
    warningsHi: 'पेट में अल्सर, किडनी की बीमारी या गैस्ट्रिक ब्लीडिंग वाले मरीज न लें। डेंगू बुखार में न लें।',
    howItWorks: 'Non-steroidal anti-inflammatory drug (NSAID) that inhibits COX enzymes reducing inflammation and swelling.',
  },
  {
    id: 'meftal_spas',
    genericName: 'Dicyclomine (10mg) + Mefenamic Acid (250mg)',
    brandNames: ['Meftal Spas', 'Cyclopam', 'Spasmonil', 'Colimex'],
    hindiName: 'मेफ्टल स्पास / साइक्लोपाम (पेट दर्द व मरोड़)',
    category: 'Fever & Pain',
    treatingConditions: [
      'Stomach Cramps (पेट मरोड़)',
      'Abdominal Pain',
      'Menstrual Pain (पीरियड्स का दर्द)',
      'Intestinal Spasms',
      'Ureteric Colic',
    ],
    treatingConditionsHi: ['पेट में तेज मरोड़ व ऐंठन', 'मासिक धर्म / पीरियड्स का असहनीय दर्द', 'आंतों की ऐंठन'],
    standardDosage: '1 tablet after food as needed for acute stomach cramps. Maximum 2-3 tablets a day.',
    dosageHi: 'पेट में तेज ऐंठन या मरोड़ होने पर 1 गोली भोजन के बाद। दिन में अधिकतम 2 बार।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹12 - ₹18 (10 गोलियां)',
    marketPrice: '₹45 - ₹65 (10 गोलियां)',
    sideEffects: ['Dry mouth', 'Drowsiness', 'Blurry vision momentarily', 'Mild acidity'],
    warningsHi: 'अपेंडिसाइटिस (दाहिनी तरफ निचला पेट दर्द) का संदेह हो तो तुरंत अस्पताल जाएं, यह दर्द निवारक न लें।',
    howItWorks: 'Relaxes smooth muscles of the digestive tract and blocks prostaglandin pain mediators.',
  },

  // --- 2. DIGESTION, ACIDITY & REHYDRATION ---
  {
    id: 'pantoprazole',
    genericName: 'Pantoprazole (40mg)',
    brandNames: ['Pan 40', 'Pantocid', 'Pantodac', 'Pan-D (with Domperidone)'],
    hindiName: 'पेंटोप्राजोल (गैस, एसिडिटी व सीने में जलन)',
    category: 'Digestion & Acidity',
    treatingConditions: ['Acidity', 'Heartburn', 'GERD / Acid Reflux', 'Stomach Ulcers', 'Gas / Indigestion'],
    treatingConditionsHi: ['एसिडिटी', 'सीने में जलन', 'गैस की समस्या', 'पेट में छाले (अल्सर)', 'खट्टी डकारें'],
    standardDosage: '1 tablet (40mg) once daily in the morning, 30 to 45 minutes before breakfast with water.',
    dosageHi: 'रोजाना सुबह खाली पेट 1 गोली, नाश्ते से आधा घंटा पहले पानी के साथ लें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹14 - ₹20 (10 गोलियां)',
    marketPrice: '₹80 - ₹140 (10 गोलियां)',
    sideEffects: ['Mild headache', 'Diarrhea or constipation', 'Stomach flatulence'],
    warningsHi: 'लंबे समय तक (3 महीने से अधिक) बिना डॉक्टर परामर्श न लें। गोली को चबाएं नहीं, सीधे निगलें।',
    howItWorks: 'Proton Pump Inhibitor (PPI) that suppresses acid pumps in the stomach lining, cutting excess acid production.',
  },
  {
    id: 'ors_zinc',
    genericName: 'Oral Rehydration Salts (WHO Formula) + Zinc Sulphate',
    brandNames: ['Electral Powder', 'ORS Cipla', 'Walyte', 'Zincovit'],
    hindiName: 'ओआरएस घोल एवं जिंक (दस्त व निर्जलीकरण)',
    category: 'First Aid & Rehydration',
    treatingConditions: [
      'Diarrhea / Loose Motions',
      'Vomiting Dehydration',
      'Heatstroke / Sunstroke',
      'Extreme Weakness from Fluid Loss',
      'Cholera Support',
    ],
    treatingConditionsHi: ['दस्त (डायरिया)', 'उल्टी से पानी की कमी', 'लू लगना (हीटस्ट्रोक)', 'पानी व नमक की कमी', 'शरीर में कमजोरी'],
    standardDosage:
      'Dissolve 1 full ORS sachet in exactly 1 Litre of clean drinking/boiled water. Sip continuously throughout the day.',
    dosageHi: '1 पूरा पैकेट ठीक 1 लीटर साफ पीने के पानी में घोलें। 24 घंटे के अंदर घूंट-घूंट करके पूरा पिएं।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹6 - ₹10 (1 लीटर सैशे)',
    marketPrice: '₹22 - ₹30 (सैशे)',
    sideEffects: ['Safe and life-saving for all age groups including infants and pregnant mothers.'],
    warningsHi: 'ओआरएस को दूध या जूस में न घोलें, केवल साफ पानी में ही बनाएं। बना हुआ घोल 24 घंटे बाद फेंक दें।',
    howItWorks: 'Provides calibrated glucose-sodium ratio triggering water absorption in intestine, preventing hypovolemic shock.',
  },
  {
    id: 'ondansetron',
    genericName: 'Ondansetron (4mg)',
    brandNames: ['Emeset 4mg', 'Ondem 4mg', 'Vomikind'],
    hindiName: 'ओनडैनसेट्रॉन (उल्टी व जी मिचलाना)',
    category: 'Digestion & Acidity',
    treatingConditions: ['Vomiting', 'Nausea / Giddiness', 'Food Poisoning Vomiting', 'Motion Sickness'],
    treatingConditionsHi: ['उल्टी होना', 'जी मिचलाना', 'फूड पॉइजनिंग में उल्टी', 'सफर में उल्टी आना'],
    standardDosage: '1 tablet (4mg) dissolved in mouth or with sips of water 30 minutes before food or during acute nausea.',
    dosageHi: 'उल्टी होने पर 1 गोली (4mg) मुंह में रखकर या थोड़े पानी के साथ लें। दिन में 2 बार तक ले सकते हैं।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹8 - ₹12 (10 गोलियां)',
    marketPrice: '₹40 - ₹60 (10 गोलियां)',
    sideEffects: ['Constipation', 'Mild headache', 'Fatigue'],
    warningsHi: 'यदि उल्टी में खून आ रहा हो तो तुरंत आपातकालीन अस्पताल जाएं, दवा पर निर्भर न रहें।',
    howItWorks: 'Blocks serotonin (5-HT3) chemical receptors in the gut and vomiting center of the brain.',
  },

  // --- 3. DIABETES & METABOLIC ---
  {
    id: 'metformin',
    genericName: 'Metformin Hydrochloride (500mg / 1000mg ER)',
    brandNames: ['Glycomet 500', 'Gluconorm', 'Obimet', 'Cetapin'],
    hindiName: 'मेटफॉर्मिन (टाइप-2 मधुमेह / शुगर नियंत्रण)',
    category: 'Diabetes & Metabolic',
    treatingConditions: [
      'Type 2 Diabetes Mellitus',
      'High Blood Sugar (Hyperglycemia)',
      'Insulin Resistance',
      'Prediabetes (Off-label)',
    ],
    treatingConditionsHi: ['टाइप-2 मधुमेह (शुगर)', 'उच्च रक्त शर्करा', 'इंसुलिन प्रतिरोध', 'प्री-डायबिटीज'],
    standardDosage: 'Initial: 500mg once or twice daily with or immediately after major meals to minimize gastric upset.',
    dosageHi: '1 गोली (500mg) खाना खाते समय या खाने के तुरंत बाद। डॉक्टर की पर्ची के अनुसार ही खुराक तय करें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹12 - ₹18 (10 गोलियां)',
    marketPrice: '₹45 - ₹70 (15 गोलियां)',
    sideEffects: ['Metallic taste', 'Loose stools initially', 'Mild stomach bloating'],
    warningsHi: 'गंभीर किडनी रोग वाले मरीज न लें। नियमित रूप से फास्टिंग ब्लड शुगर एवं HbA1c की जांच कराते रहें।',
    howItWorks: 'Biguanide that suppresses liver glucose output and enhances muscle insulin sensitivity.',
  },
  {
    id: 'glimepiride',
    genericName: 'Glimepiride (1mg / 2mg)',
    brandNames: ['Amaryl 1mg/2mg', 'Glimestar', 'Zoryl'],
    hindiName: 'ग्लिमेपिराइड (शुगर कम करने की दवा)',
    category: 'Diabetes & Metabolic',
    treatingConditions: ['Type 2 Diabetes Mellitus', 'Uncontrolled Blood Sugar despite diet'],
    treatingConditionsHi: ['टाइप-2 डायबिटीज', 'खानपान नियंत्रण के बाद भी बढ़ी हुई शुगर'],
    standardDosage: '1mg or 2mg once daily, strictly with or immediately before the first main meal (breakfast).',
    dosageHi: 'दिन में 1 बार सुबह के नाश्ते के ठीक पहले लें। दवा लेने के बाद खाना खाना अनिवार्य है।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹8 - ₹15 (10 गोलियां)',
    marketPrice: '₹55 - ₹95 (15 गोलियां)',
    sideEffects: ['Hypoglycemia (low blood sugar)', 'Dizziness', 'Sweating if meal is skipped'],
    warningsHi: 'दवा लेने के बाद कभी भी भोजन न छोड़ें, अन्यथा शुगर बहुत कम (हाइपोग्लाइसीमिया) हो सकती है। जेब में ग्लूकोज या टॉफी रखें।',
    howItWorks: 'Sulfonylurea that stimulates beta cells of the pancreas to release more natural insulin into the bloodstream.',
  },

  // --- 4. HEART & BLOOD PRESSURE ---
  {
    id: 'amlodipine',
    genericName: 'Amlodipine (5mg)',
    brandNames: ['Amlong 5', 'Norvasc', 'Amlovas', 'Stamlo'],
    hindiName: 'एम्लोडिपाइन (उच्च रक्तचाप / हाई बीपी)',
    category: 'Heart & Blood Pressure',
    treatingConditions: ['Hypertension (High Blood Pressure)', 'Chronic Stable Angina', 'Coronary Artery Disease'],
    treatingConditionsHi: ['हाई ब्लड प्रेशर (उच्च रक्तचाप)', 'सीने में एंजाइना का दर्द', 'हृदय धमनियों का सिकुड़ना'],
    standardDosage: '1 tablet (5mg) once daily at the same time each day (morning or night) with water.',
    dosageHi: 'दिन में 1 गोली (5mg) निश्चित समय पर पानी के साथ लें। बिना डॉक्टर सलाह दवा अचानक बंद न करें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹6 - ₹10 (10 गोलियां)',
    marketPrice: '₹35 - ₹60 (15 गोलियां)',
    sideEffects: ['Swelling around ankles/feet (pedal edema)', 'Dizziness on sudden standing', 'Flushing'],
    warningsHi: 'अचानक खड़े होने पर चक्कर आ सकते हैं। नियमित बीपी की जांच कराएं और नमक का सेवन कम करें।',
    howItWorks: 'Calcium channel blocker that relaxes arterial smooth muscles, widening blood vessels and lowering BP.',
  },
  {
    id: 'telmisartan',
    genericName: 'Telmisartan (40mg)',
    brandNames: ['Telma 40', 'Telmikind', 'Cresar', 'Telpres'],
    hindiName: 'टेल्मिसार्टन (ब्लड प्रेशर एवं हृदय सुरक्षा)',
    category: 'Heart & Blood Pressure',
    treatingConditions: ['Hypertension (High BP)', 'Cardiovascular Risk Reduction', 'Diabetic Nephropathy / Kidney Protection'],
    treatingConditionsHi: ['हाई ब्लड प्रेशर', 'हृदयघात का जोखिम कम करना', 'डायबिटीज के मरीजों में गुर्दे की सुरक्षा'],
    standardDosage: '1 tablet (40mg) once daily with or without food. Monitor blood pressure periodically.',
    dosageHi: 'रोजाना 1 गोली (40mg) निश्चित समय पर लें। डॉक्टर के निर्देशानुसार बीपी चार्ट बनाएं।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹15 - ₹22 (10 गोलियां)',
    marketPrice: '₹90 - ₹150 (15 गोलियां)',
    sideEffects: ['Dizziness', 'Slight rise in potassium levels', 'Fatigue'],
    warningsHi: 'गर्भावस्था में यह दवा बिल्कुल प्रतिबंधित है (गर्भाशय में भ्रूण को हानि पहुंचा सकती है)।',
    howItWorks: 'Angiotensin Receptor Blocker (ARB) blocking constriction of blood vessels and protecting kidney filters.',
  },
  {
    id: 'aspirin_75',
    genericName: 'Aspirin Gastro-resistant (75mg / 150mg) / Ecosprin',
    brandNames: ['Ecosprin 75', 'Delisprin', 'Loprin'],
    hindiName: 'एस्पिरिन / इकोस्प्रिन (खून पतला करने की दवा)',
    category: 'Heart & Blood Pressure',
    treatingConditions: [
      'Heart Attack Prevention',
      'Stroke Prevention',
      'Angina',
      'Post-Stent Care',
      'Emergency Heart Attack (300mg Chewed)',
    ],
    treatingConditionsHi: ['हार्ट अटैक से बचाव', 'ब्रेन स्ट्रोक से बचाव', 'खून के थक्के (क्लॉट) जमने से रोकना'],
    standardDosage:
      'Preventive: 75mg once daily after main meal. Acute Heart Attack Emergency: 300mg (2 tabs of 150mg) chewed immediately under doctor direction.',
    dosageHi: 'रोजाना 1 गोली (75mg) दोपहर के खाने के बाद। हार्ट अटैक की आपात स्थिति में डॉक्टर के कहने पर तुरंत चबाकर लें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹5 - ₹8 (14 गोलियां)',
    marketPrice: '₹15 - ₹25 (14 गोलियां)',
    sideEffects: ['Mild acidity', 'Increased bleeding tendency (longer to stop cuts)'],
    warningsHi: 'सक्रिय अल्सर या ब्लीडिंग विकार वाले न लें। बिना चिकित्सीय परामर्श के स्वयं न शुरू करें।',
    howItWorks: 'Antiplatelet agent irreversibly inhibiting thromboxane A2, preventing blood clots in coronary arteries.',
  },
  {
    id: 'atorvastatin',
    genericName: 'Atorvastatin (10mg / 20mg)',
    brandNames: ['Atorva 10', 'Lipitor', 'Storvas', 'Tonact'],
    hindiName: 'एटोर्वास्टेटिन (कोलेस्ट्रॉल कम करने की दवा)',
    category: 'Heart & Blood Pressure',
    treatingConditions: ['High Cholesterol (Hyperlipidemia)', 'Coronary Artery Disease', 'Plaque Stabilization in Heart'],
    treatingConditionsHi: ['खून में कोलेस्ट्रॉल और ट्राइग्लिसराइड्स बढ़ना', 'हार्ट अटैक का जोखिम घटाना', 'धमनियों में रुकावट'],
    standardDosage: '1 tablet (10mg or 20mg) once daily at bedtime with water.',
    dosageHi: 'रोजाना रात को सोने से पहले 1 गोली पानी के साथ लें। तली-भुनी चीजें बंद करें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹14 - ₹24 (10 गोलियां)',
    marketPrice: '₹70 - ₹120 (15 गोलियां)',
    sideEffects: ['Mild muscle aches', 'Headache', 'Elevated liver enzymes in rare cases'],
    warningsHi: 'मांसपेशियों में अत्यधिक दर्द या कमजोरी महसूस होने पर डॉक्टर को सूचित करें। शराब से परहेज करें।',
    howItWorks: 'HMG-CoA reductase inhibitor cutting liver synthesis of LDL ("bad") cholesterol.',
  },

  // --- 5. COUGH, COLD & ALLERGY ---
  {
    id: 'cetirizine',
    genericName: 'Cetirizine Hydrochloride (10mg)',
    brandNames: ['Cetzine', 'Okacet', 'Alerid', 'Zyrtec'],
    hindiName: 'सिट्रिजिन (जुकाम, छींकें, एलर्जी व खुजली)',
    category: 'Skin & Allergy',
    treatingConditions: [
      'Allergic Rhinitis (Cold/Sneezing)',
      'Running Nose',
      'Skin Itching / Urticaria (Hives)',
      'Watery Eyes / Pollen Allergy',
    ],
    treatingConditionsHi: ['जुकाम व लगातार छींकें आना', 'नाक बहना', 'त्वचा में खुजली व लाल चकत्ते (पित्ती)', 'आंखों से पानी बहना'],
    standardDosage: '1 tablet (10mg) once daily, preferably at night before sleeping.',
    dosageHi: 'रोजाना रात को सोने से पहले 1 गोली लें। बच्चों के लिए सिट्रिजिन सिरप आधी खुराक में दिया जाता है।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹4 - ₹8 (10 गोलियां)',
    marketPrice: '₹22 - ₹35 (10 गोलियां)',
    sideEffects: ['Mild drowsiness / sleepiness', 'Dry mouth'],
    warningsHi: 'दवा लेने के बाद गाड़ी चलाने या भारी मशीनरी चलाने से बचें क्योंकि इससे नींद आ सकती है।',
    howItWorks: 'Second-generation antihistamine blocking histamine H1 receptors, stopping allergic reactions without severe sedation.',
  },
  {
    id: 'cough_syrup_dextro',
    genericName: 'Dextromethorphan + Chlorpheniramine (Dry Cough Syrup)',
    brandNames: ['Benadryl DR', 'Ascoril-D', 'TusQ-D', 'Chericof'],
    hindiName: 'सूखी खांसी का सिरप (डेक्सट्रोमेथोर्फन)',
    category: 'Cough & Cold',
    treatingConditions: ['Dry Cough (No phlegm)', 'Throat Tickle & Irritation', 'Night Cough Disturbance'],
    treatingConditionsHi: ['सूखी खांसी (बिना बलगम वाली)', 'गले में लगातार खराश व खुजली', 'रात में खांसी का दौरा'],
    standardDosage: 'Adults: 5ml - 10ml two to three times a day using measuring cup. Avoid drinking water immediately for 15 mins.',
    dosageHi: 'वयस्क: 5 से 10 मिली सिरप दिन में 2-3 बार। सिरप पीने के 15 मिनट बाद तक पानी न पिएं।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹25 - ₹35 (100ml बोतल)',
    marketPrice: '₹90 - ₹140 (100ml बोतल)',
    sideEffects: ['Mild drowsiness', 'Dizziness', 'Nausea'],
    warningsHi: 'यदि खांसी में पीला या हरा बलगम आ रहा हो तो सूखी खांसी का सिरप न लें (बलगम वाली खांसी का एक्सपैक्टोरेंट लें)।',
    howItWorks: 'Suppresses the cough reflex in the medulla oblongata while antihistamine dries up irritation.',
  },
  {
    id: 'cough_syrup_wet',
    genericName: 'Ambroxol + Levosalbutamol + Guaiphenesin (Wet Cough Syrup)',
    brandNames: ['Ascoril LS', 'Bro-Zedex LS', 'Asthakind LS'],
    hindiName: 'बलगम वाली खांसी का सिरप (कफ सिरप)',
    category: 'Cough & Cold',
    treatingConditions: ['Productive / Wet Cough', 'Chest Congestion & Wheezing', 'Bronchitis with thick mucus'],
    treatingConditionsHi: ['बलगम वाली खांसी', 'सीने में जकड़न व घरघराहट', 'बलगम निकालने में परेशानी'],
    standardDosage: 'Adults: 5ml to 10ml three times daily after food with lukewarm water.',
    dosageHi: 'वयस्क: 5 से 10 मिली दिन में 3 बार खाना खाने के बाद गुनगुने पानी के साथ।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹30 - ₹45 (100ml बोतल)',
    marketPrice: '₹110 - ₹160 (100ml बोतल)',
    sideEffects: ['Mild tremors / shaking hands', 'Fast pulse', 'Nausea'],
    warningsHi: 'हृदय रोगी या तेज धड़कन वाले मरीज डॉक्टर से पूछकर ही लें। खूब गुनगुना पानी पिएं।',
    howItWorks: 'Ambroxol thins sticky mucus, Levosalbutamol dilates bronchial airways, Guaiphenesin expels phlegm.',
  },

  // --- 6. RESPIRATORY & ASTHMA ---
  {
    id: 'salbutamol_inhaler',
    genericName: 'Salbutamol Inhaler (100mcg per puff)',
    brandNames: ['Asthalin Inhaler', 'Ventorlin', 'Aerocort'],
    hindiName: 'अस्थालिन इनहेलर (दमा व सांस फूलने की दवा)',
    category: 'Respiratory & Asthma',
    treatingConditions: [
      'Asthma Attack (दमा)',
      'Shortness of Breath',
      'COPD Bronchospasm',
      'Wheezing in Chest (घरघराहट)',
    ],
    treatingConditionsHi: ['अस्थमा / दमा का दौरा', 'सांस फूलना', 'सीने में सीटी जैसी आवाज आना', 'खांसी से सांस रुकना'],
    standardDosage: '1 to 2 puffs inhaled when sudden breathlessness occurs. Rinse mouth with water after inhaling.',
    dosageHi: 'अचानक सांस फूलने पर 1 से 2 पफ इनहेलर से खींचें। इनहेलर लेने के बाद पानी से कुल्ला करें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹45 - ₹65 (200 MD Dose)',
    marketPrice: '₹140 - ₹190 (Inhaler)',
    sideEffects: ['Mild hand tremors', 'Transient tachycardia / fast heart beat', 'Palpitations'],
    warningsHi: 'यदि 4 पफ के बाद भी सांस न संभले तो तुरंत निकटतम अस्पताल या ऑक्सीजन सुविधा वाले केंद्र जाएं।',
    howItWorks: 'Beta-2 agonist that rapidly relaxes constricted airway smooth muscle within 5 minutes.',
  },

  // --- 7. INFECTIONS & ANTIBIOTICS ---
  {
    id: 'amoxicillin_clav',
    genericName: 'Amoxicillin & Potassium Clavulanate (625mg)',
    brandNames: ['Augmentin 625 Duo', 'Moxikind-CV 625', 'Clavam 625'],
    hindiName: 'एमोक्सिसिलिन क्लैव (एंटीबायोटिक - जीवाणु संक्रमण)',
    category: 'Infections & Antibiotics',
    treatingConditions: [
      'Bacterial Throat Infection / Tonsillitis',
      'Chest / Lung Infection (Bronchitis/Pneumonia)',
      'Ear & Sinus Infection',
      'Skin & Soft Tissue Infections',
      'Urinary Tract Infection (UTI)',
    ],
    treatingConditionsHi: [
      'गले का गंभीर जीवाणु संक्रमण (टॉन्सिल)',
      'फेफड़ों का इन्फेक्शन (निमोनिया)',
      'कान व साइनस में मवाद',
      'मूत्र मार्ग संक्रमण (UTI)',
    ],
    standardDosage: '1 tablet (625mg) twice daily after meals for 5 consecutive days. Complete the full course.',
    dosageHi: '1 गोली (625mg) सुबह-शाम खाना खाने के बाद लगातार 5 दिन तक। डॉक्टर द्वारा बताया गया पूरा कोर्स खत्म करें।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹50 - ₹70 (6 गोलियां)',
    marketPrice: '₹170 - ₹230 (10 गोलियां)',
    sideEffects: ['Diarrhea / loose stools', 'Nausea', 'Mild stomach ache'],
    warningsHi: 'पेनिसिलिन से एलर्जी वाले मरीज कभी न लें। बीच में दवा न छोड़ें अन्यथा बैक्टीरिया प्रतिरोधी (Resistant) बन जाते हैं।',
    howItWorks: 'Broad-spectrum beta-lactam antibiotic that destroys bacterial cell walls, while clavulanate stops bacterial resistance.',
  },
  {
    id: 'azithromycin',
    genericName: 'Azithromycin (500mg)',
    brandNames: ['Azithral 500', 'Zady 500', 'Azee 500'],
    hindiName: 'एजिथ्रोमाइसिन (गला व फेफड़ों का एंटीबायोटिक)',
    category: 'Infections & Antibiotics',
    treatingConditions: [
      'Throat Infection / Pharyngitis',
      'Typhoid (under supervision)',
      'Respiratory Tract Infection',
      'Skin Bacterial Infection',
    ],
    treatingConditionsHi: ['गले में तेज दर्द व खराश', 'श्वसन तंत्र में संक्रमण', 'टाइफाइड बुखार'],
    standardDosage: '1 tablet (500mg) once daily 1 hour before or 2 hours after food for 3 or 5 days.',
    dosageHi: 'रोजाना 1 गोली (500mg) दिन में 1 बार खाली पेट 3 से 5 दिन तक।',
    prescriptionType: 'Rx',
    janAushadhiPrice: '₹35 - ₹50 (3 गोलियां)',
    marketPrice: '₹95 - ₹140 (5 गोलियां)',
    sideEffects: ['Stomach cramps', 'Diarrhea', 'Mild nausea'],
    warningsHi: 'हृदय की धड़कन (QT prolongation) वाले मरीज डॉक्टर की सलाह पर ही लें। केवल 1 बार में पूरा कोर्स खत्म करें।',
    howItWorks: 'Macrolide antibiotic that halts bacterial protein synthesis, stopping bacterial growth.',
  },

  // --- 8. SKIN & TOPICAL ---
  {
    id: 'clotrimazole',
    genericName: 'Clotrimazole Cream 1% / Powder',
    brandNames: ['Candid Cream', 'Canesten', 'Abzorb Powder'],
    hindiName: 'क्लोट्रिमाजोल (दाद, खाज, खुजली व फंगल इन्फेक्शन)',
    category: 'Skin & Allergy',
    treatingConditions: [
      'Fungal Skin Infection (Ringworm / दाद)',
      "Athlete's Foot",
      'Jock Itch (जांघों की खुजली)',
      'Fungal Sweat Rash',
    ],
    treatingConditionsHi: ['दाद (रिंगवॉर्म)', 'पसीने से होने वाली खुजली व लाल चकत्ते', 'फंगल इन्फेक्शन'],
    standardDosage: 'Clean and dry the affected area thoroughly. Apply thin layer of cream twice daily for 2 to 3 weeks.',
    dosageHi: 'प्रभावित जगह को धोकर सुखाएं। दिन में 2 बार पतली परत लगाएं और लक्षण ठीक होने के बाद भी 1 हफ्ता जारी रखें।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹15 - ₹25 (20g ट्यूब)',
    marketPrice: '₹80 - ₹130 (30g ट्यूब)',
    sideEffects: ['Mild local burning or stinging on first application'],
    warningsHi: 'आंखों या मुंह में न लगाएं। स्टेरॉयड क्रीम के साथ मिलाकर बिना डॉक्टर न लगाएं।',
    howItWorks: 'Inhibits ergosterol synthesis in fungal cell membranes, causing cell leakage and killing fungal spores.',
  },
  {
    id: 'povidone_iodine',
    genericName: 'Povidone Iodine Ointment 5% / Solution (Cipladine)',
    brandNames: ['Betadine', 'Cipladine', 'Wokadine'],
    hindiName: 'पोविडोन आयोडीन / सिप्लाडिन (घाव व चोट की मरहम)',
    category: 'First Aid & Rehydration',
    treatingConditions: ['Cuts & Scrapes', 'Minor Burns', 'Wound Infection Prevention', 'Post-surgical Dressing'],
    treatingConditionsHi: ['कटे-छिले घाव', 'हल्का जलना', 'घाव में मवाद बनने से रोकना', 'चोट की पट्टी'],
    standardDosage: 'Clean wound with fresh water. Apply directly to cut or wound and cover with sterile gauze bandage.',
    dosageHi: 'घाव को साफ पानी से धोकर सुखाएं। मरहम लगाकर साफ पट्टी या पट्टी बांधें। दिन में 1-2 बार लगाएं।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹12 - ₹20 (15g ट्यूब)',
    marketPrice: '₹40 - ₹75 (20g ट्यूब)',
    sideEffects: ['Mild local skin irritation or brown staining (washes off with water)'],
    warningsHi: 'थायराइड रोग वाले मरीज बहुत बड़े खुले घाव पर ज्यादा मात्रा में न लगाएं। गहरे घाव पर टांके हेतु डॉक्टर को दिखाएं।',
    howItWorks: 'Releases elemental iodine that penetrates microbes and oxidizes vital proteins, killing bacteria, viruses and fungi.',
  },

  // --- 9. VITAMINS, IRON & MINERALS ---
  {
    id: 'b_complex_zinc',
    genericName: 'B-Complex Vitamins with Vitamin C and Zinc',
    brandNames: ['Becosules Z', 'Cobadex Forte', 'Zincovit Tablet'],
    hindiName: 'बी-कॉम्प्लेक्स एवं जिंक (कमजोरी, मुंह के छाले व इम्यूनिटी)',
    category: 'Vitamins & Iron',
    treatingConditions: [
      'Mouth Ulcers (मुंह में छाले)',
      'General Weakness & Fatigue',
      'Post-Illness Recovery',
      'Vitamin B Deficiency',
    ],
    treatingConditionsHi: ['मुंह में छाले व जीभ कटना', 'शरीर में सामान्य कमजोरी व थकान', 'बीमारी के बाद रिकवरी'],
    standardDosage: '1 capsule daily after breakfast or lunch with plenty of water for 15 to 30 days.',
    dosageHi: 'रोजाना 1 कैप्सूल दोपहर के भोजन के बाद पानी के साथ। पेशाब का रंग पीला होना सामान्य है।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹15 - ₹25 (20 कैप्सूल)',
    marketPrice: '₹48 - ₹75 (20 कैप्सूल)',
    sideEffects: ['Urine turns bright yellow due to Riboflavin excretion (completely harmless)'],
    warningsHi: 'खाली पेट न लें। यदि छाले 2 हफ्ते से ठीक न हों तो डॉक्टर से जांच कराएं।',
    howItWorks: 'Essential coenzymes that speed mucosal epithelium repair and bolster cellular metabolic energy.',
  },
  {
    id: 'iron_folic_acid',
    genericName: 'Ferrous Ascorbate (Iron 100mg) + Folic Acid (1.5mg)',
    brandNames: ['Orofer-XT', 'Autrin', 'Hb-Up', 'Govt IFA Tablet'],
    hindiName: 'आयरन व फोलिक एसिड (खून की कमी / एनीमिया)',
    category: 'Vitamins & Iron',
    treatingConditions: [
      'Iron Deficiency Anemia (खून की कमी)',
      'Pregnancy Nutritional Support',
      'Pale Skin & Low Hemoglobin',
      'Dizziness from Anemia',
    ],
    treatingConditionsHi: ['खून की कमी (एनीमिया)', 'गर्भावस्था में पोषण व बच्चे का विकास', 'कम हीमोग्लोबिन व चक्कर आना'],
    standardDosage: '1 tablet once daily, preferably 1 hour after dinner with water or lemon water. Avoid milk/tea with it.',
    dosageHi: 'रोजाना 1 गोली रात को भोजन के 1 घंटे बाद पानी के साथ। चाय या दूध के साथ बिल्कुल न लें।',
    prescriptionType: 'OTC',
    janAushadhiPrice: '₹18 - ₹28 (10 गोलियां)',
    marketPrice: '₹120 - ₹180 (10 गोलियां)',
    sideEffects: ['Dark/black stools (normal effect of iron)', 'Mild constipation or nausea'],
    warningsHi: 'चाय या कॉफी आयरन का अवशोषण रोक देती है। नींबू पानी या संतरे के रस के साथ लेने से फायदा दुगना होता है।',
    howItWorks: 'Directly restores iron stores for hemoglobin synthesis in bone marrow red blood cells.',
  },
];

export const MEDICINE_CATEGORIES = [
  'All',
  'Fever & Pain',
  'Digestion & Acidity',
  'Diabetes & Metabolic',
  'Heart & Blood Pressure',
  'Cough & Cold',
  'Respiratory & Asthma',
  'Infections & Antibiotics',
  'Skin & Allergy',
  'First Aid & Rehydration',
  'Vitamins & Iron',
] as const;

// Common Hindi & colloquial symptom synonyms mapping
const SYMPTOM_SYNONYMS: Record<string, string[]> = {
  bukhar: ['fever', 'paracetamol', 'temperature', 'viral', 'dengue'],
  fever: ['bukhar', 'paracetamol', 'dolo', 'crocin'],
  sugar: ['diabetes', 'metformin', 'glimepiride', 'madhumeh', 'insulin'],
  madhumeh: ['diabetes', 'metformin', 'sugar'],
  bp: ['hypertension', 'blood pressure', 'amlodipine', 'telmisartan'],
  raktechap: ['blood pressure', 'hypertension', 'amlodipine'],
  'pet dard': ['meftal', 'spas', 'stomach cramps', 'abdominal'],
  pet: ['pantoprazole', 'acidity', 'gas', 'dicyclomine', 'ors'],
  gas: ['acidity', 'pantoprazole', 'pan 40', 'gerd', 'heartburn'],
  jalan: ['acidity', 'heartburn', 'pantoprazole', 'gerd'],
  acidity: ['gas', 'pantoprazole', 'jalan', 'heartburn'],
  dast: ['diarrhea', 'loose motion', 'ors', 'zinc', 'electral'],
  'loose motion': ['dast', 'ors', 'diarrhea', 'electral'],
  diarrhea: ['loose motions', 'ors', 'zinc', 'electral', 'dast'],
  ulti: ['vomiting', 'nausea', 'ondansetron', 'emesen'],
  vomiting: ['ulti', 'ondansetron', 'nausea'],
  khansi: ['cough', 'cough syrup', 'dextromethorphan', 'ambroxol', 'ascoril'],
  cough: ['khansi', 'dextromethorphan', 'ambroxol', 'ascoril', 'benadryl'],
  jukam: ['cold', 'cetirizine', 'running nose', 'sneezing'],
  cold: ['jukam', 'cetirizine', 'running nose', 'rhinitis'],
  chot: ['wound', 'povidone iodine', 'betadine', 'first aid', 'bandage'],
  ghav: ['wound', 'cut', 'povidone iodine', 'betadine'],
  khujli: ['itching', 'skin', 'fungal', 'clotrimazole', 'cetirizine', 'candid'],
  daud: ['ringworm', 'clotrimazole', 'fungal', 'candid'],
  dama: ['asthma', 'salbutamol', 'inhaler', 'asthalin', 'breathlessness'],
  asthma: ['dama', 'salbutamol', 'inhaler', 'breathlessness'],
  khoon: ['anemia', 'iron', 'folic acid', 'hemoglobin'],
  anemia: ['iron', 'folic acid', 'khoon ki kami'],
  kamzori: ['weakness', 'vitamins', 'b-complex', 'becosules', 'iron'],
  chaale: ['mouth ulcer', 'b-complex', 'becosules', 'ulcers'],
  sar: ['headache', 'paracetamol', 'fever'],
  headache: ['sar dard', 'paracetamol', 'dolo'],
};

export function searchMedicines(query: string, categoryFilter?: string): MedicineInfo[] {
  let list = COMPREHENSIVE_MEDICINES;

  if (categoryFilter && categoryFilter !== 'All') {
    list = list.filter((m) => m.category === categoryFilter);
  }

  const q = query.trim().toLowerCase();
  if (!q) return list;

  // Find synonym expansions
  const expandedTerms = new Set<string>([q]);
  for (const [key, terms] of Object.entries(SYMPTOM_SYNONYMS)) {
    if (q.includes(key) || key.includes(q)) {
      terms.forEach((t) => expandedTerms.add(t));
    }
  }

  return list.filter((item) => {
    // Check direct properties
    const searchString = [
      item.genericName,
      item.hindiName,
      ...item.brandNames,
      ...item.treatingConditions,
      ...item.treatingConditionsHi,
      item.category,
      item.standardDosage,
      item.howItWorks,
    ]
      .join(' ')
      .toLowerCase();

    // Direct substring match
    if (searchString.includes(q)) return true;

    // Synonym match
    for (const term of expandedTerms) {
      if (searchString.includes(term.toLowerCase())) {
        return true;
      }
    }

    return false;
  });
}

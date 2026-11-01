import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import classification_report, accuracy_score

DATA_DIR = os.path.join(os.path.dirname(__file__), "disease symptom prediction")
OUTPUT_JSON = os.path.join(os.path.dirname(__file__), "src", "lib", "ml", "models", "disease_prediction_model.json")

DISEASE_TRANSLATIONS = {
    "(vertigo) Paroymsal  Positional Vertigo": {
        "hi": "वर्टिगो (सिर चकराना / चक्कर आना)",
        "bho": "चक्कर आइल आ देह डोलल",
        "urgency": "YELLOW"
    },
    "AIDS": {
        "hi": "एड्स / एचआईवी (प्रतिरक्षा तंत्र विकार)",
        "bho": "एड्स रोग (रोग से लड़े के ताकत खतम)",
        "urgency": "ORANGE"
    },
    "Acne": {
        "hi": "मुंहासे / पिंपल्स",
        "bho": "मुंहासा आ चेहरा पर फुंसी",
        "urgency": "GREEN"
    },
    "Alcoholic hepatitis": {
        "hi": "अल्कोहलिक हेपेटाइटिस (शराब जनित यकृत सूजन)",
        "bho": "दारू/शराब से लीवर में सूजन",
        "urgency": "ORANGE"
    },
    "Allergy": {
        "hi": "एलर्जी (अतिसंवेदनशीलता)",
        "bho": "एलर्जी (छींक आ देह नोचाइल)",
        "urgency": "GREEN"
    },
    "Arthritis": {
        "hi": "गठिया / जोड़ों की सूजन",
        "bho": "गठिया रोग आ जोड़ में दर्द",
        "urgency": "YELLOW"
    },
    "Bronchial Asthma": {
        "hi": "दमा / ब्रोंकियल अस्थमा (सांस फूलना)",
        "bho": "दमा / सांस घोंटाइल",
        "urgency": "ORANGE"
    },
    "Cervical spondylosis": {
        "hi": "सर्वाइकल स्पोंडिलोसिस (गर्दन व रीढ़ की हड्डी में दर्द)",
        "bho": "गर्दन आ पीठ में भारी दर्द",
        "urgency": "YELLOW"
    },
    "Chicken pox": {
        "hi": "छोटी माता / चिकनपॉक्स",
        "bho": "माता जी / चेचक के दाना",
        "urgency": "YELLOW"
    },
    "Chronic cholestasis": {
        "hi": "क्रोनिक कोलेस्टेसिस (पित्त नली में रुकावट)",
        "bho": "पित्त के थैली में रुकावट",
        "urgency": "ORANGE"
    },
    "Common Cold": {
        "hi": "सामान्य सर्दी-जुकाम व खांसी",
        "bho": "सर्दी जुकाम आ खोंखी",
        "urgency": "GREEN"
    },
    "Dengue": {
        "hi": "डेंगू बुखार (मच्छर जनित गंभीर संक्रमण)",
        "bho": "डेंगू बुखार (जोड़-जोड़ टूटल)",
        "urgency": "RED"
    },
    "Diabetes": {
        "hi": "मधुमेह / डायबिटीज (शुगर रोग)",
        "bho": "डायबिटीज / चीनिया बेमारी",
        "urgency": "YELLOW"
    },
    "Dimorphic hemorrhoids(piles)": {
        "hi": "बवासीर / पाइल्स (मस्सा व दर्द)",
        "bho": "बवासीर / पाखाना में मस्सा",
        "urgency": "YELLOW"
    },
    "Drug Reaction": {
        "hi": "दवा का रिएक्शन / प्रतिकूल प्रभाव",
        "bho": "दवाई के रिएक्शन / साइड इफेक्ट",
        "urgency": "ORANGE"
    },
    "Fungal infection": {
        "hi": "फंगल इन्फेक्शन (दाद, खाज, खुजली)",
        "bho": "दाद, खाज, खुजली के बेमारी",
        "urgency": "GREEN"
    },
    "GERD": {
        "hi": "एसिडिटी / जीईआरडी (पेट में जलन व खट्टी डकार)",
        "bho": "असिडिटी आ सीना में जलन",
        "urgency": "GREEN"
    },
    "Gastroenteritis": {
        "hi": "गैस्ट्रोएंटेराइटिस (पेट का इन्फेक्शन, उल्टी-दस्त)",
        "bho": "पेट खराब, उलटी आ कै-दस्त",
        "urgency": "YELLOW"
    },
    "Heart attack": {
        "hi": "दिल का दौरा / मायोकार्डियल इन्फार्कशन (हार्ट अटैक)",
        "bho": "हार्ट अटैक / सीना में भारी दौरा",
        "urgency": "RED"
    },
    "Hepatitis B": {
        "hi": "हेपेटाइटिस बी (गंभीर यकृत संक्रमण)",
        "bho": "हेपेटाइटिस बी (लीवर के भारी इन्फेक्शन)",
        "urgency": "ORANGE"
    },
    "Hepatitis C": {
        "hi": "हेपेटाइटिस सी (यकृत संक्रमण)",
        "bho": "हेपेटाइटिस सी (लीवर के बेमारी)",
        "urgency": "ORANGE"
    },
    "Hepatitis D": {
        "hi": "हेपेटाइटिस डी (यकृत संक्रमण)",
        "bho": "हेपेटाइटिस डी (लीवर संक्रमण)",
        "urgency": "ORANGE"
    },
    "Hepatitis E": {
        "hi": "हेपेटाइटिस ई (जल जनित यकृत संक्रमण)",
        "bho": "पानी से भइल लीवर इन्फेक्शन ई",
        "urgency": "ORANGE"
    },
    "Hypertension": {
        "hi": "उच्च रक्तचाप / हाइपरटेंशन (हाई बीपी)",
        "bho": "हाई ब्लड प्रेशर / बीपी बढ़ल",
        "urgency": "ORANGE"
    },
    "Hyperthyroidism": {
        "hi": "हाइपरथायरायडिज्म (थायराइड हार्मोन की अधिकता)",
        "bho": "थायराइड बेसी बढ़ल",
        "urgency": "YELLOW"
    },
    "Hypoglycemia": {
        "hi": "हाइपोग्लाइसीमिया (रक्त में शुगर की अचानक गंभीर कमी)",
        "bho": "खून में शुगर के अचानक कमी",
        "urgency": "ORANGE"
    },
    "Hypothyroidism": {
        "hi": "हाइपोथायरायडिज्म (थायराइड हार्मोन की कमी)",
        "bho": "थायराइड के कमी",
        "urgency": "YELLOW"
    },
    "Impetigo": {
        "hi": "इम्पेटिगो (त्वचा के छाले व मवाद वाली फुंसियां)",
        "bho": "चमड़ी पर घाव आ मवाद भरल फुंसी",
        "urgency": "GREEN"
    },
    "Jaundice": {
        "hi": "पीलिया / जांडिस (यकृत विकार)",
        "bho": "पीलिया / कँवल रोग",
        "urgency": "ORANGE"
    },
    "Malaria": {
        "hi": "मलेरिया बुखार (कपकपी के साथ तेज बुखार)",
        "bho": "कपकपा के मलेरिया बुखार",
        "urgency": "ORANGE"
    },
    "Migraine": {
        "hi": "माइग्रेन (आधे सिर का तेज दर्द)",
        "bho": "अधकपाली तेज सिरदर्द",
        "urgency": "YELLOW"
    },
    "Osteoarthristis": {
        "hi": "ऑस्टियोआर्थराइटिस (जोड़ों व घुटनों का घिसाव)",
        "bho": "ठेहुना आ जोड़ के घिसाव / दर्द",
        "urgency": "YELLOW"
    },
    "Paralysis (brain hemorrhage)": {
        "hi": "लकवा / पक्षाघात (मस्तिष्क रक्तस्राव / ब्रेन स्ट्रोक)",
        "bho": "लकवा / फालिज मारल (ब्रेन स्ट्रोक)",
        "urgency": "RED"
    },
    "Peptic ulcer diseae": {
        "hi": "पेप्टिक अल्सर (पेट व आंतों का घाव)",
        "bho": "पेट आ आंत में घाव / छाला",
        "urgency": "YELLOW"
    },
    "Pneumonia": {
        "hi": "निमोनिया (फेफड़ों में कफ व सांस संक्रमण)",
        "bho": "निमोनिया / पसली चलना व छाती जकड़ल",
        "urgency": "RED"
    },
    "Psoriasis": {
        "hi": "सोरायसिस (त्वचा पर पपड़ीदार लाल चकत्ते)",
        "bho": "चमड़ी पर लाल छिलका आ चकत्ता",
        "urgency": "YELLOW"
    },
    "Tuberculosis": {
        "hi": "टीबी / तपेदिक (ट्यूबरकुलोसिस)",
        "bho": "टीबी के बेमारी (पुरान खांसी)",
        "urgency": "ORANGE"
    },
    "Typhoid": {
        "hi": "टाइफाइड / मियादी बुखार",
        "bho": "टाइफाइड / मियादी बुखार",
        "urgency": "ORANGE"
    },
    "Urinary tract infection": {
        "hi": "मूत्र मार्ग संक्रमण (यूटीआई - पेशाब में जलन)",
        "bho": "पेशाब में जलन आ इन्फेक्शन",
        "urgency": "YELLOW"
    },
    "Varicose veins": {
        "hi": "वेरिकोज़ वेन्स (पैरों की नसों का फूलना)",
        "bho": "पैर के नस सूजल आ मुड़ल",
        "urgency": "YELLOW"
    },
    "hepatitis A": {
        "hi": "हेपेटाइटिस ए (यकृत संक्रमण)",
        "bho": "लीवर इन्फेक्शन ए",
        "urgency": "ORANGE"
    }
}

def train_and_export():
    print("Loading datasets...")
    df = pd.read_csv(os.path.join(DATA_DIR, "dataset.csv"))
    severity_df = pd.read_csv(os.path.join(DATA_DIR, "Symptom-severity.csv"))
    desc_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_Description.csv"))
    prec_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_precaution.csv"))

    # Normalization
    df['Disease'] = df['Disease'].astype(str).str.strip()
    desc_df['Disease'] = desc_df['Disease'].astype(str).str.strip()
    prec_df['Disease'] = prec_df['Disease'].astype(str).str.strip()
    severity_df['Symptom'] = severity_df['Symptom'].astype(str).str.strip()

    # Collect unique symptoms
    all_symptoms = set()
    for col in df.columns[1:]:
        clean_vals = df[col].dropna().astype(str).str.strip()
        all_symptoms.update(clean_vals.unique())
    all_symptoms.discard('')
    all_symptoms.discard('nan')
    symptoms_list = sorted(list(all_symptoms))

    # Binary feature matrix
    symptom_to_idx = {s: i for i, s in enumerate(symptoms_list)}
    X = np.zeros((len(df), len(symptoms_list)), dtype=int)
    for i, row in df.iterrows():
        for col in df.columns[1:]:
            val = str(row[col]).strip()
            if val in symptom_to_idx:
                X[i, symptom_to_idx[val]] = 1
    y = df['Disease'].values

    # Train test split for validation report
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)
    
    # MultinomialNB model with Laplace smoothing
    model = MultinomialNB(alpha=0.1)
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    print(f"Validation Holdout Accuracy: {acc * 100:.2f}%")

    # Fit on all data for production deployment
    final_model = MultinomialNB(alpha=0.1)
    final_model.fit(X, y)

    # Build dictionaries
    severity_map = dict(zip(severity_df['Symptom'], severity_df['weight'].astype(int)))
    desc_map = dict(zip(desc_df['Disease'], desc_df['Description']))
    prec_map = {}
    for _, row in prec_df.iterrows():
        d = row['Disease']
        precautions = [
            str(row[f'Precaution_{k}']).strip()
            for k in range(1, 5)
            if pd.notna(row[f'Precaution_{k}']) and str(row[f'Precaution_{k}']).strip() != ''
        ]
        prec_map[d] = precautions

    # Classes and Log Probabilities
    classes = [str(c) for c in final_model.classes_]
    class_log_prior = [round(float(p), 5) for p in final_model.class_log_prior_]
    feature_log_prob = [
        [round(float(val), 5) for val in final_model.feature_log_prob_[c_idx]]
        for c_idx in range(len(classes))
    ]

    export_data = {
        "version": "1.0.0",
        "modelName": "MultinomialNaiveBayes_DiseasePredictor",
        "nClasses": len(classes),
        "nFeatures": len(symptoms_list),
        "classes": classes,
        "symptoms": symptoms_list,
        "classLogPrior": class_log_prior,
        "featureLogProb": feature_log_prob,
        "severityWeights": severity_map,
        "descriptions": desc_map,
        "precautions": prec_map,
        "translations": DISEASE_TRANSLATIONS,
    }

    os.makedirs(os.path.dirname(OUTPUT_JSON), exist_ok=True)
    with open(OUTPUT_JSON, "w", encoding="utf-8") as f:
        json.dump(export_data, f, ensure_ascii=False, indent=2)

    print(f"Exported production disease predictor to {OUTPUT_JSON} ({len(json.dumps(export_data))} bytes)")
    print("Done!")

if __name__ == "__main__":
    train_and_export()


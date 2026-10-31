import joblib
import json
import numpy as np

print("Loading diabetes_model.pkl...", flush=True)
model = joblib.load("diabetes_model.pkl")

features = list(model.feature_names_in_)
classes = [int(c) for c in model.classes_]

print("Features:", features, flush=True)
print("Classes:", classes, flush=True)

# Sample test cases:
# 1. Healthy young person
test_healthy = np.array([[25, 0, 0, 22.0, 5.0, 90, 0, 0, 0, 0, 0, 1, 0]]) # age 25, bmi 22, hba1c 5.0, glucose 90, female, never smoked
# 2. High risk diabetic person
test_diabetic = np.array([[60, 1, 1, 33.5, 8.2, 210, 1, 0, 1, 0, 0, 0, 0]]) # age 60, hyper 1, heart 1, bmi 33.5, hba1c 8.2, glucose 210, male, current smoker

prob_healthy = float(model.predict_proba(test_healthy)[0][1])
prob_diabetic = float(model.predict_proba(test_diabetic)[0][1])

print(f"Sample Healthy Prob: {prob_healthy:.4f}", flush=True)
print(f"Sample Diabetic Prob: {prob_diabetic:.4f}", flush=True)

meta = {
    "model_type": "RandomForestClassifier",
    "features": features,
    "feature_descriptions": {
        "age": "Age in years (1 - 100)",
        "hypertension": "High blood pressure condition (1 = yes, 0 = no)",
        "heart_disease": "Pre-existing heart disease (1 = yes, 0 = no)",
        "bmi": "Body Mass Index kg/m² (normal: 18.5 - 24.9, overweight: 25 - 29.9, obese: 30+)",
        "hba1c_level": "Hemoglobin A1c percentage (normal: < 5.7%, prediabetes: 5.7 - 6.4%, diabetes: 6.5%+)",
        "blood_glucose_level": "Fasting blood sugar mg/dL (normal: 70 - 99, prediabetes: 100 - 125, diabetes: 126+)",
        "gender_Male": "1 if male, 0 if female/other",
        "gender_Other": "1 if other gender, 0 otherwise",
        "smoking_history_current": "1 if currently smoking, 0 otherwise",
        "smoking_history_ever": "1 if ever smoked, 0 otherwise",
        "smoking_history_former": "1 if former smoker, 0 otherwise",
        "smoking_history_never": "1 if never smoked, 0 otherwise",
        "smoking_history_not current": "1 if not current smoker, 0 otherwise"
    },
    "feature_importances": {f: round(float(imp), 4) for f, imp in zip(features, model.feature_importances_)},
    "thresholds": {
        "normal": "< 0.25 (Low Risk)",
        "borderline": "0.25 - 0.50 (Moderate / Pre-diabetes risk)",
        "high": "> 0.50 (High Risk Diabetes)"
    }
}

with open("diabetes_model_metadata.json", "w") as f:
    json.dump(meta, f, indent=2)

print("Saved diabetes_model_metadata.json successfully!", flush=True)


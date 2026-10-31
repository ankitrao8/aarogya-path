import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, GradientBoostingClassifier
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score, roc_auc_score
import joblib
import json

print("=== 1. Loading cleaned_heart_dataset.csv ===", flush=True)
df = pd.read_csv("cleaned_heart_dataset.csv")
print(f"Dataset Shape: {df.shape}", flush=True)
print("Columns:", list(df.columns), flush=True)
print("Data Types:\n", df.dtypes, flush=True)
print("Missing values:\n", df.isnull().sum().to_dict(), flush=True)
print("Summary stats:\n", df.describe().round(2).to_string(), flush=True)

X = df.drop(columns=['target'])
y = df['target']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42, stratify=y)

print("\n=== 2. Comparing Classifiers ===", flush=True)
models = {
    'RandomForest': RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42),
    'GradientBoosting': GradientBoostingClassifier(n_estimators=100, max_depth=3, random_state=42),
    'LogisticRegression': LogisticRegression(max_iter=1000, random_state=42)
}

best_name = None
best_score = 0
best_model = None

for name, model in models.items():
    cv_scores = cross_val_score(model, X_train, y_train, cv=5, scoring='accuracy')
    model.fit(X_train, y_test_dummy := y_train)
    y_pred = model.predict(X_test)
    acc = accuracy_score(y_test, y_pred)
    auc = roc_auc_score(y_test, model.predict_proba(X_test)[:, 1])
    print(f"{name}: CV Acc={cv_scores.mean():.4f} (+/- {cv_scores.std():.4f}), Test Acc={acc:.4f}, Test AUC={auc:.4f}", flush=True)
    if acc > best_score:
        best_score = acc
        best_name = name
        best_model = model

print(f"\nBest Model: {best_name} with Test Accuracy: {best_score:.4f}", flush=True)
y_pred = best_model.predict(X_test)
print("\nClassification Report:\n", classification_report(y_test, y_pred), flush=True)

# Train on full dataset or save best model
final_rf = RandomForestClassifier(n_estimators=100, max_depth=5, random_state=42)
final_rf.fit(X, y)
joblib.dump(final_rf, "heart_disease_model.pkl")
print("Saved final model to heart_disease_model.pkl", flush=True)

# Feature importances
importances = dict(zip(X.columns, [round(float(v), 4) for v in final_rf.feature_importances_]))
print("\nFeature Importances:\n", importances, flush=True)

# Also train an interpretable Logistic Regression with scaled/standardized weights or export RF parameters for fast TS inference
lr = LogisticRegression(max_iter=1000, random_state=42)
lr.fit(X, y)
joblib.dump(lr, "heart_disease_lr_model.pkl")

# Save metadata and reference ranges for project integration
meta = {
    "features": list(X.columns),
    "feature_descriptions": {
        "age": "Age in years (29 - 77)",
        "sex": "Sex (1 = male, 0 = female)",
        "cp": "Chest pain type (0: typical angina, 1: atypical angina, 2: non-anginal pain, 3: asymptomatic)",
        "trestbps": "Resting blood pressure in mm Hg (94 - 200)",
        "chol": "Serum cholesterol in mg/dl (126 - 564)",
        "fbs": "Fasting blood sugar > 120 mg/dl (1 = true, 0 = false)",
        "restecg": "Resting ECG results (0: normal, 1: ST-T wave abnormality, 2: left ventricular hypertrophy)",
        "thalach": "Maximum heart rate achieved (71 - 202 bpm)",
        "exang": "Exercise induced angina (1 = yes, 0 = no)",
        "oldpeak": "ST depression induced by exercise relative to rest (0.0 - 6.2)",
        "slope": "Slope of the peak exercise ST segment (0: upsloping, 1: flat, 2: downsloping)",
        "ca": "Number of major vessels colored by fluoroscopy (0 - 4)",
        "thal": "Thalassemia blood disorder (1: normal, 2: fixed defect, 3: reversable defect)"
    },
    "feature_means": {col: round(float(X[col].mean()), 4) for col in X.columns},
    "feature_medians": {col: round(float(X[col].median()), 4) for col in X.columns},
    "feature_mins": {col: round(float(X[col].min()), 4) for col in X.columns},
    "feature_maxs": {col: round(float(X[col].max()), 4) for col in X.columns},
    "feature_importances": importances,
    "lr_coefficients": {col: round(float(coef), 6) for col, coef in zip(X.columns, lr.coef_[0])},
    "lr_intercept": round(float(lr.intercept_[0]), 6),
    "accuracy": round(float(best_score), 4)
}

with open("heart_model_metadata.json", "w") as f:
    json.dump(meta, f, indent=2)
print("Saved heart_model_metadata.json successfully!", flush=True)


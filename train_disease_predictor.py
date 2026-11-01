import os
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import StratifiedKFold, cross_validate, train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.naive_bayes import MultinomialNB, ComplementNB
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import classification_report, accuracy_score

DATA_DIR = os.path.join(os.path.dirname(__file__), "disease symptom prediction")

def load_data():
    df = pd.read_csv(os.path.join(DATA_DIR, "dataset.csv"))
    severity_df = pd.read_csv(os.path.join(DATA_DIR, "Symptom-severity.csv"))
    desc_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_Description.csv"))
    prec_df = pd.read_csv(os.path.join(DATA_DIR, "symptom_precaution.csv"))

    # Clean whitespace
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

    # Severity dict
    severity_map = dict(zip(severity_df['Symptom'], severity_df['weight']))

    # Description dict
    desc_map = dict(zip(desc_df['Disease'], desc_df['Description']))

    # Precautions dict
    prec_map = {}
    for _, row in prec_df.iterrows():
        d = row['Disease']
        precautions = [
            str(row[f'Precaution_{k}']).strip()
            for k in range(1, 5)
            if pd.notna(row[f'Precaution_{k}']) and str(row[f'Precaution_{k}']).strip() != ''
        ]
        prec_map[d] = precautions

    return df, X, y, symptoms_list, severity_map, desc_map, prec_map

def compare_models(X, y):
    print("=" * 60)
    print("STEP 1: 5-FOLD STRATIFIED CROSS-VALIDATION")
    print("=" * 60)
    skf = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)
    models = {
        "MultinomialNB (alpha=0.1)": MultinomialNB(alpha=0.1),
        "ComplementNB (alpha=0.1)": ComplementNB(alpha=0.1),
        "LogisticRegression (C=1.0)": LogisticRegression(max_iter=500, C=1.0, random_state=42),
        "RandomForest (n=100)": RandomForestClassifier(n_estimators=100, max_depth=15, random_state=42)
    }

    results = {}
    for name, model in models.items():
        cv = cross_validate(model, X, y, cv=skf, scoring=['accuracy', 'f1_macro'])
        acc_mean = cv['test_accuracy'].mean()
        acc_std = cv['test_accuracy'].std()
        f1_mean = cv['test_f1_macro'].mean()
        results[name] = (acc_mean, acc_std, f1_mean)
        print(f"{name:30} | Accuracy: {acc_mean:.4f} (+/- {acc_std:.4f}) | F1-Macro: {f1_mean:.4f}")

    return results

if __name__ == "__main__":
    df, X, y, symptoms, sev_map, desc_map, prec_map = load_data()
    print(f"Dataset Loaded: {X.shape[0]} samples, {X.shape[1]} symptom features, {len(np.unique(y))} diseases.")
    compare_models(X, y)


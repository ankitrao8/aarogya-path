import joblib
import json
import numpy as np

def tree_to_dict(tree):
    """Recursively converts an sklearn DecisionTree to a lightweight JSON structure."""
    tree_ = tree.tree_
    
    def recurse(node):
        if tree_.feature[node] != -2: # Not a leaf
            return {
                "f": int(tree_.feature[node]),
                "th": round(float(tree_.threshold[node]), 4),
                "l": recurse(tree_.children_left[node]),
                "r": recurse(tree_.children_right[node])
            }
        else: # Leaf
            # Compute class probability for class 1
            vals = tree_.value[node][0]
            total = float(np.sum(vals))
            prob = float(vals[1] / total) if total > 0 else 0.0
            return {
                "p": round(prob, 4)
            }
    
    return recurse(0)

def ensemble_to_json(rf, feature_names, filename):
    trees = [tree_to_dict(estimator) for estimator in rf.estimators_]
    data = {
        "features": feature_names,
        "n_estimators": len(trees),
        "trees": trees
    }
    with open(filename, "w") as f:
        json.dump(data, f)
    print(f"Exported {len(trees)} trees to {filename} ({len(json.dumps(data))} bytes)")

# 1. Export Heart Disease RF Model
print("Exporting Heart Disease Model...")
heart_rf = joblib.load("heart_disease_model.pkl")
ensemble_to_json(heart_rf, list(heart_rf.feature_names_in_), "heart_forest.json")

# 2. Export Distilled Diabetes RF Model (20 trees, depth 6)
print("Training and Exporting Distilled Diabetes Model...")
orig_diabetes = joblib.load("diabetes_model.pkl")
np.random.seed(42)
N = 15000
ages = np.random.uniform(18, 85, N)
hypers = np.random.choice([0, 1], size=N, p=[0.8, 0.2])
hearts = np.random.choice([0, 1], size=N, p=[0.9, 0.1])
bmis = np.random.uniform(15, 45, N)
hba1cs = np.random.uniform(3.5, 9.0, N)
glucoses = np.random.uniform(60, 300, N)

genders = np.random.choice(['male', 'female', 'other'], size=N, p=[0.48, 0.50, 0.02])
g_male = (genders == 'male').astype(int)
g_other = (genders == 'other').astype(int)

smokings = np.random.choice(['never', 'current', 'former', 'ever', 'not current'], size=N, p=[0.5, 0.15, 0.15, 0.1, 0.1])
s_current = (smokings == 'current').astype(int)
s_ever = (smokings == 'ever').astype(int)
s_former = (smokings == 'former').astype(int)
s_never = (smokings == 'never').astype(int)
s_not_current = (smokings == 'not current').astype(int)

X_synth = np.column_stack([
    ages, hypers, hearts, bmis, hba1cs, glucoses,
    g_male, g_other,
    s_current, s_ever, s_former, s_never, s_not_current
])

from sklearn.ensemble import RandomForestClassifier
y_synth = (orig_diabetes.predict_proba(X_synth)[:, 1] >= 0.5).astype(int)

diabetes_rf = RandomForestClassifier(n_estimators=25, max_depth=6, random_state=42)
diabetes_rf.fit(X_synth, y_synth)
ensemble_to_json(diabetes_rf, list(orig_diabetes.feature_names_in_), "diabetes_forest.json")
print("Done!")


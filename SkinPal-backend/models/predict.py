import base64
import os

import cv2
import numpy as np
import tensorflow as tf

from config import MODEL_PATH

CLASSES = ["dry", "acne", "normal", "oily"]

# Multiple paths to try
POSSIBLE_PATHS = [
    MODEL_PATH,  # From config (.env)
    os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "..", "model", "skin_type_model_v2.h5")),  # Relative to this file
    os.path.abspath(os.path.join(os.getcwd(), "model", "skin_type_model_v2.h5")),  # From current working directory
    os.path.abspath(os.path.join(os.getcwd(), "..", "model", "skin_type_model_v2.h5")),  # Parent directory
    r"d:\programs\skinpalnew\SkinPal\model\skin_type_model_v2.h5",  # Absolute path
]


def _resolve_model_path():
    """Try multiple paths to find the model file"""
    for path in POSSIBLE_PATHS:
        if path and os.path.exists(path):
            print(f"✅ Found model at: {path}")
            return path
    
    print(f"❌ Model not found. Tried:")
    for path in POSSIBLE_PATHS:
        print(f"   - {path}")
    return None


def _load_model_once():
    path = _resolve_model_path()
    if not path:
        print(f"Warning: Model file not found at any expected location. Using fallback predictor.")
        return None

    try:
        print(f"Loading model from: {path}")
        model = tf.keras.models.load_model(path)
        print(f"✅ Model loaded successfully!")
        return model
    except Exception as exc:
        print(f"Warning: Failed to load model ({exc}). Using fallback predictor.")
        return None


MODEL = _load_model_once()


def _fallback_prediction():
    return {
        "dry": 0.25,
        "acne": 0.25,
        "normal": 0.25,
        "oily": 0.25,
    }


def predict_skin(image_base64):
    if not image_base64:
        raise ValueError("Missing image data")

    img_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    if img is None:
        raise ValueError("Invalid image format")

    if MODEL is None:
        print("⚠️  MODEL IS NONE - USING FALLBACK")
        return _fallback_prediction()

    print(f"🧠 Model loaded, processing image...")
    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = MODEL.predict(img, verbose=0)
    print(f"🧠 Raw model output: {prediction[0]}")
    
    # Apply scaling to adjust confidence ranges
    # Reduce dry and acne, significantly increase normal, reduce oily for better distribution
    scaling_factors = np.array([0.9, 1.2, 3.5, 0.45])  # dry, acne, normal, oily
    scaled_pred = prediction[0] * scaling_factors
    
    # Normalize back to sum to 1
    scaled_pred = scaled_pred / np.sum(scaled_pred)
    
    result = {CLASSES[i]: float(scaled_pred[i]) for i in range(len(CLASSES))}
    print(f"🧠 Scaled result: {result}")
    
    # Prefer NORMAL when scores are very close
    scores_list = sorted(result.values(), reverse=True)
    top_score = scores_list[0]
    second_score = scores_list[1] if len(scores_list) > 1 else 0
    
    # If top and second scores are within 5%, prefer NORMAL if it's in top scores
    if (top_score - second_score) < 0.05:
        print(f"⚠️  Scores are very close ({top_score:.3f} vs {second_score:.3f})")
        if result.get("normal", 0) >= second_score:
            print(f"✅ Preferring NORMAL over {max(result, key=result.get)}")
            # Boost normal, reduce others proportionally
            old_normal = result["normal"]
            result["normal"] = top_score + 0.01
            
            # Redistribute from others
            total_removed = result["normal"] - old_normal
            remaining = {k: v for k, v in result.items() if k != "normal"}
            total_remaining = sum(remaining.values())
            
            for k in remaining:
                reduction = (remaining[k] / total_remaining) * total_removed if total_remaining > 0 else 0
                result[k] = max(0, result[k] - reduction)
            
            # Normalize
            total = sum(result.values())
            if total > 0:
                result = {k: v / total for k, v in result.items()}
    
    print(f"🧠 Final result: {result}")
    return result

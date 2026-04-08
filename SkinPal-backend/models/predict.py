import base64
import os

import cv2
import numpy as np
import tensorflow as tf

from config import MODEL_PATH

CLASSES = ["acne_prone", "dry", "normal", "oily"]
DEFAULT_MODEL_PATH = os.path.abspath(
    os.path.join(os.path.dirname(__file__), "..", "..", "model", "skin_type_model_v2.h5")
)


def _resolve_model_path():
    if MODEL_PATH:
        return MODEL_PATH
    return DEFAULT_MODEL_PATH


def _load_model_once():
    path = _resolve_model_path()
    if not os.path.exists(path):
        print(f"Warning: Model file not found at {path}. Using fallback predictor.")
        return None

    try:
        return tf.keras.models.load_model(path)
    except Exception as exc:
        print(f"Warning: Failed to load model ({exc}). Using fallback predictor.")
        return None


MODEL = _load_model_once()


def _fallback_prediction():
    return {
        "acne_prone": 0.25,
        "dry": 0.25,
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
        return _fallback_prediction()

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = MODEL.predict(img, verbose=0)
    return {CLASSES[i]: float(prediction[0][i]) for i in range(len(CLASSES))}

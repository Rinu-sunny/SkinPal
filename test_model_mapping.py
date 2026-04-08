#!/usr/bin/env python3
"""
Test script to determine the correct class order from the model
"""
import sys
import os
from pathlib import Path

# Load environment
env_path = Path("D:\\programs\\SkinPal\\.env")
if env_path.exists():
    with open(env_path) as f:
        for line in f:
            if "=" in line and not line.startswith("#"):
                key, val = line.strip().split("=", 1)
                os.environ[key] = val

sys.path.insert(0, 'SkinPal-backend')

import numpy as np
from models.predict import MODEL, CLASSES

def test_model_output():
    """Create a test image and see what the model outputs"""
    if MODEL is None:
        print("❌ Model failed to load!")
        return
    
    print("=" * 70)
    print("MODEL CLASS ORDER TEST")
    print("=" * 70)
    
    # Create a dummy image (all zeros - black)
    dummy_img = np.zeros((224, 224, 3), dtype=np.float32)
    dummy_img = np.expand_dims(dummy_img, axis=0)
    
    prediction = MODEL.predict(dummy_img, verbose=0)
    
    print(f"\n📊 Raw model output (all zeros image):")
    print(f"Prediction array: {prediction[0]}")
    
    print(f"\n📋 Current CLASSES mapping:")
    for i, class_name in enumerate(CLASSES):
        print(f"  Index {i}: {class_name}")
    
    print(f"\n📈 Mapped predictions (Current code):")
    result_dict = {CLASSES[i]: float(prediction[0][i]) for i in range(len(CLASSES))}
    sorted_results = sorted(result_dict.items(), key=lambda x: x[1], reverse=True)
    
    for class_name, score in sorted_results:
        print(f"  {class_name}: {score:.4f}")
    
    print("\n" + "=" * 70)
    print("WHAT TO DO:")
    print("=" * 70)
    print("\n1. Take a photo of DRY skin")
    print("2. Run skin analysis")
    print("3. Check what skin type is predicted")
    print("4. Tell me if it matches or if it's wrong")
    print("\nExample:")
    print("  - If you show dry skin but it predicts OILY → indices are swapped")
    print("  - If you show dry skin but it predicts NORMAL → dry is at wrong index")

if __name__ == "__main__":
    test_model_output()

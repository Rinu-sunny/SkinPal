import sys
import numpy as np
from tensorflow.keras.models import load_model
from PIL import Image

# load model
model = load_model("skin_type_model_v2.h5")

def preprocess(path):
    img = Image.open(path).convert("RGB")
    img = img.resize((224, 224))  # ⚠️ change if your model used another size
    img = np.array(img) / 255.0
    img = np.expand_dims(img, axis=0)
    return img

if len(sys.argv) < 2:
    print("Usage: python run_model.py <image>")
    exit()

img_path = sys.argv[1]

img = preprocess(img_path)
prediction = model.predict(img)

class_names = ['dry', 'acne', 'normal', 'oily']

# Get sorted indices (highest first)
sorted_indices = np.argsort(prediction[0])[::-1]

print("\nAll predictions:")
for i in sorted_indices:
    print(f"{class_names[i]}: {prediction[0][i]:.4f}")

# Top prediction
top_index = sorted_indices[0]
print("\nTop Prediction:")
print(f"{class_names[top_index]} ({prediction[0][top_index]:.4f})")

print("Prediction:", prediction)
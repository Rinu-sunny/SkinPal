"""import numpy as np
import tensorflow as tf
import base64
import cv2

# Load model once
model = tf.keras.models.load_model("models/skin_model.h5")

classes = ["oily", "dry", "normal", "acne_prone"]

def predict_skin(image_base64):
    img_data = base64.b64decode(image_base64)
    np_arr = np.frombuffer(img_data, np.uint8)
    img = cv2.imdecode(np_arr, cv2.IMREAD_COLOR)

    img = cv2.resize(img, (224, 224))
    img = img / 255.0
    img = np.expand_dims(img, axis=0)

    prediction = model.predict(img)
    
    # Create dictionary of {class_name: probability}
    result = {classes[i]: float(prediction[0][i]) for i in range(len(classes))}
    
    return result
    """
def predict_skin(image):
    # Mocking a response with all probabilities
    return {
        "oily": 0.65,
        "acne_prone": 0.25,
        "normal": 0.05,
        "dry": 0.05
    }
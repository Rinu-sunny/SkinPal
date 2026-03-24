from flask import Blueprint, request, jsonify
from models.predict import predict_skin
from utils.recommendations import get_skin_tips
from utils.db import supabase
import base64
import uuid

analysis_bp = Blueprint("analysis", __name__)

@analysis_bp.route("/analyze", methods=["POST"])
def analyze():
    try:
        data = request.json
        if not data:
            return jsonify({"error": "Missing JSON data"}), 400

        user_id = data.get("user_id")
        image_base64 = data.get("image")

        if not user_id or not image_base64:
            return jsonify({"error": "Missing user_id or image"}), 400

        # Now predict_skin returns a dictionary of probabilities {skin_type: score}
        scores = predict_skin(image_base64)
        
        # Determine the top prediction for database compatibility
        prediction = max(scores, key=scores.get)
        confidence = scores[prediction]

        # Save to database
        try:
            # Map Python keys to Supabase columns
            # 'confidence' -> 'confidence_score'
            # 'user_id' -> 'user_id'
            # 'skin_type' -> 'skin_type'
            
            # Note: If 'image_id' is NOT NULL in your schema, this insert will fail 
            # unless we first upload the image and get an ID. 
            # For now, we assume it's nullable or we rely on partial insert.
            
            data_to_insert = {
                "user_id": user_id,
                "skin_type": prediction,
                "confidence_score": confidence
                # "image_id": ... # Requires upload to storage first
            }
            
            supabase.table("analysis_results").insert(data_to_insert).execute()
        except Exception as e:
            # Log DB failure but return prediction to user so the app works
            print(f"Warning: Failed to save analysis to DB (analysis_results): {e}")

        
        # Pass the full dictionary of scores to get comprehensive tips
        tips = get_skin_tips(scores)
        
        return jsonify({
            "prediction": prediction,
            "confidence": confidence,
            "scores": scores,
            "tips": tips
        })
    except Exception as e:
        return jsonify({"error": str(e)}), 500
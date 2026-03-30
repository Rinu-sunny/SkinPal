from flask import Blueprint, jsonify
from utils.db import supabase

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Query users table (using user_id column)
        # Note: 'user_id' in DB might be BigInt, while Auth IDs are UUIDs. 
        # But per screenshot, public.users PK is UUID 'user_id'. Matches perfectly.
        
        user_response = supabase.table("users").select("*").eq("user_id", user_id).execute()
        
        # Query analysis history using valid 'user_id' column
        try:
            history_response = supabase.table("analysis_results").select("*").eq("user_id", user_id).order("analysis_date", desc=True).execute()
            history = history_response.data
        except Exception as e:
            print(f"Warning: Failed to fetch history: {e}")
            history = []

        # Check if user exists
        user_data = user_response.data[0] if user_response.data else {}
        
        return jsonify({
            "user": user_data,
            "history": history
        })
    except Exception as e:
        # Handle specific DB errors gracefully
        if "invalid input syntax" in str(e):
             return jsonify({"error": "Invalid User ID format (UUID expected)"}), 400
        return jsonify({"error": str(e)}), 500
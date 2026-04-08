from flask import Blueprint, jsonify, request
from utils.db import supabase, supabase_service

profile_bp = Blueprint("profile", __name__)

@profile_bp.route("/profile/<user_id>", methods=["GET"])
def get_profile(user_id):
    try:
        if not user_id:
            return jsonify({"error": "User ID is required"}), 400

        # Get pagination params
        limit = request.args.get('limit', 10, type=int)
        offset = request.args.get('offset', 0, type=int)

        # Query users table using service role to bypass RLS
        user_response = supabase_service.table("users").select("*").eq("user_id", user_id).execute()
        
        # Query analysis history using service role with pagination
        try:
            history_response = supabase_service.table("analysis_results").select("*").eq("user_id", user_id).order("analysis_date", desc=True).range(offset, offset + limit - 1).execute()
            history_data = history_response.data
            
            # Batch fetch all images for this batch of analyses
            image_ids = [entry.get("image_id") for entry in history_data if entry.get("image_id")]
            images_map = {}
            
            if image_ids:
                try:
                    # Single query to fetch all images at once
                    images_response = supabase_service.table("uploaded_images").select("image_id, image_url").in_("image_id", image_ids).execute()
                    for img in images_response.data:
                        images_map[img["image_id"]] = img["image_url"]
                except Exception as e:
                    print(f"Warning: Failed to batch fetch images: {e}")
            
            # Enhance history with cached images
            enhanced_history = []
            for entry in history_data:
                entry_with_image = entry.copy()
                
                if entry.get("image_id") and entry["image_id"] in images_map:
                    image_url = images_map[entry["image_id"]]
                    if image_url:
                        if image_url.startswith("data:"):
                            entry_with_image["image"] = image_url
                        else:
                            entry_with_image["image"] = f"data:image/jpeg;base64,{image_url}"
                
                enhanced_history.append(entry_with_image)
            
            history = enhanced_history
        except Exception as e:
            print(f"Warning: Failed to fetch history: {e}")
            history = []

        # Check if user exists
        if not user_response.data:
            # User doesn't exist yet, create a basic profile
            try:
                default_name = "User"
                supabase_service.table("users").insert({
                    "user_id": user_id,
                    "email": "",
                    "name": default_name,
                    "password_hash": "managed_by_supabase_auth"
                }).execute()
                user_data = {
                    "user_id": user_id,
                    "email": "",
                    "name": default_name
                }
            except Exception as e:
                print(f"Error creating missing user: {e}")
                # Return 404 if we can't create the user
                return jsonify({"error": "User not found"}), 404
        else:
            user_data = user_response.data[0]
        
        return jsonify({
            "user": user_data,
            "history": history
        })
    except Exception as e:
        # Handle specific DB errors gracefully
        if "invalid input syntax" in str(e):
             return jsonify({"error": "Invalid User ID format (UUID expected)"}), 400
        return jsonify({"error": str(e)}), 500
